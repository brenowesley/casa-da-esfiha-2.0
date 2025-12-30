import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log Senior para debug (isso vai aparecer no console do Vercel)
console.log("Tentando conectar ao Supabase...");
if (!supabaseUrl) console.error("ERRO: VITE_SUPABASE_URL não encontrada!");
if (!supabaseAnonKey) console.error("ERRO: VITE_SUPABASE_ANON_KEY não encontrada!");

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;