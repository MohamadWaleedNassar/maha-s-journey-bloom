
import React from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TreatmentStageIndicator } from '@/components/TreatmentStageIndicator';

const Progress = () => {
  const { scans, currentStage, totalStages } = useData();
  
  // Group scans by stage
  const scansByStage = scans.reduce((acc, scan) => {
    const stage = scan.stageNumber;
    if (!acc[stage]) {
      acc[stage] = [];
    }
    acc[stage].push(scan);
    return acc;
  }, {} as Record<number, typeof scans>);
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Treatment Progress</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Treatment Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <TreatmentStageIndicator />
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">About Your Treatment Plan</h3>
            <p className="text-gray-600">
              Your treatment consists of {totalStages} stages. You are currently in Stage {currentStage}.
              Each stage includes multiple chemotherapy sessions followed by a scan to evaluate progress.
            </p>
            
            <div className="mt-4 bg-pink-light rounded-lg p-4 text-pink-dark">
              <p className="font-medium">What to expect in Stage {currentStage}:</p>
              <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                <li>4 chemotherapy sessions (one every 2 weeks)</li>
                <li>Regular blood work before each session</li>
                <li>A body scan after the final session</li>
                <li>Consultation with your oncologist to review progress</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-semibold mb-4">Your Scan Results</h2>
      
      {Object.keys(scansByStage).length > 0 ? (
        Object.entries(scansByStage).map(([stage, stageScans]) => (
          <div key={stage} className="mb-6">
            <h3 className="text-lg font-medium mb-3">Stage {stage} Scans</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stageScans.map(scan => (
                <Card key={scan.id} className="card-hover">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Scan from {new Date(scan.date).toLocaleDateString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {scan.imageUrl && (
                      <img 
                        src={scan.imageUrl} 
                        alt={`Stage ${scan.stageNumber} scan`}
                        className="w-full h-40 object-cover rounded-md mb-3"
                      />
                    )}
                    <div className="text-sm">
                      <p className="font-medium">Summary:</p>
                      <p className="text-gray-600 mb-2">{scan.summary}</p>
                      
                      {scan.doctorNotes && (
                        <>
                          <p className="font-medium">Doctor's Notes:</p>
                          <p className="text-gray-600">{scan.doctorNotes}</p>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      ) : (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-gray-500">
              No scan results available yet. Your first scan will be scheduled after completing Stage 1.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Progress;
