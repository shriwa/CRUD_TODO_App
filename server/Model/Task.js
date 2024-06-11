const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  task: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  taskDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Task", taskSchema);
