import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronLeft, 
  Scale, 
  Calendar,
  TrendingUp,
  Plus,
  Save
} from 'lucide-react';
import type { BodyMeasurement } from '@/shared/types';

export default function MeasurementsPage() {
  const navigate = useNavigate();
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    waist_circumference: '',
    right_arm_contracted: '',
    right_arm_relaxed: '',
    left_arm_contracted: '',
    left_arm_relaxed: '',
    thigh_midpoint: '',
    hip_circumference: '',
    measurement_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await fetch('/api/measurements');
        const data = await response.json();
        setMeasurements(data.measurements || []);
      } catch (error) {
        console.error('Error fetching measurements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeasurements();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const measurementData = {
        ...formData,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        waist_circumference: formData.waist_circumference ? parseFloat(formData.waist_circumference) : undefined,
        right_arm_contracted: formData.right_arm_contracted ? parseFloat(formData.right_arm_contracted) : undefined,
        right_arm_relaxed: formData.right_arm_relaxed ? parseFloat(formData.right_arm_relaxed) : undefined,
        left_arm_contracted: formData.left_arm_contracted ? parseFloat(formData.left_arm_contracted) : undefined,
        left_arm_relaxed: formData.left_arm_relaxed ? parseFloat(formData.left_arm_relaxed) : undefined,
        thigh_midpoint: formData.thigh_midpoint ? parseFloat(formData.thigh_midpoint) : undefined,
        hip_circumference: formData.hip_circumference ? parseFloat(formData.hip_circumference) : undefined,
      };

      // Remove undefined fields
      Object.keys(measurementData).forEach(key => {
        if (measurementData[key as keyof typeof measurementData] === undefined) {
          delete measurementData[key as keyof typeof measurementData];
        }
      });

      const response = await fetch('/api/measurements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(measurementData),
      });

      if (!response.ok) {
        throw new Error('Failed to save measurement');
      }

      // Refresh measurements
      const refreshResponse = await fetch('/api/measurements');
      const refreshData = await refreshResponse.json();
      setMeasurements(refreshData.measurements || []);

      // Reset form
      setFormData({
        weight: '',
        waist_circumference: '',
        right_arm_contracted: '',
        right_arm_relaxed: '',
        left_arm_contracted: '',
        left_arm_relaxed: '',
        thigh_midpoint: '',
        hip_circumference: '',
        measurement_date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving measurement:', error);
      alert('Erro ao salvar medidas. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mx-auto mb-4">
            <Scale className="w-12 h-12 text-indigo-600" />
          </div>
          <p className="text-gray-600">Carregando medidas...</p>
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
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Medidas Corporais</h1>
                <p className="text-sm text-gray-600">Registre seu progresso</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Medição</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* New Measurement Form */}
        {showForm && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Nova Medição</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data da Medição</label>
                  <input
                    type="date"
                    value={formData.measurement_date}
                    onChange={(e) => handleInputChange('measurement_date', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 70.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cintura (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.waist_circumference}
                    onChange={(e) => handleInputChange('waist_circumference', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 80.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quadril (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.hip_circumference}
                    onChange={(e) => handleInputChange('hip_circumference', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 95.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Braço Direito Contraído (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.right_arm_contracted}
                    onChange={(e) => handleInputChange('right_arm_contracted', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 35.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Braço Direito Relaxado (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.right_arm_relaxed}
                    onChange={(e) => handleInputChange('right_arm_relaxed', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 33.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Braço Esquerdo Contraído (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.left_arm_contracted}
                    onChange={(e) => handleInputChange('left_arm_contracted', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 35.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Braço Esquerdo Relaxado (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.left_arm_relaxed}
                    onChange={(e) => handleInputChange('left_arm_relaxed', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 32.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coxa (ponto médio) (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.thigh_midpoint}
                    onChange={(e) => handleInputChange('thigh_midpoint', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 55.0"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Salvando...' : 'Salvar Medição'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Measurements History */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Histórico de Medições</h2>
            {measurements.length > 0 && (
              <button
                onClick={() => navigate('/evolution')}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Ver Evolução</span>
              </button>
            )}
          </div>

          {measurements.length === 0 ? (
            <div className="text-center py-12">
              <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhuma medição registrada</h3>
              <p className="text-gray-500 mb-6">Registre sua primeira medição para começar a acompanhar seu progresso.</p>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Primeira Medição</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {measurements.map((measurement) => (
                <div key={measurement.id} className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <span className="font-medium text-gray-800">
                        {new Date(measurement.measurement_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {measurement.weight && (
                      <div className="flex items-center space-x-2">
                        <Scale className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-gray-800">{measurement.weight} kg</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {measurement.waist_circumference && (
                      <div>
                        <span className="text-gray-500">Cintura:</span>
                        <span className="ml-1 font-medium">{measurement.waist_circumference} cm</span>
                      </div>
                    )}
                    {measurement.hip_circumference && (
                      <div>
                        <span className="text-gray-500">Quadril:</span>
                        <span className="ml-1 font-medium">{measurement.hip_circumference} cm</span>
                      </div>
                    )}
                    {measurement.right_arm_contracted && (
                      <div>
                        <span className="text-gray-500">Braço D. (cont.):</span>
                        <span className="ml-1 font-medium">{measurement.right_arm_contracted} cm</span>
                      </div>
                    )}
                    {measurement.left_arm_contracted && (
                      <div>
                        <span className="text-gray-500">Braço E. (cont.):</span>
                        <span className="ml-1 font-medium">{measurement.left_arm_contracted} cm</span>
                      </div>
                    )}
                    {measurement.thigh_midpoint && (
                      <div>
                        <span className="text-gray-500">Coxa:</span>
                        <span className="ml-1 font-medium">{measurement.thigh_midpoint} cm</span>
                      </div>
                    )}
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
