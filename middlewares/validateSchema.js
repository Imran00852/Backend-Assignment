const quizSchema = require("../schema");
const Quiz = require("../models/quiz");

module.exports.validateSchema = (req, res, next) => {
  let { error } = quizSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
