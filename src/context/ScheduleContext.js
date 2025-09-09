"use client";

import React, { createContext, useContext, useReducer } from "react";

const ScheduleContext = createContext();

const initialState = {
  activities: [],
  theme: "light",
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_ACTIVITY":
      return { ...state, activities: [...state.activities, action.payload] };
    case "REMOVE_ACTIVITY":
      return { ...state, activities: state.activities.filter(a => a.id !== action.payload) };
    case "UPDATE_ACTIVITY":
      return {
        ...state,
        activities: state.activities.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload.data } : a
        ),
      };
    case "TOGGLE_THEME":
      return { ...state, theme: state.theme === "light" ? "dark" : "light" };
    default:
      return state;
  }
}

export function ScheduleProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ScheduleContext.Provider value={{ state, dispatch }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error("useSchedule must be used within ScheduleProvider");
  }
  return context;
}

// Default export for easier importing
export default { ScheduleProvider, useSchedule };