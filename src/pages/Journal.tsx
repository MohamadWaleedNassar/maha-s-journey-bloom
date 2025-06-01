
import React from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Loader } from 'lucide-react';
import CreateJournalDialog from '@/components/ui/CreateJournalDialog';

const Journal = () => {
  const { journalEntries, isLoading } = useData();
  
  // Sort entries by date (newest first)
  const sortedEntries = [...journalEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-lilac" />
        <span className="ml-2 text-lg">Loading journal entries...</span>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Journal</h1>
        <CreateJournalDialog />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {sortedEntries.length > 0 ? (
          sortedEntries.map(entry => (
            <Card key={entry.id} className="card-hover">
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
              {entry.mood && (
                <CardFooter>
                  <div className="bg-pink-light text-pink-dark text-xs px-3 py-1 rounded-full">
                    {entry.mood}
                  </div>
                </CardFooter>
              )}
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-medium mb-2">Your Journal is Empty</h3>
            <p className="text-gray-500 mb-4">Start documenting your journey by adding your first entry</p>
            <CreateJournalDialog />
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
