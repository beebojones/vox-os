import { useState } from "react";
import {
  CheckSquare,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

export default function TasksPanel() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Read a book",
      priority: "LOW",
      energy: "low energy",
      completed: false,
    },
  ]);

  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  function addTask() {
    if (!newTask.trim()) return;

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newTask.trim(),
        priority: "MEDIUM",
        energy: "normal",
        completed: false,
      },
    ]);
    setNewTask("");
  }

  function toggleComplete(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function startEdit(task) {
    setEditingId(task.id);
    setEditingText(task.text);
  }

  function saveEdit(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, text: editingText } : t
      )
    );
    setEditingId(null);
    setEditingText("");
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="console-card">
      {/* Header */}
      <div className="card-header">
        <div className="flex items-center gap-2">
          <CheckSquare className="icon-purple" />
          <h2>TASKS</h2>
          <span className="count-pill">{tasks.length}</span>
        </div>
      </div>

      {/* Add Task Row */}
      <div className="task-add-row">
        <input
          className="task-input"
          placeholder="Add a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button className="icon-button" onClick={addTask}>
          <Plus />
        </button>
      </div>

      {/* Task List */}
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-row">
            {/* Radio */}
            <button
              className="task-radio"
              onClick={() => toggleComplete(task.id)}
              aria-label="Complete task"
            />

            {/* Content */}
            <div className="task-content">
              {editingId === task.id ? (
                <input
                  className="task-edit-input"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && saveEdit(task.id)
                  }
                  autoFocus
                />
              ) : (
                <>
                  <div className="task-title">{task.text}</div>
                  <div className="task-meta">
                    <span className="priority">
                      {task.priority}
                    </span>
                    <span className="dot">•</span>
                    <span className="energy">{task.energy}</span>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="task-actions">
              <button
                className="icon-button subtle"
                onClick={() =>
                  editingId === task.id
                    ? saveEdit(task.id)
                    : startEdit(task)
                }
                aria-label="Edit task"
              >
                <Pencil />
              </button>
              <button
                className="icon-button subtle"
                onClick={() => deleteTask(task.id)}
                aria-label="Delete task"
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
