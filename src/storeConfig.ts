import { supabase } from "./lib/supabase";

export async function getDeliveryStatus(): Promise<boolean> {
  const { data, error } = await supabase
    .from("configuracoes_loja")
    .select("delivery_ativo")
    .eq("id", 1)
    .single();

  if (error || !data) return false;
  return data.delivery_ativo;
}

export async function setDeliveryStatus(status: boolean) {
  const { error } = await supabase
    .from("configuracoes_loja")
    .update({ delivery_ativo: status })
    .eq("id", 1);

  if (error) throw error;
}
