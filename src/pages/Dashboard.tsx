import React from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TreatmentStageIndicator } from '@/components/TreatmentStageIndicator';
import { SessionProgressCard } from '@/components/SessionProgressCard';
import { NextAppointmentCard } from '@/components/NextAppointmentCard';
import { MotivationalCard } from '@/components/MotivationalCard';
const Dashboard = () => {
  const {
    chemoSessions,
    medications,
    journalEntries
  } = useData();

  // Format date for display
  const formatDate = (dateString: Date) => {
    return dateString.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get the most recent journal entry
  const latestJournalEntry = journalEntries.length > 0 ? journalEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;
  return <div>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Maha 🌸</h1>
        
      </div>
      
      <div className="mb-8 animate-fade-in" style={{
      animationDelay: '0.1s'
    }}>
        <h2 className="text-xl font-semibold mb-4">Your Treatment Progress</h2>
        <TreatmentStageIndicator />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="animate-fade-in" style={{
        animationDelay: '0.2s'
      }}>
          <SessionProgressCard />
        </div>
        
        <div className="animate-fade-in" style={{
        animationDelay: '0.3s'
      }}>
          <NextAppointmentCard />
        </div>
        
        <div className="animate-fade-in" style={{
        animationDelay: '0.4s'
      }}>
          <MotivationalCard />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="animate-fade-in" style={{
        animationDelay: '0.5s'
      }}>
          <Card className="h-full card-hover">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Your Medications</CardTitle>
              <CardDescription>
                {medications.length} active medications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {medications.map(med => <li key={med.id} className="p-2 bg-white rounded border border-gray-100">
                    <div className="font-medium">{med.name}</div>
                    <div className="text-sm text-gray-500">{med.dosage} - {med.schedule}</div>
                  </li>)}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="animate-fade-in" style={{
        animationDelay: '0.6s'
      }}>
          <Card className="h-full card-hover">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recent Journal</CardTitle>
              <CardDescription>
                {journalEntries.length} journal entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              {latestJournalEntry ? <div>
                  <h3 className="font-medium">{latestJournalEntry.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(latestJournalEntry.date).toLocaleDateString()} • {latestJournalEntry.mood}
                  </p>
                  <p className="text-sm line-clamp-3">{latestJournalEntry.content}</p>
                </div> : <p className="text-gray-500">No journal entries yet</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default Dashboard;