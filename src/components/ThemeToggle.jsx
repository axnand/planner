"use client";

import { useSchedule } from "../context/ScheduleContext";

export default function ThemeToggle() {
  const { state, dispatch } = useSchedule();

  return (
    <button
      onClick={() => dispatch({ type: "TOGGLE_THEME" })}
      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800"
    >
      {state.theme === "light" ? "🌞 Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
