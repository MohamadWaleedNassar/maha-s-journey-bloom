
import React from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export function NextAppointmentCard() {
  const { chemoSessions, currentStage } = useData();
  
  // Find the next upcoming session
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight for proper comparison
  
  const upcomingSessions = chemoSessions
    .filter(session => !session.completed && new Date(session.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const nextSession = upcomingSessions.length > 0 ? upcomingSessions[0] : null;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Calculate days until the next session
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Check if tomorrow is stage transition day (May 10, 2025)
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isStageTransitionTomorrow = 
    tomorrow.getFullYear() === 2025 && 
    tomorrow.getMonth() === 4 && // May is month 4 (0-indexed)
    tomorrow.getDate() === 10;
  
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Calendar size={18} className="text-pink" />
          Next Appointment
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isStageTransitionTomorrow && (
          <div className="mb-3 p-2 bg-pink-light rounded-md border border-pink">
            <p className="font-medium text-sm text-pink-dark">
              Stage {currentStage + 1} begins tomorrow morning!
            </p>
          </div>
        )}
        
        {nextSession ? (
          <div>
            <p className="font-medium text-lg">{formatDate(nextSession.date)}</p>
            <p className="text-sm text-gray-500">
              Stage {nextSession.stageNumber}, Session {nextSession.sessionNumber}
            </p>
            <p className="mt-2 text-sm font-medium text-pink">
              {getDaysUntil(nextSession.date) === 0 
                ? "Today!" 
                : getDaysUntil(nextSession.date) === 1 
                  ? "Tomorrow" 
                  : `In ${getDaysUntil(nextSession.date)} days`}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No upcoming appointments</p>
        )}
      </CardContent>
    </Card>
  );
}
