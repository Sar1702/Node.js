const Todo = require('../models/Todo');
const mongoose = require('mongoose');

/**
 * @desc    Get all todos
 * @route   GET /api/todos
 * @access  Public
 */
const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find()
      .sort({ createdAt: -1 })
      .select('text completed createdAt updatedAt');
    
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a todo
 * @route   POST /api/todos
 * @access  Public
 */
const createTodo = async (req, res, next) => {
  try {
    const { text } = req.body;
    const newTodo = new Todo({ text: text.trim() });
    const savedTodo = await newTodo.save();
    
    res.status(201).json({
      success: true,
      data: savedTodo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a todo
 * @route   PUT /api/todos/:id
 * @access  Public
 */
const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid todo ID"
      });
    }

    const updateData = {};
    if (req.body.text !== undefined) {
      updateData.text = req.body.text.trim();
    }
    if (req.body.completed !== undefined) {
      updateData.completed = req.body.completed;
    }

    const updated = await Todo.findByIdAndUpdate(
      id, 
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Todo not found"
      });
    }

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a todo
 * @route   DELETE /api/todos/:id
 * @access  Public
 */
const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid todo ID"
      });
    }

    const deleted = await Todo.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Todo not found"
      });
    }

    res.json({
      success: true,
      message: "Todo deleted successfully",
      data: { id }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
