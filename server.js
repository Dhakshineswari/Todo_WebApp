const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

const cors = require('cors');
app.use(cors());

mongoose.connect('mongodb://localhost:27017/mern-app')
  .then(() => {
    console.log('DB Connected');
  })
  .catch((err) => {
    console.log(err);
  });

  const todoSchema = new mongoose.Schema({
    title: {
      required: true,
      type: String
    },
    description: String,
    isChecked: {
      type: Boolean,
      default: false // Add this field to track task completion
    }
  });
  

const todoModel = mongoose.model('Todo', todoSchema);

app.post('/todos', async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/todos', async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.put('/todos/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const task = await todoModel.findById(id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      // Toggle the isChecked status
      task.isChecked = !task.isChecked;
      await task.save();
  
      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });
  

app.delete('/todos/:id', async (req, res) => {
  try {
    await todoModel.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

const port = 9003;
app.listen(port, () => {
  console.log("Server listening to port " + port);
});
