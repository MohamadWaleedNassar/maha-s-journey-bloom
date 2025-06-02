
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { StageScan, TreatmentStage } from '@/lib/types';
import AdminStageManagement from '@/components/AdminStageManagement';

const AdminProgress = () => {
  const { scans, setScans } = useData();
  const [editingScan, setEditingScan] = useState<StageScan | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newScan, setNewScan] = useState<Partial<StageScan>>({
    stageNumber: 1,
    date: format(new Date(), 'yyyy-MM-dd'),
    summary: '',
    doctorNotes: ''
  });
  const { toast } = useToast();

  const handleEditClick = (scan: StageScan) => {
    setEditingScan({...scan});
    setIsAddingNew(false);
  };

  const handleAddNewClick = () => {
    setIsAddingNew(true);
    setEditingScan(null);
    setNewScan({
      stageNumber: 1,
      date: format(new Date(), 'yyyy-MM-dd'),
      summary: '',
      doctorNotes: ''
    });
  };

  const handleSaveEdit = () => {
    if (editingScan) {
      const updatedScans = scans.map(scan => 
        scan.id === editingScan.id ? editingScan : scan
      );
      setScans(updatedScans);
      toast({
        title: "Scan updated",
        description: `The scan data has been updated`,
      });
      setEditingScan(null);
    }
  };

  const handleSaveNew = () => {
    if (!newScan.summary || !newScan.doctorNotes) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    const scanWithId: StageScan = {
      ...newScan as StageScan,
      id: `new-${Date.now()}`,
    };
    setScans([...scans, scanWithId]);
    toast({
      title: "Scan added",
      description: `New scan data has been added`,
    });
    setIsAddingNew(false);
  };

  const handleDeleteScan = (id: string) => {
    setScans(scans.filter(scan => scan.id !== id));
    toast({
      title: "Scan deleted",
      description: "The scan data has been deleted",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Progress</h1>

      <Tabs defaultValue="scans" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scans">Scan Results</TabsTrigger>
          <TabsTrigger value="stages">Treatment Stages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scans" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Scan Results Management</h2>
            <Button onClick={handleAddNewClick} className="bg-lilac hover:bg-lilac-dark flex items-center gap-2">
              <Plus size={16} />
              Add New Scan
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Treatment Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Doctor's Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isAddingNew && (
                    <TableRow>
                      <TableCell>
                        <Input 
                          type="date" 
                          value={newScan.date} 
                          onChange={(e) => setNewScan({...newScan, date: e.target.value})} 
                        />
                      </TableCell>
                      <TableCell>
                        <select 
                          className="px-3 py-2 border rounded w-full"
                          value={newScan.stageNumber}
                          onChange={(e) => setNewScan({...newScan, stageNumber: parseInt(e.target.value) as TreatmentStage})}
                        >
                          <option value={1}>Stage 1</option>
                          <option value={2}>Stage 2</option>
                          <option value={3}>Stage 3</option>
                          <option value={4}>Stage 4</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={newScan.summary || ''} 
                          onChange={(e) => setNewScan({...newScan, summary: e.target.value})} 
                          placeholder="Summary of scan results"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={newScan.doctorNotes || ''} 
                          onChange={(e) => setNewScan({...newScan, doctorNotes: e.target.value})} 
                          placeholder="Doctor's notes"
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

                  {scans.length > 0 ? (
                    scans.map(scan => (
                      <TableRow key={scan.id}>
                        {editingScan?.id === scan.id ? (
                          <>
                            <TableCell>
                              <Input 
                                type="date" 
                                value={editingScan.date} 
                                onChange={(e) => setEditingScan({...editingScan, date: e.target.value})} 
                              />
                            </TableCell>
                            <TableCell>
                              <select 
                                className="px-3 py-2 border rounded w-full"
                                value={editingScan.stageNumber}
                                onChange={(e) => setEditingScan({...editingScan, stageNumber: parseInt(e.target.value) as TreatmentStage})}
                              >
                                <option value={1}>Stage 1</option>
                                <option value={2}>Stage 2</option>
                                <option value={3}>Stage 3</option>
                                <option value={4}>Stage 4</option>
                              </select>
                            </TableCell>
                            <TableCell>
                              <Input 
                                value={editingScan.summary} 
                                onChange={(e) => setEditingScan({...editingScan, summary: e.target.value})} 
                              />
                            </TableCell>
                            <TableCell>
                              <Input 
                                value={editingScan.doctorNotes} 
                                onChange={(e) => setEditingScan({...editingScan, doctorNotes: e.target.value})} 
                              />
                            </TableCell>
                            <TableCell className="space-x-2">
                              <Button onClick={handleSaveEdit} variant="outline" size="sm">
                                <Save size={16} />
                              </Button>
                              <Button onClick={() => setEditingScan(null)} variant="outline" size="sm" className="bg-red-50 text-red-600">
                                <X size={16} />
                              </Button>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>{new Date(scan.date).toLocaleDateString()}</TableCell>
                            <TableCell>Stage {scan.stageNumber}</TableCell>
                            <TableCell className="max-w-xs truncate">{scan.summary}</TableCell>
                            <TableCell className="max-w-xs truncate">{scan.doctorNotes}</TableCell>
                            <TableCell className="space-x-2">
                              <Button onClick={() => handleEditClick(scan)} variant="outline" size="sm">
                                <Edit size={16} />
                              </Button>
                              <Button onClick={() => handleDeleteScan(scan.id)} variant="outline" size="sm" className="text-red-600">
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
                        No scan data available. Click "Add New Scan" to add progress information.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stages" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Treatment Stages Configuration</h2>
            <p className="text-gray-600 mb-6">
              Configure the number of treatment stages and sessions per stage. This will automatically update the patient dashboard and progress tracking.
            </p>
            <AdminStageManagement />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProgress;
