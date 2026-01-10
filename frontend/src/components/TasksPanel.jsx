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

export default function TasksPanel({ tasks, setTasks }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newPriority, setNewPriority] = useState("LOW");

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingPriority, setEditingPriority] = useState("LOW");

  /* ================= ACTIONS ================= */

  function start() {
    setIsing(true);
    setNewText("");
    setNewPriority("LOW");
  }

  function cancel() {
    setIsing(false);
    setNewText("");
  }

  function confirmAdd() {
    if (!newText.trim()) return;

    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: newText.trim(),
        priority: newPriority,
        status: "pending",
      },
    ]);

    cancelAdd();
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
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

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

        <button
          onClick={startAdd}
          className="w-9 h-9 rounded-full border border-cyan-400/40
                     flex items-center justify-center
                     bg-black/30
                     hover:shadow-[0_0_14px_rgba(34,211,238,0.55)]
                     transition"
          aria-label="Add task"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* ADD MODE */}
        {isAdding && (
    <div
      className="mb-4 p-3 rounded-xl
                 bg-black/45
                 ring-1 ring-white/10
                 shadow-inner"
    >
      <input
        className="console-input w-full mb-3
                   bg-black/55
                   text-sm
                   placeholder:text-white/30
                   focus:ring-cyan-400/50"
        placeholder="Task description"
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        autoFocus
      />
  
      {/* CONTROLS ROW */}
      <div className="flex items-center gap-3">
        {/* priority pill (not a select) */}
        <button
          type="button"
          onClick={() =>
            setNewPriority(
              newPriority === "LOW"
                ? "MEDIUM"
                : newPriority === "MEDIUM"
                ? "HIGH"
                : "LOW"
            )
          }
          className="px-3 py-1 rounded-full
                     text-[10px] tracking-wide
                     uppercase
                     bg-white/5
                     ring-1 ring-white/15
                     hover:bg-white/10
                     transition"
        >
          {newPriority}
        </button>
  
        <div className="flex-1" />
  
        {/* confirm */}
        <button
          onClick={confirmAdd}
          className="w-9 h-9 rounded-full
                     bg-gradient-to-br from-green-400/30 to-green-600/30
                     ring-1 ring-green-400/40
                     shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]
                     hover:shadow-[0_0_12px_rgba(34,197,94,0.6)]
                     transition"
          aria-label="Confirm"
        >
          <Check className="w-4 h-4 text-green-300" />
        </button>
  
        {/* cancel */}
        <button
          onClick={cancelAdd}
          className="w-9 h-9 rounded-full
                     bg-gradient-to-br from-red-400/30 to-red-600/30
                     ring-1 ring-red-400/40
                     shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]
                     hover:shadow-[0_0_12px_rgba(239,68,68,0.6)]
                     transition"
          aria-label="Cancel"
        >
          <X className="w-4 h-4 text-red-300" />
        </button>
      </div>
    </div>
  )}


      {/* TASK LIST */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 px-2 py-2 rounded-lg
                       hover:bg-white/5 transition"
          >
            {/* RADIO */}
            <button
              onClick={() => toggleComplete(task.id)}
              className="w-4 h-4 mt-1 rounded-full
                         border border-white/40
                         hover:border-cyan-400"
              aria-label="Complete task"
            />

            {/* CONTENT */}
            <div className="flex-1 max-w-[75%]">
              {editingId === task.id ? (
                <>
                  <input
                    className="console-input w-full mb-1"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <select
                    className="px-3 py-1 rounded-full
                               bg-black/50 text-xs
                               ring-1 ring-white/15"
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
                  <div
                    className="inline-block mt-0.5
                               px-2 py-[2px]
                               rounded-full text-[10px]
                               tracking-wide
                               text-soft
                               bg-white/5"
                  >
                    {task.priority}
                  </div>
                </>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  editingId === task.id
                    ? saveEdit(task.id)
                    : startEdit(task)
                }
                className="w-8 h-8 rounded-full
                           bg-black/40
                           hover:bg-white/10
                           flex items-center justify-center"
                aria-label="Edit task"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="w-8 h-8 rounded-full
                           bg-black/40
                           hover:bg-red-500/20
                           flex items-center justify-center"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
