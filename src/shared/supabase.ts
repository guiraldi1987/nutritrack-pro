import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase-types';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Criar cliente do Supabase com tipos
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Exportar tipos do banco de dados
export type { Database } from './supabase-types';

// Função helper para lidar com erros do Supabase
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  throw new Error(error.message || 'Erro desconhecido do Supabase');
};

// Função helper para verificar se o usuário está autenticado
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    handleSupabaseError(error);
  }
  return user;
};

// Função helper para fazer logout
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    handleSupabaseError(error);
  }
};