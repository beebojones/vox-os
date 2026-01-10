import { useState } from "react";
import {
  CheckSquare,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";

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
  }

  function confirmAdd() {
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

    setIsAdding(false);
    setNewText("");
    setNewPriority("LOW");
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
    <div className="console-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="text-purple-400" />
          <span className="uppercase tracking-wider text-sm">Tasks</span>
          <span className="console-badge">{tasks.length}</span>
        </div>
      </div>

      {/* Add Row */}
      {!isAdding ? (
        <div className="flex items-center justify-between">
          <div className="text-soft text-sm">Add a task…</div>
          <button
            onClick={startAdd}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40"
          >
            <Plus />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            className="console-input w-full"
            placeholder="Task description"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            autoFocus
          />

          <div className="flex items-center justify-between">
            <select
              className="console-input w-28"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={confirmAdd}
                className="w-9 h-9 rounded-full border border-green-400 flex items-center justify-center"
              >
                <Check />
              </button>
              <button
                onClick={cancelAdd}
                className="w-9 h-9 rounded-full border border-red-400 flex items-center justify-center"
              >
                <X />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="mt-4 space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start justify-between p-3 rounded-lg bg-black/40"
          >
            <div className="flex gap-3">
              <div className="w-4 h-4 rounded-full border border-white/40 mt-1" />

              <div>
                {editingId === task.id ? (
                  <>
                    <input
                      className="console-input mb-2"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <select
                      className="console-input w-28"
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
                ) : (
                  <>
                    <div className="text-sm">{task.text}</div>
                    <div className="text-xs text-soft mt-1">
                      {task.priority}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  editingId === task.id
                    ? saveEdit(task.id)
                    : startEdit(task)
                }
                className="icon-button subtle"
              >
                <Pencil />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="icon-button subtle"
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
