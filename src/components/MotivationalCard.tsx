
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getRandomQuote } from '@/lib/mockData';

export function MotivationalCard() {
  const [quote, setQuote] = useState<string>('');
  
  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);
  
  const handleNewQuote = () => {
    setQuote(getRandomQuote());
  };
  
  return (
    <Card className="bg-gradient-to-r from-lilac-light to-pink-light card-hover">
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-gray-700 italic mb-2">"{quote}"</p>
          <button 
            onClick={handleNewQuote}
            className="text-xs text-lilac-dark hover:text-lilac underline mt-2"
          >
            New quote
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
