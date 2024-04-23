'use server';

import { createServiceSupabaseClient } from '@repo/supabase-client-helpers/server-only';

export const acceptReport = async (id: number, formData: FormData) => {
  const supabase = createServiceSupabaseClient();

  // get the intial report data
  const { data: reportData, error: reportError } = await supabase
    .from('review_reports')
    .select('*')
    .eq('id', id)
    .single();

  if (reportError || !reportData)
    throw new Error('Failed to fetch report data');

  // Mark the report as accepted
  const { error } = await supabase
    .from('review_reports')
    .update({ status: 'accepted' })
    .eq('id', id);

  if (error) throw new Error('Failed to accept report');

  // Report accepted so restrict the review
  const { error: restricError } = await supabase
    .from('reviews')
    .update({ restricted: true })
    .eq('review_id', reportData.review_id);

  if (restricError) {
    // undo the report acceptance
    await supabase
      .from('review_reports')
      .update({ status: reportData.status })
      .eq('id', id);
    throw new Error('Failed to restrict review');
  }
};

export const rejectReport = async (id: number, formData: FormData) => {
  const supabase = createServiceSupabaseClient();

  // get the intial report data
  const { data: reportData, error: reportError } = await supabase
    .from('review_reports')
    .select('*')
    .eq('id', id)
    .single();

  if (reportError || !reportData)
    throw new Error('Failed to fetch report data');

  // Mark the report as rejected
  const { error } = await supabase
    .from('review_reports')
    .update({ status: 'rejected' })
    .eq('id', id);

  if (error) throw new Error('Failed to reject report');

  // Report rejected so unrestrict the review
  const { error: restricError } = await supabase
    .from('reviews')
    .update({ restricted: false })
    .eq('review_id', reportData.review_id);

  if (restricError) {
    // undo the report rejection
    await supabase
      .from('review_reports')
      .update({ status: reportData.status })
      .eq('id', id);
    throw new Error('Failed to unrestrict review');
  }
};

export const reopenReport = async (id: number, formData: FormData) => {
  const supabase = createServiceSupabaseClient();

  // get the intial report data
  const { data: reportData, error: reportError } = await supabase
    .from('review_reports')
    .select('*')
    .eq('id', id)
    .single();

  if (reportError || !reportData)
    throw new Error('Failed to fetch report data');

  // Mark the report as reported
  const { error } = await supabase
    .from('review_reports')
    .update({ status: 'reported' })
    .eq('id', id);

  if (error) throw new Error('Failed to reopen report');

  // Report reopened so unrestrict the review
  const { error: restricError } = await supabase
    .from('reviews')
    .update({ restricted: false })
    .eq('review_id', reportData.review_id);

  if (restricError) {
    // undo the report reopening
    await supabase
      .from('review_reports')
      .update({ status: reportData.status })
      .eq('id', id);
    throw new Error('Failed to restrict review');
  }
};
