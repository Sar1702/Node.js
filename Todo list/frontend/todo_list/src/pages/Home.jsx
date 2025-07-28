import React, { useEffect, useState } from 'react';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import todoService from '../services/todoService';

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await todoService.getTodos();
      setTodos(response.data || []); // Backend already sorts by newest first
    } catch (error) {
      setError(error.message);
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text) => {
    try {
      setError(null);
      const response = await todoService.createTodo(text);
      if (response.success && response.data) {
        setTodos([response.data, ...todos]);
      } else {
        throw new Error(response.message || 'Failed to add todo');
      }
    } catch (error) {
      setError(error.message);
      console.error('Failed to add todo:', error);
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      setError(null);
      const response = await todoService.updateTodo(id, updates);
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
    } catch (error) {
      setError(error.message);
      console.error('Failed to update todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError(null);
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      setError(error.message);
      console.error('Failed to delete todo:', error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-green-100 py-8 px-4">
      <div className="w-full max-w-xl mx-auto">
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <TodoForm onAdd={addTodo} filter={filter} setFilter={setFilter} />
          <div className="space-y-2">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
              />
            ))}
            {filteredTodos.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No todos {filter !== 'all' ? `marked as ${filter}` : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
