const test = require('ava');
const schemaEvent = require('../../schema/event');

test('schemaEvent.validate', (t) => {
  const valid = {
    eslintCountWarning: 0,
    eslintCountError: 0,
    coveragePercentageLines: 100,
    coveragePercentageFunctions: 99,
    coveragePercentageBranches: 88,
    jobNumber: 1,
    languageVersion: '1.2.3',
    branch: null,
    buildId: 123,
    buildNumber: 456,
    commit: '0b9a30dca07c78d9e8582cffa27240c563ba6d26',
    testResult: 1,
    pullRequest: null,
    pullRequestSha: null,
    pullRequestBranch: null,
    repoSlug: 'fluxsauce/encrust',
    language: 'node',
  };

  const result = schemaEvent.validate(valid, {
    abortEarly: false,
    stripUnknown: true,
  });
  t.is(result.error, null);
});
