import { useState } from "react";
import {
  CheckSquare,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

export default function TasksPanel({ tasks, setTasks }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newPriority, setNewPriority] = useState("LOW");

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingPriority, setEditingPriority] = useState("LOW");

  function startAdd() {
    setIsAdding(true);
    setNewText("");
    setNewPriority("LOW");
  }

  function cancelAdd() {
    setIsAdding(false);
    setNewText("");
  }

  function addTask() {
    if (!newText.trim()) return;

    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: newText.trim(),
        priority: newPriority,
        completed: false,
      },
    ]);

    cancelAdd();
  }

  function completeTask(id) {
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
          ? { ...t, text: editingText, priority: editingPriority }
          : t
      )
    );
    setEditingId(null);
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="console-card p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CheckSquare className="icon-purple" />
          <span className="uppercase text-sm tracking-wide">Tasks</span>
          <span className="console-badge">{tasks.length}</span>
        </div>
      </div>

      {/* Add Row */}
      {!isAdding ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 console-input opacity-50 cursor-default">
            Add a task...
          </div>
          <button
            className="icon-button round"
            onClick={startAdd}
            aria-label="Add task"
          >
            <Plus />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            className="console-input w-full"
            placeholder="Task description"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            autoFocus
          />

          <div className="flex items-center gap-2">
            <select
              className="console-select"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <button
              className="icon-button round"
              onClick={addTask}
              aria-label="Confirm"
            >
              <Plus />
            </button>

            <button
              className="icon-button subtle"
              onClick={cancelAdd}
              aria-label="Cancel"
            >
              <X />
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="task-row">
            {/* Radio */}
            <button
              className="task-radio"
              onClick={() => completeTask(task.id)}
            />

            {/* Content */}
            <div className="flex-1">
              {editingId === task.id ? (
                <>
                  <input
                    className="task-edit-input"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && saveEdit(task.id)
                    }
                    autoFocus
                  />
                  <select
                    className="console-select mt-1"
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
                </>
              ) : (
                <>
                  <div className="task-title">{task.text}</div>
                  <div className="task-meta">
                    <span className={`priority ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
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
              >
                <Pencil />
              </button>
              <button
                className="icon-button subtle"
                onClick={() => deleteTask(task.id)}
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
