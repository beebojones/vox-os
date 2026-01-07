// CalendarPanel.jsx
import { useMemo, useState } from "react";
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
  Info,
} from "lucide-react";

const VIEW_MODES = {
  MONTH: "month",
  WEEK: "week",
  DAY: "day",
};

/**
 * IMPORTANT
 * VoxDashboard already provides the outer "Calendar" card + header.
 * This component must render ONLY the inner content.
 *
 * Icons
 * Put these in: frontend/public/icons/
 * - google-calendar.svg
 * - outlook-calendar.png
 *
 * OAuth
 * These buttons will redirect to your backend.
 * Update these paths if your FastAPI routes differ.
 */
const API_BASE = process.env.REACT_APP_API_BASE || "https://voxconsole.com/api";
const GOOGLE_OAUTH_URL = `${API_BASE}/auth/google`;
const OUTLOOK_OAUTH_URL = `${API_BASE}/auth/outlook`;

function ColoredIcon({ primarySrc, fallbackSrc, alt }) {
  const [src, setSrc] = useState(primarySrc);
  return (
    <img
      src={src}
      alt={alt}
      width={22}
      height={22}
      style={{ display: "block" }}
      onError={() => {
        if (fallbackSrc && src !== fallbackSrc) setSrc(fallbackSrc);
      }}
    />
  );
}

