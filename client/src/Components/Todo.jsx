import React, { useState } from "react";
import { addTask } from "../API/tasks";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskDateTime, setTaskDateTime] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);
  const [failureAlert, setFailureAlert] = useState(false);

  const handleAddTask = async () => {
    if (newTask.trim() !== "") {
      try {
        const res = await addTask({ task: newTask, taskDate: taskDateTime });
        setTasks([...tasks, res.task]);
        setNewTask("");
        setTaskDateTime("");
        setSuccessAlert(true);
        setTimeout(() => {
          setSuccessAlert(false);
        }, 8000);
        window.location.reload();
      } catch (error) {
        console.error("Failed to add task:", error);
        setFailureAlert(true);
        setTimeout(() => {
          setFailureAlert(false);
        }, 8000);
      }
    }
  };

  return (
    <div className="flex items-center justify-center py-6 mt-20">
      <div className="bg-gray-300 rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          To-Do{" "}
        </h1>
        {/* Success Alert */}
        {successAlert && (
          <div
            id="success-alert"
            className="flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-50"
          >
            <div className="text-sm font-medium">Task added successfully!</div>
            <button
              type="button"
              className="ml-auto focus:outline-none"
              onClick={() => setSuccessAlert(false)}
            >
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        )}
        {/* Failure Alert */}
        {failureAlert && (
          <div
            id="failure-alert"
            className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50"
          >
            <div className="text-sm font-medium">
              Failed to add task. Please try again later.
            </div>
            <button
              type="button"
              className="ml-auto focus:outline-none"
              onClick={() => setFailureAlert(false)}
            >
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        )}
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <input
            type="datetime-local"
            className="px-3 py-2 border border-gray-300 focus:outline-none"
            value={taskDateTime}
            onChange={(e) => setTaskDateTime(e.target.value)}
          />
          <button
            className="bg-cyan-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none"
            onClick={handleAddTask}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Todo;
