const express = require("express");
const router = express.Router();
const quizController = require("../controller/quiz");

router.post("/", quizController.generateToken);

module.exports = router;
