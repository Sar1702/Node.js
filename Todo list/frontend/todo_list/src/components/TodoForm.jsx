import React, { useState } from 'react';

const TodoForm = ({ onAdd, filter, setFilter }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-xl">
      <input
        type="text"
        className="flex-1 p-3 border rounded shadow-sm"
        placeholder="Add a task..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-500 shadow"
        >
          Add Task
        </button>
     <select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  className="border rounded px-3 py-2 shadow-sm  "
>
  <option value="all" className="text-black hover:bg-green-500">All</option>
  <option value="active" className="text-black">Active</option>
  <option value="completed" className="text-black">Completed</option>
</select>


      </div>
    </form>
  );
};

export default TodoForm;
