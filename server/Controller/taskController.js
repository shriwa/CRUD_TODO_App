const Task = require("../Model/Task");

// Add a task
exports.addTask = async (req, res) => {
  try {
    let tasks = await Task.find({});
    let id;
    if (tasks.length > 0) {
      let last_product_array = tasks.slice(-1);
      let last_product = last_product_array[0];
      id = last_product.id + 1;
    } else {
      id = 1;
    }

    const { task, taskDate, completed = false } = req.body;

    const newTask = new Task({
      id: id,
      task: task,
      createdAt: new Date(),
      completed: completed,
      taskDate: new Date(taskDate),
    });
    console.log(newTask);
    await newTask.save();
    console.log("Saved");
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Remove a task
exports.removeTask = async (req, res) => {
  try {
    const taskId = req.params.id; // Access task ID from URL parameter
    await Task.findOneAndDelete({ id: taskId }); // Remove task from the database
    console.log("Task deleted");
    res.json({
      success: true,
      id: taskId, // Send back the deleted task ID in the response
    });
  } catch (error) {
    console.error("Error removing task:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Get all task
exports.getAllTasks = async (req, res) => {
  try {
    let tasks = await Task.find({});
    console.log("All tasks fetched");
    res.send(tasks);
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Get a single task
exports.getSingleTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findOne({ id: taskId });
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
    const taskId = parseInt(req.params.id);
    const updatedData = {
      task: req.body.task,
      taskDate: req.body.taskDate,
      completed: req.body.completed,
    };

    const task = await Task.findOneAndUpdate({ id: taskId }, updatedData, {
      new: true,
    });
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }
    console.log("Task updated");
    res.json({
      success: true,
      task: task,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
