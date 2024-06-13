import React, { useEffect, useState, useContext } from "react";
import UpdateTask from "./UpdateTask";
import { getAllTasks, removeTask, updateTask } from "../API/tasks";
import { AuthContext } from "../Context/AuthContext";
import { RotatingLines } from "react-loader-spinner";
import SearchButton from "./SearchButton";

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
        setError("! Failed to fetch tasks");
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
      setLoading(true);
      try {
        await removeTask(id, token);
        setTasks(tasks.filter((task) => task._id !== id));
        setSelectedTasks(selectedTasks.filter((taskId) => taskId !== id));
      } catch (error) {
        console.error("Error removing task:", error);
        setError("Failed to remove task");
      } finally {
        setLoading(false);
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
      setLoading(true);
      try {
        await Promise.all(
          selectedTasks.map((id) =>
            updateTask(token, id, { completed: true }, token)
          )
        );
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            selectedTasks.includes(task._id)
              ? { ...task, completed: true }
              : task
          )
        );
        setSelectedTasks([]);
      } catch (error) {
        console.error("Error updating tasks:", error);
        setError("Failed to update tasks");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMarkIncompleted = async () => {
    if (
      window.confirm("Are you sure you want to mark all tasks as incomplete?")
    ) {
      setLoading(true);
      try {
        await Promise.all(
          selectedTasks.map((id) =>
            updateTask(token, id, { completed: false }, token)
          )
        );
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            selectedTasks.includes(task._id)
              ? { ...task, completed: false }
              : task
          )
        );
        setSelectedTasks([]);
      } catch (error) {
        console.error("Error updating tasks:", error);
        setError("Failed to update tasks");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    console.log("Loading:", loading);
    console.log("Tasks:", tasks);
    console.log("Error:", error);
  }, [loading, tasks, error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RotatingLines
          visible={true}
          height="56"
          width="56"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="py-2 px-7  mt-8 ml-10 mr-10 rounded-xl  animate-pulse text-red-600 text-md bg-red-100">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed w-full top-80">
      <div className="fixed top-72 w-full flex items-center justify-center gap-5 mb-4">
        {/* Sort Button */}
        <button
          id="dropdownRadioButton"
          data-dropdown-toggle="dropdownRadio"
          className="inline-flex items-center text-gray-900 bg-gray-200 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5"
          type="button"
        >
          <svg
            className="w-3 h-3 text-gray-500 dark:text-gray-400 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
          </svg>
          Last 30 days
          <svg
            className="w-2.5 h-2.5 ms-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        {/* Search Button */}
        <div>
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-900 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search-users"
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-200 hover:bg-gray-100  focus:ring-blue-500 focus:border-blue-500 "
              placeholder="Search for users"
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Mark Button*/}
        <button
          onClick={handleMarkCompleted}
          className={`inline-flex gap-2 items-center text-gray-100 bg-green-700 border border-gray-300 focus:outline-none hover:bg-green-600 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 ${
            selectedTasks.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={selectedTasks.length === 0}
        >
          Mark Completed
        </button>

        {/* Unmark Button*/}
        <button
          onClick={handleMarkIncompleted}
          className={`inline-flex gap-2 items-center  text-gray-100 bg-red-700 border border-gray-300 focus:outline-none hover:bg-red-600 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 ${
            selectedTasks.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={selectedTasks.length === 0}
        >
          Mark Incomplete
        </button>
      </div>

      {/* Task Table */}
      <div className="relative overflow-x-auto mr-4 ml-4 rounded-lg mt-6">
        <div className="h-72">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-black border border-gray-400">
            <thead className="sticky top-0 bg-gray-300 text-gray-800">
              <tr>
                <th scope="col" className="p-4">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedTasks(
                        e.target.checked ? tasks.map((task) => task._id) : []
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
                        id={`checkbox-table-search-${task._id}`}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        onChange={() => handleSelectTask(task._id)}
                        checked={selectedTasks.includes(task._id)}
                      />
                      <label
                        htmlFor={`checkbox-table-search-${task._id}`}
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-black">
                    {task.task}
                  </td>
                  <td className="px-6 py-4">
                    {formatDateTime(task.createdAt)}
                  </td>
                  <td className="px-6 py-4">{formatDateTime(task.taskDate)}</td>
                  <td className="px-6 py-4">
                    {task.completed ? "Completed" : "Incomplete"}
                  </td>

                  <td className="flex items-center px-6 py-4">
                    <UpdateTask taskData={task} />
                    <button
                      onClick={() => handleRemoveTask(task._id)}
                      className="inline-flex gap-2 ml-2 items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-red-600 dark:text-white dark:border-gray-600 dark:hover:bg-red-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* */}

          {/* Pagination*/}
          <nav
            className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-gray-500  mb-4 md:mb-0 block w-full md:inline md:w-auto">
              Showing <span className="font-semibold text-gray-900">1-10</span>{" "}
              of <span className="font-semibold text-gray-900">1000</span>
            </span>
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-800 bg-gray-300 border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                >
                  Previous
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-5800 bg-gray-300 border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                >
                  1
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-800 bg-gray-300 border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 "
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
          {/* */}
        </div>
      </div>
      {/* */}
    </div>
  );
};

export default TaskList;
