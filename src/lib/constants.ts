export const CATEGORIES = [
  "Photo Studio",
  "Sound Stage",
  "Dance",
  "Podcast Room",
  "Music Suite",
  "Art Workshop",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const AMENITIES = [
  "Natural light",
  "Wi-Fi",
  "Parking",
  "Lighting kit",
  "Makeup station",
  "Soundproofing",
  "Climate control",
  "Green room",
] as const;

export type Amenity = (typeof AMENITIES)[number];