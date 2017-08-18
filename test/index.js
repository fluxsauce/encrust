const test = require('ava');
const util = require('../lib/util');

test('parseEslint', (t) => {
  const input = {
    foo: {
      warningCount: 1,
      errorCount: 0,
    },
    bar: {
      warningCount: 0,
      errorCount: 2,
    },
  };

  const expected = {
    eslintCountWarning: 1,
    eslintCountError: 2,
  };

  t.deepEqual(util.parseEslint(input), expected);
});
