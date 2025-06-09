import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Heart, Camera, Edit, Trash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Memory } from '@/lib/types';

const Memories = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    notes: '',
    image: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemories((data || []).map(item => ({
        ...item,
        created_by: item.created_by as 'patient' | 'admin'
      })));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch memories: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `memories/${fileName}`;

    const { error } = await supabase.storage
      .from('memories')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('memories')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      toast({
        title: 'Missing fields',
        description: 'Please provide a title and select an image',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadImage(formData.image);

      if (editingMemory) {
        const { error } = await supabase
          .from('memories')
          .update({
            title: formData.title,
            description: formData.description,
            notes: formData.notes,
            image_url: imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingMemory.id);

        if (error) throw error;
        
        toast({
          title: 'Memory updated!',
          description: 'Your precious memory has been updated successfully'
        });
      } else {
        const { error } = await supabase
          .from('memories')
          .insert({
            title: formData.title,
            description: formData.description,
            notes: formData.notes,
            image_url: imageUrl,
            created_by: 'patient'
          });

        if (error) throw error;

        toast({
          title: 'Memory saved!',
          description: 'Your precious memory has been added to the gallery'
        });
      }

      await fetchMemories();
      setIsDialogOpen(false);
      setEditingMemory(null);
      setFormData({ title: '', description: '', notes: '', image: null });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to save memory: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (memory: Memory) => {
    setEditingMemory(memory);
    setFormData({
      title: memory.title,
      description: memory.description || '',
      notes: memory.notes || '',
      image: null
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchMemories();
      toast({
        title: 'Memory deleted',
        description: 'The memory has been removed from your gallery'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to delete memory: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-lilac-dark mb-2">Memory Gallery</h1>
          <p className="text-gray-600">Cherish every beautiful moment of your journey</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink hover:bg-pink-dark text-white">
              <Plus size={20} className="mr-2" />
              Add Memory
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lilac-dark">
                {editingMemory ? 'Edit Memory' : 'Add New Memory'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Give your memory a beautiful title..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What makes this moment special?"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Personal Notes</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Your thoughts and feelings about this memory..."
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
                  required={!editingMemory}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading} className="flex-1 bg-pink hover:bg-pink-dark">
                  {loading ? 'Saving...' : editingMemory ? 'Update Memory' : 'Save Memory'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingMemory(null);
                    setFormData({ title: '', description: '', notes: '', image: null });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {memories.length === 0 ? (
        <div className="text-center py-12">
          <Camera size={64} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No memories yet</h3>
          <p className="text-gray-500 mb-4">Start building your beautiful collection of memories</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {memories.map((memory) => (
            <Card key={memory.id} className="hover:shadow-lg transition-shadow duration-300 border-pink-100">
              <div className="relative">
                <img
                  src={memory.image_url}
                  alt={memory.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={memory.created_by === 'patient' ? 'default' : 'secondary'} className="bg-white/90 text-pink">
                    {memory.created_by === 'patient' ? 'Maha' : 'Care Team'}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-lilac-dark flex items-center gap-2">
                  <Heart size={16} className="text-pink" />
                  {memory.title}
                </CardTitle>
                {memory.description && (
                  <p className="text-sm text-gray-600">{memory.description}</p>
                )}
              </CardHeader>
              
              <CardContent>
                {memory.notes && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 italic">"{memory.notes}"</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(memory.created_at).toLocaleDateString()}</span>
                  {memory.created_by === 'patient' && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(memory)}
                        className="h-8 w-8 p-0 text-gray-600 hover:text-pink"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(memory.id)}
                        className="h-8 w-8 p-0 text-gray-600 hover:text-red-500"
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Memories;
