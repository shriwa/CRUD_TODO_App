import React, { useState, useContext } from "react";
import { addTask } from "../API/tasks";
import { AuthContext } from "../Context/AuthContext";
import { RotatingLines } from "react-loader-spinner";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskDateTime, setTaskDateTime] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleAddTask = async () => {
    if (newTask.trim() === "") {
      toast.warning("Task cannot be empty. Please enter a task.");
      return;
    }

    if (taskDateTime.trim() === "") {
      toast.warning("Date cannot be empty. Please select a date.");
      return;
    }

    try {
      setLoading(true);
      const res = await addTask(token, {
        task: newTask,
        taskDate: taskDateTime,
      });
      setTasks([...tasks, res.task]);
      setNewTask("");
      setTaskDateTime("");
      toast.success("Task added successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Failed to add task:", error);
      const errorMessage = error.message || "Failed to add task.";
      toast.error(errorMessage);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-6 mt-16 z-100">
      <div className="bg-gray-300 rounded-xl shadow-lg p-6 w-full md:max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          To-Do
        </h1>

        <ToastContainer />

        <div className="flex mb-4">
          <input
            type="text"
            className="flex-grow px-3 py-2 border border-gray-300 hover:duration-300 bg-gray-100 hover:bg-gray-50 rounded-l-md focus:outline-none"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            disabled={loading}
          />
          <input
            type="datetime-local"
            className="px-3 py-2 border border-gray-300 focus:outline-none hover:duration-300 bg-gray-100 hover:bg-gray-50"
            value={taskDateTime}
            onChange={(e) => setTaskDateTime(e.target.value)}
            disabled={loading}
          />
          <button
            className="bg-cyan-500 hover:duration-300 text-white px-4 py-2 rounded-r-md hover:bg-cyan-400 focus:outline-none"
            onClick={handleAddTask}
            disabled={loading}
          >
            {loading ? (
              <RotatingLines
                visible={true}
                height="20"
                width="20"
                color="white"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              "Add"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Todo;
