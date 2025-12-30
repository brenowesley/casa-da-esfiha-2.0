import { createClient } from '@supabase/supabase-js';

// Tenta ler com VITE_ (local/manual) ou sem VITE_ (integração automática Vercel)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (import.meta as any).env?.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.SUPABASE_ANON_KEY;

// Log de debug para você ver no console se funcionou
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🚨 ERRO DE CONEXÃO: As chaves do Supabase não foram encontradas. Verifique o prefixo VITE_ no painel da Vercel.");
} else {
  console.log("✅ Conexão com Supabase configurada com sucesso!");
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;