import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function isValidHttpUrl(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

if (!isValidHttpUrl(supabaseUrl)) {
  throw new Error(
    `Supabase URL inválida: "${supabaseUrl}". Verifique VITE_SUPABASE_URL.`
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Supabase ANON KEY não encontrada. Verifique VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const isSupabaseConfigured = true;
