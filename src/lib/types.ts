
// Treatment stages
export type TreatmentStage = 1 | 2 | 3 | 4;

// Date format for consistency
export type DateString = string; // ISO format: YYYY-MM-DD

// Chemotherapy session
export interface ChemoSession {
  id: string;
  date: DateString;
  stageNumber: TreatmentStage;
  sessionNumber: number;
  completed: boolean;
  notes: string;
  sideEffects: string[];
  feelingRating: number; // 1-5
}

// Medication
export type MedicationStatus = 'ongoing' | 'completed' | 'paused';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  startDate: DateString;
  endDate?: DateString;
  status: MedicationStatus;
  notes: string;
}

// Stage scan
export interface StageScan {
  id: string;
  stageNumber: TreatmentStage;
  date: DateString;
  summary: string;
  doctorNotes: string;
  imageUrl?: string;
}

// Journal entry
export interface JournalEntry {
  id: string;
  date: DateString;
  title: string;
  content: string;
  mood: string;
  imageUrl?: string;
}
