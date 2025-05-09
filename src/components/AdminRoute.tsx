
import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const AdminRoute = () => {
  const { toast } = useToast();
  const isAdmin = localStorage.getItem('adminAuthenticated') === 'true';
  
  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Access denied",
        description: "Please login as administrator to access this page",
        variant: "destructive"
      });
    }
  }, [isAdmin, toast]);

  return isAdmin ? <Outlet /> : <Navigate to="/admin-login" />;
};
