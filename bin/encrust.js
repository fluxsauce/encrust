#!/usr/bin/env node

const isEmpty = require('lodash/isEmpty');
const keys = require('lodash/keys');
const forEach = require('lodash/forEach');
const merge = require('lodash/merge');
const split = require('lodash/split');
const replace = require('lodash/replace');
const parse = require('lcov-parse');

if (replace(split(process.version, '.')[0], 'v', '') < 6) {
  console.log('encrust requires node.js 6 or higher.');
  process.exit(1);
}

const request = require('request');
const nconf = require('nconf');
const util = require('../lib/util');

nconf.argv()
  .env('__')
  .file({ file: `${process.cwd()}/.encrust.json` });

const errors = [];

if (nconf.get('nova:clientId') === 'REPLACE') {
  errors.push('Provide or edit the nova clientId');
}

if (nconf.get('nova:clientSecret') === 'REPLACE') {
  errors.push('Provide or edit the nova clientSecret');
}

console.log(errors);
console.log(nconf.get('nova:clientId'));

if (!isEmpty(errors)) {
  forEach.errors(error => console.error(error));
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
    console.log(eventValuesStrings, error, response.statusCode, body);
  });
});
