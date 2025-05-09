
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { useToast } from "@/hooks/use-toast";

export function AppLayout() {
  const { toast } = useToast();

  React.useEffect(() => {
    // Welcome toast that appears once when the app is first loaded
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    
    if (!hasSeenWelcome) {
      toast({
        title: "Welcome back, Maha 🌸",
        description: "You are stronger than you know. One step at a time.",
        duration: 6000,
      });
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, [toast]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div />
            <SidebarTrigger />
          </div>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
