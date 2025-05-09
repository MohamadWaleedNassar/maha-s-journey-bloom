
import { ChemoSession, Medication, StageScan, JournalEntry, DateString } from './types';

// Helper to get today's date as a string
const today = new Date();
const formatDate = (date: Date): DateString => {
  return date.toISOString().split('T')[0];
};

// Helper to adjust date by days
const addDays = (date: Date, days: number): DateString => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return formatDate(newDate);
};

// Starting treatment date - May 9, 2025
const treatmentStartDate = new Date('2025-05-09');

// Create mock chemo sessions
export const mockChemoSessions: ChemoSession[] = [
  {
    id: '1',
    date: formatDate(treatmentStartDate),
    stageNumber: 1,
    sessionNumber: 1,
    completed: true,
    notes: "First session went well. Doctor was pleased with my vitals.",
    sideEffects: ["mild nausea", "fatigue"],
    feelingRating: 3,
  },
  {
    id: '2',
    date: addDays(treatmentStartDate, 14),
    stageNumber: 1,
    sessionNumber: 2,
    completed: false,
    notes: "",
    sideEffects: [],
    feelingRating: 0,
  },
  {
    id: '3',
    date: addDays(treatmentStartDate, 28),
    stageNumber: 1,
    sessionNumber: 3,
    completed: false,
    notes: "",
    sideEffects: [],
    feelingRating: 0,
  },
  {
    id: '4',
    date: addDays(treatmentStartDate, 42),
    stageNumber: 1,
    sessionNumber: 4,
    completed: false,
    notes: "",
    sideEffects: [],
    feelingRating: 0,
  }
];

// Create mock medications
export const mockMedications: Medication[] = [
  {
    id: '1',
    name: "Ondansetron",
    dosage: "8mg",
    schedule: "Twice daily",
    startDate: formatDate(treatmentStartDate),
    status: 'ongoing',
    notes: "Take before and after chemotherapy sessions to prevent nausea",
  },
  {
    id: '2',
    name: "Dexamethasone",
    dosage: "4mg",
    schedule: "Once daily",
    startDate: formatDate(treatmentStartDate),
    status: 'ongoing',
    notes: "Take in the morning with food",
  }
];

// Create mock scans
export const mockScans: StageScan[] = [];

// Create mock journal entries
export const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    date: formatDate(treatmentStartDate),
    title: "My First Day of Treatment",
    content: "Today was my first chemotherapy session. I was nervous but the nurses were incredibly kind and made me feel comfortable. I'm feeling tired but optimistic.",
    mood: "Hopeful",
  }
];

// Motivational quotes
export const motivationalQuotes = [
  "You are braver than you believe, stronger than you seem, and smarter than you think.",
  "This is not the end. It is not even the beginning of the end. But it is, perhaps, the end of the beginning.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall.",
  "Life isn't about waiting for the storm to pass. It's about learning to dance in the rain.",
  "You never know how strong you are until being strong is your only choice.",
  "Never give up, for that is just the place and time that the tide will turn.",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
  "The most beautiful people are those who have known defeat, known suffering, known struggle, known loss, and have found their way out of those depths.",
  "You are allowed to be both a masterpiece and a work in progress simultaneously.",
  "Hope is the thing with feathers that perches in the soul and sings the tune without the words and never stops at all.",
  "Courage does not always roar. Sometimes courage is the quiet voice at the end of the day saying, 'I will try again tomorrow.'",
  "When you have exhausted all possibilities, remember this: you haven't.",
  "Sometimes the strength within you is not a big fiery flame, but a small resilient light that keeps burning no matter what."
];

// Get a random quote
export function getRandomQuote(): string {
  const index = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[index];
}
