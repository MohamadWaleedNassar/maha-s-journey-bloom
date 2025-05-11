
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Users, Calendar, FileText, Pill, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    navigate('/admin-login');
  };

  // Admin sidebar items
  const sidebarItems = [
    { name: 'Dashboard', icon: Users, path: '/admin' },
    { name: 'Sessions', icon: Calendar, path: '/admin/sessions' },
    { name: 'Medications', icon: Pill, path: '/admin/medications' },
    { name: 'Journal', icon: FileText, path: '/admin/journal' },
    { name: 'Progress', icon: Star, path: '/admin/progress' }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <div className="flex items-center justify-center p-4 mt-2">
            <h1 className="text-2xl font-bold text-purple-800">
              Admin Dashboard
            </h1>
          </div>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild>
                        <button 
                          onClick={() => navigate(item.path)}
                          className="flex items-center gap-2 px-2 py-1 rounded w-full text-left hover:bg-gray-100"
                        >
                          <item.icon size={18} />
                          <span>{item.name}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <div className="mt-auto p-4">
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="w-full flex items-center gap-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
            
            <Button 
              variant="link" 
              onClick={() => navigate('/')}
              className="w-full mt-2 text-purple-700"
            >
              Switch to Patient View
            </Button>
          </div>
        </Sidebar>
        
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
