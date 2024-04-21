const Quiz = require("../models/quiz");
const formatDate = require("../utils/dateFormat");
const { generateToken } = require("../middlewares/auth");

module.exports.createQuiz = async (req, res) => {
  let { question, options, rightAnswer, startDate, endDate } = req.body;

  startDate = new Date(startDate);
  endDate = new Date(endDate);
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  let newQuiz = new Quiz({
    question,
    options,
    rightAnswer,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  });
  await newQuiz.save();
  res.status(201).json(newQuiz);
};

module.exports.getActiveQuizzes = async (req, res) => {
  const currDate = formatDate(new Date());
  const activeQuiz = await Quiz.find({
    startDate: { $lte: currDate },
    endDate: { $gte: currDate },
  });
  if (activeQuiz.length===0) {
    return res.status(404).json({ error: "No active quiz found" });
  }
  const quizzesWithStatus = activeQuiz.map((quiz) => {
    const { rightAnswer, ...quizWithoutRightAnswer } = quiz.toObject();
    return { ...quizWithoutRightAnswer, status: "active" };
  });
  res.status(200).json(quizzesWithStatus);
};

module.exports.getQuizResult = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const currentTime = new Date();
    const quizEndTime = new Date(quiz.endDate);
    const fiveMinutesAfterEnd = new Date(quizEndTime.getTime() + 5 * 60000);

    if (currentTime < fiveMinutesAfterEnd) {
      return res.status(400).json({
        error: "Quiz result not available yet, Check after 5 minutes",
      });
    }

    const correctAnswer = quiz.options[quiz.rightAnswer];
    const quizResult = {
      rightAnswer: correctAnswer,
      question: quiz.question,
      options: quiz.options,
    };
    res.status(200).json(quizResult);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getAllQuizzes = async (req, res) => {
  try {
    const allQuizzes = await Quiz.find({});
    if (!allQuizzes) {
      return res.status(404).json({ error: "No Quiz found" });
    }
    const quizzesWithStatus = allQuizzes.map((quiz) => {
      const currentTime = formatDate(new Date());
      const isActive =
        quiz.startDate <= currentTime && quiz.endDate >= currentTime;
      return {
        ...quiz.toObject(),
        status: isActive ? "active" : "finished/not active",
      };
    });
    res.status(200).json(quizzesWithStatus);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.generateToken = (req, res) => {
  const { username, password } = req.body;
  if (username === "user" && password === "password") {
    const user = { id: "UserId", username: "user" };
    const token = generateToken(user);
    return res.json({ token });
  } else {
    return res.status(401).json({ error: "Invalid username or password" });
  }
};
