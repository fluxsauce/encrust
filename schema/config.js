const Joi = require('joi');
const novaClientId = require('../constraints/novaClientId');
const novaClientSecret = require('../constraints/novaClientSecret');
const eslintFile = require('../constraints/eslintFile');
const lcovFile = require('../constraints/lcovFile');

module.exports = Joi.object().keys({
  nova: Joi.object().keys({
    clientId: novaClientId.required().label('splunk nova clientId'),
    clientSecret: novaClientSecret.required().label('splunk nova clientSecret'),
  }).required().label('splunk nova configuration'),
  eslint: Joi.object().keys({
    file: eslintFile.required().label('Path to ESLint JSON file'),
  }).required().label('ESLint configuration'),
  lcov: Joi.object().keys({
    file: lcovFile.required().label('Path to LCOV file'),
  }).required().label('LCOV configuration'),
}).required().label('Input');
