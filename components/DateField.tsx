"use client";

import { useRef } from "react";

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function DateField({ label, value, onChange, className = "" }: DateFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openCalendar() {
    const input = inputRef.current;
    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.focus();
  }

  return (
    <label className={`grid gap-2 text-sm font-bold text-skardu-snow ${className}`}>
      {label}
      <span className="relative block">
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type="date"
          className="w-full rounded-xl border border-skardu-mist bg-skardu-void/70 px-4 py-3 pr-12 text-skardu-snow outline-none focus:border-skardu-gold focus:ring-2 focus:ring-skardu-gold/20"
        />
        <button
          type="button"
          onClick={openCalendar}
          className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-skardu-mist/70 text-skardu-gold"
          aria-label={`Open ${label.toLowerCase()} calendar`}
        >
          <CalendarIcon />
        </button>
      </span>
    </label>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
