const mongoose = require("mongoose");
const slugify = require("slugify");

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  slug: { type: String, required: true }, // Add slug field
  createdAt: { type: Date, default: Date.now },
  taskDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Middleware to generate slug before saving if task is modified
taskSchema.pre("save", function (next) {
  if (this.isModified("task")) {
    this.slug = slugify(this.task, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Task", taskSchema);
