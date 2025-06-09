import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataProvider } from "@/context/DataContext";
import { AppLayout } from "@/components/AppLayout";
import { AdminRoute } from "@/components/AdminRoute";
import Dashboard from "@/pages/Dashboard";
import Sessions from "@/pages/Sessions";
import Medications from "@/pages/Medications";
import Journal from "@/pages/Journal";
import Progress from "@/pages/Progress";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import AdminLogin from "@/pages/AdminLogin";
import AdminLayout from "@/pages/Admin/AdminLayout";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminSessions from "@/pages/Admin/AdminSessions";
import AdminMedications from "@/pages/Admin/AdminMedications";
import AdminJournal from "@/pages/Admin/AdminJournal";
import AdminProgress from "@/pages/Admin/AdminProgress";
import Memories from "@/pages/Memories";
import VideoCall from "@/pages/VideoCall";
import Notifications from "@/pages/Notifications";
import AdminMemories from "@/pages/Admin/AdminMemories";
import AdminVideoCall from "@/pages/Admin/AdminVideoCall";
import AdminNotifications from "@/pages/Admin/AdminNotifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Home/Index Route */}
            <Route path="/" element={<Index />} />
            
            {/* Patient Routes */}
            <Route path="/" element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/medications" element={<Medications />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/memories" element={<Memories />} />
              <Route path="/video-call" element={<VideoCall />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>
            
            {/* Admin Authentication */}
            <Route path="/admin-login" element={<AdminLogin />} />
            
            {/* Admin Routes (Protected) */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/sessions" element={<AdminSessions />} />
                <Route path="/admin/medications" element={<AdminMedications />} />
                <Route path="/admin/journal" element={<AdminJournal />} />
                <Route path="/admin/progress" element={<AdminProgress />} />
                <Route path="/admin/memories" element={<AdminMemories />} />
                <Route path="/admin/video-call" element={<AdminVideoCall />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
              </Route>
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
