const Joi = require('joi');
const countWarning = require('../constraints/countWarning');
const countError = require('../constraints/countError');
const percentage = require('../constraints/percentage');

module.exports = Joi.object().keys({
  eslintCountWarning: countWarning.required().label('ESLint warning count'),
  eslintCountError: countError.required().label('ESLint error count'),
  coveragePercentageLines: percentage.required().label('Code coverage lines percentage'),
  coveragePercentageFunctions: percentage.required().label('Code coverage functions percentage'),
  coveragePercentageBranches: percentage.required().label('Code coverage branches percentage'),
});
