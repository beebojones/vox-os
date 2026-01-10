// TasksPanel.jsx
import { useState } from "react";
import {
  CheckSquare,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

export default function TasksPanel({ tasks = [], setTasks }) {
  /* ================= STATE ================= */

  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newPriority, setNewPriority] = useState("LOW");

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingPriority, setEditingPriority] = useState("LOW");

  /* ================= ACTIONS ================= */

  const startAdd = () => {
    setIsAdding(true);
    setNewText("");
    setNewPriority("LOW");
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setNewText("");
  };

  const confirmAdd = () => {
    if (!newText.trim()) return;

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newText.trim(),
        priority: newPriority,
        status: "pending",
      },
    ]);

    cancelAdd();
  };

  const toggleComplete = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.title);
    setEditingPriority(task.priority);
  };

  const saveEdit = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, title: editingText, priority: editingPriority }
          : t
      )
    );
    setEditingId(null);
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  /* ================= RENDER ================= */

  return (
    <div className="console-card p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-violet-400 fill-violet-400/20" />
          <span className="uppercase text-sm tracking-wider">Tasks</span>
          <span className="console-badge">{tasks.length}</span>
        </div>

        {!isAdding && (
          <button
            onClick={startAdd}
            className="w-9 h-9 rounded-full border border-cyan-400/40
                       flex items-center justify-center
                       hover:shadow-[0_0_12px_rgba(34,211,238,0.6)]
                       transition"
            aria-label="Add task"
          >
            <Plus />
          </button>
        )}
      </div>

      {/* ADD MODE */}
      {isAdding && (
        <div className="mb-4 space-y-3">
          <input
            className="console-input w-full bg-black/40
                       ring-1 ring-white/10 focus:ring-cyan-400/60"
            placeholder="Task description"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            autoFocus
          />

          <div className="flex items-center gap-2">
            <select
              className="console-input text-xs uppercase tracking-wider
                         bg-black/40 ring-1 ring-white/10 w-32"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
            >
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>HIGH</option>
            </select>

            <button
              onClick={confirmAdd}
              className="w-9 h-9 rounded-full border border-green-400
                         flex items-center justify-center text-green-400"
              aria-label="Confirm"
            >
              <Check />
            </button>

            <button
              onClick={cancelAdd}
              className="w-9 h-9 rounded-full border border-red-400
                         flex items-center justify-center text-red-400"
              aria-label="Cancel"
            >
              <X />
            </button>
          </div>
        </div>
      )}

      {/* TASK LIST */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-2 rounded-lg
                       hover:bg-white/5 transition"
          >
            {/* RADIO */}
            <button
              onClick={() => toggleComplete(task.id)}
              className="w-4 h-4 rounded-full border border-white/40 mt-1"
              aria-label="Complete task"
            />

            {/* CONTENT */}
            <div className="flex-1">
              {editingId === task.id ? (
                <>
                  <input
                    className="console-input w-full mb-1"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <select
                    className="console-input text-xs uppercase w-32"
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
                  <div className="text-sm leading-tight">
                    {task.title}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-soft mt-0.5">
                    {task.priority}
                  </div>
                </>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-1 mt-1">
              <button
                onClick={() =>
                  editingId === task.id
                    ? saveEdit(task.id)
                    : startEdit(task)
                }
                className="icon-button subtle"
                aria-label="Edit task"
              >
                <Pencil />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="icon-button subtle"
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
