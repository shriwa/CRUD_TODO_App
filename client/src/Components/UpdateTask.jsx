import React, { useState, useEffect, useContext } from "react";
import { updateTask } from "../API/tasks";
import { AuthContext } from "../Context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateTask = ({ taskData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (taskData) {
      const formattedTaskDate = new Date(taskData.taskDate)
        .toISOString()
        .slice(0, 16);
      setFormData({ ...taskData, taskDate: formattedTaskDate });
    }
  }, [taskData]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to update the task?")) {
      try {
        const payload = {
          task: formData.task,
          taskDate: formData.taskDate,
          completed: formData.status === "completed",
        };

        const updatedTask = await updateTask(token, formData._id, payload);

        if (updatedTask.success) {
          toggleModal();
          toast.success("Task updated successfully");
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          toast.error("Failed to update task");
        }
      } catch (error) {
        console.error("Failed to update task", error);
        console.error(
          "Error details:",
          error.response ? error.response.data : "No response data"
        );
        setTimeout(() => {
          window.location.reload();
        }, 1200);
        toast.error("Failed to update task");
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <button
        onClick={toggleModal}
        className="inline-flex gap-2 items-center text-gray-200 bg-gray-600 border border-gray-300 focus:outline-none hover:bg-gray-500 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 "
        type="button"
      >
        Update
      </button>

      {isModalOpen && (
        <div className="fixed top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-300">
              {/* Modal Header */}
              <div className="flex items-center justify-center p-4 md:p-5 border-b rounded-t bg-cyan-500 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Update Task
                </h3>
                <button
                  onClick={toggleModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                    color="white"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 md:p-5 text-black">
                {/* Task Input */}
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="task"
                      className="block mb-2 text-sm font-medium "
                    >
                      Task
                    </label>
                    <input
                      type="text"
                      name="task"
                      id="task"
                      value={formData.task || ""}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-500 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Task"
                    />
                  </div>
                  {/* Datetime Input */}
                  <div className="col-span-2">
                    <label
                      htmlFor="taskDate"
                      className="block mb-2 text-sm font-medium "
                    >
                      Date and Time
                    </label>
                    <input
                      type="datetime-local"
                      name="taskDate"
                      id="taskDate"
                      value={formData.taskDate || ""}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-500 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  </div>
                  {/* Status Input */}
                  <div className="col-span-2">
                    <label
                      htmlFor="status"
                      className="block mb-2 text-sm font-medium "
                    >
                      Status
                    </label>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        id="completed"
                        value="completed"
                        checked={formData.status === "completed"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="completed" className="mr-4 ">
                        Completed
                      </label>
                      <input
                        type="radio"
                        name="status"
                        id="incomplete"
                        value="incomplete"
                        checked={formData.status === "incomplete"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="incomplete" className="">
                        Incomplete
                      </label>
                    </div>
                  </div>
                </div>
                {/* Update Button */}
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:focus:ring-blue-800"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateTask;
