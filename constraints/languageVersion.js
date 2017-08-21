const Joi = require('joi');

module.exports = Joi.string().regex(/^(\d+\.)?(\d+\.)?(\*|\d+)$/);
