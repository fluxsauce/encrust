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
  jobNumber: Joi.number().min(1).required().label('The number of the current job'),
  languageVersion: Joi.string().regex(/^(\d+\.)?(\d+\.)?(\*|\d+)$/).required().label('Primary interpreting language version'),
  branch: Joi.string().token().required().label('The name of the branch being built or targeted'),
  buildId: Joi.number().integer().min(1).required().label('The CI id of the current build'),
  buildNumber: Joi.number().integer().min(1).required().label('The number of the current build'),
  commit: Joi.string().regex(/^[0-9a-f]{5,40}$/).required().label('The commit SHA that the current build is testing'),
  testResult: Joi.number().integer().min(0).max(1).required().label('0 if build is successful, 1 if build is broken.'),
  pullRequest: Joi.number().integer().min(0).optional().label('The pull request number'),
  pullRequestSha: Joi.string().regex(/^[0-9a-f]{5,40}$/).optional().label('The commit SHA of the HEAD commit of the PR'),
  pullRequestBranch: Joi.string().token().required().label('The name of the branch from which the PR originated'),
  repoSlug: Joi.string().required().label('The slug of the repository'),
  language: Joi.string().token().required().label('Primary interpreting language name'),
});
