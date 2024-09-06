import axios from 'axios';

const API_URL = 'https://task-manager-euiy.onrender.com/api';

// Register user
export const register = async (userData) => {
  return await axios.post(`${API_URL}/auth/register`, userData);
};

// Login user
export const login = async (userData) => {
  return await axios.post(`${API_URL}/auth/login`, userData);
};

// Get all tasks
export const getTasks = async (token) => {
  return await axios.get(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Create a new task
export const createTask = async (taskData, token) => {
  return await axios.post(`${API_URL}/tasks`, taskData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Update task
export const updateTask = async (taskId, taskData, token) => {
    return await axios.put(`${API_URL}/tasks/${taskId}`, taskData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };
  
  // Delete task
  export const deleteTask = async (taskId, token) => {
    return await axios.delete(`${API_URL}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };
  