import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Grid3X3,
  List,
  Clock,
  MapPin,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Link as LinkIcon,
} from "lucide-react";

const VIEW_MODES = {
  MONTH: "month",
  WEEK: "week",
  DAY: "day",
};

export default function CalendarPanel({
  events = [],
  onDateSelect,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  isConnected = false,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState(VIEW_MODES.MONTH);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showConnectOptions, setShowConnectOptions] = useState(false);

  /* ================= HELPERS ================= */

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return events.filter((event) => {
      const eventDate = event.start?.split("T")[0] || event.date;
      return eventDate === dateStr;
    });
  };

  const getWeekEvents = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return { date: day, events: getEventsForDate(day) };
    });
  };

  const formatTime = (iso) => {
    if (!iso || !iso.includes("T")) return "All day";
    const d = new Date(iso);
    return d.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) =>
    date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const handleDateSelect = (date) => {
    if (!date) return;
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const datesWithEvents = events.map((e) => {
    const d = e.start?.split("T")[0] || e.date;
    return new Date(`${d}T00:00:00`);
  });

  /* ================= RENDER HELPERS ================= */

  const renderEvent = (event, compact = false) => (
    <div
      key={event.id}
      className={`p-2 rounded-lg bg-black/40 border-l-2 border-neon-cyan/50 ${
        compact ? "text-[10px]" : "text-xs"
      }`}
    >
      <div className="flex items-center justify-between mb-1 text-soft">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {event.is_all_day ? "All day" : formatTime(event.start)}
        </div>
        {isConnected && !compact && (
          <div className="flex gap-1">
            <button onClick={() => onEditEvent?.(event)}>
              <Edit2 className="w-3 h-3" />
            </button>
            <button onClick={() => onDeleteEvent?.(event.id)}>
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <div className="font-medium text-white/90 truncate">
        {event.title}
      </div>

      {!compact && event.location && (
        <div className="flex items-center gap-1 text-soft mt-1">
          <MapPin className="w-3 h-3" />
          {event.location}
        </div>
      )}

      {!compact && event.html_link && (
        <a
          href={event.html_link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-neon-cyan mt-1"
        >
          <ExternalLink className="w-3 h-3" />
          Open
        </a>
      )}
    </div>
  );

  /* ================= VIEWS ================= */

  const renderMonthView = () => (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        modifiers={{ hasEvents: datesWithEvents }}
        modifiersStyles={{
          hasEvents: {
            fontWeight: "bold",
            textDecoration: "underline",
            textDecorationColor: "#00f6ff",
          },
        }}
      />

      <div className="border-t border-white/10 pt-3">
        <div className="flex justify-between mb-2 text-xs text-soft">
          {formatDate(selectedDate)}
          {isConnected && (
            <button
              className="console-button text-[10px]"
              onClick={() => onAddEvent?.(selectedDate)}
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-32 overflow-y-auto">
          {getEventsForDate(selectedDate).length ? (
            getEventsForDate(selectedDate).map((e) => renderEvent(e))
          ) : (
            <p className="text-xs text-soft/60 text-center">
              No events
            </p>
          )}
        </div>
      </div>
    </div>
  );

  /* ================= RENDER ================= */

  return (
    <div className="space-y-4">
      {/* CONNECT */}
      {!isConnected && (
        <div className="space-y-3">
          <button
            className="console-button w-full flex items-center justify-center gap-2"
            onClick={() =>
              setShowConnectOptions((prev) => !prev)
            }
          >
            <LinkIcon className="w-4 h-4" />
            Connect Calendar
          </button>

          {showConnectOptions && (
            <div className="space-y-2">
              <button
                className="console-button w-full flex items-center gap-2"
                onClick={() =>
                  (window.location.href =
                    "https://voxconsole.com/api/auth/google")
                }
              >
                <img
                  src="/icons/google.svg"
                  alt=""
                  className="w-4 h-4"
                />
                Google Calendar
              </button>

              <button
                className="console-button w-full flex items-center gap-2"
                onClick={() =>
                  (window.location.href =
                    "https://voxconsole.com/api/auth/outlook")
                }
              >
                <img
                  src="/icons/outlook.svg"
                  alt=""
                  className="w-4 h-4"
                />
                Outlook Calendar
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE */}
      <div className="flex gap-1 p-1 bg-black/30 rounded-lg">
        {Object.values(VIEW_MODES).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 py-1.5 text-xs rounded ${
              viewMode === mode
                ? "bg-neon-cyan/20 text-neon-cyan"
                : "text-soft"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {viewMode === VIEW_MODES.MONTH && renderMonthView()}
      {viewMode === VIEW_MODES.WEEK && (
        <ScrollArea className="h-64">
          {getWeekEvents().map(({ date, events }) => (
            <div key={date.toISOString()} className="mb-2">
              <div className="text-xs text-soft mb-1">
                {formatDate(date)}
              </div>
              {events.map((e) => renderEvent(e, true))}
            </div>
          ))}
        </ScrollArea>
      )}
      {viewMode === VIEW_MODES.DAY && (
        <ScrollArea className="h-64">
          {getEventsForDate(selectedDate).map((e) =>
            renderEvent(e)
          )}
        </ScrollArea>
      )}
    </div>
  );
}
