# encrust

This project is no longer supported; Splunk Nova closed down.

Send LCOV code coverage and ESLint warnings and errors from CI builds to [splunk project nova](https://www.splunknova.com/).

[![Build Status](https://travis-ci.org/fluxsauce/encrust.svg?branch=master)](https://travis-ci.org/fluxsauce/encrust)

Supports [Travis CI Environment Variables](https://docs.travis-ci.com/user/environment-variables/).

## Getting Started

1. Get a Splunk Project Nova account from https://www.splunknova.com/
2. Get the API Key
3. Make sure your builds generate LCOV coverage ([nyc](https://www.npmjs.com/package/nyc) does this automatically)
4. Make sure your builds generate [ESLint](https://www.npmjs.com/package/eslint) coverage in JSON format, like `eslint -f json . > coverage/eslint.json`
5. Add the following environmental variables to your CI:
    1. `eslint__file` - path to your ESLint JSON coverage, like `./coverage/eslint.json`
    2. `lcov__file` - path to your LCOV coverage, like `./coverage/lcov.info`
    3. `nova__clientId` - Client ID from https://www.splunknova.com/apikeys
    4. `nova__clientSecret` - Client Secret from https://www.splunknova.com/apikeys
6. Add `encrust` to your post-build steps.

See `encrust.js --help` for more verbose instructions.

Also, see the `.travis.yml` and `package.json` in this repository for a working implementation.
