export const parseTime = (timeStr = "00:00") => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};


export const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const addMinutes = (timeStr, minutesToAdd) => {
  const totalMinutes = parseTime(timeStr) + minutesToAdd;
  return formatTime(totalMinutes);
};

export const getDefaultEndTime = (startTime, estimatedTime) => {
  return addMinutes(startTime, estimatedTime);
};

export const timeRangesOverlap = (
  start1, 
  end1, 
  start2, 
  end2
) => {
  const start1Minutes = parseTime(start1);
  const end1Minutes = parseTime(end1);
  const start2Minutes = parseTime(start2);
  const end2Minutes = parseTime(end2);
  
  return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
};

export const getTimeSlotBoundaries = (timeSlot) => {
  switch (timeSlot) {
    case "morning":
      return { start: "06:00", end: "12:00" };
    case "afternoon":
      return { start: "12:00", end: "18:00" };
    case "evening":
      return { start: "18:00", end: "24:00" };
    default:
      return { start: "00:00", end: "00:00" };
  }
};

export const isTimeInSlot = (time, timeSlot) => {
  const timeMinutes = parseTime(time);
  const { start, end } = getTimeSlotBoundaries(timeSlot);
  const startMinutes = parseTime(start);
  const endMinutes = parseTime(end);
  
  return timeMinutes >= startMinutes && timeMinutes < endMinutes;
};
