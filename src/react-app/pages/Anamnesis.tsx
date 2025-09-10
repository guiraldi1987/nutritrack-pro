import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, Save, ClipboardList, User, Clock, Dumbbell, Pill, Apple, Brain, Moon, Stethoscope } from 'lucide-react';
import FileUpload from '@/react-app/components/FileUpload';
import { useNotifications } from '@/react-app/hooks/useNotifications';
import type { Anamnesis, UpdateAnamnesisInput } from '@/shared/types';

const sections = [
  { id: 'general', title: 'A. Informações Gerais', icon: User },
  { id: 'routine', title: 'B. Rotina e Objetivos', icon: Clock },
  { id: 'training', title: 'C. Treinamento', icon: Dumbbell },
  { id: 'substances', title: 'D. Substâncias', icon: Pill },
  { id: 'diet', title: 'E. Dieta Atual', icon: Apple },
  { id: 'neurological', title: 'F. Aspectos Neurológicos', icon: Brain },
  { id: 'sleep', title: 'G. Descanso e Sono', icon: Moon },
  { id: 'clinical', title: 'H. Histórico Clínico', icon: Stethoscope },
];

export default function Anamnesis() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [anamnesis, setAnamnesis] = useState<Anamnesis | null>(null);
  const [formData, setFormData] = useState<UpdateAnamnesisInput>({});

  useEffect(() => {
    const fetchAnamnesis = async () => {
      try {
        const response = await fetch('/api/anamnesis');
        const data = await response.json();
        
        if (data.anamnesis) {
          setAnamnesis(data.anamnesis);
          setFormData(data.anamnesis);
        }
      } catch (error) {
        console.error('Error fetching anamnesis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnamnesis();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (markCompleted = false) => {
    setSaving(true);

    try {
      const dataToSave = {
        ...formData,
        is_completed: markCompleted || formData.is_completed,
      };

      const response = await fetch('/api/anamnesis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        throw new Error('Failed to save anamnesis');
      }

      if (markCompleted) {
        addNotification({
          title: 'Anamnese Concluída!',
          message: 'Sua anamnese foi finalizada com sucesso. Agora você pode registrar suas medidas.',
          type: 'info',
          actionUrl: '/measurements'
        });
        navigate('/dashboard');
      } else {
        addNotification({
          title: 'Progresso Salvo',
          message: 'Suas informações foram salvas. Continue quando quiser.',
          type: 'info'
        });
      }
    } catch (error) {
      console.error('Error saving anamnesis:', error);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderSection = () => {
    const section = sections[currentSection];
    
    switch (section.id) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idade</label>
                <input
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 25"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <input
                  type="text"
                  value={formData.state || ''}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: São Paulo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: São Paulo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                <input
                  type="tel"
                  value={formData.whatsapp || ''}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Massa Magra (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.lean_weight || ''}
                  onChange={(e) => handleInputChange('lean_weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 60.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">% Gordura Corporal</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.body_fat_percentage || ''}
                  onChange={(e) => handleInputChange('body_fat_percentage', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 15.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cintura (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.waist_circumference || ''}
                  onChange={(e) => handleInputChange('waist_circumference', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 80.0"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Braço Direito Contraído (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.right_arm_contracted || ''}
                  onChange={(e) => handleInputChange('right_arm_contracted', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 35.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Braço Direito Relaxado (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.right_arm_relaxed || ''}
                  onChange={(e) => handleInputChange('right_arm_relaxed', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 33.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Braço Esquerdo Contraído (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.left_arm_contracted || ''}
                  onChange={(e) => handleInputChange('left_arm_contracted', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 35.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Braço Esquerdo Relaxado (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.left_arm_relaxed || ''}
                  onChange={(e) => handleInputChange('left_arm_relaxed', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 32.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Coxa (ponto médio) (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.thigh_midpoint || ''}
                  onChange={(e) => handleInputChange('thigh_midpoint', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 55.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quadril (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.hip_circumference || ''}
                  onChange={(e) => handleInputChange('hip_circumference', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 95.0"
                />
              </div>
            </div>
          </div>
        );

      case 'routine':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profissão</label>
              <input
                type="text"
                value={formData.profession || ''}
                onChange={(e) => handleInputChange('profession', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Desenvolvedor"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Trabalho</label>
                <input
                  type="text"
                  value={formData.work_schedule || ''}
                  onChange={(e) => handleInputChange('work_schedule', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 8h às 17h"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Estudos</label>
                <input
                  type="text"
                  value={formData.studies_schedule || ''}
                  onChange={(e) => handleInputChange('studies_schedule', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 19h às 22h"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Atividades Físicas Atuais</label>
              <textarea
                value={formData.physical_activities || ''}
                onChange={(e) => handleInputChange('physical_activities', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descreva suas atividades físicas atuais..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Atividades</label>
                <input
                  type="text"
                  value={formData.activity_schedule || ''}
                  onChange={(e) => handleInputChange('activity_schedule', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 6h às 7h"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Sono</label>
                <input
                  type="text"
                  value={formData.sleep_schedule || ''}
                  onChange={(e) => handleInputChange('sleep_schedule', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 23h às 6h"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Acordar</label>
                <input
                  type="text"
                  value={formData.wake_schedule || ''}
                  onChange={(e) => handleInputChange('wake_schedule', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 6h"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Objetivos Corporais</label>
              <textarea
                value={formData.body_goals || ''}
                onChange={(e) => handleInputChange('body_goals', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descreva seus objetivos corporais..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Objetivos da Consultoria</label>
              <textarea
                value={formData.consultation_goals || ''}
                onChange={(e) => handleInputChange('consultation_goals', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="O que você espera desta consultoria..."
              />
            </div>

            <FileUpload
              label="Foto do Corpo Desejado (Opcional)"
              description="Foto de referência do seu objetivo corporal"
              acceptedTypes={['image/*']}
              maxSizeMB={5}
              currentFile={formData.desired_body_photo_url}
              onFileUpload={(url, _fileName) => handleInputChange('desired_body_photo_url', url)}
            />
          </div>
        );

      case 'training':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Há quanto tempo não faz pausa no treino?</label>
              <input
                type="text"
                value={formData.no_rest_duration || ''}
                onChange={(e) => handleInputChange('no_rest_duration', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 6 meses, 1 ano, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Possui periodização no treino?</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('has_periodization', true)}
                  className={`p-3 border rounded-xl text-left transition-all ${
                    formData.has_periodization === true
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('has_periodization', false)}
                  className={`p-3 border rounded-xl text-left transition-all ${
                    formData.has_periodization === false
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Não
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Sente estagnação no treino?</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('feels_stagnation', true)}
                  className={`p-3 border rounded-xl text-left transition-all ${
                    formData.feels_stagnation === true
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('feels_stagnation', false)}
                  className={`p-3 border rounded-xl text-left transition-all ${
                    formData.feels_stagnation === false
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Não
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nível do Pump Muscular</label>
              <select
                value={formData.muscle_pump_level || ''}
                onChange={(e) => handleInputChange('muscle_pump_level', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="baixo">Baixo</option>
                <option value="medio">Médio</option>
                <option value="alto">Alto</option>
                <option value="muito_alto">Muito Alto</option>
              </select>
            </div>
          </div>
        );

      case 'substances':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medicamentos Prescritos</label>
              <textarea
                value={formData.prescribed_medications || ''}
                onChange={(e) => handleInputChange('prescribed_medications', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Liste medicamentos que usa regularmente..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Drogas Lícitas/Ilícitas</label>
              <textarea
                value={formData.legal_illegal_drugs || ''}
                onChange={(e) => handleInputChange('legal_illegal_drugs', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Álcool, tabaco, outras substâncias..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Anabolizantes/Contraceptivos</label>
              <textarea
                value={formData.anabolics_contraceptives || ''}
                onChange={(e) => handleInputChange('anabolics_contraceptives', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Histórico de uso de anabolizantes, anticoncepcionais..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nootrópicos</label>
              <textarea
                value={formData.nootropics || ''}
                onChange={(e) => handleInputChange('nootropics', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Substâncias para melhoria cognitiva..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimulantes</label>
              <textarea
                value={formData.stimulants || ''}
                onChange={(e) => handleInputChange('stimulants', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Cafeína, energéticos, pré-treinos..."
              />
            </div>
          </div>
        );

      case 'diet':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recordatório Alimentar (3 dias)</label>
              <textarea
                value={formData.food_diary || ''}
                onChange={(e) => handleInputChange('food_diary', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descreva sua alimentação dos últimos 3 dias..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequência Intestinal</label>
              <input
                type="text"
                value={formData.bowel_frequency || ''}
                onChange={(e) => handleInputChange('bowel_frequency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 1x ao dia, 3x por semana"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Problemas Digestivos</label>
              <textarea
                value={formData.digestive_issues || ''}
                onChange={(e) => handleInputChange('digestive_issues', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Azia, refluxo, gases, etc..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilidade de Alimentos</label>
              <textarea
                value={formData.food_availability || ''}
                onChange={(e) => handleInputChange('food_availability', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Orçamento, acesso a diferentes alimentos..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alergias e Intolerâncias</label>
              <textarea
                value={formData.allergies_intolerances || ''}
                onChange={(e) => handleInputChange('allergies_intolerances', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Lactose, glúten, nozes, etc..."
              />
            </div>
          </div>
        );

      case 'neurological':
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 mb-6">
              Avalie cada aspecto numa escala de 1 a 5 (1 = Muito Baixo, 5 = Muito Alto)
            </p>

            {[
              { field: 'motivation_level', label: 'Nível de Motivação' },
              { field: 'concentration_level', label: 'Capacidade de Concentração' },
              { field: 'memory_level', label: 'Qualidade da Memória' },
              { field: 'sexual_initiative_level', label: 'Iniciativa Sexual' },
              { field: 'pleasure_level', label: 'Capacidade de Sentir Prazer' },
              { field: 'empathy_level', label: 'Nível de Empatia' },
              { field: 'sociability_level', label: 'Sociabilidade' },
              { field: 'verbal_fluency_level', label: 'Fluência Verbal' }
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleInputChange(field, value)}
                      className={`p-3 border rounded-xl text-center transition-all ${
                        formData[field as keyof typeof formData] === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'sleep':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tempo para Pegar no Sono</label>
              <input
                type="text"
                value={formData.sleep_onset_time || ''}
                onChange={(e) => handleInputChange('sleep_onset_time', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 15 minutos, 1 hora"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Acorda descansado?</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('wakes_rested', true)}
                  className={`p-3 border rounded-xl text-left transition-all ${
                    formData.wakes_rested === true
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('wakes_rested', false)}
                  className={`p-3 border rounded-xl text-left transition-all ${
                    formData.wakes_rested === false
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Não
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantas vezes acorda durante a noite?</label>
              <input
                type="number"
                value={formData.night_awakenings || ''}
                onChange={(e) => handleInputChange('night_awakenings', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Método de Respiração</label>
              <input
                type="text"
                value={formData.breathing_method || ''}
                onChange={(e) => handleInputChange('breathing_method', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 4-7-8, respiração diafragmática"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Picos de Fadiga Durante o Dia</label>
              <textarea
                value={formData.fatigue_peaks || ''}
                onChange={(e) => handleInputChange('fatigue_peaks', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Horários e situações em que sente mais cansaço..."
              />
            </div>

            <FileUpload
              label="Dados do Smartwatch/Sleep Tracker (Opcional)"
              description="Screenshots ou relatórios do sono"
              acceptedTypes={['image/*', 'application/pdf']}
              maxSizeMB={5}
              currentFile={formData.smartwatch_data_url}
              onFileUpload={(url, _fileName) => handleInputChange('smartwatch_data_url', url)}
            />
          </div>
        );

      case 'clinical':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doenças Preexistentes</label>
              <textarea
                value={formData.preexisting_diseases || ''}
                onChange={(e) => handleInputChange('preexisting_diseases', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Diabetes, hipertensão, etc..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cirurgias Realizadas</label>
              <textarea
                value={formData.surgeries || ''}
                onChange={(e) => handleInputChange('surgeries', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tipo, data e motivo das cirurgias..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tratamentos Odontológicos</label>
              <textarea
                value={formData.dental_treatments || ''}
                onChange={(e) => handleInputChange('dental_treatments', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tratamentos recentes ou em andamento..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Metais/Implantes no Corpo</label>
              <textarea
                value={formData.metals_implants || ''}
                onChange={(e) => handleInputChange('metals_implants', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Próteses, placas, parafusos..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantas doses da vacina COVID-19?</label>
              <input
                type="number"
                value={formData.covid_vaccination_doses || ''}
                onChange={(e) => handleInputChange('covid_vaccination_doses', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mudanças de Saúde Recentes</label>
              <textarea
                value={formData.recent_health_changes || ''}
                onChange={(e) => handleInputChange('recent_health_changes', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mudanças nos últimos 6 meses..."
              />
            </div>

            <FileUpload
              label="Exames Clínicos Recentes (Opcional)"
              description="Hemograma, perfil lipídico, hormonal, etc."
              acceptedTypes={['application/pdf', 'image/*']}
              maxSizeMB={10}
              currentFile={formData.clinical_exams_url}
              onFileUpload={(url, _fileName) => handleInputChange('clinical_exams_url', url)}
            />
          </div>
        );

      default:
        return <div>Seção não encontrada</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mx-auto mb-4">
            <ClipboardList className="w-12 h-12 text-indigo-600" />
          </div>
          <p className="text-gray-600">Carregando anamnese...</p>
        </div>
      </div>
    );
  }

  const currentSectionData = sections[currentSection];
  const IconComponent = currentSectionData.icon;

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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Anamnese Completa</h1>
              <p className="text-sm text-gray-600">
                {anamnesis?.is_completed ? 'Anamnese Concluída' : `Seção ${currentSection + 1} de ${sections.length}`}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Progress Bar */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Progresso</span>
            <span className="text-sm text-gray-600">{currentSection + 1} / {sections.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Section Navigation */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {sections.map((section, index) => {
              const SectionIcon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(index)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    index === currentSection
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : index < currentSection
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-gray-50 text-gray-600 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <SectionIcon className="w-4 h-4" />
                    <span className="text-xs font-medium truncate">{section.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{currentSectionData.title}</h2>
              <p className="text-gray-600">Preencha as informações desta seção</p>
            </div>
          </div>

          {renderSection()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevSection}
              disabled={currentSection === 0}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <div className="flex space-x-3">
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Salvando...' : 'Salvar Progresso'}</span>
              </button>

              {currentSection === sections.length - 1 ? (
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Finalizando...' : 'Finalizar Anamnese'}</span>
                </button>
              ) : (
                <button
                  onClick={nextSection}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all"
                >
                  <span>Próxima</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
