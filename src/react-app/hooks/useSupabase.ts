import { useState, useEffect } from 'react';
import { supabase, getCurrentUser, handleSupabaseError } from '@/shared/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/shared/supabase';

// Hook para gerenciar autenticação do Supabase
export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar usuário atual
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, error };
};

// Hook para operações CRUD genéricas
export const useSupabaseTable = <T extends keyof Database['public']['Tables']>(
  tableName: T
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type TableRow = Database['public']['Tables'][T]['Row'];
  type TableInsert = Database['public']['Tables'][T]['Insert'];
  type TableUpdate = Database['public']['Tables'][T]['Update'];

  const select = async (filters?: Record<string, any>): Promise<TableRow[]> => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from(tableName).select('*');
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { data, error } = await query;
      
      if (error) {
        handleSupabaseError(error);
      }

      return data as any[];
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const insert = async (data: TableInsert): Promise<TableRow> => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data as any)
        .select()
        .single();

      if (error) {
        handleSupabaseError(error);
      }

      return result as any;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    id: number | string,
    data: TableUpdate,
    idColumn: string = 'id'
  ): Promise<TableRow> => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data as any)
        .eq(idColumn as any, id)
        .select()
        .single();

      if (error) {
        handleSupabaseError(error);
      }

      return result as any;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (
    id: number | string,
    idColumn: string = 'id'
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq(idColumn as any, id);

      if (error) {
        handleSupabaseError(error);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    select,
    insert,
    update,
    remove,
    loading,
    error
  };
};

// Hook específico para perfis de usuário
export const useUserProfile = () => {
  const { user } = useSupabaseAuth();
  const { select, insert, update, loading, error } = useSupabaseTable('user_profiles');
  const [profile, setProfile] = useState<Database['public']['Tables']['user_profiles']['Row'] | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }

      try {
        const profiles = await select({ user_id: user.id });
        setProfile(profiles[0] || null);
      } catch (err) {
        console.error('Erro ao buscar perfil:', err);
      }
    };

    fetchProfile();
  }, [user]);

  const createProfile = async (data: Omit<Database['public']['Tables']['user_profiles']['Insert'], 'user_id'>) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    const newProfile = await insert({ ...data, user_id: user.id });
    setProfile(newProfile);
    return newProfile;
  };

  const updateProfile = async (data: Database['public']['Tables']['user_profiles']['Update']) => {
    if (!profile) throw new Error('Perfil não encontrado');
    
    const updatedProfile = await update(profile.id, data);
    setProfile(updatedProfile);
    return updatedProfile;
  };

  return {
    profile,
    createProfile,
    updateProfile,
    loading,
    error
  };
};

// Hook específico para dados de estudante
export const useStudent = () => {
  const { user } = useSupabaseAuth();
  const { select, insert, update, loading, error } = useSupabaseTable('students');
  const [student, setStudent] = useState<Database['public']['Tables']['students']['Row'] | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!user) {
        setStudent(null);
        return;
      }

      try {
        const students = await select({ user_id: user.id });
        setStudent(students[0] || null);
      } catch (err) {
        console.error('Erro ao buscar dados do estudante:', err);
      }
    };

    fetchStudent();
  }, [user]);

  const createStudent = async (data: Omit<Database['public']['Tables']['students']['Insert'], 'user_id'>) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    const newStudent = await insert({ ...data, user_id: user.id });
    setStudent(newStudent);
    return newStudent;
  };

  const updateStudent = async (data: Database['public']['Tables']['students']['Update']) => {
    if (!student) throw new Error('Dados do estudante não encontrados');
    
    const updatedStudent = await update(student.id, data);
    setStudent(updatedStudent);
    return updatedStudent;
  };

  return {
    student,
    createStudent,
    updateStudent,
    loading,
    error
  };
};

// Hook para upload de arquivos
export const useSupabaseStorage = (bucket: string) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, path: string): Promise<string> => {
    setUploading(true);
    setError(null);

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        handleSupabaseError(error);
      }

      // Obter URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data?.path || '');

      return publicUrl;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (path: string): Promise<void> => {
    setUploading(true);
    setError(null);

    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        handleSupabaseError(error);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
    error
  };
};