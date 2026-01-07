import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, Link, Plus } from "lucide-react";

const VIEW_MODES = {
  MONTH: "month",
  WEEK: "week",
  DAY: "day",
};

export default function CalendarPanel({
  events = [],
  isConnected = false,
  onDateSelect,
  onAddEvent,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState(VIEW_MODES.MONTH);
  const [showConnectOptions, setShowConnectOptions] = useState(false);

  /* =======================
     NOT CONNECTED
  ======================= */

  if (!isConnected) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-start gap-2 text-sm text-soft">
            <Info className="w-4 h-4 text-orange-400 mt-0.5" />
            <span>
              Connect your calendars for time-aware briefings and task coordination.
            </span>
          </div>

          <button
            className="console-button w-full flex items-center justify-center gap-2"
            onClick={() => setShowConnectOptions((v) => !v)}
          >
            <Link className="w-4 h-4" />
            Connect Calendar
          </button>

          {showConnectOptions && (
            <div className="space-y-2">
              <button
                className="console-button w-full flex items-center gap-3"
                onClick={() =>
                  (window.location.href =
                    "https://voxconsole.com/api/auth/google")
                }
              >
                <img src="/icons/google.svg" className="w-4 h-4" />
                Google Calendar
              </button>

              <button
                className="console-button w-full flex items-center gap-3"
                onClick={() =>
                  (window.location.href =
                    "https://voxconsole.com/api/auth/outlook")
                }
              >
                <img src="/icons/outlook.svg" className="w-4 h-4" />
                Outlook Calendar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* =======================
     CONNECTED
  ======================= */

  const handleSelect = (date) => {
    if (!date) return;
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-md space-y-4">
        {/* View toggle */}
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

        {viewMode === VIEW_MODES.MONTH && (
          <>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
            />

            <div className="flex justify-between text-xs text-soft">
              <span>
                {selectedDate.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>

              <button
                className="console-button text-[10px]"
                onClick={() => onAddEvent?.(selectedDate)}
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>

            <ScrollArea className="max-h-32">
              {events.length === 0 && (
                <p className="text-xs text-soft/60 text-center">
                  No events
                </p>
              )}
            </ScrollArea>
          </>
        )}

        {viewMode !== VIEW_MODES.MONTH && (
          <div className="text-xs text-soft/60 text-center py-6">
            {viewMode} view coming soon
          </div>
        )}
      </div>
    </div>
  );
}
