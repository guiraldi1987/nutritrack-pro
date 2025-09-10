import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronLeft, 
  Apple,
  Calendar,
  Clock,
  ChefHat,
  Utensils,
  Droplets,
  AlertCircle,
  Pill
} from 'lucide-react';
import type { DietPlan } from '@/shared/types';

interface MealPlan {
  time: string;
  name: string;
  foods: string[];
  instructions?: string;
  calories?: number;
}

interface DietContent {
  meals: MealPlan[];
  totalCalories?: number;
  waterIntake?: string;
  supplements?: string[];
  observations?: string;
}

export default function Diet() {
  const navigate = useNavigate();
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [activeDiet, setActiveDiet] = useState<DietPlan | null>(null);
  const [dietContent, setDietContent] = useState<DietContent | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDietPlans = async () => {
      try {
        const response = await fetch('/api/diet-plans');
        const data = await response.json();
        
        const plans = data.dietPlans || [];
        setDietPlans(plans);
        
        // Get the active diet plan (most recent active one)
        const active = plans.find((plan: DietPlan) => plan.is_active) || plans[0];
        setActiveDiet(active);
        
        // Parse diet content if available
        if (active?.plan_content) {
          try {
            const content = JSON.parse(active.plan_content);
            setDietContent(content);
          } catch (error) {
            console.error('Error parsing diet content:', error);
            // Fallback to sample content
            setDietContent({
              meals: [
                {
                  time: '07:00',
                  name: 'Café da Manhã',
                  foods: ['1 xícara de aveia', '1 banana', '200ml de leite desnatado', '1 col. sopa de mel'],
                  calories: 350
                },
                {
                  time: '10:00',
                  name: 'Lanche da Manhã',
                  foods: ['1 maçã', '10 castanhas'],
                  calories: 180
                },
                {
                  time: '12:30',
                  name: 'Almoço',
                  foods: ['150g de frango grelhado', '1 xíc. de arroz integral', '1 xíc. de feijão', 'Salada verde à vontade'],
                  instructions: 'Tempere a salada apenas com limão e azeite',
                  calories: 520
                },
                {
                  time: '15:30',
                  name: 'Lanche da Tarde',
                  foods: ['1 iogurte grego natural', '1 col. sopa de granola'],
                  calories: 150
                },
                {
                  time: '19:00',
                  name: 'Jantar',
                  foods: ['120g de salmão', 'Batata doce assada (150g)', 'Legumes refogados'],
                  calories: 450
                },
                {
                  time: '21:30',
                  name: 'Ceia',
                  foods: ['1 xíc. de chá de camomila', '2 castanhas do pará'],
                  calories: 80
                }
              ],
              totalCalories: 1730,
              waterIntake: '2.5 litros por dia',
              supplements: ['Whey Protein (pós-treino)', 'Vitamina D3', 'Ômega 3'],
              observations: 'Evite açúcar refinado e alimentos processados. Faça as refeições nos horários indicados.'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching diet plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDietPlans();
  }, []);

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return time;
    }
  };

  const getMealIcon = (mealName: string) => {
    const name = mealName.toLowerCase();
    if (name.includes('café') || name.includes('manhã')) return '🌅';
    if (name.includes('almoço')) return '🍽️';
    if (name.includes('lanche')) return '🍎';
    if (name.includes('jantar')) return '🌃';
    if (name.includes('ceia')) return '🌙';
    return '🍽️';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mx-auto mb-4">
            <Apple className="w-12 h-12 text-indigo-600" />
          </div>
          <p className="text-gray-600">Carregando plano alimentar...</p>
        </div>
      </div>
    );
  }

  if (!activeDiet) {
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
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Dieta Prescrita</h1>
                <p className="text-sm text-gray-600">Seu plano alimentar personalizado</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhuma dieta prescrita</h3>
            <p className="text-gray-500 mb-6">Seu treinador ainda não criou um plano alimentar para você.</p>
            <p className="text-sm text-gray-400">Entre em contato para solicitar sua dieta personalizada.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Apple className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Dieta Prescrita</h1>
              <p className="text-sm text-gray-600">Seu plano alimentar personalizado</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Diet Plan Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{activeDiet.title}</h2>
              {activeDiet.description && (
                <p className="text-gray-600 mb-4">{activeDiet.description}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Criado em {new Date(activeDiet.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                {activeDiet.is_active && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    Ativo
                  </span>
                )}
              </div>
            </div>
            
            {dietContent?.totalCalories && (
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-600">{dietContent.totalCalories}</div>
                <div className="text-sm text-gray-600">kcal/dia</div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Info Cards */}
        {dietContent && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <Utensils className="w-8 h-8 text-orange-500" />
                <div>
                  <div className="text-lg font-semibold text-gray-800">{dietContent.meals.length}</div>
                  <div className="text-sm text-gray-600">Refeições</div>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <Droplets className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-lg font-semibold text-gray-800">
                    {dietContent.waterIntake?.replace(' por dia', '') || '2L'}
                  </div>
                  <div className="text-sm text-gray-600">Água/dia</div>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <Pill className="w-8 h-8 text-purple-500" />
                <div>
                  <div className="text-lg font-semibold text-gray-800">
                    {dietContent.supplements?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Suplementos</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meals Schedule */}
        {dietContent && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Cronograma de Refeições</h3>
            
            <div className="space-y-4">
              {dietContent.meals.map((meal, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getMealIcon(meal.name)}</div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{meal.name}</h4>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{formatTime(meal.time)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {meal.calories && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-600">{meal.calories}</div>
                        <div className="text-xs text-gray-500">kcal</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700">Alimentos:</h5>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {meal.foods.map((food, foodIndex) => (
                        <li key={foodIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0" />
                          <span className="text-sm text-gray-700">{food}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {meal.instructions && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800">{meal.instructions}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Supplements */}
        {dietContent?.supplements && dietContent.supplements.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Suplementação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {dietContent.supplements.map((supplement, index) => (
                <div key={index} className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <span className="text-sm font-medium text-purple-800">{supplement}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Water Intake & Observations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dietContent?.waterIntake && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Hidratação</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-600">{dietContent.waterIntake}</p>
                  <p className="text-sm text-gray-600">Distribua ao longo do dia</p>
                </div>
              </div>
            </div>
          )}

          {dietContent?.observations && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Observações</h3>
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800">{dietContent.observations}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Multiple Diet Plans */}
        {dietPlans.length > 1 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Outros Planos Disponíveis</h3>
            <div className="space-y-3">
              {dietPlans
                .filter(plan => plan.id !== activeDiet.id)
                .map((plan) => (
                  <div key={plan.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">{plan.title}</h4>
                      <p className="text-sm text-gray-600">
                        Criado em {new Date(plan.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        plan.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {plan.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
