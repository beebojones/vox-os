import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar as CalendarIcon,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
} from "lucide-react";

const VIEW_MODES = {
  MONTH: "month",
  WEEK: "week",
  DAY: "day",
};

export default function CalendarPanel({
  events = [],
  isConnected = false,
  onAddEvent,
}) {
  const [viewMode, setViewMode] = useState(VIEW_MODES.MONTH);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getEventsForDate = (date) => {
    const key = date.toISOString().split("T")[0];
    return events.filter((e) =>
      (e.start || e.date || "").startsWith(key)
    );
  };

  const formatDate = (date) =>
    date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  /* =========================
     DISCONNECTED STATE
     ========================= */

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-6">
        <CalendarIcon className="w-10 h-10 text-soft/40" />

        <p className="text-xs text-soft text-center max-w-[220px]">
          Connect a calendar to see upcoming events and daily plans.
        </p>

        <div className="w-full space-y-2">
          <button
            className="console-button w-full flex items-center gap-3 justify-start"
            onClick={() => console.log("Google Calendar connect")}
          >
            <img
              src="/icons/google-calendar.png"
              alt="Google Calendar"
              className="w-5 h-5"
            />
            <span>Google Calendar</span>
          </button>

          <button
            className="console-button w-full flex items-center gap-3 justify-start"
            onClick={() => console.log("Outlook Calendar connect")}
          >
            <img
              src="/icons/outlook-calendar.png"
              alt="Outlook Calendar"
              className="w-5 h-5"
            />
            <span>Outlook Calendar</span>
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     CONNECTED STATE
     ========================= */

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* View Switcher */}
      <div className="flex w-full gap-1 p-1 bg-black/30 rounded-lg">
        <button
          className={`flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded ${
            viewMode === VIEW_MODES.MONTH
              ? "bg-neon-cyan/20 text-neon-cyan"
              : "text-soft"
          }`}
          onClick={() => setViewMode(VIEW_MODES.MONTH)}
        >
          <Grid3X3 className="w-3 h-3" />
          Month
        </button>

        <button
          className={`flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded ${
            viewMode === VIEW_MODES.WEEK
              ? "bg-neon-cyan/20 text-neon-cyan"
              : "text-soft"
          }`}
          onClick={() => setViewMode(VIEW_MODES.WEEK)}
        >
          <List className="w-3 h-3" />
          Week
        </button>
      </div>

      {/* Month View */}
      {viewMode === VIEW_MODES.MONTH && (
        <div className="w-full flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md"
          />
        </div>
      )}

      {/* Events */}
      <div className="w-full border-t border-white/10 pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-soft">
            {formatDate(selectedDate)}
          </span>

          <button
            onClick={() => onAddEvent?.(selectedDate)}
            className="console-button text-[10px] px-2 py-1"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>

        <ScrollArea className="max-h-40">
          <div className="space-y-2">
            {getEventsForDate(selectedDate).length > 0 ? (
              getEventsForDate(selectedDate).map((event) => (
                <div
                  key={event.id}
                  className="p-2 text-xs rounded-lg bg-black/40 border-l-2 border-neon-cyan/50"
                >
                  <div className="flex items-center gap-1 text-soft mb-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {event.start
                        ? new Date(event.start).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "All day"}
                    </span>
                  </div>
                  <div className="font-medium text-white/90">
                    {event.title}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-soft/60 text-center py-4">
                No events scheduled
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
