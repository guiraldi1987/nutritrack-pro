import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider, useAuth } from '@/react-app/hooks/useAuth.tsx';
import { useEffect, useState } from 'react';
import Landing from "@/react-app/pages/Landing";
import Dashboard from "@/react-app/pages/Dashboard";
import Anamnesis from "@/react-app/pages/Anamnesis";
import Measurements from "@/react-app/pages/Measurements";
import Evolution from "@/react-app/pages/Evolution";
import Diet from "@/react-app/pages/Diet";
import DietPlans from "@/react-app/pages/DietPlans";
import Students from "@/react-app/pages/Students";
import Reports from "@/react-app/pages/Reports";
import Materials from "@/react-app/pages/Materials";
import AuthCallback from "@/react-app/components/AuthCallback";
import ProfileSetup from "@/react-app/components/ProfileSetup";
import LoginForm from "@/react-app/components/LoginForm";

import type { UserProfile } from '@/shared/types';

function AppContent() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      try {
        // Por enquanto, vamos usar dados mock até implementar a API com Supabase
        // const response = await fetch('/api/profile');
        // const data = await response.json();
        // setProfile(data.profile);
        
        // Mock profile para teste
        setProfile({
          id: 1,
          user_id: user.id,
          name: user.user_metadata?.full_name || user.email || 'Usuário',
          user_type: user.user_metadata?.user_type || 'student',
          phone: user.phone || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mx-auto mb-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Dashboard /> : <Landing />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/dashboard" element={
        user ? (
          profile ? <Dashboard /> : <ProfileSetup onComplete={() => window.location.reload()} />
        ) : <Landing />
      } />
      <Route path="/anamnesis" element={
        user ? (
          profile ? <Anamnesis /> : <ProfileSetup onComplete={() => window.location.reload()} />
        ) : <Landing />
      } />
      <Route path="/measurements" element={
        user ? (
          profile ? <Measurements /> : <ProfileSetup onComplete={() => window.location.reload()} />
        ) : <Landing />
      } />
      <Route path="/evolution" element={
        user ? (
          profile ? <Evolution /> : <ProfileSetup onComplete={() => window.location.reload()} />
        ) : <Landing />
      } />
      <Route path="/diet" element={
        user ? (
          profile ? <Diet /> : <ProfileSetup onComplete={() => window.location.reload()} />
        ) : <Landing />
      } />
      <Route path="/diet-plans" element={
        user ? (
          profile ? <DietPlans /> : <ProfileSetup onComplete={() => window.location.reload()} />
        ) : <Landing />
      } />
      <Route path="/students" element={
        user ? (
          profile ? <Students /> : <ProfileSetup onComplete={() => window.location.reload()} />
        ) : <Landing />
      } />
      <Route path="/reports" element={
        user ? (
          profile ? <Reports /> : <ProfileSetup onComplete={() => window.location.reload()} />
        ) : <Landing />
      } />
      <Route path="/materials" element={
        user ? (
          profile ? <Materials /> : <ProfileSetup onComplete={() => window.location.reload()} />
        ) : <Landing />
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
