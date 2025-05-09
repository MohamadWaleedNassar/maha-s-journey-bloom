
import React from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Calendar, Plus, Star } from 'lucide-react';

const Sessions = () => {
  const { chemoSessions, updateChemoSession } = useData();
  
  // Group sessions by stage
  const sessionsByStage = chemoSessions.reduce((acc, session) => {
    const stage = session.stageNumber;
    if (!acc[stage]) {
      acc[stage] = [];
    }
    acc[stage].push(session);
    return acc;
  }, {} as Record<number, typeof chemoSessions>);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Mark a session as completed
  const markAsCompleted = (session: typeof chemoSessions[0]) => {
    updateChemoSession({
      ...session,
      completed: true,
      feelingRating: session.feelingRating || 3, // Default feeling rating if not set
    });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Chemotherapy Sessions</h1>
        <Button className="bg-lilac hover:bg-lilac-dark">
          <Plus size={16} className="mr-2" />
          Add Session
        </Button>
      </div>
      
      {Object.entries(sessionsByStage).map(([stage, sessions]) => (
        <div key={stage} className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-lilac text-white flex items-center justify-center mr-2">
              {stage}
            </div>
            <h2 className="text-xl font-semibold">Stage {stage}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((session) => (
                <Card key={session.id} className={`card-hover ${session.completed ? 'border-l-4 border-l-green-500' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Session {session.sessionNumber}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(session.date)}
                          </div>
                        </CardDescription>
                      </div>
                      {session.completed && (
                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center">
                          <Check size={12} className="mr-1" />
                          Completed
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {session.completed ? (
                      <div>
                        {session.notes && (
                          <p className="text-sm mb-2">{session.notes}</p>
                        )}
                        {session.sideEffects.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1">Side effects:</p>
                            <div className="flex flex-wrap gap-1">
                              {session.sideEffects.map((effect, i) => (
                                <span key={i} className="bg-pink-light text-pink-dark text-xs px-2 py-1 rounded">
                                  {effect}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">How I felt:</p>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Star
                                key={rating}
                                size={16}
                                className={`${rating <= session.feelingRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500 mb-3">
                          {new Date(session.date) <= new Date() ? 
                            "This session is scheduled for today. Mark it as completed once done." :
                            "This session is coming up. You can add notes after completion."
                          }
                        </p>
                        <Button 
                          variant="outline" 
                          className="w-full border-lilac text-lilac hover:bg-lilac hover:text-white"
                          onClick={() => markAsCompleted(session)}
                        >
                          <Check size={16} className="mr-2" />
                          Mark as Completed
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sessions;
