const Quiz = require("../models/quiz");
const cron = require("node-cron");
const formatDate = require("./dateFormat");
cron.schedule("* * * * *", async () => {
  try {
    const currentDate = formatDate(new Date());

    const allQuizzes = await Quiz.find();

    for (const quiz of allQuizzes) {
      const isActive =
        quiz.startDate <= currentDate && quiz.endDate >= currentDate;
      quiz.status = isActive ? "active" : "finished";
    }
  } catch (error) {
    console.error("Error updating quiz statuses:", error);
  }
});
