module.exports = [
  {
    name: 'jobNumber',
    type: Number,
    group: 'required',
    alias: 'j',
    description: 'The number of the current job, like "[italic]{4.1}".',
  },
  {
    name: 'buildNumber',
    type: Number,
    group: 'required',
    alias: 'n',
    description: 'The number of the current build, like "[italic]{4}".',
  },
  {
    name: 'repoSlug',
    type: String,
    group: 'required',
    alias: 's',
    description: 'The slug of the repository, like "[italic]{owner_name/repo_name}".',
  },
  {
    name: 'commit',
    type: String,
    group: 'required',
    alias: 'c',
    description: 'The commit SHA that the current build is testing.',
  },
  {
    name: 'branch',
    type: String,
    group: 'required',
    alias: 'b',
    description: 'The name of the branch being built or targeted, like "[italic]{master}".',
  },
  {
    name: 'pullRequest',
    type: Number,
    group: 'optional',
    description: 'The pull request number, like "[italic]{1}".',
  },
  {
    name: 'pullRequestBranch',
    group: 'optional',
    type: String,
    description: 'The name of the branch from which the PR originated.',
  },
  {
    name: 'pullRequestSha',
    type: String,
    group: 'optional',
    description: 'The commit SHA of the HEAD commit of the PR.',
  },
  {
    name: 'testResult',
    type: Number,
    group: 'required',
    alias: 'r',
    description: '"[italic]{0}" if the build is successful and "[italic]{1}" if the build is broken.',
  },
  {
    name: 'language',
    type: String,
    group: 'required',
    alias: 'l',
    description: 'Primary interpreting language name, like "[italic]{nodejs}".',
  },
  {
    name: 'languageVersion',
    type: String,
    group: 'required',
    alias: 'v',
    description: 'Primary interpreting language version, like "[italic]{6.7}".',
  },
  {
    name: 'buildId',
    type: Number,
    group: 'required',
    alias: 'i',
    description: 'The CI id of the current build, like "[italic]{266338703}".',
  },
  {
    name: 'help',
    alias: 'h',
    description: 'Print this usage guide.',
  },
];
