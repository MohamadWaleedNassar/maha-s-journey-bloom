
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Calendar, Plus, Star, Upload, Edit, Image } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Sessions = () => {
  const { chemoSessions, updateChemoSession } = useData();
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState<null | typeof chemoSessions[0]>(null);
  const [sessionPhoto, setSessionPhoto] = useState<string | null>(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [sideEffects, setSideEffects] = useState<string[]>([]);
  const [newSideEffect, setNewSideEffect] = useState('');
  
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
  
  // Open session editing dialog
  const openSessionDialog = (session: typeof chemoSessions[0]) => {
    setSelectedSession(session);
    setSessionNotes(session.notes || '');
    setSelectedRating(session.feelingRating || 0);
    setSideEffects(session.sideEffects || []);
    setSessionPhoto(session.imageUrl || null);
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSessionPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Add a side effect
  const addSideEffect = () => {
    if (newSideEffect.trim() && !sideEffects.includes(newSideEffect.trim())) {
      setSideEffects([...sideEffects, newSideEffect.trim()]);
      setNewSideEffect('');
    }
  };
  
  // Remove a side effect
  const removeSideEffect = (effect: string) => {
    setSideEffects(sideEffects.filter(item => item !== effect));
  };
  
  // Save session changes
  const saveSessionChanges = () => {
    if (!selectedSession) return;
    
    // Check if a photo is uploaded for marking as completed
    if (!selectedSession.completed && !sessionPhoto) {
      toast({
        title: "Photo required",
        description: "Please upload a photo to mark this session as completed",
        variant: "destructive"
      });
      return;
    }
    
    const updatedSession = {
      ...selectedSession,
      completed: !selectedSession.completed ? true : selectedSession.completed,
      notes: sessionNotes,
      feelingRating: selectedRating,
      sideEffects: sideEffects,
      imageUrl: sessionPhoto
    };
    
    updateChemoSession(updatedSession);
    toast({
      title: "Session updated",
      description: "Your session details have been saved"
    });
    
    setSelectedSession(null);
  };
  
  // Mark a session as completed
  const markAsCompleted = (session: typeof chemoSessions[0]) => {
    openSessionDialog(session);
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
                <Card 
                  key={session.id} 
                  className={`card-hover ${session.completed ? 'border-l-4 border-l-green-500' : ''}`}
                >
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
                        
                        {session.imageUrl && (
                          <div className="mb-3 border rounded p-1">
                            <img 
                              src={session.imageUrl} 
                              alt="Session documentation" 
                              className="w-full h-32 object-cover rounded"
                            />
                          </div>
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
                        
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-3 border-lilac text-lilac hover:bg-lilac hover:text-white"
                            onClick={() => openSessionDialog(session)}
                          >
                            <Edit size={16} className="mr-2" />
                            Edit Session
                          </Button>
                        </DialogTrigger>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500 mb-3">
                          {new Date(session.date) <= new Date() ? 
                            "This session is scheduled for today. Mark it as completed once done." :
                            "This session is coming up. You can add notes after completion."
                          }
                        </p>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full border-lilac text-lilac hover:bg-lilac hover:text-white"
                            onClick={() => markAsCompleted(session)}
                          >
                            <Check size={16} className="mr-2" />
                            Mark as Completed
                          </Button>
                        </DialogTrigger>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
      
      <Dialog open={!!selectedSession} onOpenChange={(open) => !open && setSelectedSession(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedSession?.completed ? "Edit Session" : "Complete Session"}
            </DialogTitle>
            <DialogDescription>
              {selectedSession?.completed 
                ? "Update the details of your session."
                : "Upload a photo and add details to mark this session as completed."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Photo Documentation:</label>
              
              {sessionPhoto ? (
                <div className="relative border rounded-md overflow-hidden">
                  <img 
                    src={sessionPhoto} 
                    alt="Session documentation" 
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2 bg-white/80"
                    onClick={() => setSessionPhoto(null)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center border-2 border-dashed rounded-md p-6 bg-gray-50">
                  <label className="cursor-pointer text-center">
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-600">
                      Upload a photo
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      JPEG, PNG, JPG up to 10MB
                    </span>
                    <Input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      <Upload size={16} className="mr-2" />
                      Browse files
                    </Button>
                  </label>
                </div>
              )}
              {!selectedSession?.completed && !sessionPhoto && (
                <p className="text-xs text-red-500">* Photo required to complete session</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">Notes:</label>
              <Textarea 
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="How was your session? Any additional information?"
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">How did you feel?</label>
              <div className="flex space-x-1 mt-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto"
                    onClick={() => setSelectedRating(rating)}
                  >
                    <Star
                      size={24}
                      className={`${rating <= selectedRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Side Effects:</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {sideEffects.map((effect, index) => (
                  <div 
                    key={index}
                    className="bg-pink-light text-pink-dark text-xs px-2 py-1 rounded flex items-center gap-1"
                  >
                    <span>{effect}</span>
                    <button
                      type="button"
                      className="text-pink-dark"
                      onClick={() => removeSideEffect(effect)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex mt-2">
                <Input
                  value={newSideEffect}
                  onChange={(e) => setNewSideEffect(e.target.value)}
                  placeholder="Add side effect"
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && addSideEffect()}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSideEffect}
                  className="ml-2"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSelectedSession(null)}
            >
              Cancel
            </Button>
            <Button 
              onClick={saveSessionChanges} 
              className="bg-lilac hover:bg-lilac-dark"
            >
              {selectedSession?.completed ? "Save Changes" : "Complete Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sessions;
