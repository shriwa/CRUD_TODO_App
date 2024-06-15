import React, { useEffect, useState, useContext } from "react";
import UpdateTask from "./UpdateTask";
import { getAllTasks, removeTask, updateTask } from "../API/tasks";
import { AuthContext } from "../Context/AuthContext";
import { RotatingLines } from "react-loader-spinner";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskList = () => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(4);
  const [totalPages, setTotalPages] = useState();
  const [totalTasks, setTotalTasks] = useState();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getAllTasks(token, {
          searchTerm,
          sort,
          page,
          limit,
        });
        setTasks(fetchedTasks.data);
        setTotalPages(fetchedTasks.totalPages);
        setTotalTasks(fetchedTasks.totalTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token, searchTerm, sort, page, limit]);

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
    const confirmRemove = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmRemove) {
      setLoading(true);
      try {
        await removeTask(id, token);
        setTasks(tasks.filter((task) => task._id !== id));
        setSelectedTasks(selectedTasks.filter((taskId) => taskId !== id));
        setTimeout(() => {
          toast.success("Task removed successfully");
        }, 100);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error("Error removing task:", error);
        toast.error("Failed to remove task");
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
    const confirmMark = window.confirm(
      "Are you sure you want to mark all tasks as completed?"
    );
    if (confirmMark) {
      setLoading(true);
      try {
        await Promise.all(
          selectedTasks.map((id) => updateTask(token, id, { completed: true }))
        );
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            selectedTasks.includes(task._id)
              ? { ...task, completed: true }
              : task
          )
        );
        setSelectedTasks([]);
        setTimeout(() => {
          toast.success("Tasks marked as completed");
        }, 100);
      } catch (error) {
        console.error("Error updating tasks:", error);

        setTimeout(() => {
          toast.error("Failed to update tasks");
        }, 100);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMarkIncompleted = async () => {
    const confirmUnmark = window.confirm(
      "Are you sure you want to mark all tasks as incomplete?"
    );
    if (confirmUnmark) {
      setLoading(true);
      try {
        await Promise.all(
          selectedTasks.map((id) => updateTask(token, id, { completed: false }))
        );
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            selectedTasks.includes(task._id)
              ? { ...task, completed: false }
              : task
          )
        );
        setSelectedTasks([]);
        setTimeout(() => {
          toast.success("Tasks marked as incomplete");
        }, 100);
      } catch (error) {
        console.error("Error updating tasks:", error);
        setTimeout(() => {
          toast.error("Failed to update tasks");
        }, 100);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (sortOption) => {
    setSort(sortOption);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
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
      <div className="flex items-center justify-center">
        <div className="py-2 px-7 mt-8 ml-10 mr-10 rounded-xl animate-pulse text-red-600 text-md bg-red-100">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-22 overflow-hidden">
      <ToastContainer />
      <div className="md:flex md:w-full justify-center items-center grid mr-10 ml-10 gap-5 mb-4 py-2 ">
        <div className="flex items-center justify-center gap-4">
          {/* Sort Button */}
          <button
            id="dropdownRadioButton"
            data-dropdown-toggle="dropdownRadio"
            className="inline-flex shadow-md items-center w-20 text-gray-900 bg-gray-200 border hover:duration-300 border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-3"
            type="button"
            onClick={() => handleSortChange("taskDate")}
          >
            <svg
              className="w-3 h-3 text-gray-800 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
            </svg>

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

          {/* Sort Dropdown */}
          <div
            id="dropdownRadio"
            className="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
            data-popper-reference-hidden=""
            data-popper-escaped=""
            data-popper-placement="top"
            style={{
              position: "absolute",
              inset: "auto auto 0px 0px",
              margin: "0px",
              transform: "translate(682px, 1088px)",
            }}
          >
            <ul
              className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownRadioButton"
            >
              <li>
                <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                  <input
                    id="task-date-radio"
                    type="radio"
                    value=""
                    name="default-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    onClick={() => handleSortChange("taskDate")}
                  />
                  <label
                    htmlFor="task-date-radio"
                    className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                  >
                    Sort By Task Date
                  </label>
                </div>
              </li>
              <li>
                <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                  <input
                    id="task-name-radio"
                    type="radio"
                    value=""
                    name="default-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    onClick={() => handleSortChange("taskName")}
                  />
                  <label
                    htmlFor="task-name-radio"
                    className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                  >
                    Sort By Task Name
                  </label>
                </div>
              </li>
            </ul>
          </div>

          {/* Search Button */}
          <div>
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-900"
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
                className="block p-2 ps-10 text-sm shadow-md text-gray-900 border border-gray-300 rounded-lg w-60 md:w-80 bg-gray-200 hover:duration-300 hover:bg-gray-100 focus:outline-none"
                placeholder="Search for tasks"
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <h1>Total Tasks {totalTasks}</h1>
        <div className="flex items-center justify-center gap-4">
          {/* Mark Button */}
          <button
            onClick={handleMarkCompleted}
            className={`inline-flex gap-2 w-22 shadow-md items-center justify-center text-gray-100 bg-green-700 border border-gray-300 focus:outline-none hover:bg-green-600 hover:duration-300 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 ${
              selectedTasks.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={selectedTasks.length === 0}
          >
            Mark Completed
          </button>

          {/* Unmark Button */}
          <button
            onClick={handleMarkIncompleted}
            className={`inline-flex gap-2 w-22 shadow-md items-center justify-center text-gray-100 bg-red-700 border border-gray-300 focus:outline-none hover:bg-red-600 hover:duration-300 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 ${
              selectedTasks.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={selectedTasks.length === 0}
          >
            Mark Incomplete
          </button>
        </div>
      </div>

      {/* Task Table */}
      <div className="overflow-x-auto mx-4 mt-4 rounded-lg">
        <div className="overflow-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-400">
            <thead className="sticky top-0 bg-gray-300 text-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedTasks.length === tasks.length}
                    onChange={() => {
                      if (selectedTasks.length === tasks.length) {
                        setSelectedTasks([]);
                      } else {
                        setSelectedTasks(tasks.map((task) => task._id));
                      }
                    }}
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
                  className={`border bg-gray-300 border-gray-400 text-gray-900 ${
                    task.completed ? "bg-green-200" : "bg-red-200"
                  }`}
                >
                  <td className="w-4 p-3">
                    <div className="flex items-center">
                      <input
                        id={`checkbox-table-search-${task._id}`}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-900 dark:focus:ring-blue-900 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-800"
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
                  <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {task.task}
                  </td>
                  <td className="px-6 py-4">
                    {formatDateTime(task.createdAt)}
                  </td>
                  <td className="px-6 py-3">{formatDateTime(task.taskDate)}</td>
                  <td className="px-6 py-3">
                    {task.completed ? "Completed" : "Incomplete"}
                  </td>
                  <td className="flex items-center px-6 py-3">
                    <UpdateTask taskData={task} />
                    <button
                      onClick={() => handleRemoveTask(task._id)}
                      className="inline-flex gap-2 ml-2 items-center text-gray-100 bg-red-600 border border-gray-300 focus:outline-none hover:bg-red-500 focus:ring-2 focus:ring-red-900 font-medium rounded-lg text-sm px-3 py-1.5"
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

      {/* Pagination */}
      <nav className="flex items-center md:flex-row justify-center gap-20 mx-10 pt-4">
        <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
          Showing page{" "}
          <span className="font-semibold text-gray-900">{page}</span> of{" "}
          <span className="font-semibold text-gray-900">{totalPages}</span>
        </span>
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
          <li>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-800 bg-gray-300 border border-gray-400 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${
                page === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index}>
              <button
                onClick={() => handlePageChange(index + 1)}
                className={`flex items-center justify-center px-3 h-8 leading-tight ${
                  page === index + 1
                    ? "bg-gray-400 text-white"
                    : "text-gray-800 bg-gray-300 border border-gray-400 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-800 bg-gray-300 border border-gray-400 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${
                page === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default TaskList;
