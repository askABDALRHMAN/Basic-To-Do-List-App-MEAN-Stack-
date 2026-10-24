const express = require('express');
const Todo = require('../models/todo');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().select('text');
    res.json(todos);
  } catch {
    console.error('Failed to retrieve to-do items from MongoDB.');
    res.status(500).json({ error: 'Failed to retrieve to-do items.' });
  }
});

router.post('/', async (req, res) => {
  const { text } = req.body || {};

  if (typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text must not be empty.' });
  }

  try {
    const todo = await Todo.create({ text: text.trim() });
    res.status(201).json(todo);
  } catch {
    console.error('Failed to save the to-do item to MongoDB.');
    res.status(500).json({ error: 'Failed to create to-do item.' });
  }
});

module.exports = router;
