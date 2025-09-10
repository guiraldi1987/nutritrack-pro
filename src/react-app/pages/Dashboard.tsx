import { useEffect, useState } from 'react';
import { useAuth } from '@/react-app/hooks/useAuth.tsx';
import { useNavigate } from 'react-router';
import { 
  ClipboardList, 
  Scale, 
  Calendar, 
  Users, 
  TrendingUp, 
  Apple,
  LogOut,
  BarChart3,
  BookOpen,
  UserPlus,
  Settings,
  X
} from 'lucide-react';
import NotificationCenter from '@/react-app/components/NotificationCenter';
import InstallPrompt from '@/react-app/components/InstallPrompt';
import type { UserProfile, Student, Anamnesis } from '@/shared/types';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [anamnesis, setAnamnesis] = useState<Anamnesis | null>(null);
  const [trainers, setTrainers] = useState<Array<{ user_id: string; name: string }>>([]);
  const [currentTrainer, setCurrentTrainer] = useState<{ user_id: string; name: string } | null>(null);
  const [showTrainerSelector, setShowTrainerSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        const profileResponse = await fetch('/api/profile');
        const profileData = await profileResponse.json();
        
        if (profileData.profile) {
          setProfile(profileData.profile);
          
          // If student, fetch additional data
          if (profileData.profile.user_type === 'student') {
            const [studentResponse, anamnesisResponse, trainersResponse] = await Promise.all([
              fetch('/api/student'),
              fetch('/api/anamnesis'),
              fetch('/api/trainers')
            ]);
            
            const studentData = await studentResponse.json();
            const anamnesisData = await anamnesisResponse.json();
            const trainersData = await trainersResponse.json();
            
            setStudent(studentData.student);
            setAnamnesis(anamnesisData.anamnesis);
            setTrainers(trainersData.trainers || []);
            
            // Find current trainer
            if (studentData.student?.trainer_id) {
              const trainer = trainersData.trainers?.find(
                (t: any) => t.user_id === studentData.student.trainer_id
              );
              setCurrentTrainer(trainer || null);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getNextMeasurementDays = () => {
    if (!student?.next_measurement_date) return null;
    const nextDate = new Date(student.next_measurement_date);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleTrainerSelection = async (trainerId: string) => {
    setUpdating(true);
    try {
      const response = await fetch('/api/update-trainer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trainer_id: trainerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update trainer');
      }

      // Update local state
      const selectedTrainer = trainers.find(t => t.user_id === trainerId);
      setCurrentTrainer(selectedTrainer || null);
      
      // Update student data
      if (student) {
        setStudent({ ...student, trainer_id: trainerId });
      }
      
      setShowTrainerSelector(false);
      alert('Treinador atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating trainer:', error);
      alert('Erro ao atualizar treinador. Tente novamente.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mx-auto mb-4">
            <BarChart3 className="w-12 h-12 text-indigo-600" />
          </div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">NutriTrack Pro</h1>
                <p className="text-sm text-gray-600">
                  Olá, {profile?.name || user?.google_user_data.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                {profile?.user_type === 'student' ? 'Aluno' : 'Treinador'}
              </span>
              <NotificationCenter />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {profile?.user_type === 'student' ? (
          // Student Dashboard
          <>
            {/* Trainer Status */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserPlus className="w-6 h-6 text-indigo-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Seu Treinador</h3>
                    <p className="text-sm text-gray-600">
                      {currentTrainer ? currentTrainer.name : 'Nenhum treinador selecionado'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTrainerSelector(true)}
                  className="flex items-center space-x-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-xl transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>{currentTrainer ? 'Alterar' : 'Selecionar'}</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Peso Atual</h3>
                  <Scale className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {student?.current_weight ? `${student.current_weight} kg` : 'Não registrado'}
                </p>
                {student?.initial_weight && student?.current_weight && (
                  <p className="text-sm text-gray-600 mt-1">
                    {student.current_weight > student.initial_weight ? '+' : ''}
                    {(student.current_weight - student.initial_weight).toFixed(1)} kg desde o início
                  </p>
                )}
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Próxima Medição</h3>
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {(() => {
                    const days = getNextMeasurementDays();
                    if (days === null) return 'Não agendada';
                    if (days <= 0) return 'Hoje!';
                    return `${days} dias`;
                  })()}
                </p>
                {student?.next_measurement_date && (
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(student.next_measurement_date).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Anamnese</h3>
                  <ClipboardList className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {anamnesis?.is_completed ? 'Completa' : 'Pendente'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {anamnesis?.is_completed ? 'Avaliação finalizada' : 'Complete sua avaliação'}
                </p>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              <button
                onClick={() => navigate('/anamnesis')}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Anamnese</h3>
                <p className="text-sm text-gray-600">
                  {anamnesis?.is_completed ? 'Visualizar anamnese' : 'Preencher questionário completo'}
                </p>
              </button>

              <button
                onClick={() => navigate('/measurements')}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Medidas</h3>
                <p className="text-sm text-gray-600">Registrar peso e medidas corporais</p>
              </button>

              <button
                onClick={() => navigate('/evolution')}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Evolução</h3>
                <p className="text-sm text-gray-600">Gráficos de progresso e histórico</p>
              </button>

              <button
                onClick={() => navigate('/diet')}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Apple className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Dieta</h3>
                <p className="text-sm text-gray-600">Visualizar plano alimentar prescrito</p>
              </button>

              <button
                onClick={() => navigate('/materials')}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Materiais</h3>
                <p className="text-sm text-gray-600">Consultar documentos educativos</p>
              </button>
            </div>
          </>
        ) : (
          // Trainer Dashboard
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => navigate('/students')}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all text-left group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Alunos</h3>
              <p className="text-sm text-gray-600">Gerenciar e acompanhar alunos</p>
            </button>

            <button
              onClick={() => navigate('/diet-plans')}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all text-left group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Planos Alimentares</h3>
              <p className="text-sm text-gray-600">Criar e gerenciar dietas</p>
            </button>

            <button
              onClick={() => navigate('/reports')}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all text-left group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Relatórios</h3>
              <p className="text-sm text-gray-600">Análises e exportação em PDF</p>
            </button>

            <button
              onClick={() => navigate('/materials')}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all text-left group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Materiais</h3>
              <p className="text-sm text-gray-600">Gerenciar documentos educativos</p>
            </button>
          </div>
        )}
      </div>

      {/* Install Prompt */}
      <InstallPrompt />

      {/* Trainer Selector Modal */}
      {showTrainerSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Selecionar Treinador</h2>
                <button
                  onClick={() => setShowTrainerSelector(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Escolha um treinador para acompanhar seu progresso
              </p>
            </div>

            <div className="p-6">
              {trainers.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum treinador disponível</h3>
                  <p className="text-gray-500">Não há treinadores cadastrados no sistema no momento.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {trainers.map((trainer) => (
                    <div
                      key={trainer.user_id}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        currentTrainer?.user_id === trainer.user_id
                          ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => handleTrainerSelection(trainer.user_id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{trainer.name}</h4>
                            <p className="text-sm opacity-70">Nutricionista</p>
                          </div>
                        </div>
                        {currentTrainer?.user_id === trainer.user_id && (
                          <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Option to remove trainer */}
                  <div
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      !currentTrainer
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => handleTrainerSelection('')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
                          <LogOut className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Remover Treinador</h4>
                          <p className="text-sm opacity-70">Continuar sem treinador</p>
                        </div>
                      </div>
                      {!currentTrainer && (
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {updating && (
                <div className="mt-6 text-center">
                  <div className="animate-spin mx-auto mb-2">
                    <Settings className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="text-gray-600">Atualizando...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
