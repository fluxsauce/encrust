#!/usr/bin/env node

const defaults = require('../.encrust.default.json');
const isEmpty = require('lodash/isEmpty');
const keys = require('lodash/keys');
const forEach = require('lodash/forEach');
const merge = require('lodash/merge');
const split = require('lodash/split');
const replace = require('lodash/replace');
const parse = require('lcov-parse');
const winston = require('winston');

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

nconf
  .env('__')
  .argv()
  .file({ file: `${process.cwd()}/.encrust.json` })
  .defaults(defaults);

const errors = [];

if (nconf.get('nova:clientId') === 'REPLACE') {
  errors.push('Provide or edit the nova clientId');
}

if (nconf.get('nova:clientSecret') === 'REPLACE') {
  errors.push('Provide or edit the nova clientSecret');
}

if (!isEmpty(errors)) {
  forEach(errors, error => logger.error(error));
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
