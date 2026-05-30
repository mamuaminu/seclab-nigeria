import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const supabaseUrl = 'https://ossgeecuxijcziazzvfl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zc2dlZWN1eGlqY3ppYXp6dmZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NjA2NjQsImV4cCI6MjA5NTEzNjY2NH0.Q6XHOG5WrUKkMQv2YcNzSxwpO7e0F0tTM2J3FqWeWEg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function hashFlag(flag: string): string {
  return createHash('sha256').update(flag.trim()).digest('hex');
}

function verifyFlag(submitted: string, stored: string): boolean {
  // Support both plain-text flags and pre-hashed flags
  const trimmed = submitted.trim();
  return trimmed === stored || hashFlag(trimmed) === stored;
}

// ─── CTF Helpers ────────────────────────────────────────────────

export async function fetchChallenges() {
  const { data, error } = await supabase
    .from('challenges')
    .select('id, title, description, category, difficulty, points, hint, tags, created_at')
    .eq('active', true)
    .order('points', { ascending: true });
  if (error) throw error;
  return data;
}

export async function fetchLeaderboard(limit = 10) {
  const { data, error } = await supabase
    .from('profiles')
    .select('username, points, solves_count')
    .order('points', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function submitFlag(userId: string, username: string, challengeId: number, flag: string, points: number): Promise<{correct: boolean; message: string; newPoints: number}> {
  // 1. Fetch the challenge's stored flag_hash
  const { data: challenge, error: chErr } = await supabase
    .from('challenges')
    .select('id, flag_hash, points')
    .eq('id', challengeId)
    .single();
  if (chErr || !challenge) throw new Error('Challenge not found');

  // 2. Check if already solved
  const { data: existing } = await supabase
    .from('submissions')
    .select('id')
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)
    .eq('correct', true)
    .single();
  if (existing) return { correct: true, message: 'Already solved!', newPoints: 0 };

  // 3. Verify flag (supports plain-text or SHA256 hash in DB)
  const correct = verifyFlag(flag, challenge.flag_hash);

  if (!correct) {
    // Record wrong attempt
    await supabase.from('submissions').insert({
      user_id: userId,
      challenge_id: challengeId,
      flag_submitted: flag,
      correct: false,
      points_earned: 0,
    });
    return { correct: false, message: 'Wrong flag. Try again!', newPoints: 0 };
  }

  // 4. Record correct submission
  const { error: subErr } = await supabase.from('submissions').insert({
    user_id: userId,
    challenge_id: challengeId,
    flag_submitted: flag,
    correct: true,
    points_earned: points,
  });
  if (subErr) throw subErr;

  // 5. Upsert profile + increment points
  const { data: profile } = await supabase
    .from('profiles')
    .select('points, solves_count')
    .eq('id', userId)
    .single();

  const newPoints = (profile?.points || 0) + points;
  const newSolves = (profile?.solves_count || 0) + 1;

  await (supabase.from('profiles') as any).upsert(
    { id: userId, username, points: newPoints, solves_count: newSolves },
    { onConflict: 'id' }
  );

  return { correct: true, message: `Correct! +${points} points`, newPoints };
}

export async function getSolveCount(challengeId: number): Promise<number> {
  const { count, error } = await supabase
    .from('submissions')
    .select('id', { count: 'exact', head: true })
    .eq('challenge_id', challengeId)
    .eq('correct', true);
  if (error) return 0;
  return count || 0;
}

export async function getUserSolvedChallenges(userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select('challenge_id')
    .eq('user_id', userId)
    .eq('correct', true);
  if (error) return [];
  return data.map(d => d.challenge_id);
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('username, points, solves_count, is_pro, pro_variant_id')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function fetchPrivateChallenges() {
  // Fetches premium challenges only visible to Pro/Elite subscribers
  const { data, error } = await supabase
    .from('challenges')
    .select('id, title, description, category, difficulty, points, hint, tags, created_at, is_private')
    .eq('active', true)
    .eq('is_private', true)
    .order('points', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function upsertProfile(userId: string, username: string) {
  const { error: upsertErr } = await (supabase.from('profiles') as any).upsert(
    { id: userId, username },
    { onConflict: 'id' }
  );
  if (upsertErr && upsertErr.code !== '23505') throw upsertErr;
}

// ─── Hints Helpers ────────────────────────────────────────────

export async function getHints(challengeId: number): Promise<{id: number; hint_text: string; hint_order: number; unlock_cost: number}[]> {
  const { data, error } = await supabase
    .from('ctf_hints')
    .select('id, hint_text, hint_order, unlock_cost')
    .eq('challenge_id', challengeId)
    .order('hint_order', { ascending: true });
  if (error) return [];
  return data || [];
}

export async function unlockHint(userId: string, hintId: number): Promise<void> {
  await (supabase.from('user_hints') as any).upsert(
    { user_id: userId, hint_id: hintId, unlocked_at: new Date().toISOString() },
    { onConflict: 'user_id,hint_id' }
  );
}

export async function getUnlockedHints(userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from('user_hints')
    .select('hint_id')
    .eq('user_id', userId);
  if (error) return [];
  return (data || []).map((d: any) => d.hint_id);
}

// ─── Courses Helpers ────────────────────────────────────────────

export async function getEnrolledCourses(userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from('course_enrollments')
    .select('course_id')
    .eq('user_id', userId);
  if (error) return [];
  return data.map(d => d.course_id);
}

export async function enrollCourse(userId: string, courseId: number) {
  await (supabase.from('course_enrollments') as any).upsert({
    user_id: userId,
    course_id: courseId,
  }, { onConflict: 'user_id,course_id' });
}

export async function unenrollCourse(userId: string, courseId: number) {
  await supabase.from('course_enrollments')
    .delete()
    .eq('user_id', userId)
    .eq('course_id', courseId);
}

export async function getCourseProgress(userId: string, courseId: number): Promise<Record<string, boolean>> {
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('lesson_key, completed')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('completed', true);
  if (error) return {};
  return Object.fromEntries(data.map(d => [d.lesson_key, true]));
}

export async function setLessonComplete(userId: string, courseId: number, lessonKey: string, completed: boolean) {
  await (supabase.from('lesson_progress') as any).upsert({
    user_id: userId,
    course_id: courseId,
    lesson_key: lessonKey,
    completed,
  }, { onConflict: 'user_id,course_id,lesson_key' });
}