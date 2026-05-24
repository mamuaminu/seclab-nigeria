'use client';
import { useState, useEffect } from 'react';

const STREAK_KEY = 'seclab_streak';
const XP_KEY = 'seclab_xp';

interface StreakData {
  currentStreak: number;
  lastActiveDate: string;
  totalXP: number;
}

function loadStreak(): StreakData {
  if (typeof window === 'undefined') return { currentStreak: 0, lastActiveDate: '', totalXP: 0 };
  const stored = localStorage.getItem(STREAK_KEY);
  const xp = parseInt(localStorage.getItem(XP_KEY) || '0');
  if (!stored) return { currentStreak: 0, lastActiveDate: '', totalXP: xp };
  return { ...JSON.parse(stored), totalXP: xp };
}

export function addXP(amount: number) {
  if (typeof window === 'undefined') return;
  const data = loadStreak();
  data.totalXP = (data.totalXP || 0) + amount;
  localStorage.setItem(XP_KEY, String(data.totalXP));
}

export function getXP(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(XP_KEY) || '0');
}

export function getStreak(): number {
  if (typeof window === 'undefined') return 0;
  const data = loadStreak();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (data.lastActiveDate !== today && data.lastActiveDate !== yesterday) return 0;
  return data.currentStreak;
}

export default function StreakCounter() {
  const [streak, setStreak] = useState({ currentStreak: 0, totalXP: 0 });

  useEffect(() => {
    const data = loadStreak();
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    if (data.lastActiveDate === today) {
      // Already counted today
    } else if (data.lastActiveDate === yesterday) {
      data.currentStreak += 1;
      data.lastActiveDate = today;
      localStorage.setItem(STREAK_KEY, JSON.stringify({ currentStreak: data.currentStreak, lastActiveDate: today }));
    } else if (data.lastActiveDate !== today) {
      data.currentStreak = 1;
      data.lastActiveDate = today;
      localStorage.setItem(STREAK_KEY, JSON.stringify({ currentStreak: 1, lastActiveDate: today }));
    }
    setStreak({ currentStreak: data.currentStreak, totalXP: data.totalXP });
  }, []);

  if (streak.currentStreak === 0 && streak.totalXP === 0) return null;

  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      {streak.currentStreak > 0 && (
        <>
          <span>🔥</span>
          <span style={{ color: streak.currentStreak >= 7 ? '#f59e0b' : streak.currentStreak >= 3 ? '#06b6d4' : '#71717a' }}>
            {streak.currentStreak}d
          </span>
          <span style={{ color: '#3f3f46' }}>·</span>
        </>
      )}
      {streak.totalXP > 0 && (
        <span style={{ color: '#06b6d4' }}>⭐ {streak.totalXP.toLocaleString()} XP</span>
      )}
    </div>
  );
}
