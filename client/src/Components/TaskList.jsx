import React, { useEffect, useState } from "react";
import UpdateTask from "./UpdateTask";
import { getAllTasks, removeTask, updateTask } from "../API/tasks"; // Assuming you have an updateTask API

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getAllTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

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
        await removeTask(id);
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
      window.confirm("Are you sure you want to to mark all tasks as completed")
    ) {
      try {
        await Promise.all(
          selectedTasks.map((id) => updateTask(id, { completed: true }))
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
      window.confirm("Are you sure you want to mark all tasks as Icompleted?")
    ) {
      try {
        await Promise.all(
          selectedTasks.map((id) => updateTask(id, { completed: false }))
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
      <div className="flex items-center justify-center border-gray-200 rounded-lg bg-gray-50">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-200 fill-cyan-500"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
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
          Mark All Completed
        </button>
        <button
          onClick={handleMarkIncompleted}
          className={`inline-flex gap-2 items-center text-gray-100 bg-red-700 border border-gray-300 focus:outline-none hover:bg-red-600 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 ${
            selectedTasks.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Mark All Incomplete
        </button>
      </div>
      <div className="relative overflow-x-auto mr-4 ml-4 shadow-md rounded-lg ">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-black">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-cyan-500 dark:text-gray-800">
            <tr>
              <th scope="col" className="p-4">
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
                className={`border-bbg-gray-300 border-gray-700 ${
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
                  {task.completed ? "Completed" : "Incompleted"}
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
