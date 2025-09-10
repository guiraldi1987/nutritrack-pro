import { useState, useCallback } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (fileUrl: string, fileName: string) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  label: string;
  description?: string;
  currentFile?: string;
  className?: string;
}

export default function FileUpload({
  onFileUpload,
  acceptedTypes = ['image/*', 'application/pdf'],
  maxSizeMB = 10,
  label,
  description,
  currentFile,
  className = ''
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(
    currentFile ? { name: 'arquivo-atual.pdf', url: currentFile } : null
  );

  const validateFile = (file: File): boolean => {
    setError(null);
    
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
      return false;
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      setError('Tipo de arquivo não suportado');
      return false;
    }

    return true;
  };

  const simulateUpload = async (file: File): Promise<string> => {
    // Simulate file upload with progress
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate mock URL based on file type and name
        // const extension = file.name.split('.').pop();
        const mockUrl = `https://nutritrack-files.com/${Date.now()}-${file.name}`;
        resolve(mockUrl);
      }, 2000);
    });
  };

  const handleFileSelect = async (file: File) => {
    if (!validateFile(file)) return;

    setUploading(true);
    setError(null);

    try {
      const fileUrl = await simulateUpload(file);
      const uploadedFileInfo = { name: file.name, url: fileUrl };
      
      setUploadedFile(uploadedFileInfo);
      onFileUpload(fileUrl, file.name);
    } catch (error) {
      setError('Erro ao fazer upload do arquivo');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError(null);
    onFileUpload('', '');
  };

  // const formatFileSize = (bytes: number) => {
  //   if (bytes === 0) return '0 Bytes';
  //   const k = 1024;
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  // };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return '🖼️';
    } else if (extension === 'pdf') {
      return '📄';
    }
    return '📎';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}

      {!uploadedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            isDragging
              ? 'border-indigo-400 bg-indigo-50'
              : uploading
              ? 'border-gray-300 bg-gray-50'
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }`}
        >
          <input
            type="file"
            onChange={handleInputChange}
            accept={acceptedTypes.join(',')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />

          <div className="flex flex-col items-center space-y-4">
            {uploading ? (
              <>
                <div className="animate-spin">
                  <Upload className="w-12 h-12 text-indigo-600" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Fazendo upload...</p>
                  <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400" />
                <div>
                  <p className="text-gray-700 font-medium mb-1">
                    {isDragging ? 'Solte o arquivo aqui' : 'Clique ou arraste um arquivo'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Formatos aceitos: {acceptedTypes.map(type => 
                      type === 'image/*' ? 'Imagens' : 
                      type === 'application/pdf' ? 'PDF' : type
                    ).join(', ')}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Máximo: {maxSizeMB}MB</p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{getFileIcon(uploadedFile.name)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {uploadedFile.name}
                </p>
                <p className="text-sm text-gray-600">
                  Upload realizado com sucesso
                </p>
              </div>
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            </div>
            <button
              onClick={removeFile}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              title="Remover arquivo"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
