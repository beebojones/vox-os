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
  onRequestConnect,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState(VIEW_MODES.MONTH);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

    const weekEvents = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekEvents.push({
        date: day,
        events: getEventsForDate(day),
      });
    }
    return weekEvents;
  };

  const formatTime = (isoString) => {
    if (!isoString || !isoString.includes("T")) return "All day";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return isoString;
    }
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
    const dateStr = e.start?.split("T")[0] || e.date;
    return new Date(`${dateStr}T00:00:00`);
  });

  const renderEvent = (event, compact = false) => (
    <div
      key={event.id}
      className={`p-2 rounded-lg bg-black/40 border-l-2 border-neon-cyan/50 ${
        compact ? "text-[10px]" : "text-xs"
      } group`}
    >
      <div className="flex justify-between mb-1">
        <div className="flex items-center gap-1 text-soft">
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
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteEvent?.(event.id);
              }}
              className="p-1 text-soft hover:text-neon-orange"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <div className={`font-medium ${compact ? "truncate" : ""}`}>
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

  const renderMonthView = () => (
    <div className="space-y-4">
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

      <div className="border-t border-white/10 pt-3">
        <div className="flex justify-between mb-2 text-xs text-soft">
          {formatDate(selectedDate)}
          {isConnected && (
            <button
              onClick={() => onAddEvent?.(selectedDate)}
              className="console-button text-[10px]"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-32 overflow-y-auto">
          {getEventsForDate(selectedDate).length > 0 ? (
            getEventsForDate(selectedDate).map((event) =>
              renderEvent(event)
            )
          ) : (
            <p className="text-xs text-soft/60 text-center py-2">
              No events
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderWeekView = () => (
    <ScrollArea className="h-64">
      <div className="space-y-2">
        {getWeekEvents().map(({ date, events }) => (
          <div
            key={date.toISOString()}
            className="p-2 rounded-lg bg-black/20"
            onClick={() => handleDateSelect(date)}
          >
            <div className="flex justify-between text-xs mb-1">
              <span>{formatDate(date)}</span>
              {events.length > 0 && (
                <span className="text-soft">
                  {events.length} event{events.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="space-y-1">
              {events.slice(0, 2).map((event) =>
                renderEvent(event, true)
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  const renderDayView = () => (
    <ScrollArea className="h-64">
      <div className="space-y-2">
        {getEventsForDate(selectedDate).length > 0 ? (
          getEventsForDate(selectedDate).map((event) =>
            renderEvent(event)
          )
        ) : (
          <div className="text-center py-8">
            <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-soft/40" />
            <p className="text-xs text-soft/60">No events scheduled</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );

  return (
    <div className="calendar-root space-y-4">
      {!isConnected && (
        <button
          onClick={onRequestConnect}
          className="console-button w-full text-xs"
        >
          Connect Calendar
        </button>
      )}

      <div className="flex gap-1 p-1 bg-black/30 rounded-lg">
        <button
          onClick={() => setViewMode(VIEW_MODES.MONTH)}
          className={`flex-1 text-xs py-1 rounded ${
            viewMode === VIEW_MODES.MONTH
              ? "bg-neon-cyan/20 text-neon-cyan"
              : "text-soft"
          }`}
        >
          <Grid3X3 className="w-3 h-3 inline mr-1" />
          Month
        </button>

        <button
          onClick={() => setViewMode(VIEW_MODES.WEEK)}
          className={`flex-1 text-xs py-1 rounded ${
            viewMode === VIEW_MODES.WEEK
              ? "bg-neon-cyan/20 text-neon-cyan"
              : "text-soft"
          }`}
        >
          <List className="w-3 h-3 inline mr-1" />
          Week
        </button>

        <button
          onClick={() => setViewMode(VIEW_MODES.DAY)}
          className={`flex-1 text-xs py-1 rounded ${
            viewMode === VIEW_MODES.DAY
              ? "bg-neon-cyan/20 text-neon-cyan"
              : "text-soft"
          }`}
        >
          <CalendarIcon className="w-3 h-3 inline mr-1" />
          Day
        </button>
      </div>

      {viewMode === VIEW_MODES.MONTH && renderMonthView()}
      {viewMode === VIEW_MODES.WEEK && renderWeekView()}
      {viewMode === VIEW_MODES.DAY && renderDayView()}
    </div>
  );
}
