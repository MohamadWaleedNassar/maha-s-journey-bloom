import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Calendar, Home, Pill, FileText, Star, LogOut, Camera, Video, Bell } from "lucide-react";

// Menu items
const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    title: "Sessions",
    path: "/sessions",
    icon: Calendar,
  },
  {
    title: "Medications",
    path: "/medications",
    icon: Pill,
  },
  {
    title: "Journal",
    path: "/journal",
    icon: FileText,
  },
  {
    title: "Progress",
    path: "/progress",
    icon: Star,
  },
  {
    title: "Memories",
    path: "/memories",
    icon: Camera,
  },
  {
    title: "Video Call",
    path: "/video-call",
    icon: Video,
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: Bell,
  }
];

export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Sidebar>
      <div className="flex items-center justify-center p-4 mt-2">
        <h1 className="text-2xl font-bold text-lilac-dark flex items-center gap-2">
          <span className="text-pink">✿</span> Healing Path
        </h1>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        isActive ? "text-lilac-dark font-semibold" : "text-gray-600 hover:text-lilac"
                      }
                    >
                      <item.icon size={20} />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto p-4 space-y-3">
        <div className="bg-pink-light rounded-lg p-3">
          <p className="text-pink-dark italic text-sm text-center">
            "Remember: every day is a step forward."
          </p>
        </div>
        
        <Button 
          onClick={handleLogout}
          variant="outline" 
          size="sm" 
          className="w-full border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <LogOut size={16} className="mr-2" />
          Leave Maha's View
        </Button>
      </div>
    </Sidebar>
  );
}
