import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronLeft, 
  FileText,
  Plus,
  Upload,
  Download,
  Eye,
  Trash2,
  Search,
  Calendar,
  File,
  BookOpen,
  Save,
  X,
  Users
} from 'lucide-react';
import type { Material, UserProfile } from '@/shared/types';

interface CreateMaterialForm {
  title: string;
  description: string;
  file: File | null;
  selectedStudents: string[];
}

export default function Materials() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<CreateMaterialForm>({
    title: '',
    description: '',
    file: null,
    selectedStudents: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile to determine user type
        const profileResponse = await fetch('/api/profile');
        const profileData = await profileResponse.json();
        setProfile(profileData.profile);

        // Fetch materials
        const materialsResponse = await fetch('/api/materials');
        const materialsData = await materialsResponse.json();
        setMaterials(materialsData.materials || []);

        // Fetch students if user is a trainer
        if (profileData.profile?.user_type === 'trainer') {
          const studentsResponse = await fetch('/api/students');
          const studentsData = await studentsResponse.json();
          setStudents(studentsData.students || []);
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== 'application/pdf') {
      alert('Por favor, selecione apenas arquivos PDF.');
      e.target.value = ''; // Clear the input
      return;
    }
    setFormData(prev => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.file) {
      alert('Por favor, preencha o título e selecione um arquivo.');
      return;
    }

    setUploading(true);
    try {
      // In a real app, you would upload the file first and get a URL
      // For now, we'll mock this
      const mockFileUrl = `https://example.com/materials/${formData.file.name}`;
      
      const materialData = {
        title: formData.title,
        description: formData.description,
        file_url: mockFileUrl,
        file_name: formData.file.name,
        file_size: formData.file.size,
        student_user_ids: formData.selectedStudents,
      };

      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialData),
      });

      if (!response.ok) {
        throw new Error('Failed to upload material');
      }

      // Refresh materials list
      const refreshResponse = await fetch('/api/materials');
      const refreshData = await refreshResponse.json();
      setMaterials(refreshData.materials || []);

      // Reset form
      setFormData({ title: '', description: '', file: null, selectedStudents: [] });
      setShowUploadForm(false);
      alert('Material adicionado com sucesso!');
    } catch (error) {
      console.error('Error uploading material:', error);
      alert('Erro ao fazer upload do material. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (material.description && material.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isTrainer = profile?.user_type === 'trainer';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mx-auto mb-4">
            <FileText className="w-12 h-12 text-indigo-600" />
          </div>
          <p className="text-gray-600">Carregando materiais...</p>
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
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Materiais para Consulta</h1>
                <p className="text-sm text-gray-600">
                  {isTrainer ? 'Gerencie documentos educativos' : 'Materiais compartilhados pelo seu treinador'}
                </p>
              </div>
            </div>
            {isTrainer && (
              <button
                onClick={() => setShowUploadForm(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Novo Material</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Upload Form Modal */}
        {showUploadForm && isTrainer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-50">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Novo Material</h2>
                  <button
                    onClick={() => setShowUploadForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Material *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Ex: Guia de Alimentação Saudável"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                    placeholder="Descrição opcional do material..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Liberar para Alunos
                  </label>
                  <div className="border border-gray-200 rounded-xl p-4 max-h-48 overflow-y-auto">
                    {students.length === 0 ? (
                      <p className="text-gray-500 text-sm">Você ainda não possui alunos cadastrados</p>
                    ) : (
                      <div className="space-y-2">
                        <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.selectedStudents.length === students.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({ 
                                  ...prev, 
                                  selectedStudents: students.map(s => s.user_id) 
                                }));
                              } else {
                                setFormData(prev => ({ ...prev, selectedStudents: [] }));
                              }
                            }}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="font-medium text-gray-800">Todos os alunos</span>
                        </label>
                        <hr className="my-2" />
                        {students.map((student) => (
                          <label key={student.user_id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.selectedStudents.includes(student.user_id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({ 
                                    ...prev, 
                                    selectedStudents: [...prev.selectedStudents, student.user_id] 
                                  }));
                                } else {
                                  setFormData(prev => ({ 
                                    ...prev, 
                                    selectedStudents: prev.selectedStudents.filter(id => id !== student.user_id) 
                                  }));
                                }
                              }}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div>
                              <p className="font-medium text-gray-800">{student.name}</p>
                              {student.email && (
                                <p className="text-sm text-gray-600">{student.email}</p>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Selecione os alunos que terão acesso a este material. Se nenhum aluno for selecionado, o material ficará privado.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arquivo PDF *
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
                    {formData.file ? (
                      <div className="flex items-center justify-center space-x-3">
                        <File className="w-8 h-8 text-red-500" />
                        <div>
                          <p className="font-medium text-gray-800">{formData.file.name}</p>
                          <p className="text-sm text-gray-600">{formatFileSize(formData.file.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Clique para selecionar ou arraste um arquivo PDF</p>
                        <p className="text-sm text-gray-500">Apenas arquivos PDF são aceitos</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{uploading ? 'Enviando...' : 'Salvar Material'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 mb-6">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Buscar materiais..."
            />
          </div>
        </div>

        {/* Stats */}
        {isTrainer && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Materiais</p>
                  <p className="text-2xl font-bold text-gray-800">{materials.length}</p>
                </div>
                <FileText className="w-8 h-8 text-indigo-500" />
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Materiais Ativos</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {materials.filter(m => m.is_active).length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Este Mês</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {materials.filter(m => {
                      const materialDate = new Date(m.created_at);
                      const now = new Date();
                      return materialDate.getMonth() === now.getMonth() && 
                             materialDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-orange-500" />
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tamanho Total</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatFileSize(materials.reduce((acc, m) => acc + (m.file_size || 0), 0))}
                  </p>
                </div>
                <Upload className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        )}

        {/* Materials List */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {isTrainer ? 'Materiais Criados' : 'Materiais Disponíveis'}
            </h2>
          </div>

          {filteredMaterials.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {searchTerm ? 'Nenhum material encontrado' : 
                 isTrainer ? 'Nenhum material criado ainda' : 'Nenhum material disponível'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Tente buscar com outros termos.' :
                 isTrainer ? 'Comece adicionando materiais educativos para seus alunos.' :
                 'Seu treinador ainda não compartilhou materiais.'}
              </p>
              {!searchTerm && isTrainer && (
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all"
                >
                  Adicionar Primeiro Material
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMaterials.map((material) => (
                <div key={material.id} className="p-6 hover:bg-white/40 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <File className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{material.title}</h3>
                          {material.is_active && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                              Ativo
                            </span>
                          )}
                        </div>
                        
                        {material.description && (
                          <p className="text-gray-600 mb-3">{material.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <File className="w-4 h-4" />
                            <span>{material.file_name}</span>
                          </div>
                          {material.file_size && (
                            <div className="flex items-center space-x-1">
                              <Upload className="w-4 h-4" />
                              <span>{formatFileSize(material.file_size)}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(material.created_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                          {isTrainer && (material as any).granted_students && (
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>
                                {(material as any).granted_students 
                                  ? (material as any).granted_students.split(',').length + ' aluno(s)'
                                  : 'Privado'
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => window.open(material.file_url, '_blank')}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Visualizar PDF"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={material.file_url}
                        download={material.file_name}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Baixar arquivo"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      {isTrainer && (
                        <button
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir material"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
