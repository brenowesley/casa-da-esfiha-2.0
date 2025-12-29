import { createClient } from '@supabase/supabase-js';

// Busca as variáveis, se não existirem, usa uma string vazia para não quebrar o sistema
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verificação Senior: Só tenta criar o cliente se as chaves existirem
export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

// Inicializa o cliente (Se estiver vazio, o app usará os dados locais MENU_ITEMS sem crashar)
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;