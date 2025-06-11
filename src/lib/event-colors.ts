// Bright, vibrant colors that will pop on the calendar
const BRIGHT_COLORS = [
  // Reds
  { bg: 'bg-red-500', text: 'text-white', bgLight: 'bg-red-100', textLight: 'text-red-800', bgDark: 'bg-red-900/20', textDark: 'text-red-400' },
  { bg: 'bg-pink-500', text: 'text-white', bgLight: 'bg-pink-100', textLight: 'text-pink-800', bgDark: 'bg-pink-900/20', textDark: 'text-pink-400' },
  { bg: 'bg-rose-500', text: 'text-white', bgLight: 'bg-rose-100', textLight: 'text-rose-800', bgDark: 'bg-rose-900/20', textDark: 'text-rose-400' },
  
  // Oranges
  { bg: 'bg-orange-500', text: 'text-white', bgLight: 'bg-orange-100', textLight: 'text-orange-800', bgDark: 'bg-orange-900/20', textDark: 'text-orange-400' },
  { bg: 'bg-amber-500', text: 'text-white', bgLight: 'bg-amber-100', textLight: 'text-amber-800', bgDark: 'bg-amber-900/20', textDark: 'text-amber-400' },
  
  // Yellows
  { bg: 'bg-yellow-500', text: 'text-black', bgLight: 'bg-yellow-100', textLight: 'text-yellow-800', bgDark: 'bg-yellow-900/20', textDark: 'text-yellow-400' },
  { bg: 'bg-lime-500', text: 'text-black', bgLight: 'bg-lime-100', textLight: 'text-lime-800', bgDark: 'bg-lime-900/20', textDark: 'text-lime-400' },
  
  // Greens
  { bg: 'bg-green-500', text: 'text-white', bgLight: 'bg-green-100', textLight: 'text-green-800', bgDark: 'bg-green-900/20', textDark: 'text-green-400' },
  { bg: 'bg-emerald-500', text: 'text-white', bgLight: 'bg-emerald-100', textLight: 'text-emerald-800', bgDark: 'bg-emerald-900/20', textDark: 'text-emerald-400' },
  { bg: 'bg-teal-500', text: 'text-white', bgLight: 'bg-teal-100', textLight: 'text-teal-800', bgDark: 'bg-teal-900/20', textDark: 'text-teal-400' },
  
  // Blues
  { bg: 'bg-cyan-500', text: 'text-white', bgLight: 'bg-cyan-100', textLight: 'text-cyan-800', bgDark: 'bg-cyan-900/20', textDark: 'text-cyan-400' },
  { bg: 'bg-sky-500', text: 'text-white', bgLight: 'bg-sky-100', textLight: 'text-sky-800', bgDark: 'bg-sky-900/20', textDark: 'text-sky-400' },
  { bg: 'bg-blue-500', text: 'text-white', bgLight: 'bg-blue-100', textLight: 'text-blue-800', bgDark: 'bg-blue-900/20', textDark: 'text-blue-400' },
  { bg: 'bg-indigo-500', text: 'text-white', bgLight: 'bg-indigo-100', textLight: 'text-indigo-800', bgDark: 'bg-indigo-900/20', textDark: 'text-indigo-400' },
  
  // Purples
  { bg: 'bg-violet-500', text: 'text-white', bgLight: 'bg-violet-100', textLight: 'text-violet-800', bgDark: 'bg-violet-900/20', textDark: 'text-violet-400' },
  { bg: 'bg-purple-500', text: 'text-white', bgLight: 'bg-purple-100', textLight: 'text-purple-800', bgDark: 'bg-purple-900/20', textDark: 'text-purple-400' },
  { bg: 'bg-fuchsia-500', text: 'text-white', bgLight: 'bg-fuchsia-100', textLight: 'text-fuchsia-800', bgDark: 'bg-fuchsia-900/20', textDark: 'text-fuchsia-400' },
];

export interface EventColor {
  bg: string;
  text: string;
  bgLight: string;
  textLight: string;
  bgDark: string;
  textDark: string;
}

// Cache to store event colors to ensure consistency
const eventColorCache = new Map<string, EventColor>();

/**
 * Get a consistent bright color for an event based on its ID
 * This ensures the same event always has the same color
 */
export function getEventColor(eventId: string): EventColor {
  // Check if we already have a color for this event
  if (eventColorCache.has(eventId)) {
    return eventColorCache.get(eventId)!;
  }

  // Generate a consistent index based on the event ID
  let hash = 0;
  for (let i = 0; i < eventId.length; i++) {
    const char = eventId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use absolute value to ensure positive index
  const colorIndex = Math.abs(hash) % BRIGHT_COLORS.length;
  const color = BRIGHT_COLORS[colorIndex];
  
  // Cache the color for future use
  eventColorCache.set(eventId, color);
  
  return color;
}

/**
 * Get a random bright color (useful for new events before they have an ID)
 */
export function getRandomEventColor(): EventColor {
  const randomIndex = Math.floor(Math.random() * BRIGHT_COLORS.length);
  return BRIGHT_COLORS[randomIndex];
}

/**
 * Clear the color cache (useful for testing or if needed)
 */
export function clearEventColorCache(): void {
  eventColorCache.clear();
}

/**
 * Get all available bright colors
 */
export function getAllEventColors(): EventColor[] {
  return [...BRIGHT_COLORS];
}
