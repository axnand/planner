import { activities } from "@/data/activities";

export const generateRandomPlan = (options) => {
  const { theme, activeDays, preferences = {} } = options;
  const {
    preferIndoor,
    preferOutdoor,
    maxActivitiesPerDay = 3,
    avoidCategories = [],
  } = preferences;


  let filteredActivities = activities.filter(
    (activity) =>
      activity.themes.includes(theme) &&
      !avoidCategories.includes(activity.category)
  );

  if (preferIndoor !== undefined && preferOutdoor !== undefined) {
    if (preferIndoor && !preferOutdoor) {
      filteredActivities = filteredActivities.filter(
        (activity) => activity.isIndoor
      );
    } else if (preferOutdoor && !preferIndoor) {
      filteredActivities = filteredActivities.filter(
        (activity) => !activity.isIndoor
      );
    }
  }

  const timeSlots = ["morning", "afternoon", "evening"];
  const scheduleItems = [];

  activeDays.forEach((day) => {
 
    const activitiesCount = Math.floor(Math.random() * maxActivitiesPerDay) + 1;

    const shuffledSlots = [...timeSlots].sort(() => Math.random() - 0.5);
    const selectedSlots = shuffledSlots.slice(0, activitiesCount);

    selectedSlots.forEach((timeSlot) => {

      let suitableActivities = [...filteredActivities];

      if (timeSlot === "morning") {
        suitableActivities = suitableActivities.filter(
          (activity) =>
            activity.mood === "relaxed" ||
            activity.category === "wellness" ||
            activity.category === "food"
        );
      } else if (timeSlot === "afternoon") {
        suitableActivities = suitableActivities.filter(
          (activity) =>
            activity.mood === "energized" ||
            activity.category === "outdoor" ||
            activity.category === "social"
        );
      } else {
       
        suitableActivities = suitableActivities.filter(
          (activity) =>
            activity.mood === "relaxed" ||
            activity.category === "entertainment" ||
            activity.category === "food"
        );
      }

      
      if (suitableActivities.length === 0) {
        suitableActivities = filteredActivities;
      }

   
      const randomActivity =
        suitableActivities[
          Math.floor(Math.random() * suitableActivities.length)
        ];

      if (randomActivity) {
        const scheduleItem = {
          id: `auto-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          activity: randomActivity,
          day,
          timeSlot,
          startTime: getRandomTimeForSlot(timeSlot),
          mood: randomActivity.mood,
          notes: generateRandomNote(randomActivity, theme),
        };

        scheduleItems.push(scheduleItem);

        
        filteredActivities = filteredActivities.filter(
          (a) => a.id !== randomActivity.id
        );
      }
    });
  });

  return scheduleItems;
};

const getRandomTimeForSlot = (timeSlot) => {
  const timeRanges = {
    morning: { start: 8, end: 11 },
    afternoon: { start: 13, end: 17 },
    evening: { start: 18, end: 21 },
  };

  const range = timeRanges[timeSlot];
  const hour =
    Math.floor(Math.random() * (range.end - range.start + 1)) + range.start;
  const minute = Math.random() < 0.5 ? 0 : 30;

  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
};

const generateRandomNote = (activity, theme) => {
  const themeNotes = {
    lazy: [
      "Perfect for a relaxing day",
      "Take your time and enjoy",
      "No rush, just pure comfort",
      "Cozy vibes all the way",
    ],
    adventurous: [
      "Ready for an adventure!",
      "Let's explore something new",
      "Adventure awaits!",
      "Time to push boundaries",
    ],
    family: [
      "Great bonding time",
      "Fun for everyone",
      "Making memories together",
      "Quality family time",
    ],
  };

  const categoryNotes = {
    food: ["Don't forget to check reviews", "Make a reservation if needed"],
    outdoor: ["Check the weather first", "Bring sunscreen"],
    wellness: ["Focus on relaxation", "Stay hydrated"],
    social: ["Invite friends to join", "Great conversation starter"],
    entertainment: ["Check showtimes", "Arrive a bit early"],
    creative: ["Bring your own supplies", "Let creativity flow"],
    fitness: ["Warm up properly", "Bring a water bottle"],
    indoor: ["Perfect for any weather", "Comfortable environment"],
  };

  const notes = [
    ...(themeNotes[theme] || []),
    ...(categoryNotes[activity.category] || []),
  ];

  return notes[Math.floor(Math.random() * notes.length)] || "";
};

export const generateThemeBasedSuggestions = (theme) => {
  return activities
    .filter((activity) => activity.themes.includes(theme))
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);
};
