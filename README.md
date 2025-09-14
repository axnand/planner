# Weekendly <img src="./public/logo.png" alt="Weekendly Logo" width="32" style="vertical-align: middle;" />


**Weekendly** is an interactive, intelligent, and visually engaging web application that helps users plan their weekends — or even long weekends — in an easy, fun, and personalized way. Built using **Next.js**, **shadcn/ui**, and integrated with multiple external APIs, Weekendly offers a seamless experience with smart recommendations, offline access, and export options.

---

## 🚀 Live Demo  
Check out the working application here:  
**[Deployment Link](https://weekend-planner-nine.vercel.app/)**

---

## 🎥 Video Walkthrough  
Watch a detailed explanation of the app, its features, and engineering decisions:  
**[Video Explanation Link](https://your-video-link.com/)**

---

## 📋 Features

### ✅ Core Features
- ✅ Browse from a curated list of activities (brunch, hiking, movie night, reading, etc.)
- ✅ Find nearby restaurants and events using **Google Places API**
- ✅ Get weather-based suggestions using **OpenWeather API**
- ✅ Plan weekends based on how many days you want (weekend, long weekend, or full week)
- ✅ Smart notifications about upcoming public holidays and long weekends
- ✅ Drag-and-drop interface to easily arrange activities in the schedule
- ✅ Edit or remove activities with intuitive controls
- ✅ Smart timeline suggestions with conflict detection (e.g. overlapping activities or invalid schedules)
- ✅ Automated curated planner based on activity selection and timeline
- ✅ Save plans and access them later from localStorage or IndexedDB
- ✅ View saved plans as timelines, charts, and graphs with insights
- ✅ Export plans as SVG images, posters, or PDFs

### ✅ Bonus Features
- ✅ Personalized themes (lazy, adventurous, family) with unique colors and activity suggestions
- ✅ Mood tracking with vibes assigned to activities (happy, relaxed, energetic)
- ✅ Share/export plans with friends and family
- ✅ Visual richness with icons, images, and color-coded categories

### ✅ Super Stretch Features
- ✅ Offline-friendly Progressive Web App (PWA) — accessible even without internet
- ✅ Efficient performance for handling 50+ activities
- ✅ Unit/component testing included for base functionality
- ✅ Clean component architecture and reusable UI with **shadcn/ui**
- ✅ Semantic HTML with accessibility features (ARIA attributes, keyboard navigation)
- ✅ Best practices followed in Next.js folder structure and state management

---

## 🛠 Tech Stack

- **Framework:** Next.js
- **UI Library:** shadcn/ui
- **APIs Used:**  
  - OpenWeather API – for weather-based activity suggestions  
  - Google Places API – for nearby restaurants and events  
  - Public Holiday API – for holiday and long weekend suggestions
- **Storage:** localStorage, IndexedDB
- **Export Options:** SVG, poster, PDF
- **PWA Support:** Service workers, offline compatibility
- **State Management:** [Your method here — e.g. React Context, Zustand, etc.]
- **Testing:** Unit/component tests included
- **Deployment:** Vercel / Netlify

---

## 📂 Folder Structure (Next.js Best Practices)

```
/app
/components
/hooks
/services
/utils
/public
/styles
/tests
```

- Modular, reusable components
- Clean separation of concerns
- Scalable for future extensions

---

## ⚙ Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation
```bash
git clone https://github.com/your-username/weekendly.git
cd weekendly
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run start
```

---

## 📖 Documentation Notes

- All UI components are accessible, responsive, and optimized for performance
- State management ensures smooth updates and avoids unnecessary renders
- Offline fallback is implemented using service workers and IndexedDB
- Themes are customizable with clear visual distinctions
- Activity conflicts are validated to ensure realistic planning
- Automated planner generates smart suggestions based on selected activities

---

## ✅ Testing

Weekendly includes basic testing to ensure key components render as expected and workflows function correctly. Currently, the testing setup covers:

- Rendering of core UI components like the schedule header.
- Mocking navigation functionality using `next/navigation`.
- Verifying component behavior with provided props.


Run tests with:
```bash
npm test
```

---

