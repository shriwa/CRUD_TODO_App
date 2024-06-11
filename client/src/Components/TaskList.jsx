import React, { useEffect, useState, useContext } from "react";
import UpdateTask from "./UpdateTask";
import { getAllTasks, removeTask, updateTask } from "../API/tasks";
import { AuthContext } from "../Context/AuthContext";
import { RotatingLines } from "react-loader-spinner";

const TaskList = () => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getAllTasks(token);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  const handleRemoveTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await removeTask(id, token);
        setTasks(tasks.filter((task) => task.id !== id));
        setSelectedTasks(selectedTasks.filter((taskId) => taskId !== id));
      } catch (error) {
        console.error("Error removing task:", error);
      }
    }
  };

  const handleSelectTask = (id) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((taskId) => taskId !== id)
        : [...prevSelected, id]
    );
  };

  const handleMarkCompleted = async () => {
    if (
      window.confirm("Are you sure you want to mark all tasks as completed?")
    ) {
      try {
        await Promise.all(
          selectedTasks.map((id) =>
            updateTask(token, id, { completed: true }, token)
          )
        );
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            selectedTasks.includes(task.id)
              ? { ...task, completed: true }
              : task
          )
        );
        setSelectedTasks([]);
      } catch (error) {
        console.error("Error updating tasks:", error);
        setError("Failed to update tasks");
      }
    }
  };

  const handleMarkIncompleted = async () => {
    if (
      window.confirm("Are you sure you want to mark all tasks as incomplete?")
    ) {
      try {
        await Promise.all(
          selectedTasks.map((id) =>
            updateTask(token, id, { completed: false }, token)
          )
        );
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            selectedTasks.includes(task.id)
              ? { ...task, completed: false }
              : task
          )
        );
        setSelectedTasks([]);
      } catch (error) {
        console.error("Error updating tasks:", error);
        setError("Failed to update tasks");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center ">
        <RotatingLines
          visible={true}
          height="56"
          width="56"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 mr-20 ml-20 rounded-lg text-red-600 text-lg bg-red-100">
        {error}
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center justify-center gap-5 mb-4">
        <button
          onClick={handleMarkCompleted}
          className={`inline-flex gap-2 items-center text-gray-100 bg-green-700 border border-gray-300 focus:outline-none hover:bg-green-600 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 ${
            selectedTasks.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={selectedTasks.length === 0}
        >
          Mark Completed
        </button>
        <button
          onClick={handleMarkIncompleted}
          className={`inline-flex gap-2 items-center text-gray-100 bg-red-700 border border-gray-300 focus:outline-none hover:bg-red-600 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 ${
            selectedTasks.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Mark Incomplete
        </button>
      </div>
      <div className="relative overflow-x-auto mr-4 ml-4 shadow-md rounded-lg ">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-black border  border-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-cyan-500 dark:text-gray-800">
            <tr>
              <th scope="col" className="p-4 ">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedTasks(
                      e.target.checked ? tasks.map((task) => task.id) : []
                    )
                  }
                  checked={selectedTasks.length === tasks.length}
                />
              </th>
              <th scope="col" className="px-6 py-3">
                Task
              </th>
              <th scope="col" className="px-6 py-3">
                Created on
              </th>
              <th scope="col" className="px-6 py-3">
                Task Date
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task._id}
                className={`border bg-gray-300 border-gray-400 ${
                  task.completed ? " bg-green-200" : " bg-red-200"
                }`}
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-search-${task.id}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onChange={() => handleSelectTask(task.id)}
                      checked={selectedTasks.includes(task.id)}
                    />
                    <label
                      htmlFor={`checkbox-table-search-${task.id}`}
                      className="sr-only"
                    >
                      checkbox
                    </label>
                  </div>
                </td>
                <td
                  className={`px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-black`}
                >
                  {task.task}
                </td>
                <td className="px-6 py-4">{formatDateTime(task.createdAt)}</td>
                <td className="px-6 py-4">{formatDateTime(task.taskDate)}</td>
                <td className="px-6 py-4">
                  {task.completed ? "Completed" : "Incomplete"}
                </td>
                <td className="flex items-center px-6 py-4">
                  <UpdateTask taskData={task} />
                  <button
                    onClick={() => handleRemoveTask(task.id)}
                    className="inline-flex gap-2 ml-2 items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-red-600 dark:text-white dark:border-gray-600 dark:hover:bg-red-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
