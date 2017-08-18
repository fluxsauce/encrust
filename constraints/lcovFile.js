const Joi = require('joi');

module.exports = Joi.string().regex(/^.*lcov\.info/);
