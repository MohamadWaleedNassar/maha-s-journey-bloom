
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Calendar, Plus, Edit, Trash, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ChemoSession } from '@/lib/types';

const AdminSessions = () => {
  const { chemoSessions, setChemoSessions } = useData();
  const [editingSession, setEditingSession] = useState<ChemoSession | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSession, setNewSession] = useState<Partial<ChemoSession>>({
    stageNumber: 1,
    sessionNumber: 1,
    date: format(new Date(), 'yyyy-MM-dd'),
    completed: false,
    notes: '',
    sideEffects: [],
    feelingRating: 0
  });
  const { toast } = useToast();

  const handleEditClick = (session: ChemoSession) => {
    setEditingSession({...session});
    setIsAddingNew(false);
  };

  const handleAddNewClick = () => {
    setIsAddingNew(true);
    setEditingSession(null);
    // Find the maximum session number to set a default for the new session
    const maxSessionNumber = Math.max(...chemoSessions.map(s => s.sessionNumber), 0);
    setNewSession({
      stageNumber: 1,
      sessionNumber: maxSessionNumber + 1,
      date: format(new Date(), 'yyyy-MM-dd'),
      completed: false,
      notes: '',
      sideEffects: [],
      feelingRating: 0
    });
  };

  const handleSaveEdit = () => {
    if (editingSession) {
      const updatedSessions = chemoSessions.map(session => 
        session.id === editingSession.id ? editingSession : session
      );
      setChemoSessions(updatedSessions);
      toast({
        title: "Session updated",
        description: `Session ${editingSession.sessionNumber} has been updated`,
      });
      setEditingSession(null);
    }
  };

  const handleSaveNew = () => {
    const sessionWithId: ChemoSession = {
      ...newSession as ChemoSession,
      id: `new-${Date.now()}`,
    };
    setChemoSessions([...chemoSessions, sessionWithId]);
    toast({
      title: "Session added",
      description: `New session has been added`,
    });
    setIsAddingNew(false);
  };

  const handleDeleteSession = (id: string) => {
    setChemoSessions(chemoSessions.filter(session => session.id !== id));
    toast({
      title: "Session deleted",
      description: "The session has been deleted",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Sessions</h1>
        <Button onClick={handleAddNewClick} className="bg-lilac hover:bg-lilac-dark flex items-center gap-2">
          <Plus size={16} />
          Add New Session
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Session #</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isAddingNew && (
            <TableRow>
              <TableCell>
                <Input 
                  type="date" 
                  value={newSession.date} 
                  onChange={(e) => setNewSession({...newSession, date: e.target.value})} 
                />
              </TableCell>
              <TableCell>
                <Input 
                  type="number" 
                  value={newSession.stageNumber} 
                  onChange={(e) => setNewSession({...newSession, stageNumber: parseInt(e.target.value) as 1|2|3|4})} 
                  min="1" 
                  max="4"
                />
              </TableCell>
              <TableCell>
                <Input 
                  type="number" 
                  value={newSession.sessionNumber} 
                  onChange={(e) => setNewSession({...newSession, sessionNumber: parseInt(e.target.value)})} 
                />
              </TableCell>
              <TableCell>
                <select 
                  className="px-3 py-2 border rounded w-full"
                  value={newSession.completed ? "true" : "false"}
                  onChange={(e) => setNewSession({...newSession, completed: e.target.value === "true"})}
                >
                  <option value="true">Completed</option>
                  <option value="false">Upcoming</option>
                </select>
              </TableCell>
              <TableCell>
                <Input 
                  value={newSession.notes} 
                  onChange={(e) => setNewSession({...newSession, notes: e.target.value})} 
                />
              </TableCell>
              <TableCell className="space-x-2">
                <Button onClick={handleSaveNew} variant="outline" size="sm">
                  <Save size={16} />
                </Button>
                <Button onClick={() => setIsAddingNew(false)} variant="outline" size="sm" className="bg-red-50 text-red-600">
                  <X size={16} />
                </Button>
              </TableCell>
            </TableRow>
          )}

          {chemoSessions.map(session => (
            <TableRow key={session.id}>
              {editingSession?.id === session.id ? (
                <>
                  <TableCell>
                    <Input 
                      type="date" 
                      value={editingSession.date} 
                      onChange={(e) => setEditingSession({...editingSession, date: e.target.value})} 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      value={editingSession.stageNumber} 
                      onChange={(e) => setEditingSession({...editingSession, stageNumber: parseInt(e.target.value) as 1|2|3|4})} 
                      min="1" 
                      max="4"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      value={editingSession.sessionNumber} 
                      onChange={(e) => setEditingSession({...editingSession, sessionNumber: parseInt(e.target.value)})} 
                    />
                  </TableCell>
                  <TableCell>
                    <select 
                      className="px-3 py-2 border rounded w-full"
                      value={editingSession.completed ? "true" : "false"}
                      onChange={(e) => setEditingSession({...editingSession, completed: e.target.value === "true"})}
                    >
                      <option value="true">Completed</option>
                      <option value="false">Upcoming</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={editingSession.notes} 
                      onChange={(e) => setEditingSession({...editingSession, notes: e.target.value})} 
                    />
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button onClick={handleSaveEdit} variant="outline" size="sm">
                      <Save size={16} />
                    </Button>
                    <Button onClick={() => setEditingSession(null)} variant="outline" size="sm" className="bg-red-50 text-red-600">
                      <X size={16} />
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                  <TableCell>{session.stageNumber}</TableCell>
                  <TableCell>{session.sessionNumber}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded ${session.completed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {session.completed ? 'Completed' : 'Upcoming'}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{session.notes}</TableCell>
                  <TableCell className="space-x-2">
                    <Button onClick={() => handleEditClick(session)} variant="outline" size="sm">
                      <Edit size={16} />
                    </Button>
                    <Button onClick={() => handleDeleteSession(session.id)} variant="outline" size="sm" className="text-red-600">
                      <Trash size={16} />
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminSessions;
