import React from 'react';

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const date = new Date(todo.createdAt || Date.now()); // use createdAt or fallback
  const time = date.toLocaleTimeString();
  const fullDate = date.toLocaleDateString();

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-3">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onUpdate(todo._id, { completed: !todo.completed })}
          className="w-5 h-5 accent-blue-600"
        />
        <div>
          <p className={`text-lg ${todo.completed ? 'line-through text-gray-400' : ''}`}>
            {todo.title}
          </p>
          <small className="text-gray-500 text-xs">{time}, {fullDate}</small>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onDelete(todo._id)}
          className="text-gray-500 hover:text-red-600"
        >
          🗑️
        </button>
        <button className="text-gray-500 hover:text-green-500">
          ✏️
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
