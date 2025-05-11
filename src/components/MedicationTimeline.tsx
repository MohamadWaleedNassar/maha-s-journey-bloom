
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Medication } from '@/lib/types';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Check, X } from 'lucide-react';

interface MedicationTimelineProps {
  medications: Medication[];
}

const MedicationTimeline: React.FC<MedicationTimelineProps> = ({ medications }) => {
  // Only show ongoing medications in the timeline
  const ongoingMedications = medications.filter(med => med.status === 'ongoing');
  
  // Get the current week dates (7 days starting from today)
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  
  // For demo purposes, we'll generate random adherence data
  // In a real app, this would come from actual tracking data
  const getMedicationStatus = (medication: Medication, date: Date): 'taken' | 'missed' | 'upcoming' => {
    // Consider medications as taken for past dates and upcoming for future dates
    const isPastDate = date < today && !isSameDay(date, today);
    const isFutureDate = date > today && !isSameDay(date, today);
    
    if (isFutureDate) return 'upcoming';
    
    // For demo, randomly mark some past medications as missed (about 20%)
    if (isPastDate || isSameDay(date, today)) {
      // Use medication ID and date to create a deterministic but seemingly random pattern
      const seed = medication.id.charCodeAt(0) + date.getDate();
      return seed % 10 < 8 ? 'taken' : 'missed';
    }
    
    return 'upcoming';
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl">Weekly Medication Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left px-2 py-2">Medication</th>
                {weekDates.map((date, index) => (
                  <th key={index} className="text-center px-3 py-2 min-w-16">
                    <div className="text-xs font-medium">{format(date, 'EEE')}</div>
                    <div className={`text-sm ${isSameDay(date, today) ? 'text-pink font-bold' : ''}`}>
                      {format(date, 'd')}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ongoingMedications.length > 0 ? (
                ongoingMedications.map((med) => (
                  <tr key={med.id} className="border-t">
                    <td className="text-left py-3 px-2 font-medium">{med.name}</td>
                    {weekDates.map((date, index) => {
                      const status = getMedicationStatus(med, date);
                      return (
                        <td key={index} className="text-center py-3 px-2">
                          {status === 'taken' && (
                            <div className="mx-auto flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                              <Check size={16} className="text-green-600" />
                            </div>
                          )}
                          {status === 'missed' && (
                            <div className="mx-auto flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                              <X size={16} className="text-red-600" />
                            </div>
                          )}
                          {status === 'upcoming' && (
                            <div className="mx-auto flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No ongoing medications to track
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={10} className="text-green-600" />
            </div>
            <span className="text-sm">Taken</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
              <X size={10} className="text-red-600" />
            </div>
            <span className="text-sm">Missed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-100"></div>
            <span className="text-sm">Upcoming</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationTimeline;
