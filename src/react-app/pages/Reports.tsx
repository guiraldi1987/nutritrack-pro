import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronLeft, 
  BarChart3,
  Users,
  Download,
  Calendar,
  Target,
  Scale,
  TrendingUp,
  Search
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface StudentReport {
  id: string;
  name: string;
  email: string;
  currentWeight?: number;
  initialWeight?: number;
  totalMeasurements: number;
  lastMeasurement?: string;
  hasAnamnesis: boolean;
  activeDiet: boolean;
  weightLoss?: number;
  progress: number;
}

interface ReportData {
  date: string;
  weight?: number;
  waist?: number;
}

export default function Reports() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [reportType, setReportType] = useState<'overview' | 'individual'>('overview');

  // Mock data - In a real app, this would come from the API
  const mockStudents: StudentReport[] = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@example.com',
      currentWeight: 75.2,
      initialWeight: 80.0,
      totalMeasurements: 8,
      lastMeasurement: '2025-01-05',
      hasAnamnesis: true,
      activeDiet: true,
      weightLoss: -4.8,
      progress: 85,
    },
    {
      id: '2', 
      name: 'Maria Santos',
      email: 'maria@example.com',
      currentWeight: 62.5,
      initialWeight: 65.0,
      totalMeasurements: 6,
      lastMeasurement: '2025-01-03',
      hasAnamnesis: true,
      activeDiet: false,
      weightLoss: -2.5,
      progress: 70,
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro@example.com',
      currentWeight: 78.5,
      initialWeight: 82.0,
      totalMeasurements: 4,
      lastMeasurement: '2025-01-01',
      hasAnamnesis: false,
      activeDiet: false,
      weightLoss: -3.5,
      progress: 40,
    },
  ];

  // Mock chart data
  const mockChartData: ReportData[] = [
    { date: '01/12', weight: 80.0, waist: 85 },
    { date: '08/12', weight: 79.2, waist: 84 },
    { date: '15/12', weight: 78.5, waist: 83 },
    { date: '22/12', weight: 77.8, waist: 82 },
    { date: '29/12', weight: 76.9, waist: 81 },
    { date: '05/01', weight: 75.2, waist: 80 },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDFReport = (student?: StudentReport) => {
    // In a real app, this would generate and download a PDF report
    const reportName = student ? `relatorio-${student.name.replace(' ', '-').toLowerCase()}` : 'relatorio-geral';
    alert(`Gerando relatório PDF: ${reportName}.pdf`);
  };

  const getSelectedStudentData = () => {
    return mockStudents.find(s => s.id === selectedStudent);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mx-auto mb-4">
            <BarChart3 className="w-12 h-12 text-indigo-600" />
          </div>
          <p className="text-gray-600">Carregando relatórios...</p>
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
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Relatórios</h1>
                <p className="text-sm text-gray-600">Análises detalhadas e exportação</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => generatePDFReport()}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Report Type Selector */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setReportType('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  reportType === 'overview'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => setReportType('individual')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  reportType === 'individual'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Por Aluno
              </button>
            </div>

            {reportType === 'individual' && (
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder="Buscar aluno..."
                />
              </div>
            )}
          </div>
        </div>

        {reportType === 'overview' ? (
          // Overview Report
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                    <p className="text-2xl font-bold text-gray-800">{mockStudents.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ativos Este Mês</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {mockStudents.filter(s => s.lastMeasurement).length}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Perda Média</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {(mockStudents.reduce((acc, s) => acc + (s.weightLoss || 0), 0) / mockStudents.length).toFixed(1)}kg
                    </p>
                  </div>
                  <Scale className="w-8 h-8 text-orange-500" />
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {Math.round(mockStudents.reduce((acc, s) => acc + s.progress, 0) / mockStudents.length)}%
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Progresso Geral dos Alunos</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockStudents}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280"
                      fontSize={12}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Bar dataKey="progress" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Students Summary Table */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">Resumo dos Alunos</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {mockStudents.map((student) => (
                  <div key={student.id} className="p-6 hover:bg-white/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-800">{student.name}</h4>
                          <div className="flex space-x-2">
                            {student.hasAnamnesis && (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                Anamnese ✓
                              </span>
                            )}
                            {student.activeDiet && (
                              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                                Dieta Ativa
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="text-gray-500">Peso atual:</span>
                            <span className="ml-1 font-medium">{student.currentWeight}kg</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Perda:</span>
                            <span className={`ml-1 font-medium ${student.weightLoss && student.weightLoss < 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {student.weightLoss}kg
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Medições:</span>
                            <span className="ml-1 font-medium">{student.totalMeasurements}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Progresso:</span>
                            <span className="ml-1 font-medium">{student.progress}%</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => generatePDFReport(student)}
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Gerar relatório individual"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Individual Report
          <>
            {/* Student Selector */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Selecionar Aluno</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedStudent === student.id
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <h4 className="font-semibold">{student.name}</h4>
                    <p className="text-sm opacity-70">{student.email}</p>
                    {student.weightLoss && (
                      <p className={`text-sm font-medium mt-1 ${
                        student.weightLoss < 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {student.weightLoss}kg
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {selectedStudent && getSelectedStudentData() && (
              <>
                {/* Individual Student Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Peso Atual</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {getSelectedStudentData()?.currentWeight}kg
                        </p>
                      </div>
                      <Scale className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Perda Total</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {getSelectedStudentData()?.weightLoss}kg
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Medições</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {getSelectedStudentData()?.totalMeasurements}
                        </p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Progresso</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {getSelectedStudentData()?.progress}%
                        </p>
                      </div>
                      <Target className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                </div>

                {/* Individual Chart */}
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      Evolução - {getSelectedStudentData()?.name}
                    </h3>
                    <button
                      onClick={() => generatePDFReport(getSelectedStudentData())}
                      className="flex items-center space-x-2 bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-xl transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Exportar PDF</span>
                    </button>
                  </div>
                  
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#6b7280"
                          fontSize={12}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#6b7280"
                          fontSize={12}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="#6366f1" 
                          strokeWidth={3}
                          dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                          name="Peso"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="waist" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                          name="Cintura"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
