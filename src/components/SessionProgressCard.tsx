
import React from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function SessionProgressCard() {
  const { chemoSessions, currentStage, treatmentStages } = useData();
  
  // Find the current stage configuration
  const currentStageConfig = treatmentStages.find(stage => stage.stageNumber === currentStage);
  
  const currentStageSessions = chemoSessions.filter(
    session => session.stageNumber === currentStage
  );
  
  const completedSessions = currentStageSessions.filter(
    session => session.completed
  ).length;
  
  const totalSessions = currentStageConfig?.sessionsPerStage || 4;
  const progress = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
  
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Current Stage Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">
            {completedSessions} of {totalSessions} sessions completed
          </span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        {currentStageConfig && (
          <p className="text-xs text-gray-500 mt-2">
            {currentStageConfig.stageName || `Stage ${currentStage}`}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
