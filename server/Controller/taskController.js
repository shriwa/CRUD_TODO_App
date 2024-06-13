const Task = require("../Model/Task");
const User = require("../Model/User");

// Add a task
exports.addTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { task, taskDate, completed = false } = req.body;

    const newTask = new Task({
      task,
      createdAt: new Date(),
      completed,
      taskDate: new Date(taskDate),
      user: userId,
    });

    await newTask.save();
    await User.findByIdAndUpdate(userId, { $push: { tasks: newTask._id } });

    res.json({ success: true, task: newTask });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Remove a task
exports.removeTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    console.log("Task deleted");
    res.json({ success: true, id: taskId });
  } catch (error) {
    console.error("Error removing task:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    let tasks = await Task.find({ user: userId });
    console.log("All tasks fetched");
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Get a single task
exports.getSingleTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    console.log("Task fetched");
    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const { task, taskDate, completed } = req.body;

    let updatedData = {
      task,
      taskDate,
      completed,
    };

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      updatedData,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    console.log("Task updated");
    res.json({ success: true, task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
