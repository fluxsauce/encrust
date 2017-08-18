#!/usr/bin/env node

const isError = require('lodash/isError');
const keys = require('lodash/keys');
const forEach = require('lodash/forEach');
const merge = require('lodash/merge');
const omit = require('lodash/omit');
const split = require('lodash/split');
const replace = require('lodash/replace');
const parse = require('lcov-parse');
const winston = require('winston');
const Joi = require('joi');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: 'all',
    }),
  ],
});

if (replace(split(process.version, '.')[0], 'v', '') < 6) {
  logger.error('encrust requires node.js 6 or higher.');
  process.exit(1);
}

const request = require('request');
const nconf = require('nconf');
const util = require('../lib/util');

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
const inputSchema = Joi.object().keys({
  nova: Joi.object().keys({
    clientId: Joi.string().required().invalid('REPLACE').label('splunk nova clientId'),
    clientSecret: Joi.string().required().invalid('REPLACE').label('splunk nova clientSecret'),
  }).required().label('splunk nova configuration'),
  eslint: Joi.object().keys({
    file: Joi.string().required().label('Path to ESLint JSON file'),
  }).required().label('ESLint configuration'),
  lcov: Joi.object().keys({
    file: Joi.string().required().label('Path to LCOV file'),
  }).required().label('LCOV configuration'),
}).required().label('Input');

const inputValidation = inputSchema.validate(input, { abortEarly: false, stripUnknown: true });

if (isError(inputValidation.error)) {
  logger.error(inputValidation.error.message);
  process.exit(1);
}

const event = {
  eslintCountWarning: 0,
  eslintCountError: 0,
  coveragePercentageLines: 0,
  coveragePercentageFunctions: 0,
  coveragePercentageBranches: 0,
};

const eslintJson = util.readJson(nconf.get('eslint:file'));
const counts = util.parseEslint(eslintJson);
merge(event, counts);

parse(nconf.get('lcov:file'), (err, data) => {
  merge(event, util.parseLcov(data));

  // Workaround until Nova API supports JSON.
  const eventValuesStrings = {};
  forEach(keys(event), (key) => {
    eventValuesStrings[key] = event[key].toString();
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
