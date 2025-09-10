import { useState, useEffect } from 'react';
import { Save, User, Phone, Users } from 'lucide-react';
import type { CreateUserProfileInput } from '@/shared/types';

interface ProfileSetupProps {
  onComplete: () => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [formData, setFormData] = useState<CreateUserProfileInput & { trainer_id?: string }>({
    name: '',
    user_type: 'student',
    phone: '',
    trainer_id: '',
  });
  const [trainers, setTrainers] = useState<Array<{ user_id: string; name: string }>>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch available trainers when user selects 'student'
    const fetchTrainers = async () => {
      if (formData.user_type === 'student') {
        try {
          const response = await fetch('/api/trainers');
          const data = await response.json();
          setTrainers(data.trainers || []);
        } catch (error) {
          console.error('Error fetching trainers:', error);
        }
      }
    };

    fetchTrainers();
  }, [formData.user_type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      onComplete();
    } catch (error) {
      console.error('Error creating profile:', error);
      setError('Erro ao criar perfil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Configurar Perfil</h2>
          <p className="text-gray-600">Complete suas informações para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Usuário *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, user_type: 'student', trainer_id: '' }))}
                className={`p-4 border rounded-xl text-left transition-all ${
                  formData.user_type === 'student'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-semibold">Aluno</div>
                <div className="text-sm opacity-70">Acompanhar evolução</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, user_type: 'trainer', trainer_id: undefined }))}
                className={`p-4 border rounded-xl text-left transition-all ${
                  formData.user_type === 'trainer'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-semibold">Treinador</div>
                <div className="text-sm opacity-70">Gerenciar alunos</div>
              </button>
            </div>
          </div>

          {formData.user_type === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecionar Treinador
              </label>
              <div className="relative">
                <Users className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={formData.trainer_id || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, trainer_id: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Selecione um treinador (opcional)</option>
                  {trainers.map(trainer => (
                    <option key={trainer.user_id} value={trainer.user_id}>
                      {trainer.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Você pode vincular-se a um treinador agora ou depois
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving || !formData.name}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando...' : 'Criar Perfil'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
