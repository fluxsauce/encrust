const forEach = require('lodash/forEach');
const fs = require('fs');
const get = require('lodash/get');
const set = require('lodash/set');
const update = require('lodash/update');
const upperFirst = require('lodash/upperFirst');

function readJson(path) {
  let jsonRaw;

  try {
    jsonRaw = fs.readFileSync(path);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`Cannot find "${path}"`);
    } else {
      throw err;
    }
  }

  let json;

  try {
    json = JSON.parse(jsonRaw);
  } catch (err) {
    throw new Error(`Cannot read "${path}" as JSON: ${err.message}`);
  }

  return json;
}

function parseEslint(json) {
  const counts = {
    eslintCountWarning: 0,
    eslintCountError: 0,
  };

  forEach(json, (file) => {
    counts.eslintCountWarning += file.warningCount;
    counts.eslintCountError += file.errorCount;
  });

  return counts;
}

function parseLcov(lcov) {
  const targets = ['lines', 'functions', 'branches'];
  const types = ['found', 'hit'];

  const totals = {};

  forEach(types, (type) => {
    forEach(targets, (target) => {
      set(totals, `${target}.${type}`, 0);
    });
  });

  forEach(lcov, (file) => {
    forEach(types, (type) => {
      forEach(targets, (target) => {
        update(totals, `${target}.${type}`, total => total + get(file, `${target}.${type}`, 0));
      });
    });
  });

  const counts = {};

  forEach(targets, (target) => {
    const hit = get(totals, `${target}.hit`);
    const found = get(totals, `${target}.found`);
    const ratio = hit / found;
    const percentage = ratio * 100;

    counts[`coveragePercentage${upperFirst(target)}`] = percentage.toFixed(2);
  });

  return counts;
}

module.exports = {
  readJson,
  parseEslint,
  parseLcov,
};
