
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { JournalEntry } from '@/lib/types';

const AdminJournal = () => {
  const { journalEntries, setJournalEntries } = useData();
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    title: '',
    content: '',
    mood: ''
  });
  const { toast } = useToast();

  const handleEditClick = (entry: JournalEntry) => {
    setEditingEntry({...entry});
    setIsAddingNew(false);
  };

  const handleAddNewClick = () => {
    setIsAddingNew(true);
    setEditingEntry(null);
    setNewEntry({
      date: format(new Date(), 'yyyy-MM-dd'),
      title: '',
      content: '',
      mood: ''
    });
  };

  const handleSaveEdit = () => {
    if (editingEntry) {
      const updatedEntries = journalEntries.map(entry => 
        entry.id === editingEntry.id ? editingEntry : entry
      );
      setJournalEntries(updatedEntries);
      toast({
        title: "Journal entry updated",
        description: `The journal entry has been updated`,
      });
      setEditingEntry(null);
    }
  };

  const handleSaveNew = () => {
    if (!newEntry.title || !newEntry.content || !newEntry.mood) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    const entryWithId: JournalEntry = {
      ...newEntry as JournalEntry,
      id: `new-${Date.now()}`,
    };
    setJournalEntries([...journalEntries, entryWithId]);
    toast({
      title: "Journal entry added",
      description: `New journal entry has been added`,
    });
    setIsAddingNew(false);
  };

  const handleDeleteEntry = (id: string) => {
    setJournalEntries(journalEntries.filter(entry => entry.id !== id));
    toast({
      title: "Journal entry deleted",
      description: "The journal entry has been deleted",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Journal</h1>
        <Button onClick={handleAddNewClick} className="bg-lilac hover:bg-lilac-dark flex items-center gap-2">
          <Plus size={16} />
          Add New Entry
        </Button>
      </div>

      {isAddingNew && (
        <Card className="border-2 border-lilac">
          <CardHeader>
            <CardTitle className="flex gap-4 items-center">
              <Input 
                type="date"
                value={newEntry.date} 
                onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                className="w-auto"
              />
              <Input 
                value={newEntry.title || ''} 
                onChange={(e) => setNewEntry({...newEntry, title: e.target.value})} 
                placeholder="Entry title"
                className="flex-1"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea 
              value={newEntry.content || ''} 
              onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
              placeholder="Write journal entry here..."
              className="w-full h-32 p-2 border rounded resize-y"
            />
            <div className="mt-4">
              <Input 
                value={newEntry.mood || ''} 
                onChange={(e) => setNewEntry({...newEntry, mood: e.target.value})}
                placeholder="Mood (e.g., Hopeful, Tired)" 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button onClick={() => setIsAddingNew(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSaveNew} className="bg-lilac hover:bg-lilac-dark">
              Save Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        {journalEntries.map(entry => (
          <Card key={entry.id} className={editingEntry?.id === entry.id ? "border-2 border-lilac" : ""}>
            {editingEntry?.id === entry.id ? (
              <>
                <CardHeader>
                  <CardTitle className="flex gap-4 items-center">
                    <Input 
                      type="date"
                      value={editingEntry.date} 
                      onChange={(e) => setEditingEntry({...editingEntry, date: e.target.value})}
                      className="w-auto"
                    />
                    <Input 
                      value={editingEntry.title} 
                      onChange={(e) => setEditingEntry({...editingEntry, title: e.target.value})} 
                      className="flex-1"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea 
                    value={editingEntry.content} 
                    onChange={(e) => setEditingEntry({...editingEntry, content: e.target.value})}
                    className="w-full h-32 p-2 border rounded resize-y"
                  />
                  <div className="mt-4">
                    <Input 
                      value={editingEntry.mood} 
                      onChange={(e) => setEditingEntry({...editingEntry, mood: e.target.value})} 
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button onClick={() => setEditingEntry(null)} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit} className="bg-lilac hover:bg-lilac-dark">
                    Save Changes
                  </Button>
                </CardFooter>
              </>
            ) : (
              <>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>{entry.title}</span>
                    <span className="text-sm font-normal text-gray-500">
                      {formatDate(entry.date)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{entry.content}</p>
                  {entry.imageUrl && (
                    <div className="mt-4">
                      <img 
                        src={entry.imageUrl} 
                        alt="Journal entry" 
                        className="rounded-md max-h-60 object-cover mx-auto"
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="bg-pink-light text-pink-dark text-xs px-3 py-1 rounded-full">
                    {entry.mood}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEditClick(entry)} variant="outline" size="sm">
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                    <Button 
                      onClick={() => handleDeleteEntry(entry.id)} 
                      variant="outline" 
                      size="sm"
                      className="text-red-600"
                    >
                      <Trash size={16} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminJournal;
