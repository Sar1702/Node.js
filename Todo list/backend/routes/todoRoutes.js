const express = require('express');
const router = express.Router();
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todocontroller');

/**
 * Middleware to validate todo requests
 */
const validateTodoBody = (req, res, next) => {
  try {
    if (req.method === 'POST') {
      const { text } = req.body;
      
      if (!text || typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Text is required for new todo'
        });
      }
    }

    if (req.method === 'PUT') {
      const { text, completed } = req.body;
      const updates = Object.keys(req.body);
      
      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No updates provided'
        });
      }

      if (text !== undefined && (typeof text !== 'string' || !text.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Text must be a non-empty string'
        });
      }

      if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'Completed must be a boolean'
        });
      }

      // Check for invalid fields
      const allowedUpdates = ['text', 'completed'];
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).json({
          success: false,
          message: 'Invalid updates! Only text and completed can be updated'
        });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Validation error'
    });
  }
};

// Route handlers with validation
router.route('/')
  .get(getTodos)
  .post(validateTodoBody, createTodo);

router.route('/:id')
  .put(validateTodoBody, updateTodo)
  .delete(deleteTodo);

// Handle 404 for non-existent routes
router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = router;
