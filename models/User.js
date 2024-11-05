const mongoose = require("mongoose");

const exercise = new mongoose.Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
});

const user = mongoose.Schema({
  username: { type: String, required: true },
  log: [exercise],
});

module.exports = mongoose.model("User", user);