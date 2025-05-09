
import React from 'react';
import { useData } from '@/context/DataContext';
import { Progress } from '@/components/ui/progress';

export function TreatmentStageIndicator() {
  const { currentStage, totalStages } = useData();
  const progress = (currentStage / totalStages) * 100;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-500">Stage {currentStage} of {totalStages}</span>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalStages }, (_, i) => (
          <div 
            key={i}
            className={`flex flex-col items-center ${i + 1 <= currentStage ? 'text-lilac-dark' : 'text-gray-300'}`}
          >
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm mb-1
                ${i + 1 < currentStage ? 'bg-lilac' : i + 1 === currentStage ? 'bg-lilac animate-pulse-gentle' : 'bg-gray-200'}`}
            >
              {i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
