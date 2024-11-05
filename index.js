const express = require("express");
const app = express();
const cors = require("cors");
const crypto = require("crypto");

const mongoose = require("./models");
const User = require("./models/User");

require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async ({  body }, response) => {
  const { username } = body;
  const user = new User({ username });
  await user.save();
  response.json(user);
});

app.get("/api/users", async (request, response) => {
  const users = await User.find().select("-log");
  response.json(users);
});

app.post("/api/users/:_id/exercises", async ({  body, params }, response) => {
  const { description, duration, date } = body;
  const { _id } = params;
  const user = await User.findById(_id);
  const exercise = {
    description,
    duration: parseInt(duration),
    date: date ? new Date(date) : new Date(),
  };
  user.log.push(exercise);
  await user.save();
  response.json({
    _id: user._id,
    username: user.username,
    date: exercise.date.toDateString(),
    duration: exercise.duration,
    description: exercise.description,
  });
});

app.get("/api/users/:_id/logs", async ({ query, params }, response) => {
  console.log(query);
  const { from, to, limit } = query;
  const { _id } = params;
  const user = await User.findById(_id);
  const logs = user.log || [];
  let result = logs.map((log) => ({
    description: log.description,
    duration: log.duration,
    date: log.date.toDateString(),
  }));
  from && (result = result.filter((log) => new Date(log.date) >= new Date(from)));
  to && (result = result.filter((log) => new Date(log.date) <= new Date(to)));
  limit && (result = result.slice(0, limit));
  response.json({
    _id: user._id,
    username: user.username,
    count: result.length,
    log: result,
  });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
