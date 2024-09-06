import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getTasks, createTask, updateTask } from '../services/api';
import TaskCard from './TaskCard';

const TaskBoard = ({ token, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo' });
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await getTasks(token);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask(newTask, token);
      setNewTask({ title: '', description: '', status: 'todo' });
      fetchTasks();
    } catch (err) {
      console.error('Error adding task:', err);
      setError(err.response?.data?.error || 'An error occurred while adding the task.');
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    updatedTasks.splice(destination.index, 0, movedTask);

    setTasks(updatedTasks);
    try {
      await updateTask(movedTask._id, movedTask, token);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task.');
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={onLogout} style={styles.logoutButton}>Logout</button>
      <h2>Task Board</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Task Description"
          value={newTask.description}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <select
          name="status"
          value={newTask.status}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button type="submit" style={styles.button}>Add Task</button>
        {error && <p style={styles.error}>{error}</p>}
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        {['todo', 'in-progress', 'done'].map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={styles.column}
              >
                <h3>{status.charAt(0).toUpperCase() + status.slice(1)}</h3>
                {tasks.filter(task => task.status === status).map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ ...styles.task, ...provided.draggableProps.style }}
                      >
                        <TaskCard task={task} token={token} onTaskUpdate={fetchTasks} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    margin: '5px 0',
  },
  button: {
    padding: '10px 20px',
    cursor: 'pointer',
  },
  column: {
    padding: '10px',
    margin: '5px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    width: '300px',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
  },
  task: {
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  logoutButton: {
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
  },
};

export default TaskBoard;
