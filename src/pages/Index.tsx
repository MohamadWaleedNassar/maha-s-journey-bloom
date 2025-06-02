
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Lock, Heart, Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-lilac-50">
      <div className="w-full max-w-4xl px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-4">
            <span className="text-6xl">🌸</span>
          </div>
          <h1 className="text-5xl font-bold text-lilac-dark mb-4 font-serif">
            Welcome Home, Maha
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="text-pink w-6 h-6 animate-pulse" />
            <p className="text-2xl text-gray-700 font-medium">
              Your Healing Path Awaits
            </p>
            <Sparkles className="text-pink w-6 h-6 animate-pulse" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            This is your safe space, designed with love to support every step of your healing journey. 
            You are stronger than you know, and you're not walking this path alone. 💕
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-3 border-pink-200 hover:border-pink-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-3 w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="text-white w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-pink-600">
                Maha's View
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-gray-700 text-lg leading-relaxed">
                Your personal sanctuary to track progress, share thoughts, and celebrate victories. 
                Every small step matters, and every moment of courage counts. ✨
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📊 Track your treatment journey</p>
                <p>📝 Journal your thoughts & feelings</p>
                <p>💊 Manage medications with ease</p>
                <p>🌟 Celebrate your progress</p>
              </div>
              <Link to="/dashboard">
                <Button className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-semibold py-3 text-lg rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105">
                  <span>Enter Your Space</span>
                  <ChevronRight size={20} />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-3 border-purple-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-3 w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <Lock className="text-white w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-purple-600">
                Care Team Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-gray-700 text-lg leading-relaxed">
                Secure access for your care team to customize treatment plans, update schedules, 
                and ensure everything is perfectly tailored for you. 🩺
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>⚙️ Configure treatment details</p>
                <p>📅 Manage session schedules</p>
                <p>💊 Update medication plans</p>
                <p>📋 Review progress notes</p>
              </div>
              <Link to="/admin-login">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 text-lg rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105">
                  <span>Care Team Login</span>
                  <ChevronRight size={20} />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-8">
          <div className="inline-block bg-white/60 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border border-pink-100">
            <p className="text-gray-600 text-lg font-medium">
              "Every sunrise is a new beginning, every breath a gift of strength" 🌅
            </p>
          </div>
        </div>
      </div>
      
      <footer className="mt-8 text-center space-y-2">
        <p className="text-gray-500 text-sm">© 2025 Healing Path. All rights reserved.</p>
        <p className="text-pink-500 text-lg font-medium italic">
          Created with 💖 by your beloved Wello
        </p>
      </footer>
    </div>
  );
};

export default Index;
