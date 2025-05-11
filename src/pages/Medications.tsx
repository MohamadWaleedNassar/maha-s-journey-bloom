
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pill } from 'lucide-react';
import MedicationTimeline from '@/components/MedicationTimeline';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Medication } from '@/lib/types';

const Medications = () => {
  const { medications, updateMedication, addMedication } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    schedule: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: undefined,
    status: 'ongoing',
    notes: ''
  });
  const { toast } = useToast();
  
  // Group by status
  const ongoingMeds = medications.filter(med => med.status === 'ongoing');
  const completedMeds = medications.filter(med => med.status === 'completed');
  const pausedMeds = medications.filter(med => med.status === 'paused');
  
  // Status badge styling
  const statusStyles = {
    ongoing: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-700",
    paused: "bg-yellow-100 text-yellow-700"
  };
  
  // Change medication status
  const setMedicationStatus = (medication: typeof medications[0], status: 'ongoing' | 'completed' | 'paused') => {
    updateMedication({
      ...medication,
      status
    });
  };
  
  // Handle adding a new medication
  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.schedule) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    addMedication(newMedication as Omit<Medication, 'id'>);
    setIsAddDialogOpen(false);
    setNewMedication({
      name: '',
      dosage: '',
      schedule: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: undefined,
      status: 'ongoing',
      notes: ''
    });
  };
  
  // Render a single medication card
  const MedicationCard = ({ medication }: { medication: typeof medications[0] }) => (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Pill size={18} className="text-pink" />
            {medication.name}
          </CardTitle>
          <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[medication.status]}`}>
            {medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div>
            <p className="text-xs text-gray-500">Dosage</p>
            <p className="text-sm">{medication.dosage}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Schedule</p>
            <p className="text-sm">{medication.schedule}</p>
          </div>
          {medication.notes && (
            <div>
              <p className="text-xs text-gray-500">Notes</p>
              <p className="text-sm">{medication.notes}</p>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-4">
          {medication.status !== 'ongoing' && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs flex-1"
              onClick={() => setMedicationStatus(medication, 'ongoing')}
            >
              Resume
            </Button>
          )}
          {medication.status !== 'paused' && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs flex-1"
              onClick={() => setMedicationStatus(medication, 'paused')}
            >
              Pause
            </Button>
          )}
          {medication.status !== 'completed' && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs flex-1"
              onClick={() => setMedicationStatus(medication, 'completed')}
            >
              Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Medications</h1>
        <Button 
          className="bg-lilac hover:bg-lilac-dark"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus size={16} className="mr-2" />
          Add Medication
        </Button>
      </div>
      
      {/* Weekly Timeline */}
      <MedicationTimeline medications={medications} />
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ongoing Medications</h2>
        {ongoingMeds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ongoingMeds.map(med => (
              <MedicationCard key={med.id} medication={med} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No ongoing medications</p>
        )}
      </div>
      
      {pausedMeds.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Paused Medications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pausedMeds.map(med => (
              <MedicationCard key={med.id} medication={med} />
            ))}
          </div>
        </div>
      )}
      
      {completedMeds.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Completed Medications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedMeds.map(med => (
              <MedicationCard key={med.id} medication={med} />
            ))}
          </div>
        </div>
      )}
      
      {/* Add Medication Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Medication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="name" className="text-sm font-medium mb-1 block">Medication Name</label>
              <Input 
                id="name" 
                value={newMedication.name} 
                onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                placeholder="Enter medication name"
              />
            </div>
            <div>
              <label htmlFor="dosage" className="text-sm font-medium mb-1 block">Dosage</label>
              <Input 
                id="dosage" 
                value={newMedication.dosage} 
                onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                placeholder="e.g., 10mg"
              />
            </div>
            <div>
              <label htmlFor="schedule" className="text-sm font-medium mb-1 block">Schedule</label>
              <Input 
                id="schedule" 
                value={newMedication.schedule} 
                onChange={(e) => setNewMedication({...newMedication, schedule: e.target.value})}
                placeholder="e.g., Once daily"
              />
            </div>
            <div>
              <label htmlFor="startDate" className="text-sm font-medium mb-1 block">Start Date</label>
              <Input 
                id="startDate" 
                type="date" 
                value={newMedication.startDate} 
                onChange={(e) => setNewMedication({...newMedication, startDate: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="notes" className="text-sm font-medium mb-1 block">Notes (optional)</label>
              <Input 
                id="notes" 
                value={newMedication.notes} 
                onChange={(e) => setNewMedication({...newMedication, notes: e.target.value})}
                placeholder="Add any additional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMedication} className="bg-lilac hover:bg-lilac-dark">Add Medication</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Medications;
