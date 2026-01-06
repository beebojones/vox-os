import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Send,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Zap,
  Sun,
  Moon,
} from "lucide-react";

import CalendarPanel from "@/components/CalendarPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

axios.defaults.withCredentials = true;

const API = "https://voxconsole.com/api";
const safeArray = (v) => (Array.isArray(v) ? v : []);

const getTimeOfDay = () => {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
};

export default function VoxDashboard() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [memories, setMemories] = useState([]);
  const [events, setEvents] = useState([]);

  const [showBriefing, setShowBriefing] = useState(true);
  const [showCalendar, setShowCalendar] = useState(true);
  const [showTasks, setShowTasks] = useState(true);
  const [showMemories, setShowMemories] = useState(true);

  const [showCalendarConnect, setShowCalendarConnect] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      const [tasksRes, memoriesRes, eventsRes] = await Promise.allSettled([
        axios.get(`${API}/tasks`),
        axios.get(`${API}/memories`),
        axios.get(`${API}/calendar`),
      ]);

      setTasks(tasksRes.status === "fulfilled" ? safeArray(tasksRes.value.data) : []);
      setMemories(memoriesRes.status === "fulfilled" ? safeArray(memoriesRes.value.data) : []);
      setEvents(eventsRes.status === "fulfilled" ? safeArray(eventsRes.value.data) : []);

      const chatRes = await axios.get(`${API}/chat/history/default`);
      setMessages(safeArray(chatRes.data));
    } catch {
      setMessages([]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${API}/chat/send`, {
        session_id: "default",
        content: userMessage.content,
      });
      setMessages((prev) => [...prev, res.data]);
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    setMessages([]);
    await axios.delete(`${API}/chat/history/default`);
  };

  const pendingTasks = safeArray(tasks).filter(
    (t) => t.status !== "completed"
  ).length;

  return (
    <div className="console-wrapper">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="title-gradient text-4xl font-bold tracking-[0.18em] uppercase">
            VOX OS
          </h1>
          <p className="text-soft text-sm uppercase">
            Personal Assistant • Good {getTimeOfDay()}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-3 space-y-6">
            <Collapsible open={showBriefing} onOpenChange={setShowBriefing}>
              <div className="console-card p-4">
                <CollapsibleTrigger className="flex justify-between w-full">
                  <span className="uppercase text-sm">Daily Briefing</span>
                  {showBriefing ? <ChevronUp /> : <ChevronDown />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex gap-2 mt-3">
                    <button className="console-button flex-1 text-xs">
                      <Sun className="w-3 h-3" /> Morning
                    </button>
                    <button className="console-button flex-1 text-xs">
                      <Moon className="w-3 h-3" /> Evening
                    </button>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            <Collapsible open={showCalendar} onOpenChange={setShowCalendar}>
              <div className="console-card p-4">
                <CollapsibleTrigger className="flex justify-between w-full mb-4">
                  <span className="uppercase text-sm">Calendar</span>
                  {showCalendar ? <ChevronUp /> : <ChevronDown />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="calendar-content">
                    <div className="calendar-inner">
                      <CalendarPanel
                        events={events}
                        isConnected={false}
                        onRequestConnect={() =>
                          setShowCalendarConnect(true)
                        }
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>

          {/* CENTER */}
          <div className="lg:col-span-6">
            <div className="console-card h-[calc(100vh-200px)] flex flex-col">
              <ScrollArea className="flex-1 p-4">
                {messages.map((m) => (
                  <div key={m.id} className={`chat-message ${m.role}`}>
                    {m.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="chat-message assistant">...</div>
                )}
                <div ref={messagesEndRef} />
              </ScrollArea>

              <form onSubmit={sendMessage} className="p-4">
                <div className="flex gap-2">
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="console-input flex-1"
                    placeholder="Ask Vox anything..."
                  />
                  <button type="submit" className="console-button">
                    <Send />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-3 space-y-6">
            <Collapsible open={showTasks} onOpenChange={setShowTasks}>
              <div className="console-card p-4">
                <CollapsibleTrigger className="flex justify-between">
                  <span className="uppercase text-sm">Tasks</span>
                  <span className="console-badge">{pendingTasks}</span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {tasks.map((t) => (
                    <div key={t.id} className="text-xs p-2">
                      {t.title}
                    </div>
                  ))}
                </CollapsibleContent>
              </div>
            </Collapsible>

            <Collapsible open={showMemories} onOpenChange={setShowMemories}>
              <div className="console-card p-4">
                <CollapsibleTrigger className="flex justify-between">
                  <span className="uppercase text-sm">Memory</span>
                  <span className="console-badge orange">
                    {memories.length}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {memories.map((m) => (
                    <div key={m.id} className="text-xs p-2">
                      {m.content}
                    </div>
                  ))}
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>
        </div>
      </div>

      {showCalendarConnect && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="console-card p-6 w-80 space-y-4">
            <h3 className="uppercase text-sm tracking-wider">
              Connect Calendar
            </h3>

            <button
              className="console-button w-full"
              onClick={() => {
                setShowCalendarConnect(false);
                toast("Google Calendar selected");
              }}
            >
              Google Calendar
            </button>

            <button
              className="console-button w-full"
              onClick={() => {
                setShowCalendarConnect(false);
                toast("Outlook selected");
              }}
            >
              Outlook
            </button>

            <button
              className="text-xs text-soft/60"
              onClick={() => setShowCalendarConnect(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
