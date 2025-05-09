
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Lock, User } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-3xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-lilac-dark mb-2">
            <span className="text-pink">✿</span> Healing Path
          </h1>
          <p className="text-xl text-gray-600">
            Supporting your journey back to health, one step at a time.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-pink hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="text-pink" />
                Patient View
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Track your treatment progress, journal your experiences, and manage your medications.
              </p>
              <Link to="/dashboard">
                <Button className="w-full bg-pink hover:bg-pink-dark flex items-center justify-between">
                  <span>Enter Patient View</span>
                  <ChevronRight size={16} />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-purple-500 hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="text-purple-600" />
                Admin Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Configure treatment details, manage sessions, update medications and journal entries.
              </p>
              <Link to="/admin-login">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-between">
                  <span>Admin Login</span>
                  <ChevronRight size={16} />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2025 Healing Path. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
