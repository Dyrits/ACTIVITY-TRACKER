const mongoose = require("mongoose");

const URI = "mongodb://localhost:27017/exercise-tracker";

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected to the database");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

module.exports = mongoose;