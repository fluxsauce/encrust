const forEach = require('lodash/forEach');
const has = require('lodash/has');
const get = require('lodash/get');
const set = require('lodash/set');

module.exports = (env) => {
  const event = {};

  const mapping = {
    jobNumber: 'TRAVIS_JOB_NUMBER',
    languageVersion: 'TRAVIS_NODE_VERSION',
    branch: 'TRAVIS_BRANCH',
    buildId: 'TRAVIS_BUILD_ID',
    buildNumber: 'TRAVIS_BUILD_NUMBER',
    commit: 'TRAVIS_COMMIT',
    testResult: 'TRAVIS_TEST_RESULT',
    pullRequest: 'TRAVIS_PULL_REQUEST',
    pullRequestSha: 'TRAVIS_PULL_REQUEST_SHA',
    pullRequestBranch: 'TRAVIS_PULL_REQUEST_BRANCH',
    repoSlug: 'TRAVIS_REPO_SLUG',
  };

  forEach(mapping, (source, target) => {
    if (has(env, source)) {
      const value = get(env, source);
      set(event, target, value);
    }
  });

  return event;
};
