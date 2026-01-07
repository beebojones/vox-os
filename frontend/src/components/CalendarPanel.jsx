import { useState } from "react";
import { Calendar, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CalendarPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProviders, setShowProviders] = useState(false);

  return (
    <div className="console-card p-6">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-wide">
            CALENDAR
          </h2>
        </div>

        <span
          className={cn(
            "transition-transform",
            isExpanded && "rotate-180"
          )}
        >
          ⌃
        </span>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="mt-8 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-4">
            <Calendar className="h-10 w-10 text-white/90" />
          </div>

          {/* Description */}
          <p className="text-white/80 max-w-md mb-6">
            Connect a calendar to see upcoming events and daily plans.
          </p>

          {/* Connect Button */}
          <button
            onClick={() => setShowProviders(true)}
            className="mb-6 w-full max-w-md rounded-full border border-white/20
                       bg-black/40 px-6 py-3 text-base font-medium
                       flex items-center justify-center gap-2
                       shadow-[0_0_25px_rgba(168,85,247,0.25)]
                       hover:shadow-[0_0_35px_rgba(168,85,247,0.45)]
                       transition"
          >
            <Link2 className="h-5 w-5" />
            Connect Calendar
          </button>

          {/* Providers */}
          {showProviders && (
            <div className="w-full max-w-md space-y-4">
              {/* Google */}
              <button
                type="button"
                className="w-full rounded-full bg-black/40 border border-white/10
                           px-6 py-3 flex items-center gap-3
                           hover:border-white/25 transition"
              >
                <img
                  src="/icons/google-calendar.svg"
                  alt="Google Calendar"
                  className="h-6 w-6"
                />
                <span className="text-base">Google Calendar</span>
              </button>

              {/* Outlook */}
              <button
                type="button"
                className="w-full rounded-full bg-black/40 border border-white/10
                           px-6 py-3 flex items-center gap-3
                           hover:border-white/25 transition"
              >
                <img
                  src="/icons/outlook-calendar.png"
                  alt="Outlook Calendar"
                  className="h-6 w-6"
                />
                <span className="text-base">Outlook Calendar</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
