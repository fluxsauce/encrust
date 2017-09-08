#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const isError = require('lodash/isError');
const merge = require('lodash/merge');
const nconf = require('nconf');
const omit = require('lodash/omit');
const parse = require('lcov-parse');
const request = require('request');
const winston = require('winston');
const has = require('lodash/has');
const get = require('lodash/get');

const envTravisCi = require('../lib/env/travisCi');
const help = require('../lib/help');
const schemaEvent = require('../schema/event');
const schemaConfig = require('../schema/config');
const util = require('../lib/util');
const usage = require('../lib/usage');

// Logger.
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: 'all',
    }),
  ],
});

const options = commandLineArgs(usage);

// Show help.
if (has(options, '_all.help')) {
  help(usage);
  process.exit(0);
}

// Parse config.
nconf
  .env({
    separator: '__',
    whitelist: ['nova__clientId', 'nova__clientSecret'],
  })
  .file({ file: `${process.cwd()}/.encrust.json` })
  .defaults(require('../.encrust.default.json'));

const config = omit(nconf.get(), 'type');

// Validate configuration.
const configValidation = schemaConfig.validate(config, {
  abortEarly: false,
  stripUnknown: true,
});

if (isError(configValidation.error)) {
  logger.error(configValidation.error.message);
  logger.info('Use --help for documentation.');
  process.exit(1);
}

// Build event.
const event = {};

merge(event, (get(options, '_all')));

if (get(process, 'env.TRAVIS')) {
  logger.debug('Detected Travis CI, setting event from environment variables');
  merge(event, envTravisCi(get(process, 'env')));
}

const eslintJson = util.readJson(get(config, 'eslint.file'));
const counts = util.parseEslint(eslintJson);
merge(event, counts);

parse(get(config, 'lcov.file'), (err, data) => {
  merge(event, util.parseLcov(data));

  // Cleanup.
  if (has(event, 'pullRequest') && !get(event, 'pullRequest')) {
    delete event.pullRequest;
    delete event.pullRequestSha;
    delete event.pullRequestBranch;
  }

  const { error, value } = schemaEvent.validate(event, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (isError(error)) {
    logger.error(error.message);
    process.exit(1);
  }

  const requestOptions = {
    uri: 'https://api.splunknova.com/v1/events',
    auth: {
      user: get(config, 'nova.clientId'),
      pass: get(config, 'nova.clientSecret'),
    },
    json: [value],
  };

  request.post(requestOptions, (postError, response, body) => {
    if (postError) {
      logger.log('error', postError);
    }

    if (response.statusCode === 200) {
      logger.info(body);
    } else {
      logger.log('info', value);
      logger.log('error', 'statusCode: %s', response.statusCode);
      logger.log('error', body);
    }
  });
});
