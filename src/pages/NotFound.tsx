
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <h1 className="text-4xl font-bold text-lilac mb-2">Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">Sorry, we couldn't find the page you're looking for.</p>
      
      <Button 
        onClick={() => navigate('/')}
        className="bg-lilac hover:bg-lilac-dark"
      >
        Return to Dashboard
      </Button>
    </div>
  );
};

export default NotFound;
