import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronLeft, 
  Apple,
  Plus,
  Users,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Save,
  X,
  FileText,
  Clock,
  Utensils,
  Droplets,
  Pill,
  AlertCircle
} from 'lucide-react';
import type { DietPlan } from '@/shared/types';

interface CreateDietForm {
  student_user_id: string;
  title: string;
  description: string;
  plan_content: string;
}

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

interface Student {
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
}

export default function DietPlans() {
  const navigate = useNavigate();
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);
  const [formData, setFormData] = useState<CreateDietForm>({
    student_user_id: '',
    title: '',
    description: '',
    plan_content: ''
  });
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [useStructuredForm, setUseStructuredForm] = useState(true);
  const [dietContent, setDietContent] = useState<DietContent>({
    meals: [
      {
        time: '07:00',
        name: 'Café da Manhã',
        foods: [''],
        instructions: '',
        calories: 0
      }
    ],
    totalCalories: 0,
    waterIntake: '2 litros por dia',
    supplements: [],
    observations: ''
  });
  
  // Check if managing specific student (from students page)
  const searchParams = new URLSearchParams(window.location.search);
  const studentId = searchParams.get('student');
  const isManagingStudent = !!studentId;

  useEffect(() => {
    const fetchDietPlans = async () => {
      try {
        let url = '/api/diet-plans';
        // If managing specific student, filter plans (could be implemented in backend)
        const response = await fetch(url);
        const data = await response.json();
        if (data.dietPlans) {
          let plans = data.dietPlans;
          // Filter by student if specified
          if (isManagingStudent) {
            plans = plans.filter((plan: DietPlan) => plan.student_user_id === studentId);
          }
          setDietPlans(plans);
        }
      } catch (error) {
        console.error('Error fetching diet plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDietPlans();
    
    // If managing specific student, pre-fill the form
    if (isManagingStudent) {
      setFormData(prev => ({ ...prev, student_user_id: studentId }));
    }
  }, [studentId, isManagingStudent]);

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
    if (!isManagingStudent) {
      fetchStudents();
    }
  };

  const handleCreatePlan = async () => {
    if (!formData.title || !formData.student_user_id) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validate structured form if using it
    if (useStructuredForm) {
      if (dietContent.meals.length === 0 || dietContent.meals.some(meal => !meal.name || !meal.time)) {
        alert('Por favor, preencha pelo menos uma refeição com nome e horário.');
        return;
      }

      // Clean up empty foods and calculate total calories
      const cleanedMeals = dietContent.meals.map(meal => ({
        ...meal,
        foods: meal.foods.filter(food => food.trim() !== ''),
      })).filter(meal => meal.foods.length > 0);

      const totalCalories = cleanedMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
      const cleanedSupplements = dietContent.supplements?.filter(sup => sup.trim() !== '') || [];

      const finalContent: DietContent = {
        meals: cleanedMeals,
        totalCalories: dietContent.totalCalories || totalCalories,
        waterIntake: dietContent.waterIntake,
        supplements: cleanedSupplements,
        observations: dietContent.observations
      };

      formData.plan_content = JSON.stringify(finalContent, null, 2);
    } else {
      if (!formData.plan_content) {
        alert('Por favor, preencha o conteúdo do plano.');
        return;
      }
    }

    setSaving(true);
    try {
      const response = await fetch('/api/diet-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create diet plan');
      }

      // Refresh the list
      const updatedResponse = await fetch('/api/diet-plans');
      const updatedData = await updatedResponse.json();
      if (updatedData.dietPlans) {
        setDietPlans(updatedData.dietPlans);
      }

      // Reset form
      setFormData({
        student_user_id: isManagingStudent ? studentId! : '',
        title: '',
        description: '',
        plan_content: ''
      });
      setDietContent({
        meals: [
          {
            time: '07:00',
            name: 'Café da Manhã',
            foods: [''],
            instructions: '',
            calories: 0
          }
        ],
        totalCalories: 0,
        waterIntake: '2 litros por dia',
        supplements: [],
        observations: ''
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating diet plan:', error);
      alert('Erro ao criar plano alimentar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const parsePlanContent = (content: string) => {
    try {
      return JSON.parse(content);
    } catch {
      return { meals: [], notes: content };
    }
  };

  const formatPlanPreview = (content: string) => {
    const parsed = parsePlanContent(content);
    if (parsed.meals && Array.isArray(parsed.meals) && parsed.meals.length > 0) {
      return `${parsed.meals.length} refeições planejadas`;
    }
    return content.substring(0, 100) + (content.length > 100 ? '...' : '');
  };

  // Structured Diet Form Component
  const StructuredDietForm = ({ 
    dietContent, 
    setDietContent 
  }: { 
    dietContent: DietContent; 
    setDietContent: React.Dispatch<React.SetStateAction<DietContent>>; 
  }) => {
    const addMeal = () => {
      setDietContent(prev => ({
        ...prev,
        meals: [
          ...prev.meals,
          {
            time: '12:00',
            name: '',
            foods: [''],
            instructions: '',
            calories: 0
          }
        ]
      }));
    };

    const removeMeal = (index: number) => {
      setDietContent(prev => ({
        ...prev,
        meals: prev.meals.filter((_, i) => i !== index)
      }));
    };

    const updateMeal = (index: number, field: keyof MealPlan, value: any) => {
      setDietContent(prev => ({
        ...prev,
        meals: prev.meals.map((meal, i) => 
          i === index ? { ...meal, [field]: value } : meal
        )
      }));
    };

    const addFood = (mealIndex: number) => {
      setDietContent(prev => ({
        ...prev,
        meals: prev.meals.map((meal, i) => 
          i === mealIndex 
            ? { ...meal, foods: [...meal.foods, ''] }
            : meal
        )
      }));
    };

    const removeFood = (mealIndex: number, foodIndex: number) => {
      setDietContent(prev => ({
        ...prev,
        meals: prev.meals.map((meal, i) => 
          i === mealIndex 
            ? { ...meal, foods: meal.foods.filter((_, fi) => fi !== foodIndex) }
            : meal
        )
      }));
    };

    const updateFood = (mealIndex: number, foodIndex: number, value: string) => {
      setDietContent(prev => ({
        ...prev,
        meals: prev.meals.map((meal, i) => 
          i === mealIndex 
            ? { ...meal, foods: meal.foods.map((food, fi) => fi === foodIndex ? value : food) }
            : meal
        )
      }));
    };

    const addSupplement = () => {
      setDietContent(prev => ({
        ...prev,
        supplements: [...(prev.supplements || []), '']
      }));
    };

    const removeSupplement = (index: number) => {
      setDietContent(prev => ({
        ...prev,
        supplements: prev.supplements?.filter((_, i) => i !== index) || []
      }));
    };

    const updateSupplement = (index: number, value: string) => {
      setDietContent(prev => ({
        ...prev,
        supplements: prev.supplements?.map((sup, i) => i === index ? value : sup) || []
      }));
    };

    return (
      <div className="space-y-8">
        {/* Meals Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Utensils className="w-5 h-5 text-green-600" />
              <span>Refeições</span>
            </h3>
            <button
              type="button"
              onClick={addMeal}
              className="flex items-center space-x-2 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Refeição</span>
            </button>
          </div>

          <div className="space-y-6">
            {dietContent.meals.map((meal, mealIndex) => (
              <div key={mealIndex} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-800">Refeição {mealIndex + 1}</h4>
                  {dietContent.meals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMeal(mealIndex)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Horário *
                    </label>
                    <input
                      type="time"
                      value={meal.time}
                      onChange={(e) => updateMeal(mealIndex, 'time', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Refeição *
                    </label>
                    <input
                      type="text"
                      value={meal.name}
                      onChange={(e) => updateMeal(mealIndex, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: Café da Manhã, Almoço, Jantar"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Alimentos *
                    </label>
                    <button
                      type="button"
                      onClick={() => addFood(mealIndex)}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      + Adicionar Alimento
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {meal.foods.map((food, foodIndex) => (
                      <div key={foodIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={food}
                          onChange={(e) => updateFood(mealIndex, foodIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Ex: 1 xícara de aveia, 200ml de leite"
                        />
                        {meal.foods.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFood(mealIndex, foodIndex)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instruções Especiais
                    </label>
                    <textarea
                      value={meal.instructions}
                      onChange={(e) => updateMeal(mealIndex, 'instructions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
                      placeholder="Ex: Tempere apenas com limão e azeite"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calorias (kcal)
                    </label>
                    <input
                      type="number"
                      value={meal.calories || ''}
                      onChange={(e) => updateMeal(mealIndex, 'calories', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: 350"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supplements Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Pill className="w-5 h-5 text-purple-600" />
              <span>Suplementos</span>
            </h3>
            <button
              type="button"
              onClick={addSupplement}
              className="flex items-center space-x-2 bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-lg transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Suplemento</span>
            </button>
          </div>

          <div className="space-y-2">
            {dietContent.supplements?.map((supplement, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={supplement}
                  onChange={(e) => updateSupplement(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Whey Protein (pós-treino), Vitamina D3"
                />
                <button
                  type="button"
                  onClick={() => removeSupplement(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Water Intake and Total Calories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Droplets className="w-4 h-4 inline mr-1 text-blue-500" />
              Ingestão de Água
            </label>
            <input
              type="text"
              value={dietContent.waterIntake}
              onChange={(e) => setDietContent(prev => ({ ...prev, waterIntake: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 2.5 litros por dia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calorias Totais (kcal)
            </label>
            <input
              type="number"
              value={dietContent.totalCalories || ''}
              onChange={(e) => setDietContent(prev => ({ ...prev, totalCalories: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Calculado automaticamente ou digite manualmente"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Soma automática: {dietContent.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0)} kcal
            </p>
          </div>
        </div>

        {/* Observations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <AlertCircle className="w-4 h-4 inline mr-1 text-amber-500" />
            Observações Importantes
          </label>
          <textarea
            value={dietContent.observations}
            onChange={(e) => setDietContent(prev => ({ ...prev, observations: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            rows={4}
            placeholder="Ex: Evite açúcar refinado e alimentos processados. Faça as refeições nos horários indicados."
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mx-auto mb-4">
            <Apple className="w-12 h-12 text-indigo-600" />
          </div>
          <p className="text-gray-600">Carregando planos alimentares...</p>
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
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Planos Alimentares</h1>
                <p className="text-sm text-gray-600">
                  {isManagingStudent ? `Gerenciar dietas do aluno ${studentId}` : 'Gerencie dietas dos seus alunos'}
                </p>
              </div>
            </div>
            <button
              onClick={handleShowCreateForm}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Plano</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Criar Novo Plano Alimentar</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecionar Aluno *
                  </label>
                  {isManagingStudent ? (
                    <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
                      <span className="text-gray-700">
                        Aluno selecionado: {studentId}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">Aluno pré-selecionado da página anterior</p>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <Users className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <select
                          value={formData.student_user_id}
                          onChange={(e) => setFormData(prev => ({ ...prev, student_user_id: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                          disabled={loadingStudents}
                        >
                          <option value="">
                            {loadingStudents ? 'Carregando alunos...' : 'Selecione um aluno'}
                          </option>
                          {students.map(student => (
                            <option key={student.user_id} value={student.user_id}>
                              {student.name} ({student.user_id})
                              {student.email && ` - ${student.email}`}
                            </option>
                          ))}
                        </select>
                      </div>
                      {students.length === 0 && !loadingStudents && (
                        <p className="text-sm text-amber-600 mt-1">
                          ⚠️ Nenhum aluno encontrado. Certifique-se de ter alunos vinculados a você.
                        </p>
                      )}
                      {students.length > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          Escolha o aluno para quem você quer criar o plano alimentar
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Plano *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Plano de Emagrecimento - Janeiro 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Descrição opcional do plano..."
                  />
                </div>

                {/* Form Type Selector */}
                <div className="mb-6">
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setUseStructuredForm(true)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 ${
                        useStructuredForm
                          ? 'bg-white text-green-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Formulário Estruturado
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseStructuredForm(false)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 ${
                        !useStructuredForm
                          ? 'bg-white text-green-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Texto Livre
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {useStructuredForm 
                      ? 'Use o formulário guiado para criar uma dieta estruturada'
                      : 'Digite o conteúdo da dieta em formato livre'
                    }
                  </p>
                </div>

                {useStructuredForm ? (
                  <StructuredDietForm 
                    dietContent={dietContent}
                    setDietContent={setDietContent}
                  />
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conteúdo do Plano *
                    </label>
                    <div className="mb-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-sm text-blue-700">
                        <strong>Dica:</strong> Você pode escrever em formato livre ou usar JSON estruturado.
                      </p>
                    </div>
                    <textarea
                      value={formData.plan_content}
                      onChange={(e) => setFormData(prev => ({ ...prev, plan_content: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                      rows={10}
                      placeholder={`Exemplo:

CAFÉ DA MANHÃ (07:00)
- 1 xícara de aveia com leite desnatado
- 1 banana média
- 1 colher de sopa de mel

LANCHE DA MANHÃ (10:00)
- 1 iogurte grego natural
- 1 punhado de castanhas

ALMOÇO (12:30)
- 150g de peito de frango grelhado
- 1 xícara de arroz integral
- Salada verde à vontade`}
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreatePlan}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Salvando...' : 'Criar Plano'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plan Details Modal */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedPlan.title}</h2>
                    <p className="text-gray-600">{selectedPlan.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {selectedPlan.plan_content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Planos</p>
                <p className="text-2xl font-bold text-gray-800">{dietPlans.length}</p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Planos Ativos</p>
                <p className="text-2xl font-bold text-gray-800">
                  {dietPlans.filter(plan => plan.is_active).length}
                </p>
              </div>
              <Apple className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alunos Atendidos</p>
                <p className="text-2xl font-bold text-gray-800">
                  {new Set(dietPlans.map(plan => plan.student_user_id)).size}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Este Mês</p>
                <p className="text-2xl font-bold text-gray-800">
                  {dietPlans.filter(plan => {
                    const planDate = new Date(plan.created_at);
                    const now = new Date();
                    return planDate.getMonth() === now.getMonth() && 
                           planDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Diet Plans List */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {isManagingStudent ? 'Planos do Aluno' : 'Planos Alimentares Criados'}
              </h2>
              {isManagingStudent && (
                <button
                  onClick={() => navigate('/students')}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  ← Voltar para alunos
                </button>
              )}
            </div>
          </div>

          {dietPlans.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Apple className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {isManagingStudent ? 'Nenhum plano criado para este aluno' : 'Nenhum plano criado ainda'}
              </h3>
              <p className="text-gray-600 mb-6">
                {isManagingStudent 
                  ? 'Crie o primeiro plano alimentar para este aluno.' 
                  : 'Comece criando um plano alimentar para seus alunos.'
                }
              </p>
              <button
                onClick={handleShowCreateForm}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                {isManagingStudent ? 'Criar Plano para Aluno' : 'Criar Primeiro Plano'}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {dietPlans.map((plan) => (
                <div key={plan.id} className="p-6 hover:bg-white/40 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{plan.title}</h3>
                        {plan.is_active && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                            Ativo
                          </span>
                        )}
                      </div>
                      
                      {plan.description && (
                        <p className="text-gray-600 mb-3">{plan.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>
                            Aluno: {students.find(s => s.user_id === plan.student_user_id)?.name || plan.student_user_id}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(plan.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{formatPlanPreview(plan.plan_content)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedPlan(plan)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Visualizar plano"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar plano"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir plano"
                      >
                        <Trash2 className="w-4 h-4" />
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
