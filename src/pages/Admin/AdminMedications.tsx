
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Medication, MedicationStatus } from '@/lib/types';

const AdminMedications = () => {
  const { medications, setMedications } = useData();
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newMed, setNewMed] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    schedule: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'ongoing',
    notes: ''
  });
  const { toast } = useToast();

  const statusOptions: MedicationStatus[] = ['ongoing', 'completed', 'paused'];

  const handleEditClick = (medication: Medication) => {
    setEditingMed({...medication});
    setIsAddingNew(false);
  };

  const handleAddNewClick = () => {
    setIsAddingNew(true);
    setEditingMed(null);
    setNewMed({
      name: '',
      dosage: '',
      schedule: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'ongoing',
      notes: ''
    });
  };

  const handleSaveEdit = () => {
    if (editingMed) {
      const updatedMeds = medications.map(med => 
        med.id === editingMed.id ? editingMed : med
      );
      setMedications(updatedMeds);
      toast({
        title: "Medication updated",
        description: `${editingMed.name} has been updated`,
      });
      setEditingMed(null);
    }
  };

  const handleSaveNew = () => {
    if (!newMed.name || !newMed.dosage || !newMed.schedule) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const medicationWithId: Medication = {
      ...newMed as Medication,
      id: `new-${Date.now()}`,
    };
    setMedications([...medications, medicationWithId]);
    toast({
      title: "Medication added",
      description: `${newMed.name} has been added`,
    });
    setIsAddingNew(false);
  };

  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
    toast({
      title: "Medication deleted",
      description: "The medication has been deleted",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Medications</h1>
        <Button onClick={handleAddNewClick} className="bg-lilac hover:bg-lilac-dark flex items-center gap-2">
          <Plus size={16} />
          Add New Medication
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Start Date</TableHead>
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
                  value={newMed.name || ''} 
                  onChange={(e) => setNewMed({...newMed, name: e.target.value})} 
                  placeholder="Medication name"
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={newMed.dosage || ''} 
                  onChange={(e) => setNewMed({...newMed, dosage: e.target.value})} 
                  placeholder="e.g., 10mg"
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={newMed.schedule || ''} 
                  onChange={(e) => setNewMed({...newMed, schedule: e.target.value})} 
                  placeholder="e.g., Once daily"
                />
              </TableCell>
              <TableCell>
                <Input 
                  type="date" 
                  value={newMed.startDate} 
                  onChange={(e) => setNewMed({...newMed, startDate: e.target.value})} 
                />
              </TableCell>
              <TableCell>
                <select 
                  className="px-3 py-2 border rounded w-full"
                  value={newMed.status}
                  onChange={(e) => setNewMed({...newMed, status: e.target.value as MedicationStatus})}
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                  ))}
                </select>
              </TableCell>
              <TableCell>
                <Input 
                  value={newMed.notes || ''} 
                  onChange={(e) => setNewMed({...newMed, notes: e.target.value})} 
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

          {medications.map(med => (
            <TableRow key={med.id}>
              {editingMed?.id === med.id ? (
                <>
                  <TableCell>
                    <Input 
                      value={editingMed.name} 
                      onChange={(e) => setEditingMed({...editingMed, name: e.target.value})} 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={editingMed.dosage} 
                      onChange={(e) => setEditingMed({...editingMed, dosage: e.target.value})} 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={editingMed.schedule} 
                      onChange={(e) => setEditingMed({...editingMed, schedule: e.target.value})} 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="date" 
                      value={editingMed.startDate} 
                      onChange={(e) => setEditingMed({...editingMed, startDate: e.target.value})} 
                    />
                  </TableCell>
                  <TableCell>
                    <select 
                      className="px-3 py-2 border rounded w-full"
                      value={editingMed.status}
                      onChange={(e) => setEditingMed({...editingMed, status: e.target.value as MedicationStatus})}
                    >
                      {statusOptions.map(option => (
                        <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={editingMed.notes} 
                      onChange={(e) => setEditingMed({...editingMed, notes: e.target.value})} 
                    />
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button onClick={handleSaveEdit} variant="outline" size="sm">
                      <Save size={16} />
                    </Button>
                    <Button onClick={() => setEditingMed(null)} variant="outline" size="sm" className="bg-red-50 text-red-600">
                      <X size={16} />
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{med.name}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>{med.schedule}</TableCell>
                  <TableCell>{new Date(med.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded ${
                      med.status === 'ongoing' ? 'bg-green-100 text-green-700' : 
                      med.status === 'paused' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{med.notes}</TableCell>
                  <TableCell className="space-x-2">
                    <Button onClick={() => handleEditClick(med)} variant="outline" size="sm">
                      <Edit size={16} />
                    </Button>
                    <Button onClick={() => handleDeleteMedication(med.id)} variant="outline" size="sm" className="text-red-600">
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

export default AdminMedications;
