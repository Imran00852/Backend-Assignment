const express = require("express");
const router = express.Router();
const quizController = require("../controller/quiz");
const { verifyToken } = require("../middlewares/auth");
const limiter = require("../middlewares/rateLimit");
const { validateSchema } = require("../middlewares/validateSchema");

router
  .route("/")
  .post(verifyToken, validateSchema, limiter, quizController.createQuiz);

router
  .route("/active")
  .get(verifyToken, limiter, quizController.getActiveQuizzes);

router.route("/:id/result").get(limiter, quizController.getQuizResult);

router.route("/all").get(limiter, quizController.getAllQuizzes);

module.exports = router;
