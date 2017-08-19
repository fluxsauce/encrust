#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const forEach = require('lodash/forEach');
const isError = require('lodash/isError');
const keys = require('lodash/keys');
const merge = require('lodash/merge');
const nconf = require('nconf');
const omit = require('lodash/omit');
const parse = require('lcov-parse');
const request = require('request');
const winston = require('winston');
const set = require('lodash/set');

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
if (set(options, '_all.help')) {
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
  process.exit(1);
}

// Build event.
const event = {};

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

  const options = {
    uri: 'https://api.logface.io/v1/events',
    auth: {
      user: nconf.get('nova:clientId'),
      pass: nconf.get('nova:clientSecret'),
    },
    json: [eventValuesStrings],
  };

  request.post(options, (error, response, body) => {
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
