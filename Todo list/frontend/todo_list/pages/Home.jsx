import React, { useEffect, useState } from 'react';
import TodoForm from '../src/components/TodoForm';
import TodoItem from '../src/components/TodoItem';
import todoService from '../src/services/todoService';

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchTodos = async () => {
    const res = await todoService.getTodos();
    setTodos(res.data.reverse()); // latest on top
  };

  const addTodo = async (title) => {
    const res = await todoService.createTodo(title);
    setTodos([res.data, ...todos]);
  };

  const updateTodo = async (id, updates) => {
    const res = await todoService.updateTodo(id, updates);
    setTodos(todos.map(todo => todo._id === id ? res.data : todo));
  };

  const deleteTodo = async (id) => {
    await todoService.deleteTodo(id);
    setTodos(todos.filter(todo => todo._id !== id));
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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="w-full max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Todo List
        </h1>
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
