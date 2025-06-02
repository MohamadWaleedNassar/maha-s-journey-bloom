
import React from 'react';
import { useData } from '@/context/DataContext';
import { Progress } from '@/components/ui/progress';

export function TreatmentStageIndicator() {
  const { currentStage, totalStages, treatmentStages } = useData();
  const progress = totalStages > 0 ? (currentStage / totalStages) * 100 : 0;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-500">Stage {currentStage} of {totalStages}</span>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      
      <div className="flex justify-between mt-2">
        {treatmentStages.map((stage, i) => (
          <div 
            key={stage.id}
            className={`flex flex-col items-center ${stage.stageNumber <= currentStage ? 'text-lilac-dark' : 'text-gray-300'}`}
          >
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm mb-1
                ${stage.stageNumber < currentStage ? 'bg-lilac' : stage.stageNumber === currentStage ? 'bg-lilac animate-pulse-gentle' : 'bg-gray-200'}`}
            >
              {stage.stageNumber}
            </div>
            <span className="text-xs">{stage.stageName || `Stage ${stage.stageNumber}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
