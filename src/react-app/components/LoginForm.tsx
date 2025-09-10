import { useState } from 'react';
import { useAuth } from '@/react-app/hooks/useAuth.tsx';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, UserCheck, GraduationCap } from 'lucide-react';

export default function LoginForm() {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'student' // Padrão: aluno
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        await signUpWithEmail(formData.email, formData.password, formData.name, formData.userType);
        setError('Cadastro realizado! Verifique seu email para confirmar a conta e fazer login.');
      }
    } catch (error: any) {
      setError(error.message || 'Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Limpar erro ao digitar
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </h1>
          <p className="text-gray-300">
            {isLogin ? 'Acesse sua conta do NutriTrack Pro' : 'Crie sua conta no NutriTrack Pro'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome (apenas no cadastro) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Seu nome completo"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {/* Tipo de Usuário (apenas no cadastro) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Tipo de Perfil
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('userType', 'student')}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center space-y-2 ${
                    formData.userType === 'student'
                      ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300'
                      : 'border-white/20 bg-white/10 text-gray-300 hover:border-cyan-400/50'
                  }`}
                >
                  <GraduationCap className="w-6 h-6" />
                  <span className="text-sm font-medium">Aluno</span>
                  <span className="text-xs text-center opacity-75">
                    Quero acompanhar minha evolução
                  </span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleInputChange('userType', 'trainer')}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center space-y-2 ${
                    formData.userType === 'trainer'
                      ? 'border-pink-400 bg-pink-400/20 text-pink-300'
                      : 'border-white/20 bg-white/10 text-gray-300 hover:border-pink-400/50'
                  }`}
                >
                  <UserCheck className="w-6 h-6" />
                  <span className="text-sm font-medium">Treinador</span>
                  <span className="text-xs text-center opacity-75">
                    Quero gerenciar meus alunos
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="Sua senha"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {!isLogin && (
              <p className="text-xs text-gray-400 mt-1">
                Mínimo de 6 caracteres
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className={`p-3 rounded-lg text-sm ${
              error.includes('Cadastro realizado') 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-400 to-pink-400 text-slate-900 py-3 rounded-lg font-semibold hover:from-cyan-300 hover:to-pink-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full" />
            ) : (
              <>
                <span>{isLogin ? 'Entrar' : 'Criar Conta'}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="mt-6 text-center">
          <p className="text-gray-300">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          </p>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ name: '', email: '', password: '', userType: 'student' });
            }}
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors mt-1"
          >
            {isLogin ? 'Criar conta gratuita' : 'Fazer login'}
          </button>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← Voltar para o início
          </button>
        </div>
      </div>
    </div>
  );
}