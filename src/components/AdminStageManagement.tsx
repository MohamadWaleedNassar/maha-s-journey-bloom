
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TreatmentStageConfig } from '@/lib/types';

const AdminStageManagement = () => {
  const { treatmentStages, addTreatmentStage, updateTreatmentStage, deleteTreatmentStage } = useData();
  const [editingStage, setEditingStage] = useState<TreatmentStageConfig | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newStage, setNewStage] = useState<Partial<TreatmentStageConfig>>({
    stageNumber: Math.max(...treatmentStages.map(s => s.stageNumber), 0) + 1,
    sessionsPerStage: 4,
    stageName: '',
    stageDescription: ''
  });
  const { toast } = useToast();

  const handleEditClick = (stage: TreatmentStageConfig) => {
    setEditingStage({...stage});
    setIsAddingNew(false);
  };

  const handleAddNewClick = () => {
    setIsAddingNew(true);
    setEditingStage(null);
    setNewStage({
      stageNumber: Math.max(...treatmentStages.map(s => s.stageNumber), 0) + 1,
      sessionsPerStage: 4,
      stageName: '',
      stageDescription: ''
    });
  };

  const handleSaveEdit = () => {
    if (editingStage) {
      updateTreatmentStage(editingStage);
      setEditingStage(null);
    }
  };

  const handleSaveNew = () => {
    if (!newStage.stageNumber || !newStage.sessionsPerStage) {
      toast({
        title: "Missing information",
        description: "Please fill in stage number and sessions per stage",
        variant: "destructive"
      });
      return;
    }
    
    // Check if stage number already exists
    if (treatmentStages.some(s => s.stageNumber === newStage.stageNumber)) {
      toast({
        title: "Stage already exists",
        description: "A stage with this number already exists",
        variant: "destructive"
      });
      return;
    }
    
    addTreatmentStage(newStage as Omit<TreatmentStageConfig, 'id'>);
    setIsAddingNew(false);
  };

  const handleDeleteStage = (id: string) => {
    deleteTreatmentStage(id);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Treatment Stages Configuration</CardTitle>
          <Button onClick={handleAddNewClick} className="bg-lilac hover:bg-lilac-dark flex items-center gap-2">
            <Plus size={16} />
            Add New Stage
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stage Number</TableHead>
              <TableHead>Stage Name</TableHead>
              <TableHead>Sessions per Stage</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAddingNew && (
              <TableRow>
                <TableCell>
                  <Input 
                    type="number" 
                    value={newStage.stageNumber || ''} 
                    onChange={(e) => setNewStage({...newStage, stageNumber: parseInt(e.target.value) || 1})} 
                    min="1"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={newStage.stageName || ''} 
                    onChange={(e) => setNewStage({...newStage, stageName: e.target.value})} 
                    placeholder="Stage name"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    value={newStage.sessionsPerStage || ''} 
                    onChange={(e) => setNewStage({...newStage, sessionsPerStage: parseInt(e.target.value) || 4})} 
                    min="1"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={newStage.stageDescription || ''} 
                    onChange={(e) => setNewStage({...newStage, stageDescription: e.target.value})} 
                    placeholder="Description"
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

            {treatmentStages.length > 0 ? (
              treatmentStages.map(stage => (
                <TableRow key={stage.id}>
                  {editingStage?.id === stage.id ? (
                    <>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={editingStage.stageNumber} 
                          onChange={(e) => setEditingStage({...editingStage, stageNumber: parseInt(e.target.value) || 1})} 
                          min="1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={editingStage.stageName || ''} 
                          onChange={(e) => setEditingStage({...editingStage, stageName: e.target.value})} 
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={editingStage.sessionsPerStage} 
                          onChange={(e) => setEditingStage({...editingStage, sessionsPerStage: parseInt(e.target.value) || 4})} 
                          min="1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={editingStage.stageDescription || ''} 
                          onChange={(e) => setEditingStage({...editingStage, stageDescription: e.target.value})} 
                        />
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button onClick={handleSaveEdit} variant="outline" size="sm">
                          <Save size={16} />
                        </Button>
                        <Button onClick={() => setEditingStage(null)} variant="outline" size="sm" className="bg-red-50 text-red-600">
                          <X size={16} />
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{stage.stageNumber}</TableCell>
                      <TableCell>{stage.stageName || `Stage ${stage.stageNumber}`}</TableCell>
                      <TableCell>{stage.sessionsPerStage}</TableCell>
                      <TableCell className="max-w-xs truncate">{stage.stageDescription}</TableCell>
                      <TableCell className="space-x-2">
                        <Button onClick={() => handleEditClick(stage)} variant="outline" size="sm">
                          <Edit size={16} />
                        </Button>
                        <Button onClick={() => handleDeleteStage(stage.id)} variant="outline" size="sm" className="text-red-600">
                          <Trash size={16} />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No treatment stages configured. Click "Add New Stage" to create the first stage.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminStageManagement;
