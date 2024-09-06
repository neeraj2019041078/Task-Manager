import React, { useState } from 'react';
import { updateTask, deleteTask } from '../services/api';

const TaskCard = ({ task, token, onTaskUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTask, setEditTask] = useState({ ...task });

  const handleChange = (e) => {
    setEditTask({ ...editTask, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await updateTask(task._id, editTask, token);
      setIsEditing(false);
      onTaskUpdate(); // Refresh tasks after updating
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task._id, token);
      onTaskUpdate(); // Refresh tasks after deleting
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.card}>
      {isEditing ? (
        <>
          <input
            type="text"
            name="title"
            value={editTask.title}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="text"
            name="description"
            value={editTask.description}
            onChange={handleChange}
            style={styles.input}
          />
          <button onClick={handleUpdate} style={styles.button}>Save</button>
          <button onClick={() => setIsEditing(false)} style={styles.button}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          {task.dueDate && <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>}
          <p><strong>Status:</strong> {task.status}</p>
          <button onClick={() => setIsEditing(true)} style={styles.button}>Edit</button>
          <button onClick={handleDelete} style={styles.deleteButton}>Delete</button>
        </>
      )}
    </div>
  );
};

const styles = {
  card: {
    padding: '20px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  input: {
    padding: '10px',
    margin: '5px 0',
    width: '100%',
  },
  button: {
    marginRight: '10px',
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

export default TaskCard;
