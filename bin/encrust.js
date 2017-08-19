#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const forEach = require('lodash/forEach');
const isError = require('lodash/isError');
const keys = require('lodash/keys');
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
const schemaInput = require('../schema/input');
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

// Parse input.
nconf
  .env({
    separator: '__',
    whitelist: ['nova__clientId', 'nova__clientSecret'],
  })
  .file({ file: `${process.cwd()}/.encrust.json` })
  .defaults(require('../.encrust.default.json'));

const input = omit(nconf.get(), 'type');

// Validate input.
const inputValidation = schemaInput.validate(input, {
  abortEarly: false,
  stripUnknown: true,
});

if (isError(inputValidation.error)) {
  logger.error(inputValidation.error.message);
  logger.info('Use --help for documentation.');
  process.exit(1);
}

// Build event.
const event = {
  language: 'nodejs',
};
merge(event, (get(options, '_all')));

if (get(process, 'env.TRAVIS') === true) {
  merge(event, envTravisCi(process.env));
}

console.log(event);
process.exit(0);

const eslintJson = util.readJson(nconf.get('eslint:file'));
const counts = util.parseEslint(eslintJson);
merge(event, counts);

parse(nconf.get('lcov:file'), (err, data) => {
  merge(event, util.parseLcov(data));

  const eventValidation = schemaEvent.validate(event);

  if (isError(eventValidation.error)) {
    logger.error(eventValidation.error.message);
    process.exit(1);
  }

  // Workaround until Nova API supports JSON.
  const eventValuesStrings = {};
  forEach(keys(eventValidation.value), (key) => {
    eventValuesStrings[key] = eventValidation.value[key].toString();
  });

  const requestOptions = {
    uri: 'https://api.logface.io/v1/events',
    auth: {
      user: nconf.get('nova:clientId'),
      pass: nconf.get('nova:clientSecret'),
    },
    json: [eventValuesStrings],
  };

  request.post(requestOptions, (error, response, body) => {
    if (error) {
      logger.log('error', error);
    }

    if (response.statusCode === 200) {
      logger.info(body);
    } else {
      logger.log('info', eventValuesStrings);
      logger.log('error', 'statusCode: %s', response.statusCode);
      logger.log('error', body);
    }
  });
});
