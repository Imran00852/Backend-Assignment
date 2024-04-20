if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const quizRouter = require("./routes/quiz");
const authRouter = require("./routes/auth");

app.use(express.urlencoded({ extended: true }));

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}
app.use("/generate-token", authRouter);
app.use("/quizzes", quizRouter);

app.listen(8080, () => {
  console.log("server is running on port 8080");
});
