import type { Grade, SubjectId } from "./curriculum";

export interface Video {
  yt: string;
  title: string;
  subject: SubjectId;
  grade: Grade;
  chapter: string;
  source: string;
  minutes: string;
}

export const VIDEOS: Video[] = [
  { yt: "WLZ88aAEBmc", title: "Chemical Reactions & Equations — Full Chapter in 30 Minutes", subject: "sci", grade: 10, chapter: "Chemical Reactions and Equations", source: "NCERT One-Shot", minutes: "30 min" },
  { yt: "to9s4R1pyiI", title: "Control & Coordination — Class 10 Science One Shot", subject: "sci", grade: 10, chapter: "Control and Coordination", source: "Chapter One-Shot", minutes: "45 min" },
  { yt: "PgGu1nP81PA", title: "Introduction to Trigonometry — Class 10 Maths, Part 1", subject: "math", grade: 10, chapter: "Introduction to Trigonometry", source: "Maths With Swapnil", minutes: "Lecture" },
  { yt: "VdyRV6nm4b4", title: "Current Electricity — Class 12 Physics One Shot (Boards + NEET)", subject: "phy", grade: 12, chapter: "Current Electricity", source: "Abhishek Sahu Sir", minutes: "Full chapter" },
  { yt: "YGWiJ3xcxCA", title: "Semiconductors — Class 12 Physics Chapter 14 One Shot", subject: "phy", grade: 12, chapter: "Semiconductor Electronics", source: "One-Shot Revision", minutes: "Deep dive" },
  { yt: "77NR5rNMpMk", title: "Semiconductors in One Shot — NCERT + CUET, Rakshak Sir", subject: "phy", grade: 12, chapter: "Semiconductor Electronics", source: "Rakshak Sir Science", minutes: "NCERT line-by-line" },
  { yt: "Y6IDXanyXQk", title: "Semiconductors One Shot in 30 Minutes — CBSE Class 12", subject: "phy", grade: 12, chapter: "Semiconductor Electronics", source: "Abhishek Sahu Sir", minutes: "30 min" },
  { yt: "6JTtNnU10MY", title: "Semiconductors — Chapter 14 'Gunshot' Revision, CBSE / JEE / NEET", subject: "phy", grade: 12, chapter: "Semiconductor Electronics", source: "Exam Revision", minutes: "Revision" },
  { yt: "Swg0bDvRvQo", title: "Current Electricity — Class 12 Chapter 3 Revision (CBSE 2026–27)", subject: "phy", grade: 12, chapter: "Current Electricity", source: "Board Revision", minutes: "Full revision" },
];

export function ytThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function ytEmbed(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&autoplay=1`;
}

export function ytWatch(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function ytSearchUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
