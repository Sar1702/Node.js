const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-list')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Todo Schema
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/', async (req, res) => {
    try {
        const filter = req.query.filter || 'all';
        let query = {};
        
        if (filter === 'active') {
            query.completed = false;
        } else if (filter === 'completed') {
            query.completed = true;
        }

        const todos = await Todo.find(query).sort({ createdAt: -1 });
        res.render('index', { todos, filter });
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).render('error', { message: 'Failed to fetch todos' });
    }
});

app.post('/todos', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.redirect('/?error=Text is required');
        }
        await Todo.create({ text });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating todo:', error);
        res.redirect('/?error=Failed to create todo');
    }
});

app.post('/todos/:id/toggle', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.redirect('/?error=Todo not found');
        }
        todo.completed = !todo.completed;
        await todo.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error toggling todo:', error);
        res.redirect('/?error=Failed to update todo');
    }
});

app.post('/todos/:id/delete', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.redirect('/?error=Failed to delete todo');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
