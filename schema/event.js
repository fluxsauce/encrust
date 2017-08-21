const Joi = require('joi');
const countError = require('../constraints/countError');
const countWarning = require('../constraints/countWarning');
const jobNumber = require('../constraints/jobNumber');
const languageVersion = require('../constraints/languageVersion');
const percentage = require('../constraints/percentage');
const positiveInteger = require('../constraints/positiveInteger');
const sha = require('../constraints/sha');
const testResult = require('../constraints/testResult');

module.exports = Joi.object().keys({
  eslintCountWarning: countWarning.required().label('ESLint warning count'),
  eslintCountError: countError.required().label('ESLint error count'),
  coveragePercentageLines: percentage.required().label('Code coverage lines percentage'),
  coveragePercentageFunctions: percentage.required().label('Code coverage functions percentage'),
  coveragePercentageBranches: percentage.required().label('Code coverage branches percentage'),
  jobNumber: jobNumber.required().label('The number of the current job'),
  languageVersion: languageVersion.required().label('Primary interpreting language version'),
  branch: Joi.string().token().required().label('The name of the branch being built or targeted'),
  buildId: positiveInteger.required().label('The CI id of the current build'),
  buildNumber: positiveInteger.required().label('The number of the current build'),
  commit: sha.required().label('The commit SHA that the current build is testing'),
  testResult: testResult.required().label('0 if build is successful, 1 if build is broken.'),
  pullRequest: positiveInteger.optional().label('The pull request number'),
  pullRequestSha: sha.optional().label('The commit SHA of the HEAD commit of the PR'),
  pullRequestBranch: Joi.string().token().required().label('The name of the branch from which the PR originated'),
  repoSlug: Joi.string().required().label('The slug of the repository'),
  language: Joi.string().token().required().label('Primary interpreting language name'),
});
