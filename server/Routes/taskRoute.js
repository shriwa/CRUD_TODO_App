const express = require("express");
const router = express.Router();

const {
  addTask,
  removeTask,
  getAllTasks,
  getSingleTask,
  updateTask,
} = require("../Controller/taskController");

router.post("/addtask", addTask);
router.delete("/removetask/:id", removeTask);
router.get("/getalltask", getAllTasks);
router.get("/getsingletask/:id", getSingleTask);
router.put("/updatetask/:id", updateTask);

module.exports = router;
