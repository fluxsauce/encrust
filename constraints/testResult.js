const Joi = require('joi');

module.exports = Joi.number().integer().min(0).max(1);
