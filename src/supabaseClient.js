import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY)

export async function fetchClientes() {
  const { data, error } = await supabase
    .from('Clientes')
    .select('clienteMin, clienteMax')
    .order('lastFleteFecha', { ascending: false, nullsFirst: false })
    .limit(1000);
  if (error) { console.error('fetchClientes:', error); return []; }
  return data ?? [];
}

export async function fetchObras() {
  const PAGE = 1000;
  let all = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('Obras')
      .select('clienteMin, obraMin, obraMax, link')
      .order('lastFleteFecha', { ascending: false, nullsFirst: false })
      .range(from, from + PAGE - 1);
    if (error || !data?.length) break;
    all = all.concat(data);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return all;
}

export default supabase
