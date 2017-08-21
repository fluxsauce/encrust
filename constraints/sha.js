const Joi = require('joi');

module.exports = Joi.string().regex(/^[0-9a-f]{5,40}$/);
