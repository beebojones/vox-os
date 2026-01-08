import { useState } from "react";
import {
  CheckSquare,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

export default function TasksPanel({
  tasks,
  setTasks,
  open,
  onOpenChange,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingPriority, setEditingPriority] = useState("MEDIUM");

  function addTask() {
    if (!newTask.trim()) return;

    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: newTask.trim(),
        priority: editingPriority,
        status: "pending",
      },
    ]);

    setNewTask("");
    setEditingPriority("MEDIUM");
    setIsAdding(false);
  }

  function toggleComplete(id) {
    setTasks((prev) =>
      prev.filter((t) => t.id !== id)
    );
  }

  function startEdit(task) {
    setEditingId(task.id);
    setEditingText(task.title);
    setEditingPriority(task.priority);
  }

  function saveEdit(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              title: editingText,
              priority: editingPriority,
            }
          : t
      )
    );
    setEditingId(null);
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="console-card p-4">
      {/* Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => onOpenChange(!open)}
      >
        <div className="flex items-center gap-2">
          <CheckSquare className="icon-purple" />
          <span className="uppercase text-sm">Tasks</span>
          <span className="console-badge">
            {tasks.length}
          </span>
        </div>
      </div>

      {open && (
        <>
          {/* Add row */}
          <div className="flex items-center gap-2 mt-3">
            {!isAdding && (
              <button
                className="icon-button"
                onClick={() => setIsAdding(true)}
              >
                <Plus />
              </button>
            )}

            {isAdding && (
              <>
                <input
                  className="console-input flex-1"
                  placeholder="Add a task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && addTask()
                  }
                  autoFocus
                />

                <select
                  className="console-select"
                  value={editingPriority}
                  onChange={(e) =>
                    setEditingPriority(e.target.value)
                  }
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </>
            )}
          </div>

          {/* Task list */}
          <div className="mt-4 space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3"
              >
                {/* Radio */}
                <button
                  className="task-radio"
                  onClick={() => toggleComplete(task.id)}
                />

                {/* Content */}
                <div className="flex-1">
                  {editingId === task.id ? (
                    <>
                      <input
                        className="task-edit-input"
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
                        className="console-select mt-1"
                        value={editingPriority}
                        onChange={(e) =>
                          setEditingPriority(
                            e.target.value
                          )
                        }
                      >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">
                          MEDIUM
                        </option>
                        <option value="HIGH">HIGH</option>
                      </select>
                    </>
                  ) : (
                    <>
                      <div className="task-title">
                        {task.title}
                      </div>
                      <div className="task-meta">
                        {task.priority}
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
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
                    onClick={() =>
                      deleteTask(task.id)
                    }
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
