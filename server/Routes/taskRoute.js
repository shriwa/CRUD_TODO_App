const express = require("express");
const router = express.Router();
const {
  addTask,
  removeTask,
  getAllTasks,
  getSingleTask,
  updateTask,
} = require("../Controller/taskController");
const { fetchUser } = require("../Middleware/auth");

router.post("/addtask", fetchUser, addTask);
router.delete("/removetask/:id", fetchUser, removeTask);
router.get("/getalltasks", fetchUser, getAllTasks);
router.get("/getsingletask/:id", fetchUser, getSingleTask);
router.put("/updatetask/:id", fetchUser, updateTask);

module.exports = router;
