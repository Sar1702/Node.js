import axios from 'axios';

const API = 'http://localhost:5000/api/todos'; // Change if deployed

const getTodos = () => axios.get(API);
const createTodo = (title) => axios.post(API, { title });
const updateTodo = (id, updates) => axios.put(`${API}/${id}`, updates);
const deleteTodo = (id) => axios.delete(`${API}/${id}`);

export default { getTodos, createTodo, updateTodo, deleteTodo };
