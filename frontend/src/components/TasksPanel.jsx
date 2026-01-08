// frontend/src/components/TasksPanel.jsx
import { useMemo, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

import {
  CheckSquare,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

axios.defaults.withCredentials = true;

const API = "https://voxconsole.com/api";
const safeArray = (v) => (Array.isArray(v) ? v : []);

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function TasksPanel({
  tasks,
  setTasks,
  open,
  onOpenChange,
}) {
  const list = safeArray(tasks);

  const pendingCount = useMemo(
    () => list.filter((t) => t.status !== "completed").length,
    [list]
  );

  const [newText, setNewText] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingPriority, setEditingPriority] = useState("MEDIUM");

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.title ?? task.text ?? "");
    setEditingPriority(
      (task.priority ?? "MEDIUM").toString().toUpperCase()
    );
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    setEditingPriority("MEDIUM");
  };

  const addTask = async () => {
    const title = newText.trim();
    if (!title) return;

    // optimistic UI
    const temp = {
      id: `tmp-${crypto.randomUUID()}`,
      title,
      priority: "MEDIUM",
      status: "pending",
    };
    setTasks((prev) => [...safeArray(prev), temp]);
    setNewText("");

    try {
      const res = await axios.post(`${API}/tasks`, {
        title,
        priority: "MEDIUM",
      });

      // replace temp with real
      setTasks((prev) =>
        safeArray(prev).map((t) =>
          t.id === temp.id ? res.data : t
        )
      );
    } catch (e) {
      // rollback
      setTasks((prev) => safeArray(prev).filter((t) => t.id !== temp.id));
      toast.error("Failed to add task");
    }
  };

  const deleteTask = async (id) => {
    // optimistic
    const before = list;
    setTasks((prev) => safeArray(prev).filter((t) => t.id !== id));

    try {
      await axios.delete(`${API}/tasks/${id}`);
    } catch (e) {
      setTasks(before);
      toast.error("Failed to delete task");
    }
  };

  // Your UI behavior: clicking the radio completes and removes
  const completeTask = async (task) => {
    const id = task.id;
    const before = list;
    setTasks((prev) => safeArray(prev).filter((t) => t.id !== id));

    try {
      // if your backend supports a status update, keep it. otherwise delete.
      // prefer "complete" endpoint if you have one.
      await axios.patch(`${API}/tasks/${id}`, { status: "completed" });
    } catch {
      try {
        await axios.delete(`${API}/tasks/${id}`);
      } catch {
        setTasks(before);
        toast.error("Failed to complete task");
      }
    }
  };

  const saveEdit = async (id) => {
    const title = editingText.trim();
    const priority = (editingPriority || "MEDIUM")
      .toString()
      .toUpperCase();

    if (!title) return;

    // optimistic
    const before = list;
    setTasks((prev) =>
      safeArray(prev).map((t) =>
        t.id === id ? { ...t, title, priority } : t
      )
    );

    try {
      await axios.patch(`${API}/tasks/${id}`, { title, priority });
      cancelEdit();
    } catch (e) {
      setTasks(before);
      toast.error("Failed to update task");
    }
  };

  const isOpen = typeof open === "boolean" ? open : true;

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <div className="console-card p-4">
        {/* Header */}
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-5 h-5 text-purple-400" />
            <span className="uppercase text-sm tracking-wider">
              Tasks
            </span>

            <span className="console-badge">{pendingCount}</span>
          </div>

          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-white/70" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/70" />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent>
          {/* Add row */}
          <div className="mt-4 flex items-center gap-3">
            <input
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Add a task..."
              className="flex-1 rounded-full px-4 py-3 bg-black/20 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-cyan-300/40"
            />

            <button
              type="button"
              onClick={addTask}
              className="h-12 w-12 rounded-full flex items-center justify-center border border-cyan-300/30 bg-black/25 shadow-[0_0_0_1px_rgba(34,211,238,0.15),0_0_24px_rgba(168,85,247,0.15)] hover:border-cyan-300/50"
              aria-label="Add task"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Task list */}
          <div className="mt-4 space-y-3">
            {list.map((task) => {
              const title = task.title ?? task.text ?? "";
              const priority = (task.priority ?? "MEDIUM")
                .toString()
                .toUpperCase();

              const editing = editingId === task.id;

              return (
                <div
                  key={task.id}
                  className="rounded-2xl bg-black/20 border border-white/10 px-4 py-4"
                >
                  <div className="flex items-start gap-3">
                    {/* radio */}
                    <button
                      type="button"
                      onClick={() => completeTask(task)}
                      className="mt-1 h-5 w-5 rounded-full border border-white/40 hover:border-cyan-300/60"
                      aria-label="Complete task"
                    />

                    {/* content */}
                    <div className="flex-1 min-w-0">
                      {editing ? (
                        <div className="space-y-2">
                          <input
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && saveEdit(task.id)
                            }
                            className="w-full rounded-xl px-3 py-2 bg-black/25 border border-white/10 text-white outline-none focus:border-cyan-300/40"
                            autoFocus
                          />

                          <div className="flex items-center gap-2">
                            <select
                              value={editingPriority}
                              onChange={(e) => setEditingPriority(e.target.value)}
                              className="rounded-xl px-3 py-2 bg-black/25 border border-white/10 text-white outline-none focus:border-cyan-300/40"
                            >
                              {PRIORITIES.map((p) => (
                                <option key={p} value={p}>
                                  {p}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              onClick={() => saveEdit(task.id)}
                              className="console-button text-xs"
                            >
                              Save
                            </button>

                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="console-button text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-base font-medium text-white truncate">
                            {title}
                          </div>

                          {/* priority line BELOW title */}
                          <div className="mt-1 text-xs tracking-wider text-cyan-200/80 uppercase">
                            {priority}
                          </div>
                        </>
                      )}
                    </div>

                    {/* actions */}
                    {!editing && (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => startEdit(task)}
                          className="p-1 text-white/80 hover:text-white"
                          aria-label="Edit task"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="p-1 text-white/80 hover:text-white"
                          aria-label="Delete task"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
