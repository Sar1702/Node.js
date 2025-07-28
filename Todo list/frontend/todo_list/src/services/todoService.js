import axios from 'axios';

const API = 'http://localhost:3000/api/todos';

const api = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Get all todos
const getTodos = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch todos');
  }
};

// Create a new todo
const createTodo = async (text) => {
  try {
    const response = await api.post('/', { text });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create todo');
  }
};

// Update a todo
const updateTodo = async (id, updates) => {
  try {
    const response = await api.put(`/${id}`, updates);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update todo');
  }
};

// Delete a todo
const deleteTodo = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete todo');
  }
};

export default { getTodos, createTodo, updateTodo, deleteTodo };
