const Joi = require('joi');

module.exports = Joi.number()
  .precision(2)
  .min(0)
  .max(100)
  .default(0);
