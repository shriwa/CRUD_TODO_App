import API from ".";

// Get all tasks
export const getAllTasks = async (
  token,
  { searchTerm = "", sort = "", page, limit }
) => {
  try {
    const res = await API.get("/task/getalltasks", {
      headers: { auth_token: token },
      params: {
        task: searchTerm,
        sort,
        page,
        limit,
      },
    });
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Add a task
export const addTask = async (token, taskData) => {
  try {
    const res = await API.post("/task/addtask", taskData, {
      headers: { auth_token: token },
    });
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Remove a task
export const removeTask = async (id, token) => {
  try {
    const res = await API.delete(`/task/removetask/${id}`, {
      headers: { auth_token: token },
    });
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get a single task
export const getSingleTask = async (id, token) => {
  try {
    const res = await API.get(`/task/getsingletask/${id}`, {
      headers: { auth_token: token },
    });
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update a task
export const updateTask = async (token, id, payload) => {
  try {
    const res = await API.put(`/task/updatetask/${id}`, payload, {
      headers: { auth_token: token },
    });
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};
