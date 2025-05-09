
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Pill, FileText, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Manage Sessions",
      description: "Add, edit, or delete chemotherapy sessions",
      icon: Calendar,
      path: "/admin/sessions",
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Manage Medications",
      description: "Update medication schedules and information",
      icon: Pill,
      path: "/admin/medications",
      color: "bg-green-100 text-green-700"
    },
    {
      title: "Manage Journal",
      description: "Edit or add journal entries",
      icon: FileText,
      path: "/admin/journal",
      color: "bg-pink-100 text-pink-700"
    },
    {
      title: "Manage Progress",
      description: "Update treatment progress and scan data",
      icon: Star,
      path: "/admin/progress",
      color: "bg-purple-100 text-purple-700"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome to the admin dashboard. From here you can manage all aspects of Maha's treatment journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <Card 
            key={index}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(card.path)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">{card.title}</CardTitle>
              <div className={`p-2 rounded-full ${card.color}`}>
                <card.icon size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
