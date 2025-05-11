
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChemoSession, Medication, StageScan, JournalEntry } from '@/lib/types';
import { mockChemoSessions, mockMedications, mockScans, mockJournalEntries } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface DataContextType {
  // Chemo sessions
  chemoSessions: ChemoSession[];
  addChemoSession: (session: Omit<ChemoSession, 'id'>) => void;
  updateChemoSession: (session: ChemoSession) => void;
  deleteChemoSession: (id: string) => void;
  setChemoSessions: React.Dispatch<React.SetStateAction<ChemoSession[]>>;
  
  // Medications
  medications: Medication[];
  addMedication: (medication: Omit<Medication, 'id'>) => void;
  updateMedication: (medication: Medication) => void;
  deleteMedication: (id: string) => void;
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
  
  // Scans
  scans: StageScan[];
  addScan: (scan: Omit<StageScan, 'id'>) => void;
  updateScan: (scan: StageScan) => void;
  deleteScan: (id: string) => void;
  setScans: React.Dispatch<React.SetStateAction<StageScan[]>>;
  
  // Journal entries
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateJournalEntry: (entry: JournalEntry) => void;
  deleteJournalEntry: (id: string) => void;
  setJournalEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  
  // Treatment info
  currentStage: number;
  totalStages: number;
  treatmentStartDate: Date;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [chemoSessions, setChemoSessions] = useState<ChemoSession[]>(mockChemoSessions);
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [scans, setScans] = useState<StageScan[]>(mockScans);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries);
  
  const { toast } = useToast();
  
  // Treatment info
  const totalStages = 4;
  const currentStage = 1;
  const treatmentStartDate = new Date('2025-05-09');

  // Generate a simple ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Chemo sessions methods
  const addChemoSession = (session: Omit<ChemoSession, 'id'>) => {
    const newSession = { ...session, id: generateId() };
    setChemoSessions([...chemoSessions, newSession]);
    toast({
      title: 'Session added',
      description: `Session for ${session.date} was successfully added.`
    });
  };

  const updateChemoSession = (session: ChemoSession) => {
    setChemoSessions(chemoSessions.map(s => s.id === session.id ? session : s));
    toast({
      title: 'Session updated',
      description: `Session for ${session.date} was successfully updated.`
    });
  };

  const deleteChemoSession = (id: string) => {
    setChemoSessions(chemoSessions.filter(s => s.id !== id));
    toast({
      title: 'Session deleted',
      description: 'The session was successfully removed.'
    });
  };

  // Medications methods
  const addMedication = (medication: Omit<Medication, 'id'>) => {
    const newMedication = { ...medication, id: generateId() };
    setMedications([...medications, newMedication]);
    toast({
      title: 'Medication added',
      description: `${medication.name} was successfully added.`
    });
  };

  const updateMedication = (medication: Medication) => {
    setMedications(medications.map(m => m.id === medication.id ? medication : m));
    toast({
      title: 'Medication updated',
      description: `${medication.name} was successfully updated.`
    });
  };

  const deleteMedication = (id: string) => {
    const medication = medications.find(m => m.id === id);
    setMedications(medications.filter(m => m.id !== id));
    toast({
      title: 'Medication deleted',
      description: medication ? `${medication.name} was successfully removed.` : 'Medication was successfully removed.'
    });
  };

  // Scans methods
  const addScan = (scan: Omit<StageScan, 'id'>) => {
    const newScan = { ...scan, id: generateId() };
    setScans([...scans, newScan]);
    toast({
      title: 'Scan added',
      description: `Scan for Stage ${scan.stageNumber} was successfully added.`
    });
  };

  const updateScan = (scan: StageScan) => {
    setScans(scans.map(s => s.id === scan.id ? scan : s));
    toast({
      title: 'Scan updated',
      description: `Scan for Stage ${scan.stageNumber} was successfully updated.`
    });
  };

  const deleteScan = (id: string) => {
    setScans(scans.filter(s => s.id !== id));
    toast({
      title: 'Scan deleted',
      description: 'The scan was successfully removed.'
    });
  };

  // Journal entries methods
  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry = { ...entry, id: generateId() };
    setJournalEntries([...journalEntries, newEntry]);
    toast({
      title: 'Journal entry added',
      description: `"${entry.title}" was successfully added.`
    });
  };

  const updateJournalEntry = (entry: JournalEntry) => {
    setJournalEntries(journalEntries.map(e => e.id === entry.id ? entry : e));
    toast({
      title: 'Journal entry updated',
      description: `"${entry.title}" was successfully updated.`
    });
  };

  const deleteJournalEntry = (id: string) => {
    const entry = journalEntries.find(e => e.id === id);
    setJournalEntries(journalEntries.filter(e => e.id !== id));
    toast({
      title: 'Journal entry deleted',
      description: entry ? `"${entry.title}" was successfully removed.` : 'Journal entry was successfully removed.'
    });
  };

  const value = {
    chemoSessions,
    addChemoSession,
    updateChemoSession,
    deleteChemoSession,
    setChemoSessions,
    
    medications,
    addMedication,
    updateMedication,
    deleteMedication,
    setMedications,
    
    scans,
    addScan,
    updateScan,
    deleteScan,
    setScans,
    
    journalEntries,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    setJournalEntries,
    
    currentStage,
    totalStages,
    treatmentStartDate,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
