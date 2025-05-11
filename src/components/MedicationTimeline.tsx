
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Medication } from '@/lib/types';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Check, X } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/hooks/use-toast';

interface MedicationTimelineProps {
  medications: Medication[];
}

const MedicationTimeline: React.FC<MedicationTimelineProps> = ({ medications }) => {
  // Only show ongoing medications in the timeline
  const ongoingMedications = medications.filter(med => med.status === 'ongoing');
  const { updateMedication } = useData();
  const { toast } = useToast();
  
  // Get the current week dates (7 days starting from today)
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  
  // For tracking medication adherence
  // In a real app with a proper backend, we would store this in the database
  // For now, we'll simulate by adding a tracking property to medications
  const getMedicationStatus = (medication: Medication, date: Date): 'taken' | 'missed' | 'upcoming' => {
    // Generate a unique key for this medication and date
    const key = `med_${medication.id}_${format(date, 'yyyy-MM-dd')}`;
    const savedStatus = localStorage.getItem(key);
    
    // If we have a saved status, return it
    if (savedStatus === 'taken') return 'taken';
    if (savedStatus === 'missed') return 'missed';
    
    // Consider medications as upcoming for future dates
    const isFutureDate = date > today && !isSameDay(date, today);
    if (isFutureDate) return 'upcoming';
    
    // For past dates without saved status, default to missed
    const isPastDate = date < today && !isSameDay(date, today);
    if (isPastDate) return 'missed';
    
    // For today without saved status, default to upcoming
    return 'upcoming';
  };
  
  // Toggle medication status for a specific date
  const toggleMedicationStatus = (medication: Medication, date: Date) => {
    const key = `med_${medication.id}_${format(date, 'yyyy-MM-dd')}`;
    const currentStatus = getMedicationStatus(medication, date);
    
    // Toggle between taken and missed
    if (currentStatus === 'taken') {
      localStorage.setItem(key, 'missed');
      toast({
        title: "Medication marked as missed",
        description: `${medication.name} for ${format(date, 'MMM dd')} is now marked as missed.`
      });
    } else {
      localStorage.setItem(key, 'taken');
      toast({
        title: "Medication marked as taken",
        description: `${medication.name} for ${format(date, 'MMM dd')} is now marked as taken.`
      });
    }
    
    // Force a re-render
    // In a real application, this would be better handled with state or context
    setTimeout(() => {
      document.dispatchEvent(new Event('medicationStatusUpdated'));
    }, 0);
  };
  
  // Listen for status updates and force re-render
  React.useEffect(() => {
    const handleStatusUpdate = () => {
      // This will force a re-render
      updateMedication({...medications[0]});
    };
    
    document.addEventListener('medicationStatusUpdated', handleStatusUpdate);
    return () => {
      document.removeEventListener('medicationStatusUpdated', handleStatusUpdate);
    };
  }, [medications, updateMedication]);

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
                          <button 
                            className="mx-auto flex items-center justify-center w-8 h-8 rounded-full transition-all hover:scale-110"
                            onClick={() => toggleMedicationStatus(med, date)}
                            aria-label={status === 'taken' ? 'Mark as missed' : 'Mark as taken'}
                            style={{ 
                              background: status === 'taken' ? 'rgb(220, 252, 231)' : 
                                          status === 'missed' ? 'rgb(254, 226, 226)' : 
                                          'rgb(243, 244, 246)'
                            }}
                          >
                            {status === 'taken' && (
                              <Check size={16} className="text-green-600" />
                            )}
                            {status === 'missed' && (
                              <X size={16} className="text-red-600" />
                            )}
                          </button>
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
