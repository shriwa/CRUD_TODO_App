import React, { useState, useContext } from "react";
import { addTask } from "../API/tasks";
import { AuthContext } from "../Context/AuthContext";
import { RotatingLines } from "react-loader-spinner";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskDateTime, setTaskDateTime] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleAddTask = async () => {
    if (newTask.trim() === "") {
      setAlert({
        type: "warning",
        message: "Task cannot be empty. Please enter a task.",
      });
      setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 8000);
      return;
    }

    if (taskDateTime.trim() === "") {
      setAlert({
        type: "warning",
        message: "Date cannot be empty. Please select a date.",
      });
      setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 8000);
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
      setAlert({ type: "success", message: "Task added successfully!" });
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (error) {
      console.error("Failed to add task:", error);
      const errorMessage = error.message || "Failed to add task.";
      setAlert({
        type: "failure",
        message: `${errorMessage}`,
      });
      setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 8000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-6 mt-16  z-100">
      <div className="bg-gray-300 rounded-lg shadow-lg p-6 w-full md:max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          To-Do
        </h1>

        {/* Alert */}
        {alert.type && (
          <div
            className={`flex items-center p-3 mb-4 rounded-lg ${
              alert.type === "success"
                ? "text-green-800 bg-green-50"
                : alert.type === "failure"
                ? "text-red-800 bg-red-50"
                : "text-yellow-800 bg-yellow-50"
            }`}
          >
            <div className="text-sm font-medium">{alert.message}</div>
            <button
              type="button"
              className="ml-auto focus:outline-none"
              onClick={() => setAlert({ type: "", message: "" })}
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
            disabled={loading}
          />
          <input
            type="datetime-local"
            className="px-3 py-2 border border-gray-300 focus:outline-none"
            value={taskDateTime}
            onChange={(e) => setTaskDateTime(e.target.value)}
            disabled={loading}
          />
          <button
            className="bg-cyan-500 text-white px-4 py-2 rounded-r-md hover:bg-cyan-600 focus:outline-none"
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
