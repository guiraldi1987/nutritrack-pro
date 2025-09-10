import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronLeft, 
  Users,
  Search,
  Plus,
  User,
  Scale,
  Calendar,
  Phone,
  Mail,
  BarChart3,
  Apple,
  ClipboardList
} from 'lucide-react';

export default function Students() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for now
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        const data = await response.json();
        setStudents(data.students || []);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mx-auto mb-4">
            <Users className="w-12 h-12 text-indigo-600" />
          </div>
          <p className="text-gray-600">Carregando alunos...</p>
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
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Meus Alunos</h1>
                <p className="text-sm text-gray-600">Gerencie e acompanhe seus alunos</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Adicionar Aluno</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 mb-6">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Buscar alunos por nome ou email..."
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                <p className="text-2xl font-bold text-gray-800">{students.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Com Anamnese</p>
                <p className="text-2xl font-bold text-gray-800">
                  {students.filter(s => s.has_anamnesis > 0).length}
                </p>
              </div>
              <ClipboardList className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Com Dieta Ativa</p>
                <p className="text-2xl font-bold text-gray-800">
                  {students.filter(s => s.active_diets > 0).length}
                </p>
              </div>
              <Apple className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ativos Este Mês</p>
                <p className="text-2xl font-bold text-gray-800">
                  {students.filter(s => s.last_measurement_date).length}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Lista de Alunos</h2>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {searchTerm ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Tente buscar com outros termos.'
                  : 'Comece adicionando seus primeiros alunos para acompanhar o progresso deles.'
                }
              </p>
              {!searchTerm && (
                <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all">
                  Adicionar Primeiro Aluno
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <div key={student.id} className="p-6 hover:bg-white/40 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                          <div className="flex space-x-2">
                            {student.has_anamnesis > 0 && (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                Anamnese ✓
                              </span>
                            )}
                            {student.active_diets > 0 && (
                              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                                Dieta Ativa
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                          {student.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>{student.email}</span>
                            </div>
                          )}
                          
                          {student.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4" />
                              <span>{student.phone}</span>
                            </div>
                          )}

                          {student.current_weight && (
                            <div className="flex items-center space-x-2">
                              <Scale className="w-4 h-4" />
                              <span>
                                {student.current_weight}kg 
                                {student.initial_weight && (
                                  <span className={`ml-1 ${
                                    student.current_weight < student.initial_weight 
                                      ? 'text-green-600' 
                                      : 'text-red-600'
                                  }`}>
                                    ({student.current_weight > student.initial_weight ? '+' : ''}
                                    {(student.current_weight - student.initial_weight).toFixed(1)}kg)
                                  </span>
                                )}
                              </span>
                            </div>
                          )}

                          {student.last_measurement_date && (
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>Última medição: {new Date(student.last_measurement_date).toLocaleDateString('pt-BR')}</span>
                            </div>
                          )}

                          <div className="flex items-center space-x-2 text-gray-500">
                            <BarChart3 className="w-4 h-4" />
                            <span>{student.measurement_count || 0} medições</span>
                          </div>
                        </div>

                        {!student.current_weight && (
                          <div className="mt-2 text-sm text-amber-600">
                            ⚠️ Nenhuma medição registrada
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => navigate(`/evolution?student=${student.user_id}`)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                        title="Ver evolução"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => navigate(`/diet-plans?student=${student.user_id}`)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                        title="Gerenciar dieta"
                      >
                        <Apple className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
