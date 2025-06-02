import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ChemoSession, Medication, StageScan, JournalEntry, TreatmentStageConfig } from '@/lib/types';
import { mockChemoSessions, mockMedications, mockScans, mockJournalEntries } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DataContextType {
  // Chemo sessions
  chemoSessions: ChemoSession[];
  addChemoSession: (session: Omit<ChemoSession, 'id'>) => Promise<void>;
  updateChemoSession: (session: ChemoSession) => Promise<void>;
  deleteChemoSession: (id: string) => Promise<void>;
  setChemoSessions: React.Dispatch<React.SetStateAction<ChemoSession[]>>;
  
  // Medications
  medications: Medication[];
  addMedication: (medication: Omit<Medication, 'id'>) => Promise<void>;
  updateMedication: (medication: Medication) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
  
  // Scans
  scans: StageScan[];
  addScan: (scan: Omit<StageScan, 'id'>) => Promise<void>;
  updateScan: (scan: StageScan) => Promise<void>;
  deleteScan: (id: string) => Promise<void>;
  setScans: React.Dispatch<React.SetStateAction<StageScan[]>>;
  
  // Journal entries
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => Promise<void>;
  updateJournalEntry: (entry: JournalEntry) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
  setJournalEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  
  // Treatment stage configuration
  treatmentStages: TreatmentStageConfig[];
  addTreatmentStage: (stage: Omit<TreatmentStageConfig, 'id'>) => Promise<void>;
  updateTreatmentStage: (stage: TreatmentStageConfig) => Promise<void>;
  deleteTreatmentStage: (id: string) => Promise<void>;
  setTreatmentStages: React.Dispatch<React.SetStateAction<TreatmentStageConfig[]>>;
  
  // Treatment info (computed from treatmentStages)
  currentStage: number;
  totalStages: number;
  treatmentStartDate: Date;
  
  // Data loading state
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [chemoSessions, setChemoSessions] = useState<ChemoSession[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [scans, setScans] = useState<StageScan[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [treatmentStages, setTreatmentStages] = useState<TreatmentStageConfig[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { toast } = useToast();
  
  // Treatment info (computed from treatmentStages and chemoSessions)
  const treatmentStartDate = new Date('2025-05-09');
  const totalStages = treatmentStages.length;
  
  // Calculate current stage based on completed sessions
  const getCurrentStage = () => {
    if (treatmentStages.length === 0) return 1;
    
    for (let i = 0; i < treatmentStages.length; i++) {
      const stage = treatmentStages[i];
      const stageSessions = chemoSessions.filter(s => s.stageNumber === stage.stageNumber);
      const completedSessions = stageSessions.filter(s => s.completed).length;
      
      if (completedSessions < stage.sessionsPerStage) {
        return stage.stageNumber;
      }
    }
    
    return treatmentStages[treatmentStages.length - 1]?.stageNumber || 1;
  };
  
  const currentStage = getCurrentStage();

  // Helper function to map database response to TreatmentStageConfig
  const mapToTreatmentStageConfig = (dbStage: any): TreatmentStageConfig => ({
    id: dbStage.id,
    stageNumber: dbStage.stage_number,
    sessionsPerStage: dbStage.sessions_per_stage,
    stageName: dbStage.stage_name,
    stageDescription: dbStage.stage_description
  });

  // Helper function to map database response to ChemoSession
  const mapToChemoSession = (dbSession: any): ChemoSession => ({
    id: dbSession.id,
    date: dbSession.date,
    stageNumber: dbSession.stage_number as 1|2|3|4,
    sessionNumber: dbSession.session_number,
    completed: dbSession.completed,
    notes: dbSession.notes || '',
    sideEffects: Array.isArray(dbSession.side_effects) ? dbSession.side_effects : [],
    feelingRating: dbSession.feeling_rating || 0,
    imageUrl: dbSession.image_url
  });

  // Helper function to map database response to Medication
  const mapToMedication = (dbMedication: any): Medication => ({
    id: dbMedication.id,
    name: dbMedication.name,
    dosage: dbMedication.dosage,
    schedule: dbMedication.schedule,
    startDate: dbMedication.start_date,
    endDate: dbMedication.end_date,
    status: dbMedication.status,
    notes: dbMedication.notes || ''
  });

  // Helper function to map database response to StageScan
  const mapToStageScan = (dbScan: any): StageScan => ({
    id: dbScan.id,
    stageNumber: dbScan.stage_number as 1|2|3|4,
    date: dbScan.date,
    summary: dbScan.summary,
    doctorNotes: dbScan.doctor_notes || '',
    imageUrl: dbScan.image_url
  });

  // Helper function to map database response to JournalEntry
  const mapToJournalEntry = (dbEntry: any): JournalEntry => ({
    id: dbEntry.id,
    date: dbEntry.date,
    title: dbEntry.title,
    content: dbEntry.content,
    mood: dbEntry.mood || '',
    imageUrl: dbEntry.image_url
  });

  // Load data from Supabase on initial render
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch treatment stages first
        const { data: stagesData, error: stagesError } = await supabase
          .from('treatment_stages')
          .select('*')
          .order('stage_number', { ascending: true });
        
        if (stagesError) {
          throw stagesError;
        }
        
        // Fetch chemo sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('chemo_sessions')
          .select('*')
          .order('date', { ascending: true });
        
        if (sessionsError) {
          throw sessionsError;
        }
        
        // Fetch medications
        const { data: medsData, error: medsError } = await supabase
          .from('medications')
          .select('*')
          .order('name', { ascending: true });
        
        if (medsError) {
          throw medsError;
        }
        
        // Fetch scans
        const { data: scansData, error: scansError } = await supabase
          .from('stage_scans')
          .select('*')
          .order('date', { ascending: true });
        
        if (scansError) {
          throw scansError;
        }
        
        // Fetch journal entries
        const { data: entriesData, error: entriesError } = await supabase
          .from('journal_entries')
          .select('*')
          .order('date', { ascending: false });
        
        if (entriesError) {
          throw entriesError;
        }
        
        // Map data to proper TypeScript interfaces
        const mappedStages = stagesData ? stagesData.map(mapToTreatmentStageConfig) : [];
        const mappedSessions = sessionsData ? sessionsData.map(mapToChemoSession) : [];
        const mappedMedications = medsData ? medsData.map(mapToMedication) : [];
        const mappedScans = scansData ? scansData.map(mapToStageScan) : [];
        const mappedEntries = entriesData ? entriesData.map(mapToJournalEntry) : [];
        
        // Set state with mapped data
        setTreatmentStages(mappedStages);
        setChemoSessions(mappedSessions);
        setMedications(mappedMedications);
        setScans(mappedScans);
        setJournalEntries(mappedEntries);
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
        toast({
          title: "Error loading data",
          description: "Could not load data from the database. Using mock data instead.",
          variant: "destructive"
        });
        
        // Fallback to mock data
        setChemoSessions(mockChemoSessions);
        setMedications(mockMedications);
        setScans(mockScans);
        setJournalEntries(mockJournalEntries);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // Treatment stages methods
  const addTreatmentStage = async (stage: Omit<TreatmentStageConfig, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('treatment_stages')
        .insert([{ 
          stage_number: stage.stageNumber,
          sessions_per_stage: stage.sessionsPerStage,
          stage_name: stage.stageName,
          stage_description: stage.stageDescription
        }])
        .select();
      
      if (error) throw error;
      
      const newStage = mapToTreatmentStageConfig(data[0]);
      setTreatmentStages(prev => [...prev, newStage].sort((a, b) => a.stageNumber - b.stageNumber));
      
      toast({
        title: 'Treatment stage added',
        description: `Stage ${stage.stageNumber} was successfully added.`
      });
    } catch (error: any) {
      console.error("Error adding treatment stage:", error);
      toast({
        title: 'Error',
        description: `Failed to add treatment stage: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const updateTreatmentStage = async (stage: TreatmentStageConfig) => {
    try {
      const { error } = await supabase
        .from('treatment_stages')
        .update({ 
          stage_number: stage.stageNumber,
          sessions_per_stage: stage.sessionsPerStage,
          stage_name: stage.stageName,
          stage_description: stage.stageDescription
        })
        .eq('id', stage.id);
      
      if (error) throw error;
      
      setTreatmentStages(treatmentStages.map(s => s.id === stage.id ? stage : s));
      
      toast({
        title: 'Treatment stage updated',
        description: `Stage ${stage.stageNumber} was successfully updated.`
      });
    } catch (error: any) {
      console.error("Error updating treatment stage:", error);
      toast({
        title: 'Error',
        description: `Failed to update treatment stage: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const deleteTreatmentStage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('treatment_stages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTreatmentStages(treatmentStages.filter(s => s.id !== id));
      
      toast({
        title: 'Treatment stage deleted',
        description: 'The treatment stage was successfully removed.'
      });
    } catch (error: any) {
      console.error("Error deleting treatment stage:", error);
      toast({
        title: 'Error',
        description: `Failed to delete treatment stage: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  // Chemo sessions methods
  const addChemoSession = async (session: Omit<ChemoSession, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('chemo_sessions')
        .insert([{ 
          date: session.date,
          stage_number: session.stageNumber,
          session_number: session.sessionNumber,
          completed: session.completed,
          notes: session.notes || '',
          side_effects: session.sideEffects || [],
          feeling_rating: session.feelingRating || 0,
          image_url: session.imageUrl
        }])
        .select();
      
      if (error) throw error;
      
      const newSession = mapToChemoSession(data[0]);
      setChemoSessions(prev => [...prev, newSession]);
      
      toast({
        title: 'Session added',
        description: `Session for ${session.date} was successfully added.`
      });
    } catch (error: any) {
      console.error("Error adding chemo session:", error);
      toast({
        title: 'Error',
        description: `Failed to add session: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const updateChemoSession = async (session: ChemoSession) => {
    try {
      const { error } = await supabase
        .from('chemo_sessions')
        .update({ 
          date: session.date,
          stage_number: session.stageNumber,
          session_number: session.sessionNumber,
          completed: session.completed,
          notes: session.notes || '',
          side_effects: session.sideEffects || [],
          feeling_rating: session.feelingRating || 0,
          image_url: session.imageUrl
        })
        .eq('id', session.id);
      
      if (error) throw error;
      
      setChemoSessions(chemoSessions.map(s => s.id === session.id ? session : s));
      
      toast({
        title: 'Session updated',
        description: `Session for ${session.date} was successfully updated.`
      });
    } catch (error: any) {
      console.error("Error updating chemo session:", error);
      toast({
        title: 'Error',
        description: `Failed to update session: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const deleteChemoSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chemo_sessions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setChemoSessions(chemoSessions.filter(s => s.id !== id));
      
      toast({
        title: 'Session deleted',
        description: 'The session was successfully removed.'
      });
    } catch (error: any) {
      console.error("Error deleting chemo session:", error);
      toast({
        title: 'Error',
        description: `Failed to delete session: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  // Medications methods
  const addMedication = async (medication: Omit<Medication, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .insert([{ 
          name: medication.name,
          dosage: medication.dosage,
          schedule: medication.schedule,
          start_date: medication.startDate,
          end_date: medication.endDate,
          status: medication.status,
          notes: medication.notes || ''
        }])
        .select();
      
      if (error) throw error;
      
      const newMedication = mapToMedication(data[0]);
      setMedications(prev => [...prev, newMedication]);
      
      toast({
        title: 'Medication added',
        description: `${medication.name} was successfully added.`
      });
    } catch (error: any) {
      console.error("Error adding medication:", error);
      toast({
        title: 'Error',
        description: `Failed to add medication: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const updateMedication = async (medication: Medication) => {
    try {
      const { error } = await supabase
        .from('medications')
        .update({ 
          name: medication.name,
          dosage: medication.dosage,
          schedule: medication.schedule,
          start_date: medication.startDate,
          end_date: medication.endDate,
          status: medication.status,
          notes: medication.notes || ''
        })
        .eq('id', medication.id);
      
      if (error) throw error;
      
      setMedications(medications.map(m => m.id === medication.id ? medication : m));
      
      toast({
        title: 'Medication updated',
        description: `${medication.name} was successfully updated.`
      });
    } catch (error: any) {
      console.error("Error updating medication:", error);
      toast({
        title: 'Error',
        description: `Failed to update medication: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      const medication = medications.find(m => m.id === id);
      
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMedications(medications.filter(m => m.id !== id));
      
      toast({
        title: 'Medication deleted',
        description: medication ? `${medication.name} was successfully removed.` : 'Medication was successfully removed.'
      });
    } catch (error: any) {
      console.error("Error deleting medication:", error);
      toast({
        title: 'Error',
        description: `Failed to delete medication: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  // Scans methods
  const addScan = async (scan: Omit<StageScan, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('stage_scans')
        .insert([{ 
          stage_number: scan.stageNumber,
          date: scan.date,
          summary: scan.summary,
          doctor_notes: scan.doctorNotes || '',
          image_url: scan.imageUrl
        }])
        .select();
      
      if (error) throw error;
      
      const newScan = mapToStageScan(data[0]);
      setScans(prev => [...prev, newScan]);
      
      toast({
        title: 'Scan added',
        description: `Scan for Stage ${scan.stageNumber} was successfully added.`
      });
    } catch (error: any) {
      console.error("Error adding scan:", error);
      toast({
        title: 'Error',
        description: `Failed to add scan: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const updateScan = async (scan: StageScan) => {
    try {
      const { error } = await supabase
        .from('stage_scans')
        .update({ 
          stage_number: scan.stageNumber,
          date: scan.date,
          summary: scan.summary,
          doctor_notes: scan.doctorNotes || '',
          image_url: scan.imageUrl
        })
        .eq('id', scan.id);
      
      if (error) throw error;
      
      setScans(scans.map(s => s.id === scan.id ? scan : s));
      
      toast({
        title: 'Scan updated',
        description: `Scan for Stage ${scan.stageNumber} was successfully updated.`
      });
    } catch (error: any) {
      console.error("Error updating scan:", error);
      toast({
        title: 'Error',
        description: `Failed to update scan: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const deleteScan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stage_scans')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setScans(scans.filter(s => s.id !== id));
      
      toast({
        title: 'Scan deleted',
        description: 'The scan was successfully removed.'
      });
    } catch (error: any) {
      console.error("Error deleting scan:", error);
      toast({
        title: 'Error',
        description: `Failed to delete scan: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  // Journal entries methods
  const addJournalEntry = async (entry: Omit<JournalEntry, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([{ 
          date: entry.date,
          title: entry.title,
          content: entry.content,
          mood: entry.mood || '',
          image_url: entry.imageUrl
        }])
        .select();
      
      if (error) throw error;
      
      const newEntry = mapToJournalEntry(data[0]);
      setJournalEntries(prev => [newEntry, ...prev]);
      
      toast({
        title: 'Journal entry added',
        description: `"${entry.title}" was successfully added.`
      });
    } catch (error: any) {
      console.error("Error adding journal entry:", error);
      toast({
        title: 'Error',
        description: `Failed to add journal entry: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const updateJournalEntry = async (entry: JournalEntry) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .update({ 
          date: entry.date,
          title: entry.title,
          content: entry.content,
          mood: entry.mood || '',
          image_url: entry.imageUrl
        })
        .eq('id', entry.id);
      
      if (error) throw error;
      
      setJournalEntries(journalEntries.map(e => e.id === entry.id ? entry : e));
      
      toast({
        title: 'Journal entry updated',
        description: `"${entry.title}" was successfully updated.`
      });
    } catch (error: any) {
      console.error("Error updating journal entry:", error);
      toast({
        title: 'Error',
        description: `Failed to update journal entry: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const deleteJournalEntry = async (id: string) => {
    try {
      const entry = journalEntries.find(e => e.id === id);
      
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setJournalEntries(journalEntries.filter(e => e.id !== id));
      
      toast({
        title: 'Journal entry deleted',
        description: entry ? `"${entry.title}" was successfully removed.` : 'Journal entry was successfully removed.'
      });
    } catch (error: any) {
      console.error("Error deleting journal entry:", error);
      toast({
        title: 'Error',
        description: `Failed to delete journal entry: ${error.message}`,
        variant: 'destructive'
      });
    }
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
    
    treatmentStages,
    addTreatmentStage,
    updateTreatmentStage,
    deleteTreatmentStage,
    setTreatmentStages,
    
    currentStage,
    totalStages,
    treatmentStartDate,
    isLoading
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
