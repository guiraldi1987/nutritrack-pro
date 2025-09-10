import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronLeft, 
  TrendingUp, 
  Scale, 
  Calendar,
  Target,
  Zap,
  Activity,
  BarChart3,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import type { BodyMeasurement, Anamnesis } from '@/shared/types';

interface ProgressData {
  date: string;
  weight?: number;
  waist?: number;
  rightArm?: number;
  leftArm?: number;
  thigh?: number;
  hip?: number;
}

interface ProgressInsights {
  weightChange: number;
  waistChange: number;
  armChange: number;
  totalMeasurements: number;
  daysTracking: number;
  averageWeightLoss: number;
  consistency: number;
}



export default function EvolutionPage() {
  const navigate = useNavigate();
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [anamnesis, setAnamnesis] = useState<Anamnesis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'measurements'>('weight');
  const [expandedInsights, setExpandedInsights] = useState(false);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [insights, setInsights] = useState<ProgressInsights | null>(null);
  
  // Check if viewing specific student (for trainers)
  const searchParams = new URLSearchParams(window.location.search);
  const studentId = searchParams.get('student');
  const isViewingStudent = !!studentId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let measurementsUrl = '/api/measurements';
        let anamnesisUrl = '/api/anamnesis';
        
        // If viewing specific student, modify URLs (for future implementation)
        if (isViewingStudent) {
          measurementsUrl += `?student=${studentId}`;
          anamnesisUrl += `?student=${studentId}`;
        }
        
        const [measurementsResponse, anamnesisResponse] = await Promise.all([
          fetch(measurementsUrl),
          fetch(anamnesisUrl)
        ]);
        
        const measurementsData = await measurementsResponse.json();
        const anamnesisData = await anamnesisResponse.json();
        
        setMeasurements(measurementsData.measurements || []);
        setAnamnesis(anamnesisData.anamnesis);
        
        // Process data for charts
        const processedData = processDataForCharts(measurementsData.measurements || []);
        setProgressData(processedData);
        
        // Calculate insights
        const calculatedInsights = calculateInsights(measurementsData.measurements || []);
        setInsights(calculatedInsights);
      } catch (error) {
        console.error('Error fetching evolution data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId, isViewingStudent]);

  const processDataForCharts = (measurements: BodyMeasurement[]): ProgressData[] => {
    return measurements
      .sort((a, b) => new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime())
      .map(measurement => ({
        date: new Date(measurement.measurement_date).toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        }),
        weight: measurement.weight,
        waist: measurement.waist_circumference,
        rightArm: measurement.right_arm_contracted,
        leftArm: measurement.left_arm_contracted,
        thigh: measurement.thigh_midpoint,
        hip: measurement.hip_circumference,
      }));
  };

  const calculateInsights = (measurements: BodyMeasurement[]): ProgressInsights | null => {
    if (measurements.length < 2) return null;

    const sorted = [...measurements].sort((a, b) => 
      new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime()
    );

    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    
    const firstDate = new Date(first.measurement_date);
    const lastDate = new Date(last.measurement_date);
    const daysTracking = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));

    const weightChange = (last.weight || 0) - (first.weight || 0);
    const waistChange = (last.waist_circumference || 0) - (first.waist_circumference || 0);
    const armChange = Math.max(
      (last.right_arm_contracted || 0) - (first.right_arm_contracted || 0),
      (last.left_arm_contracted || 0) - (first.left_arm_contracted || 0)
    );

    const averageWeightLoss = daysTracking > 0 ? (weightChange / daysTracking) * 7 : 0; // per week
    const consistency = (measurements.length / Math.max(daysTracking / 7, 1)) * 100; // percentage

    return {
      weightChange,
      waistChange,
      armChange,
      totalMeasurements: measurements.length,
      daysTracking,
      averageWeightLoss,
      consistency: Math.min(consistency, 100),
    };
  };

  const getGoalProgress = () => {
    if (!anamnesis?.body_goals || !insights) return null;
    
    const weightLossGoal = anamnesis.body_goals.toLowerCase().includes('perder') ||
                          anamnesis.body_goals.toLowerCase().includes('emagr');
    const muscleGainGoal = anamnesis.body_goals.toLowerCase().includes('ganhar') ||
                          anamnesis.body_goals.toLowerCase().includes('músculo');

    let progress = 0;
    let goalText = '';

    if (weightLossGoal && insights.weightChange < 0) {
      progress = Math.min(Math.abs(insights.weightChange) * 10, 100);
      goalText = `Perdendo peso: ${Math.abs(insights.weightChange).toFixed(1)}kg`;
    } else if (muscleGainGoal && insights.armChange > 0) {
      progress = Math.min(insights.armChange * 20, 100);
      goalText = `Ganhando massa: +${insights.armChange.toFixed(1)}cm braço`;
    } else {
      progress = insights.consistency;
      goalText = `Consistência: ${insights.consistency.toFixed(0)}%`;
    }

    return { progress, goalText };
  };

  const MetricCard = ({ title, value, unit, change, icon: Icon, color }: {
    title: string;
    value: number | undefined;
    unit: string;
    change?: number;
    icon: any;
    color: string;
  }) => (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        {change !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            change > 0 ? 'text-green-700 bg-green-100' : 
            change < 0 ? 'text-red-700 bg-red-100' : 
            'text-gray-700 bg-gray-100'
          }`}>
            {change > 0 ? '+' : ''}{change.toFixed(1)}{unit}
          </span>
        )}
      </div>
      <div className="text-lg font-bold text-gray-800">
        {value ? `${value.toFixed(1)}${unit}` : 'N/A'}
      </div>
      <div className="text-xs text-gray-600">{title}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mx-auto mb-4">
            <TrendingUp className="w-12 h-12 text-indigo-600" />
          </div>
          <p className="text-gray-600">Carregando evolução...</p>
        </div>
      </div>
    );
  }

  if (measurements.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Evolução</h1>
                <p className="text-sm text-gray-600">Acompanhe seu progresso</p>
              </div>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhuma medição encontrada</h3>
            <p className="text-gray-500 mb-6">Registre suas medidas para ver sua evolução aqui.</p>
            <button
              onClick={() => navigate('/measurements')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Registrar Primeira Medição
            </button>
          </div>
        </div>
      </div>
    );
  }

  const goalProgress = getGoalProgress();
  const latestMeasurement = measurements[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Evolução</h1>
              <p className="text-sm text-gray-600">Seu progresso detalhado</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Goal Progress Card */}
        {goalProgress && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Progresso da Meta</h3>
              <Target className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{goalProgress.goalText}</span>
                <span>{goalProgress.progress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(goalProgress.progress, 100)}%` }}
                ></div>
              </div>
            </div>
            {anamnesis?.body_goals && (
              <p className="text-sm text-gray-600">Meta: {anamnesis.body_goals}</p>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Peso Atual"
            value={latestMeasurement.weight}
            unit="kg"
            change={insights?.weightChange}
            icon={Scale}
            color="bg-gradient-to-r from-blue-500 to-cyan-500"
          />
          <MetricCard
            title="Cintura"
            value={latestMeasurement.waist_circumference}
            unit="cm"
            change={insights?.waistChange}
            icon={Activity}
            color="bg-gradient-to-r from-green-500 to-emerald-500"
          />
          <MetricCard
            title="Braço Direito"
            value={latestMeasurement.right_arm_contracted}
            unit="cm"
            change={insights?.armChange}
            icon={Zap}
            color="bg-gradient-to-r from-purple-500 to-pink-500"
          />
          <MetricCard
            title="Medições"
            value={measurements.length}
            unit=""
            icon={Calendar}
            color="bg-gradient-to-r from-orange-500 to-red-500"
          />
        </div>

        {/* Insights Card */}
        {insights && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden">
            <button
              onClick={() => setExpandedInsights(!expandedInsights)}
              className="w-full p-6 flex items-center justify-between hover:bg-white/60 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Info className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">Insights do Progresso</h3>
              </div>
              {expandedInsights ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {expandedInsights && (
              <div className="px-6 pb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Perda de Peso Semanal</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {insights.averageWeightLoss > 0 ? '+' : ''}{insights.averageWeightLoss.toFixed(2)}kg
                    </p>
                    <p className="text-sm text-gray-600">por semana em média</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Consistência</h4>
                    <p className="text-2xl font-bold text-green-600">{insights.consistency.toFixed(0)}%</p>
                    <p className="text-sm text-gray-600">de frequência de medições</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Dias Acompanhando</h4>
                    <p className="text-2xl font-bold text-purple-600">{insights.daysTracking}</p>
                    <p className="text-sm text-gray-600">dias de progresso</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Total de Medições</h4>
                    <p className="text-2xl font-bold text-orange-600">{insights.totalMeasurements}</p>
                    <p className="text-sm text-gray-600">registros salvos</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chart Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Gráficos de Evolução</h3>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setSelectedMetric('weight')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedMetric === 'weight'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Peso
              </button>
              <button
                onClick={() => setSelectedMetric('measurements')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedMetric === 'measurements'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Medidas
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {selectedMetric === 'weight' ? (
                <AreaChart data={progressData}>
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
                    labelFormatter={(value) => `Data: ${value}`}
                    formatter={(value: any) => [
                      `${value?.toFixed(1)}kg`,
                      'Peso'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#6366f1" 
                    fill="url(#weightGradient)"
                    strokeWidth={2}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                  />
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              ) : (
                <LineChart data={progressData}>
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
                    dataKey="waist" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                    name="Cintura"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rightArm" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                    name="Braço D."
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hip" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                    name="Quadril"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Measurement History */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Histórico Detalhado</h3>
          <div className="space-y-3">
            {measurements.slice(0, 5).map((measurement, index) => (
              <div key={measurement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    index === 0 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-300'
                  }`}>
                    <Calendar className={`w-5 h-5 ${index === 0 ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {new Date(measurement.measurement_date).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {index === 0 ? 'Medição mais recente' : `${index + 1}ª medição`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    {measurement.weight ? `${measurement.weight}kg` : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {measurement.waist_circumference ? `${measurement.waist_circumference}cm cintura` : ''}
                  </p>
                </div>
              </div>
            ))}
            
            {measurements.length > 5 && !isViewingStudent && (
              <button
                onClick={() => navigate('/measurements')}
                className="w-full p-4 text-center text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Ver todas as {measurements.length} medições
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {!isViewingStudent && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/measurements')}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              <Scale className="w-5 h-5" />
              <span>Nova Medição</span>
            </button>
            
            <button
              onClick={() => navigate('/anamnesis')}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Atualizar Metas</span>
            </button>
          </div>
        )}
        
        {isViewingStudent && (
          <div className="text-center">
            <button
              onClick={() => navigate('/students')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              Voltar para Lista de Alunos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
