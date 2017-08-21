const commandLineUsage = require('command-line-usage');

/**
 * Render help.
 *
 * @param {Object} optionDefinitions
 *   Configuration for command-line-args and command-line-usage.
 *
 * @returns {void}
 */
module.exports = (optionDefinitions) => {
  const sections = [
    {
      header: 'encrust',
      content: 'Send LCOV code coverage and ESLint warnings and errors from CI builds to splunk project nova.',
    },
    {
      header: 'Configuration',
      content: 'To provide credentials or paths to coverage files, see [italic]{README.md}',
    },
    {
      header: 'Required',
      optionList: optionDefinitions,
      group: ['required'],
    },
    {
      header: 'Optional',
      optionList: optionDefinitions,
      group: ['optional'],
    },
    {
      header: 'Miscellaneous',
      optionList: optionDefinitions,
      group: '_none',
    },
  ];
  console.log(commandLineUsage(sections)); // eslint-disable-line no-console
};
