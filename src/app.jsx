import React, { useState, useEffect } from 'react';
import './App.css';

function TodoApp() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("my-todo-tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState('all');

  // NEW: State for editing
  const [editingId, setEditingId] = useState(null); // ID of task being edited
  const [editText, setEditText] = useState("");     // The text inside the edit input

  useEffect(() => {
    localStorage.setItem("my-todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (inputValue.trim() === "") return;
    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInputValue("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // NEW: Start editing a task
  const startEditing = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  // NEW: Save the edited task
  const saveEdit = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: editText } : task
    );
    setTasks(updatedTasks);
    setEditingId(null); // Exit edit mode
    setEditText("");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="app-container">
      <div className="todo-card">
        <h1>My To-Do List</h1>
        
        <div className="input-group">
          <input
            type="text"
            placeholder="Add a new task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <button className="add-btn" onClick={addTask}>Add</button>
        </div>

        <div className="filter-group">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active</button>
          <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
        </div>

        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              
              {/* CONDITIONAL RENDERING: Check if this specific task is being edited */}
              {editingId === task.id ? (
                // EDIT MODE
                <div className="edit-mode">
                  <input 
                    type="text" 
                    value={editText} 
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-input"
                  />
                  <button className="save-btn" onClick={() => saveEdit(task.id)}>Save</button>
                  <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                // VIEW MODE
                <>
                  <span onClick={() => toggleTask(task.id)}>
                    {task.text}
                  </span>
                  <div className="actions">
                    <button className="edit-btn" onClick={() => startEditing(task.id, task.text)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}

            </li>
          ))}
        </ul>
        
        {tasks.length === 0 && <p className="empty-msg">No tasks yet!</p>}
      </div>
    </div>
  );
}

export default TodoApp;
