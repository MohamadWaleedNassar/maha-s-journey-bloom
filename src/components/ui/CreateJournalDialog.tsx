
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useData } from '@/context/DataContext';
import { format } from 'date-fns';
import { Plus, Upload, Image } from 'lucide-react';

const CreateJournalDialog = () => {
  const { addJournalEntry } = useData();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [entryPhoto, setEntryPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEntryPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addJournalEntry({
        title: title.trim(),
        content: content.trim(),
        mood: mood.trim(),
        date: format(new Date(), 'yyyy-MM-dd'),
        imageUrl: entryPhoto
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setMood('');
      setEntryPhoto(null);
      setOpen(false);
    } catch (error) {
      console.error('Error creating journal entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-lilac hover:bg-lilac-dark">
          <Plus size={16} className="mr-2" />
          New Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Journal Entry</DialogTitle>
          <DialogDescription>
            Share your thoughts and feelings about your journey.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          <div>
            <label className="text-sm font-medium">Title:</label>
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your entry a title..."
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">How are you feeling?</label>
            <Input 
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="e.g., Hopeful, Tired, Grateful..."
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Content:</label>
            <Textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write about your day, thoughts, or anything you'd like to remember..."
              className="mt-1 min-h-[120px]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Photo (optional):</label>
            
            {entryPhoto ? (
              <div className="relative border rounded-md overflow-hidden">
                <img 
                  src={entryPhoto} 
                  alt="Journal entry" 
                  className="w-full h-48 object-cover"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 bg-white/80"
                  onClick={() => setEntryPhoto(null)}
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
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-lilac hover:bg-lilac-dark"
            disabled={!title.trim() || !content.trim() || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Entry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJournalDialog;
