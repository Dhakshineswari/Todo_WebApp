import React, { useState, useEffect } from 'react';
import './Todo.css';

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:9003/todos');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
  if (input.trim() === '') {
    alert('You must write a task title');
    return;
  }

  try {
    const response = await fetch('http://localhost:9003/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: input, description: description }),
    });

    if (!response.ok) throw new Error('Failed to add task');
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
    setInput('');
    setDescription('');
  } catch (error) {
    console.error('Error adding task:', error);
  }
};

const toggleTask = async (taskId) => {
  try {
    const response = await fetch(`http://localhost:9003/todos/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) throw new Error('Failed to toggle task');
    const updatedTask = await response.json();
    setTasks(tasks.map(task =>
      task._id === taskId ? updatedTask : task
    ));
  } catch (error) {
    console.error('Error toggling task:', error);
  }
};

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:9003/todos/${taskId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  
  return (
  
  <div className="todo-app">
    <h1 className="container">TODO APP</h1>
    
    <div className="row">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new task"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description"
      />
      <button onClick={addTask}>Add Task</button>
    </div>
    <ul>
      {tasks.map(task => (
        <li
          key={task._id}
          className={task.isChecked ? 'checked' : ''}
          onClick={() => toggleTask(task._id)}
        >
          {task.title}
          <span onClick={(e) => { e.stopPropagation(); deleteTask(task._id); }}>✖</span>
        </li>
      ))}
    </ul>
  </div>
);

};

export default Todo;
