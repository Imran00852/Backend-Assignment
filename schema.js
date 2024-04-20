const Joi = require("joi");

const quizSchema = Joi.object({
  question: Joi.string().required(),
  options: Joi.array().items(Joi.string()).required(),
  rightAnswer: Joi.number().integer().min(0).required(),
  startDate: Joi.string().isoDate().required(),
  endDate: Joi.string().isoDate().required(),
}).required();

module.exports = quizSchema;
