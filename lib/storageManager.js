// lib/storageManager.js
import { MOCK_USERS, MOCK_TUTORING_SCHEDULES, MOCK_VIDEOS } from './mockData';

const KEY_STUDENTS = 'rapid_app_students_v3';
const KEY_VIDEOS = 'rapid_app_videos_v3';
const KEY_SCHEDULES = 'rapid_app_schedules_v3';
const KEY_DEMO_SESSION = 'rapid_app_demo_session_v1';

// 1. Get & Save Students
export const getStoredStudents = () => {
  if (typeof window === 'undefined') return Object.values(MOCK_USERS);
  try {
    const raw = localStorage.getItem(KEY_STUDENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  const defaults = Object.values(MOCK_USERS);
  saveStoredStudents(defaults);
  return defaults;
};

export const saveStoredStudents = (students) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_STUDENTS, JSON.stringify(students));
  } catch (e) {}
};

// 2. Get & Save Videos
export const getStoredVideos = () => {
  if (typeof window === 'undefined') return MOCK_VIDEOS;
  try {
    const raw = localStorage.getItem(KEY_VIDEOS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  saveStoredVideos(MOCK_VIDEOS);
  return MOCK_VIDEOS;
};

export const saveStoredVideos = (videos) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_VIDEOS, JSON.stringify(videos));
  } catch (e) {}
};

// 3. Get & Save Schedules
export const getStoredSchedules = () => {
  if (typeof window === 'undefined') return MOCK_TUTORING_SCHEDULES;
  try {
    const raw = localStorage.getItem(KEY_SCHEDULES);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  saveStoredSchedules(MOCK_TUTORING_SCHEDULES);
  return MOCK_TUTORING_SCHEDULES;
};

export const saveStoredSchedules = (schedules) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_SCHEDULES, JSON.stringify(schedules));
  } catch (e) {}
};

// Demo mode has no server-side auth. Persist only the selected account ID, never
// a password, so a page reload can restore the same local demo session.
export const getDemoSessionUserId = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEY_DEMO_SESSION);
};

export const saveDemoSessionUserId = (userId) => {
  if (typeof window === 'undefined') return;
  if (userId) localStorage.setItem(KEY_DEMO_SESSION, userId);
  else localStorage.removeItem(KEY_DEMO_SESSION);
};
