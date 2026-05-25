'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, fetchChallenges, fetchLeaderboard, submitFlag, getSolveCount, getUserSolvedChallenges, upsertProfile, getHints, unlockHint, getUnlockedHints } from '@/app/lib/supabase';
import StreakCounter, { addXP } from '@/app/components/StreakCounter';

const DIFFICULTY = {
  Easy:   { color: '#059669', bg: '#d1fae5', border: '#6ee7b7', text: '#065f46' },
  Medium: { color: '#d97706', bg: '#fef3c7', border: '#fcd34d', text: '#78350f' },
  Hard:   { color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', text: '#7f1d1d' },
};

function getUserId() {
  if (typeof window === 'undefined') return 'ssr';
  let id = localStorage.getItem('seclab_user_id');
  if (!id) {
    id = 'anon_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('seclab_user_id', id);
  }
  return id;
}

function getUsername() {
  if (typeof window === 'undefined') return 'Anonymous';
  return localStorage.getItem('seclab_username') || 'Anonymous';
}

function setUsername(name: string) {
  localStorage.setItem('seclab_username', name);
}

export default function CTFPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [solveCounts, setSolveCounts] = useState<Record<number, number>>({});
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ok: boolean; msg: string} | null>(null);
  const [hints, setHints] = useState<{id: number; hint_text: string; hint_order: number; unlock_cost: number}[]>([]);
  const [unlockedHints, setUnlockedHints] = useState<number[]>([]);
  const [filterCat, setFilterCat] = useState('All');
  const [tab, setTab] = useState<'challenges' | 'leaderboard'>('challenges');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [userId, setUserId] = useState('ssr');
  const [tappedId, setTappedId] = useState<number | null>(null);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const categories = ['All', 'Web', 'Crypto', 'Network', 'Forensics'];

  useEffect(() => {
    setUserId(getUserId());
    setTempName(getUsername());
    loadData();
    upsertProfile(getUserId(), getUsername()).catch(console.error);
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [chData, solvedIds, lbData] = await Promise.all([
        fetchChallenges(),
        getUserSolvedChallenges(userId),
        fetchLeaderboard(),
      ]);
      setChallenges(chData || []);
      setSolved(solvedIds);

      const today = new Date().toISOString().slice(0, 10);
      const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      const daily = (chData || [])[seed % (chData || []).length] || null;
      setDailyChallenge(daily);

      const counts: Record<number, number> = {};
      for (const ch of chData || []) {
        counts[ch.id] = await getSolveCount(ch.id);
      }
      setSolveCounts(counts);
      setLeaderboard(lbData || []);

      const myEntry = lbData?.find((p: any) => p.username === getUsername());
      if (myEntry) setUserPoints(myEntry.points);
    } catch (e) {
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmitFlag = useCallback(async (challengeId: number, flag: string, points: number) => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const result = await submitFlag(userId, getUsername(), challengeId, answer.trim(), points);
      if (result.correct) {
        setSolved(prev => [...prev, challengeId]);
        setSolveCounts(prev => ({ ...prev, [challengeId]: (prev[challengeId] || 0) + 1 }));
        setUserPoints(result.newPoints > 0 ? userPoints + result.newPoints : userPoints);
        setFeedback({ ok: true, msg: result.message });
        addXP(points);
        const lb = await fetchLeaderboard();
        setLeaderboard(lb || []);
        setSelected(null);
        setAnswer('');
      } else {
        setFeedback({ ok: false, msg: result.message });
      }
    } catch (e: any) {
      setFeedback({ ok: false, msg: e?.message || 'Submission failed. Try again.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  }, [answer, userId, userPoints]);

  async function loadHintsForChallenge(challengeId: number) {
    const [h, unlocked] = await Promise.all([getHints(challengeId), getUnlockedHints(userId)]);
    setHints(h);
    setUnlockedHints(unlocked);
  }

  async function handleUnlockHint(hintId: number, cost: number) {
    if (userPoints < cost) return;
    await unlockHint(userId, hintId);
    setUnlockedHints(prev => [...prev, hintId]);
    setUserPoints(prev => prev - cost);
  }

  const filtered = filterCat === 'All' ? challenges : challenges.filter(c => c.category === filterCat);
  const totalSolves = Object.values(solveCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0891b2' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L15 4.5V11.5L8 15L1 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M5.5 8L7 9.5L10.5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-sm tracking-tight" style={{ color: 'var(--text)' }}>
              Sec<span style={{ color: '#0891b2' }}>Lab</span><span style={{ color: '#d97706' }}>.ng</span>
            </span>
          </a>
          <div className="flex items-center gap-6">
            <a href="/ctf" className="nav-link" style={{ color: '#0891b2' }}>CTF</a>
            <a href="/courses" className="nav-link" style={{ color: 'var(--text-2)' }}>Courses</a>
            <a href="/recon" className="nav-link" style={{ color: 'var(--text-2)' }}>Recon</a>
          </div>
        </div>
      </nav>

      {/* ── HEADER ── */}
      <div className="pt-12 pb-0 px-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto">
          <span className="section-label">// CTF PLATFORM</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-3 mb-8">
            <div>
              <h1 className="font-display font-bold text-4xl" style={{ color: 'var(--text)' }}>
                <span style={{ color: '#0891b2' }}>Sec</span>Lab CTF
              </h1>
              <p className="font-mono text-sm mt-1" style={{ color: 'var(--text-3)' }}>
                {challenges.length} challenges · {totalSolves.toLocaleString()} solves
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              {editingName ? (
                <div className="flex gap-2">
                  <input value={tempName} onChange={e => setTempName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { setUsername(tempName.trim() || 'Anonymous'); setEditingName(false); } if (e.key === 'Escape') setEditingName(false); }}
                    className="input w-36" autoFocus style={{ height: '34px', paddingTop: '6px', paddingBottom: '6px' }} />
                  <button onClick={() => { setUsername(tempName.trim() || 'Anonymous'); setEditingName(false); }}
                    className="btn-primary py-1.5 px-3 text-xs">Save</button>
                </div>
              ) : (
                <button onClick={() => { setTempName(getUsername()); setEditingName(true); }}
                  className="flex items-center gap-2 font-mono text-xs" style={{ color: 'var(--text-3)' }}>
                  👤 {getUsername()}
                  <span style={{ color: 'var(--border-2)' }}>✎</span>
                </button>
              )}
              <div className="flex items-center gap-4">
                <div className="font-mono text-xs" style={{ color: 'var(--text-3)' }}>
                  <span style={{ color: '#0891b2' }}>{userPoints.toLocaleString()}</span> pts ·{' '}
                  <span style={{ color: '#d97706' }}>{solved.length}</span> solves
                </div>
                <StreakCounter />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b" style={{ borderColor: 'var(--border)' }}>
            {[['challenges', 'Challenges'], ['leaderboard', 'Leaderboard']].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id as typeof tab)}
                className="font-mono text-sm pb-3 border-b-2 transition-all"
                style={{
                  borderColor: tab === id ? '#0891b2' : 'transparent',
                  color: tab === id ? '#0891b2' : 'var(--text-3)',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {tab === 'challenges' && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex items-center gap-3 font-mono text-sm" style={{ color: 'var(--text-3)' }}>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1V4M8 12V15M1 8H4M12 8H15M3.05 3.05L5.28 5.28M10.72 10.72L12.95 12.95M3.05 12.95L5.28 10.72M10.72 5.28L12.95 3.05"
                      stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Loading...
                </div>
              </div>
            ) : (
              <>
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setFilterCat(cat)}
                      className="font-mono text-xs px-3 py-1.5 rounded-md border transition-all"
                      style={{
                        borderColor: filterCat === cat ? '#0891b2' : 'var(--border)',
                        color: filterCat === cat ? '#0891b2' : 'var(--text-3)',
                        background: filterCat === cat ? 'rgba(8,145,178,0.06)' : 'transparent',
                      }}>
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Daily Challenge Banner */}
                {dailyChallenge && (
                  <div className="mb-8 rounded-xl p-5"
                    style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderLeft: '4px solid #d97706' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#d97706' }}>
                        ⚡ Daily Challenge
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: '#fff', color: '#d97706' }}>
                        {dailyChallenge.points} pts
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>{dailyChallenge.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: '#fff', color: '#0891b2' }}>{dailyChallenge.category}</span>
                      <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: DIFFICULTY[dailyChallenge.difficulty as keyof typeof DIFFICULTY]?.bg, color: DIFFICULTY[dailyChallenge.difficulty as keyof typeof DIFFICULTY]?.text }}>
                        {dailyChallenge.difficulty}
                      </span>
                    </div>
                    <button
                      onClick={() => { setSelected(dailyChallenge.id); setAnswer(''); setHints([]); setUnlockedHints([]); setFeedback(null); loadHintsForChallenge(dailyChallenge.id); }}
                      className="font-mono text-xs py-2 px-4 rounded-md" style={{ background: '#d97706', color: '#fff' }}>
                      Solve Now →
                    </button>
                  </div>
                )}

                {/* Challenge Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map(ch => {
                    const d = DIFFICULTY[ch.difficulty as keyof typeof DIFFICULTY] || DIFFICULTY.Easy;
                    const isSolved = solved.includes(ch.id);
                    return (
                      <div key={ch.id}
                        className="card rounded-xl p-5 cursor-pointer"
                        onClick={() => { setSelected(ch.id); setAnswer(''); setHints([]); setUnlockedHints([]); setFeedback(null); setTappedId(ch.id); loadHintsForChallenge(ch.id); setTimeout(() => setTappedId(null), 150); }}
                        style={{ transform: tappedId === ch.id ? 'scale(0.98)' : undefined }}>
                        {isSolved && (
                          <div className="absolute top-3 right-3 font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: '#d1fae5', color: '#059669' }}>
                            ✓ Solved
                          </div>
                        )}

                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-mono text-[10px] px-2 py-1 rounded-md font-medium"
                            style={{ background: d.bg, color: d.text }}>
                            {ch.difficulty}
                          </span>
                          <span className="font-mono text-[10px]" style={{ color: 'var(--text-3)' }}>{ch.category}</span>
                          <span className="font-mono text-[10px] ml-auto" style={{ color: '#d97706' }}>{ch.points} pts</span>
                        </div>

                        <h3 className="font-display font-semibold text-base mb-1" style={{ color: 'var(--text)' }}>{ch.title}</h3>
                        <p className="text-sm mb-3" style={{ color: 'var(--text-2)' }}>{ch.description}</p>

                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs" style={{ color: 'var(--text-3)' }}>
                            {solveCounts[ch.id] || 0} solves
                          </span>
                          <span className="font-mono text-xs" style={{ color: isSolved ? '#059669' : '#0891b2' }}>
                            {isSolved ? 'Solved ✓' : 'Solve →'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {tab === 'leaderboard' && (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <p className="font-mono text-sm" style={{ color: 'var(--text-2)' }}>Top hackers by total points</p>
              <button onClick={loadData}
                className="font-mono text-xs px-3 py-1.5 rounded-md border transition-all"
                style={{ borderColor: 'var(--border)', color: 'var(--text-3)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0891b2'; e.currentTarget.style.color = '#0891b2'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-3)'; }}>
                ↻ Refresh
              </button>
            </div>

            {leaderboard.length > 0 ? (
              <div className="mb-6">
                <div className="flex items-end justify-center gap-3 md:gap-6 px-4">
                  {/* 2nd */}
                  {leaderboard[1] && (() => {
                    const entry = leaderboard[1];
                    const isMe = entry.username === getUsername();
                    return (
                      <div className="flex flex-col items-center gap-2 flex-1 max-w-[130px]">
                        <div className="text-3xl">🥈</div>
                        <div className="w-full rounded-xl p-4 flex flex-col items-center gap-1"
                          style={{ background: 'var(--surface)', border: '1.5px solid var(--border-2)' }}>
                          <span className="font-display font-semibold text-sm truncate w-full text-center"
                            style={{ color: isMe ? '#0891b2' : 'var(--text)' }}>
                            {entry.username}{isMe && <span style={{ color: '#d97706' }}> (you)</span>}
                          </span>
                          <span className="font-mono text-xl font-bold" style={{ color: '#94a3b8' }}>
                            {entry.points.toLocaleString()}
                          </span>
                          <span className="font-mono text-xs" style={{ color: 'var(--text-3)' }}>{entry.solves_count || 0} solves</span>
                        </div>
                        <div className="w-full rounded-t-xl flex items-center justify-center py-2"
                          style={{ background: 'var(--bg-3)', border: '1.5px solid var(--border-2)', borderBottom: 'none', height: '48px' }}>
                          <span className="font-mono text-xs font-bold" style={{ color: '#94a3b8' }}>#2</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 1st */}
                  {leaderboard[0] && (() => {
                    const entry = leaderboard[0];
                    const isMe = entry.username === getUsername();
                    return (
                      <div className="flex flex-col items-center gap-2 flex-1 max-w-[150px]">
                        <div className="text-4xl">🥇</div>
                        <div className="w-full rounded-xl p-5 flex flex-col items-center gap-1"
                          style={{ background: 'var(--surface)', border: '1.5px solid #fcd34d', boxShadow: '0 4px 12px rgba(217,119,6,0.1)' }}>
                          <span className="font-display font-semibold text-base truncate w-full text-center"
                            style={{ color: isMe ? '#0891b2' : 'var(--text)' }}>
                            {entry.username}{isMe && <span style={{ color: '#d97706' }}> (you)</span>}
                          </span>
                          <span className="font-mono text-3xl font-bold" style={{ color: '#d97706' }}>
                            {entry.points.toLocaleString()}
                          </span>
                          <span className="font-mono text-xs" style={{ color: 'var(--text-3)' }}>{entry.solves_count || 0} solves</span>
                        </div>
                        <div className="w-full rounded-t-xl flex items-center justify-center py-3"
                          style={{ background: '#fef3c7', border: '1.5px solid #fcd34d', borderBottom: 'none', height: '72px' }}>
                          <span className="font-mono text-sm font-bold" style={{ color: '#d97706' }}>#1</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 3rd */}
                  {leaderboard[2] && (() => {
                    const entry = leaderboard[2];
                    const isMe = entry.username === getUsername();
                    return (
                      <div className="flex flex-col items-center gap-2 flex-1 max-w-[130px]">
                        <div className="text-3xl">🥉</div>
                        <div className="w-full rounded-xl p-4 flex flex-col items-center gap-1"
                          style={{ background: 'var(--surface)', border: '1.5px solid var(--border-2)' }}>
                          <span className="font-display font-semibold text-sm truncate w-full text-center"
                            style={{ color: isMe ? '#0891b2' : 'var(--text)' }}>
                            {entry.username}{isMe && <span style={{ color: '#d97706' }}> (you)</span>}
                          </span>
                          <span className="font-mono text-xl font-bold" style={{ color: '#cd7f32' }}>
                            {entry.points.toLocaleString()}
                          </span>
                          <span className="font-mono text-xs" style={{ color: 'var(--text-3)' }}>{entry.solves_count || 0} solves</span>
                        </div>
                        <div className="w-full rounded-t-xl flex items-center justify-center py-2"
                          style={{ background: 'var(--bg-3)', border: '1.5px solid var(--border-2)', borderBottom: 'none', height: '48px' }}>
                          <span className="font-mono text-xs font-bold" style={{ color: '#cd7f32' }}>#3</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="rounded-xl p-8 text-center font-mono text-sm mb-8"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-3)' }}>
                No submissions yet. Be the first!
              </div>
            )}

            {leaderboard.length > 3 && (
              <div className="rounded-xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                {leaderboard.slice(3).map((entry: any, i: number) => {
                  const isMe = entry.username === getUsername();
                  return (
                    <div key={i}
                      className="flex items-center gap-4 px-6 py-3"
                      style={{ borderBottom: i < leaderboard.slice(3).length - 1 ? '1px solid var(--border)' : undefined }}>
                      <span className="font-mono font-bold text-sm w-5" style={{ color: 'var(--text-3)' }}>#{i + 4}</span>
                      <span className="font-mono text-sm flex-1"
                        style={{ color: isMe ? '#0891b2' : 'var(--text)', fontWeight: isMe ? 600 : 400 }}>
                        {entry.username} {isMe ? '(you)' : ''}
                      </span>
                      <span className="font-mono text-xs" style={{ color: 'var(--text-3)' }}>{entry.solves_count || 0} solves</span>
                      <span className="font-mono text-sm font-bold" style={{ color: '#059669' }}>
                        {entry.points.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selected && (() => {
        const ch = challenges.find(c => c.id === selected);
        if (!ch) return null;
        const d = DIFFICULTY[ch.difficulty as keyof typeof DIFFICULTY] || DIFFICULTY.Easy;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
            <div className="w-full max-w-lg rounded-2xl p-6 md:p-8"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(15,23,42,0.12)' }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>{ch.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[10px] px-2 py-1 rounded-md" style={{ background: d.bg, color: d.text }}>{ch.difficulty}</span>
                    <span className="font-mono text-[10px]" style={{ color: '#d97706' }}>{ch.points} pts</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: 'var(--bg-3)', color: 'var(--text-2)' }}>
                  ✕
                </button>
              </div>

              <p className="text-sm mb-5" style={{ color: 'var(--text-2)' }}>{ch.description}</p>

              {hints.length > 0 && (
                <div className="space-y-2 mb-5">
                  {hints.map((hint, i) => {
                    const isUnlocked = unlockedHints.includes(hint.id);
                    const cost = hint.unlock_cost ?? 50;
                    return (
                      <div key={hint.id}
                        className="rounded-lg p-4"
                        style={{
                          background: isUnlocked ? '#d1fae5' : 'var(--bg-3)',
                          border: isUnlocked ? '1px solid #6ee7b7' : '1px solid var(--border)',
                        }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs font-semibold" style={{ color: 'var(--text-2)' }}>
                            Hint {i + 1}
                          </span>
                          {!isUnlocked && (
                            <button
                              onClick={() => handleUnlockHint(hint.id, cost)}
                              disabled={userPoints < cost}
                              className="font-mono text-[10px] px-3 py-1 rounded-md border"
                              style={{
                                borderColor: userPoints >= cost ? '#d97706' : 'var(--border)',
                                color: userPoints >= cost ? '#d97706' : 'var(--text-3)',
                                background: userPoints >= cost ? '#fef3c7' : 'transparent',
                                cursor: userPoints >= cost ? 'pointer' : 'not-allowed',
                              }}>
                              Unlock — {cost} pts
                            </button>
                          )}
                          {isUnlocked && (
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: '#d1fae5', color: '#059669' }}>✓</span>
                          )}
                        </div>
                        {isUnlocked && (
                          <p className="font-mono text-xs" style={{ color: '#065f46' }}>{hint.hint_text}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {feedback && (
                <div className="rounded-lg p-3 mb-4 font-mono text-xs"
                  style={{
                    background: feedback.ok ? '#d1fae5' : '#fee2e2',
                    color: feedback.ok ? '#059669' : '#dc2626',
                    border: feedback.ok ? '1px solid #6ee7b7' : '1px solid #fca5a5',
                  }}>
                  {feedback.msg}
                </div>
              )}

              <div className="flex gap-3">
                <input
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmitFlag(ch.id, answer, ch.points)}
                  placeholder="seclab{...}"
                  className="input flex-1"
                  style={{ background: 'var(--bg)' }}
                  disabled={submitting}
                />
                <button onClick={() => handleSubmitFlag(ch.id, answer, ch.points)}
                  disabled={submitting}
                  className="btn-primary">
                  {submitting ? 'Checking...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* FOOTER */}
      <footer className="px-6 py-10" style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0891b2' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L15 4.5V11.5L8 15L1 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5"/>
                <path d="M5.5 8L7 9.5L10.5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-xs" style={{ color: 'var(--text)' }}>
              Sec<span style={{ color: '#0891b2' }}>Lab</span><span style={{ color: '#d97706' }}>.ng</span>
            </span>
          </div>
          <p className="font-mono text-xs" style={{ color: 'var(--text-3)' }}>© 2026 SecLab Nigeria · Built in Nigeria</p>
        </div>
      </footer>
    </div>
  );
}