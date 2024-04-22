
import { createServiceSupabaseClient } from '@repo/supabase-client-helpers/server-only';

export const getAllReports = async () => {
  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase.from('review_reports').select('*');
  console.log(data, error);
  return data ?? [];
};