export default function CalendarPanel({
  events = [],
  onDateSelect,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  isConnected = false,
  onConnectGoogle,
  onConnectOutlook,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState(VIEW_MODES.MONTH);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [connectOpen, setConnectOpen] = useState(false);

  const safeEvents = Array.isArray(events) ? events : [];

  const handleDateSelect = (date) => {
    if (!date) return;
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const formatTime = (isoString) => {
    if (!isoString || !String(isoString).includes("T")) return "All day";
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return String(isoString);
    }
  };

  const formatDate = (date) =>
    date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return safeEvents.filter((event) => {
      const eventDate = event.start?.split("T")[0] || event.date;
      return eventDate === dateStr;
    });
  };

  const getWeekEvents = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    const weekEvents = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekEvents.push({ date: day, events: getEventsForDate(day) });
    }
    return weekEvents;
  };

  const datesWithEvents = useMemo(() => {
    return safeEvents
      .map((e) => e.start?.split("T")[0] || e.date)
      .filter(Boolean)
      .map((dateStr) => new Date(`${dateStr}T00:00:00`));
  }, [safeEvents]);

  const renderEvent = (event, compact = false) => (
    <div
      key={event.id}
      className={`p-2 rounded-lg bg-black/40 border-l-2 border-neon-cyan/50 ${
        compact ? "text-[10px]" : "text-xs"
      } group relative`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-soft mb-1">
          <Clock className="w-3 h-3" />
          <span>{event.is_all_day ? "All day" : formatTime(event.start)}</span>
        </div>

        {isConnected && !compact && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditEvent?.(event);
              }}
              className="p-1 text-soft hover:text-neon-cyan"
              type="button"
              aria-label="Edit event"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteEvent?.(event.id);
              }}
              className="p-1 text-soft hover:text-neon-orange"
              type="button"
              aria-label="Delete event"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <div className={`font-medium text-white/90 ${compact ? "truncate" : ""}`}>
        {event.title}
      </div>

      {!compact && event.location && (
        <div className="flex items-center gap-1 text-soft mt-1">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{event.location}</span>
        </div>
      )}

      {!compact && event.html_link && (
        <a
          href={event.html_link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-neon-cyan/70 hover:text-neon-cyan mt-1"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3 h-3" />
          <span>Open</span>
        </a>
      )}
    </div>
  );

  const connectGoogle = () => {
    if (typeof onConnectGoogle === "function") return onConnectGoogle();
    window.location.href = GOOGLE_OAUTH_URL;
  };

  const connectOutlook = () => {
    if (typeof onConnectOutlook === "function") return onConnectOutlook();
    window.location.href = OUTLOOK_OAUTH_URL;
  };

  // =========================
  // NOT CONNECTED UI
  // =========================
  if (!isConnected) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center text-center gap-4 py-6 px-2">
          <CalendarIcon className="w-10 h-10 text-white/80" />
          <div className="text-soft text-sm max-w-xs">
            Connect your calendars for time-aware briefings and task coordination.
          </div>

          <button
            type="button"
            className="console-button w-full max-w-sm justify-center text-sm"
            onClick={() => setConnectOpen((v) => !v)}
          >
            <LinkIcon className="w-4 h-4" />
            Connect Calendar
          </button>

          {connectOpen && (
            <div className="w-full max-w-sm space-y-3">
              <button
                type="button"
                className="console-button w-full justify-start gap-3"
                onClick={connectGoogle}
              >
                <ColoredIcon
                  primarySrc="/icons/google-calendar.svg"
                  fallbackSrc="/google-calendar.svg"
                  alt="Google Calendar"
                />
                <span>Google Calendar</span>
              </button>

              <button
                type="button"
                className="console-button w-full justify-start gap-3"
                onClick={connectOutlook}
              >
                <ColoredIcon
                  primarySrc="/icons/outlook-calendar.png"
                  fallbackSrc="/outlook-calendar.png"
                  alt="Outlook Calendar"
                />
                <span>Outlook Calendar</span>
              </button>

              <button
                type="button"
                className="text-xs text-neon-cyan/80 hover:text-neon-cyan underline underline-offset-4 flex items-center gap-2 justify-center w-full"
                onClick={() => {
                  alert(
                    "Calendar lets Vox: (1) see upcoming events, (2) time your briefings, (3) help schedule tasks around real availability."
                  );
                }}
              >
                <Info className="w-3 h-3" />
                What does this allow?
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================
  // CONNECTED UI (CALENDAR)
  // =========================

  const renderMonthView = () => (
    <div className="space-y-4">
      {/* Center the calendar when the sidebar stretches wide */}
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md"
            modifiers={{ hasEvents: datesWithEvents }}
            modifiersStyles={{
              hasEvents: {
                fontWeight: "bold",
                textDecoration: "underline",
                textDecorationColor: "#00f6ff",
              },
            }}
          />
        </div>
      </div>

      <div className="border-t border-white/10 pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-soft">{formatDate(selectedDate)}</div>
          <button
            onClick={() => onAddEvent?.(selectedDate)}
            className="console-button text-[10px] px-2 py-1"
            type="button"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>

        <div className="space-y-2 max-h-32 overflow-y-auto">
          {getEventsForDate(selectedDate).length > 0 ? (
            getEventsForDate(selectedDate).map((event) => renderEvent(event))
          ) : (
            <p className="text-xs text-soft/60 text-center py-2">No events</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderWeekView = () => {
    const weekEvents = getWeekEvents();
    const today = new Date().toDateString();

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(selectedDate.getDate() - 7);
              setSelectedDate(d);
            }}
            className="p-1 hover:bg-white/10 rounded"
            type="button"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs text-soft">
            {formatDate(weekEvents[0].date)} - {formatDate(weekEvents[6].date)}
          </span>

          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(selectedDate.getDate() + 7);
              setSelectedDate(d);
            }}
            className="p-1 hover:bg-white/10 rounded"
            type="button"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <ScrollArea className="h-64">
          <div className="space-y-2">
            {weekEvents.map(({ date, events: dayEvents }) => (
              <div
                key={date.toISOString()}
                className={`p-2 rounded-lg cursor-pointer ${
                  date.toDateString() === today
                    ? "bg-neon-cyan/10 border border-neon-cyan/30"
                    : "bg-black/20"
                } ${
                  date.toDateString() === selectedDate.toDateString()
                    ? "ring-1 ring-neon-magenta/50"
                    : ""
                }`}
                onClick={() => handleDateSelect(date)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-medium ${
                      date.toDateString() === today ? "text-neon-cyan" : "text-white/80"
                    }`}
                  >
                    {date.toLocaleDateString([], { weekday: "short", day: "numeric" })}
                  </span>

                  {dayEvents.length > 0 && (
                    <span className="text-[10px] text-soft">
                      {dayEvents.length} event{dayEvents.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {dayEvents.length > 0 && (
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => renderEvent(event, true))}
                    {dayEvents.length > 2 && (
                      <p className="text-[10px] text-soft">+{dayEvents.length - 2} more</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(selectedDate);
    const today = new Date().toDateString();
    const isToday = selectedDate.toDateString() === today;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(selectedDate.getDate() - 1);
              setSelectedDate(d);
            }}
            className="p-1 hover:bg-white/10 rounded"
            type="button"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <div className={`text-sm font-medium ${isToday ? "text-neon-cyan" : ""}`}>
              {selectedDate.toLocaleDateString([], {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </div>
            {isToday && <span className="text-[10px] text-neon-cyan">Today</span>}
          </div>

          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(selectedDate.getDate() + 1);
              setSelectedDate(d);
            }}
            className="p-1 hover:bg-white/10 rounded"
            type="button"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <ScrollArea className="h-64">
          <div className="space-y-2">
            {dayEvents.length > 0 ? (
              dayEvents.map((event) => renderEvent(event))
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-soft/40" />
                <p className="text-xs text-soft/60">No events scheduled</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <button
          onClick={() => onAddEvent?.(selectedDate)}
          className="console-button w-full text-xs mt-3"
          type="button"
        >
          <Plus className="w-3 h-3" />
          Add Event
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-4" data-testid="calendar-full-panel">
      <div className="flex gap-1 p-1 bg-black/30 rounded-lg">
        <button
          onClick={() => setViewMode(VIEW_MODES.MONTH)}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded text-xs transition-all ${
            viewMode === VIEW_MODES.MONTH
              ? "bg-neon-cyan/20 text-neon-cyan"
              : "text-soft hover:text-white"
          }`}
          type="button"
        >
          <Grid3X3 className="w-3 h-3" />
          Month
        </button>

        <button
          onClick={() => setViewMode(VIEW_MODES.WEEK)}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded text-xs transition-all ${
            viewMode === VIEW_MODES.WEEK
              ? "bg-neon-cyan/20 text-neon-cyan"
              : "text-soft hover:text-white"
          }`}
          type="button"
        >
          <List className="w-3 h-3" />
          Week
        </button>

        <button
          onClick={() => setViewMode(VIEW_MODES.DAY)}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded text-xs transition-all ${
            viewMode === VIEW_MODES.DAY
              ? "bg-neon-cyan/20 text-neon-cyan"
              : "text-soft hover:text-white"
          }`}
          type="button"
        >
          <CalendarIcon className="w-3 h-3" />
          Day
        </button>
      </div>

      {viewMode === VIEW_MODES.MONTH && renderMonthView()}
      {viewMode === VIEW_MODES.WEEK && renderWeekView()}
      {viewMode === VIEW_MODES.DAY && renderDayView()}
    </div>
  );
}
