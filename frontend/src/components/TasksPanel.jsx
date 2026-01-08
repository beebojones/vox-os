import { useState } from "react";
import {
  CheckSquare,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

export default function TasksPanel() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Read a book",
      priority: "LOW",
      completed: false,
    },
  ]);

  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingPriority, setEditingPriority] = useState("LOW");

  function addTask() {
    if (!newTask.trim()) return;

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newTask.trim(),
        priority: "MEDIUM",
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
    setEditingPriority(task.priority);
  }

  function saveEdit(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              text: editingText.trim() || t.text,
              priority: editingPriority,
            }
          : t
      )
    );

    setEditingId(null);
    setEditingText("");
    setEditingPriority("LOW");
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="console-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="icon-purple" />
          <span className="uppercase text-sm tracking-wide">
            Tasks
          </span>
          <span className="count-pill">{tasks.length}</span>
        </div>
      </div>

      {/* Add Task */}
      <div className="flex items-center gap-2 mb-4">
        <input
          className="task-input flex-1"
          placeholder="Add a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button
          className="icon-button"
          onClick={addTask}
          aria-label="Add task"
        >
          <Plus />
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map((task) => {
          const isEditing = editingId === task.id;

          return (
            <div
              key={task.id}
              className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/5"
            >
              {/* Radio */}
              <button
                className="task-radio"
                onClick={() => toggleComplete(task.id)}
                aria-label="Complete task"
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      className="task-edit-input flex-1"
                      value={editingText}
                      onChange={(e) =>
                        setEditingText(e.target.value)
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        saveEdit(task.id)
                      }
                      autoFocus
                    />

                    <select
                      className="task-priority-select"
                      value={editingPriority}
                      onChange={(e) =>
                        setEditingPriority(e.target.value)
                      }
                    >
                      {PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="task-title truncate">
                      {task.text}
                    </span>
                    <span className={`priority-pill ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  className="icon-button subtle"
                  onClick={() =>
                    isEditing
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
          );
        })}
      </div>
    </div>
  );
}
