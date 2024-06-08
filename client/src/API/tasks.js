import API from ".";

// Get all tasks
export const getAllTasks = async () => {
  try {
    const res = await API.get("/task/getalltask");
    return res.data;
  } catch (error) {
    console.error("Fetching all tasks failed", error);
    throw error.response.data;
  }
};

// Add a task
export const addTask = async (taskData) => {
  try {
    const res = await API.post("/task/addtask", taskData);
    return res.data;
  } catch (error) {
    console.error("Adding task failed", error);
    throw error.response.data;
  }
};

// Remove a task
export const removeTask = async (id) => {
  try {
    const res = await API.delete(`/task/removetask/${id}`);
    return res.data;
  } catch (error) {
    console.error("Removing task failed", error);
    throw error.response.data;
  }
};

// Get a single task
export const getSingleTask = async (id) => {
  try {
    const res = await API.get(`/task/getsingletask/${id}`);
    return res.data;
  } catch (error) {
    console.error("Fetching single task failed", error);
    throw error.response.data;
  }
};

// Update a task
export const updateTask = async (id, payload) => {
  try {
    const res = await API.put(`/task/updatetask/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error("Updating task failed", error);
    throw error.response.data;
  }
};
