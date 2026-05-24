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

function saveStreak(data: StreakData) {
  localStorage.setItem(STREAK_KEY, JSON.stringify({ currentStreak: data.currentStreak, lastActiveDate: data.lastActiveDate }));
  localStorage.setItem(XP_KEY, String(data.totalXP));
}

export function addXP(amount: number) {
  const data = loadStreak();
  data.totalXP += amount;
  saveStreak(data);
}

export default function StreakCounter() {
  const [streak, setStreak] = useState({ currentStreak: 0, lastActiveDate: '', totalXP: 0 });

  useEffect(() => {
    const data = loadStreak();
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    if (data.lastActiveDate === today) {
      // Already active today, just show
    } else if (data.lastActiveDate === yesterday) {
      // Consecutive day — increment
      data.currentStreak += 1;
      data.lastActiveDate = today;
      saveStreak(data);
    } else if (data.lastActiveDate !== today) {
      // Streak broken — reset
      data.currentStreak = 1;
      data.lastActiveDate = today;
      saveStreak(data);
    }
    setStreak(data);
  }, []);

  if (streak.currentStreak === 0) return null;

  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      <span>🔥</span>
      <span style={{ color: streak.currentStreak >= 7 ? '#f59e0b' : streak.currentStreak >= 3 ? '#06b6d4' : '#71717a' }}>
        {streak.currentStreak}d
      </span>
      <span style={{ color: '#52525b' }}>|</span>
      <span style={{ color: '#06b6d4' }}>⭐ {streak.totalXP.toLocaleString()} XP</span>
    </div>
  );
}