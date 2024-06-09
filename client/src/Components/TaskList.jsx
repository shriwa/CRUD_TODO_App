import React, { useEffect, useState } from "react";
import UpdateTask from "./UpdateTask";
import { getAllTasks, removeTask } from "../API/tasks";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getAllTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks");
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
      } catch (error) {
        console.error("Error removing task:", error);
      }
    }
  };

  return (
    <div className="relative overflow-x-auto mr-4 ml-4 shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-black">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-cyan-500 dark:text-gray-800">
          <tr>
            <th scope="col" className="p-4"></th>
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
            <th scope="col" className="px-6 py-3">
              <div className="flex">
                <button
                  onClick={() => handleRemoveTask(task.id)}
                  className="inline-flex gap-2 ml-2 items-center  text-gray-100 bg-green-700 border border-gray-300 focus:outline-none hover:bg-green-600 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5"
                >
                  Mark All Completed
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task._id}
              className="bg-white border-b dark:bg-gray-300 dark:border-gray-700 "
            >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id={`checkbox-table-search-${task.id}`}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={`checkbox-table-search-${task.id}`}
                    className="sr-only"
                  >
                    checkbox
                  </label>
                </div>
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-black">
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
  );
};

export default TaskList;
