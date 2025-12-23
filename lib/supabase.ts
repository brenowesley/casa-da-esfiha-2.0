import { createClient } from '@supabase/supabase-js';

// Prioriza process.env (padrão do ambiente) mas aceita fallback
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

// Validação para evitar "Failed to fetch" causado por URL inválida
export const isSupabaseValid = 
  typeof supabaseUrl === 'string' && 
  supabaseUrl.startsWith('https://') && 
  supabaseAnonKey.length > 0;

export const supabase = createClient(
  isSupabaseValid ? supabaseUrl : 'https://placeholder-url.supabase.co',
  isSupabaseValid ? supabaseAnonKey : 'placeholder-key'
);