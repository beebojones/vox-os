import { useState } from "react";
import {
  CheckSquare,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export default function TasksPanel({
  tasks,
  setTasks,
  open,
  onOpenChange,
}) {
  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingPriority, setEditingPriority] = useState("LOW");

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
    setEditingPriority("LOW");
    setAdding(false);
  }

  function toggleComplete(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
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
          ? { ...t, title: editingText, priority: editingPriority }
          : t
      )
    );
    setEditingId(null);
    setEditingText("");
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="console-card p-4">
      {/* Header */}
      <button
        onClick={() => onOpenChange(!open)}
        className="flex items-center justify-between w-full mb-3"
      >
        <div className="flex items-center gap-2">
          <CheckSquare className="text-purple-400" />
          <span className="uppercase text-sm tracking-wider">
            Tasks
          </span>
          <span className="console-badge">{tasks.length}</span>
        </div>
        {open ? <ChevronUp /> : <ChevronDown />}
      </button>

      {open && (
        <>
          {/* Add row */}
          <div className="flex items-center gap-2 mb-3">
            {adding ? (
              <>
                <input
                  className="console-input flex-1"
                  placeholder="Add a task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  autoFocus
                />
                <select
                  className="console-input w-24"
                  value={editingPriority}
                  onChange={(e) =>
                    setEditingPriority(e.target.value)
                  }
                >
                  <option>LOW</option>
                  <option>MEDIUM</option>
                  <option>HIGH</option>
                </select>
                <button
                  className="icon-button"
                  onClick={addTask}
                >
                  <Plus />
                </button>
              </>
            ) : (
              <button
                className="console-button w-full justify-between"
                onClick={() => setAdding(true)}
              >
                Add a task...
                <Plus />
              </button>
            )}
          </div>

          {/* Tasks */}
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-black/30"
              >
                {/* Radio */}
                <button
                  className="task-radio mt-1"
                  onClick={() => toggleComplete(task.id)}
                />

                {/* Content */}
                <div className="flex-1">
                  {editingId === task.id ? (
                    <>
                      <input
                        className="console-input mb-1"
                        value={editingText}
                        onChange={(e) =>
                          setEditingText(e.target.value)
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && saveEdit(task.id)
                        }
                      />
                      <select
                        className="console-input w-24"
                        value={editingPriority}
                        onChange={(e) =>
                          setEditingPriority(e.target.value)
                        }
                      >
                        <option>LOW</option>
                        <option>MEDIUM</option>
                        <option>HIGH</option>
                      </select>
                    </>
                  ) : (
                    <>
                      <div className="text-sm">
                        {task.title}
                      </div>
                      <div className="text-xs text-soft mt-1">
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
                    onClick={() => deleteTask(task.id)}
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
