
import React from 'react';
import { NavLink } from 'react-router-dom';
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
import { Calendar, Home, Pill, FileText, Star } from "lucide-react";

// Menu items
const menuItems = [
  {
    title: "Dashboard",
    path: "/",
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
  }
];

export function AppSidebar() {
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

      <div className="mt-auto p-4 text-center text-sm text-gray-500">
        <div className="bg-pink-light rounded-lg p-3 mb-3">
          <p className="text-pink-dark italic">
            "Remember: every day is a step forward."
          </p>
        </div>
      </div>
    </Sidebar>
  );
}
