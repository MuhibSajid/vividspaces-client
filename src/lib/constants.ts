export const CATEGORIES = [
  "Photo Studio",
  "Sound Stage",
  "Podcast Room",
  "Music Suite",
  "Art Workshop",
] as const;

export type Category = (typeof CATEGORIES)[number];