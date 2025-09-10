import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '@/shared/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Processar o callback do OAuth
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error in auth callback:', error);
          navigate('/?error=auth_failed');
          return;
        }

        if (data.session) {
          console.log('Authentication successful:', data.session.user);
          navigate('/dashboard');
        } else {
          console.log('No session found, redirecting to home');
          navigate('/');
        }
      } catch (error) {
        console.error('Authentication failed:', error);
        navigate('/?error=auth_failed');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin mx-auto mb-4">
          <Loader2 className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Autenticando...</h2>
        <p className="text-gray-600">Aguarde enquanto finalizamos seu login.</p>
      </div>
    </div>
  );
}
