'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, fetchChallenges, fetchLeaderboard, submitFlag, getSolveCount, getUserSolvedChallenges, upsertProfile, getHints, unlockHint, getUnlockedHints } from '@/app/lib/supabase';
import StreakCounter, { addXP } from '@/app/components/StreakCounter';

const DIFFICULTY = {
  Easy:   { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)' },
  Medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
  Hard:   { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)' },
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
  const [filter, setFilter] = useState('All');
  const [tab, setTab] = useState<'challenges' | 'leaderboard'>('challenges');
  const [filterCat, setFilterCat] = useState('All');
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

      // Set daily challenge (seeded by today's date)
      const today = new Date().toISOString().slice(0, 10);
      const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      const daily = (chData || [])[seed % (chData || []).length] || null;
      setDailyChallenge(daily);

      // Get solve counts per challenge
      const counts: Record<number, number> = {};
      for (const ch of chData || []) {
        counts[ch.id] = await getSolveCount(ch.id);
      }
      setSolveCounts(counts);
      setLeaderboard(lbData || []);

      // User's own points
      const myEntry = lbData?.find((p: any) => p.username === getUsername());
      if (myEntry) setUserPoints(myEntry.points);
    } catch (e) {
      console.error('Failed to load CTF data:', e);
      // Fallback to static data
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
        addXP(challenge.points);
        const lb = await fetchLeaderboard();
        setLeaderboard(lb || []);
        setSelected(null);
        setAnswer('');
      }
    } catch (e: any) {
      setFeedback({ ok: false, msg: e?.message || 'Submission failed. Try again.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  }, [answer, userId, userPoints]);

  async function loadHintsForChallenge(challengeId: number) {
    const [h, unlocked] = await Promise.all([
      getHints(challengeId),
      getUnlockedHints(userId),
    ]);
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
    <div className="min-h-screen" style={{ background: '#09090b' }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6"
        style={{ background: 'rgba(9,9,11,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1e1e24' }}>
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="#06b6d4" strokeWidth="1.5" fill="rgba(6,182,212,0.1)"/>
              <path d="M9 14L12 17L19 10" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="font-display font-bold text-sm" style={{ color: '#f4f4f5' }}>
              Sec<span style={{ color: '#06b6d4' }}>Lab</span><span style={{ color: '#f59e0b' }}>NG</span>
            </span>
          </a>
          <div className="flex items-center gap-6">
            <a href="/ctf" className="nav-link" style={{ color: '#06b6d4' }}>CTF</a>
            <a href="/courses" className="nav-link">Courses</a>
            <a href="/recon" className="nav-link">Recon</a>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <div className="pt-32 pb-0 px-6" style={{ borderBottom: '1px solid #1e1e24' }}>
        <div className="max-w-6xl mx-auto">
          <span className="section-label">// CTF PLATFORM</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-3 mb-8">
            <div>
              <h1 className="font-display font-bold text-4xl" style={{ color: '#f4f4f5' }}>
                <span style={{ color: '#06b6d4' }}>Sec</span>Lab <span style={{ color: '#f59e0b' }}>CTF</span>
              </h1>
              <p className="font-mono text-sm mt-1" style={{ color: '#52525b' }}>
                {challenges.length} challenges · {totalSolves.toLocaleString()} total solves · Live leaderboard
              </p>
            </div>

            {/* User stats + name editor */}
            <div className="flex flex-col items-end gap-2">
              {editingName ? (
                <div className="flex gap-2">
                  <input
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        setUsername(tempName.trim() || 'Anonymous');
                        setEditingName(false);
                      }
                      if (e.key === 'Escape') setEditingName(false);
                    }}
                    className="tool-input w-full sm:w-36"
                    autoFocus
                  />
                  <button onClick={() => { setUsername(tempName.trim() || 'Anonymous'); setEditingName(false); }}
                    className="btn-primary py-2 px-3 text-xs">Save</button>
                </div>
              ) : (
                <button onClick={() => { setTempName(getUsername()); setEditingName(true); }}
                  className="flex items-center gap-2 font-mono text-xs transition-colors"
                  style={{ color: '#71717a' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#06b6d4')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>
                  <span>👤 {getUsername()}</span>
                  <span style={{ color: '#3f3f46' }}>✎</span>
                </button>
              )}
              <div className="flex items-center gap-4">
                <div className="font-mono text-xs" style={{ color: '#52525b' }}>
                  <span style={{ color: '#06b6d4' }}>{userPoints.toLocaleString()}</span> pts ·{' '}
                  <span style={{ color: '#f59e0b' }}>{solved.length}</span> solves
                </div>
                <StreakCounter />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-[#1e1e24] pb-0 mb-0">
            {[['challenges', 'Challenges'], ['leaderboard', 'Leaderboard']].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id as typeof tab)}
                className="font-mono text-sm pb-3 border-b-2 transition-all"
                style={{
                  borderColor: tab === id ? '#06b6d4' : 'transparent',
                  color: tab === id ? '#06b6d4' : '#52525b',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {tab === 'challenges' && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex items-center gap-3 font-mono text-sm" style={{ color: '#52525b' }}>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1V4M8 12V15M1 8H4M12 8H15M3.05 3.05L5.28 5.28M10.72 10.72L12.95 12.95M3.05 12.95L5.28 10.72M10.72 5.28L12.95 3.05"
                      stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Loading challenges...
                </div>
              </div>
            ) : (
              <>
                {/* Filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setFilterCat(cat)}
                      className="font-mono text-xs px-3 py-1.5 rounded-md border transition-all"
                      style={{
                        borderColor: filterCat === cat ? '#06b6d4' : '#1e1e24',
                        color: filterCat === cat ? '#06b6d4' : '#52525b',
                        background: filterCat === cat ? 'rgba(6,182,212,0.08)' : 'transparent',
                      }}>
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Daily Challenge Banner */}
                {dailyChallenge && (
                  <div className="mb-8 rounded-xl p-5 relative overflow-hidden"
                    style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', boxShadow: '0 0 30px rgba(245,158,11,0.12)' }}>
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)' }} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#f59e0b' }}>⚡ Daily Challenge</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>{dailyChallenge.points} pts</span>
                      </div>
                      <h3 className="font-display font-bold text-lg mb-2" style={{ color: '#f4f4f5' }}>{dailyChallenge.title}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.2)' }}>{dailyChallenge.category}</span>
                        <span className="font-mono text-[10px] px-2 py-1 rounded" style={{ background: DIFFICULTY[dailyChallenge.difficulty as keyof typeof DIFFICULTY]?.bg, color: DIFFICULTY[dailyChallenge.difficulty as keyof typeof DIFFICULTY]?.color }}>{dailyChallenge.difficulty}</span>
                      </div>
                      <button
                        onClick={() => { setSelected(dailyChallenge.id); setAnswer(''); setHints([]); setUnlockedHints([]); setFeedback(null); loadHintsForChallenge(dailyChallenge.id); }}
                        className="font-mono text-xs py-2 px-4 rounded-md transition-all"
                        style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                        Solve Now →
                      </button>
                    </div>
                  </div>
                )}

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map(ch => {
                    const d = DIFFICULTY[ch.difficulty as keyof typeof DIFFICULTY] || DIFFICULTY.Easy;
                    const isSolved = solved.includes(ch.id);
                    return (
                      <div key={ch.id}
                        className={`card rounded-xl p-6 relative overflow-hidden cursor-pointer card-tap transition-all duration-200 hover:-translate-y-1 card-shimmer card-glow-${ch.category.toLowerCase()}`}
                        onClick={() => {
                          setSelected(ch.id);
                          setAnswer('');
                          setHints([]);
                          setUnlockedHints([]);
                          setFeedback(null);
                          setTappedId(ch.id);
                          loadHintsForChallenge(ch.id);
                          setTimeout(() => setTappedId(null), 150);
                        }}
                        style={{
                          background: '#111116',
                          border: `1px solid ${isSolved ? 'rgba(34,197,94,0.3)' : '#1e1e24'}`,
                          transform: tappedId === ch.id ? 'scale(0.97)' : undefined,
                          transition: 'transform 0.1s ease',
                        }}>
                        {isSolved && (
                          <div className="absolute top-4 right-4 font-mono text-[10px] px-2 py-0.5 rounded"
                            style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }}>
                            SOLVED
                          </div>
                        )}

                        <div className="flex items-center gap-2 mb-4">
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded"
                            style={{ background: d.bg, color: d.color, border: `1px solid ${d.border}` }}>
                            {ch.difficulty === 'Easy' ? '🟢 ' : ch.difficulty === 'Medium' ? '🟡 ' : '🔴 '}{ch.difficulty}
                          </span>
                          <span className="font-mono text-[10px]" style={{ color: '#3f3f46' }}>{ch.category}</span>
                          <span className="font-mono text-[10px] ml-auto" style={{ color: '#f59e0b' }}>{ch.points} pts</span>
                        </div>

                        <h3 className="font-display font-semibold text-base mb-2" style={{ color: '#f4f4f5' }}>{ch.title}</h3>
                        <p className="text-sm leading-relaxed mb-4" style={{ color: '#71717a' }}>{ch.description}</p>

                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {(ch.tags || []).map((tag: string) => (
                            <span key={tag} className="font-mono text-[10px] px-2 py-0.5 rounded"
                              style={{ background: 'rgba(255,255,255,0.04)', color: '#52525b', border: '1px solid #1e1e24' }}>
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs" style={{ color: '#3f3f46' }}>
                            {solveCounts[ch.id] || 0} solves
                          </span>
                          <button
                            onClick={() => { setSelected(ch.id); setAnswer(''); setHints([]); setUnlockedHints([]); setFeedback(null); loadHintsForChallenge(ch.id); }}
                            className="font-mono text-xs transition-colors"
                            style={{ color: isSolved ? '#22c55e' : '#06b6d4' }}>
                            {isSolved ? 'Solved ✓' : 'Solve →'}
                          </button>
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
              <p className="font-mono text-sm" style={{ color: '#52525b' }}>Top hackers ranked by total points</p>
              <button onClick={loadData}
                className="font-mono text-xs px-3 py-1.5 rounded-md border transition-all"
                style={{ borderColor: '#1e1e24', color: '#52525b' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#06b6d4'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e24'; e.currentTarget.style.color = '#52525b'; }}>
                ↻ Refresh
              </button>
            </div>

            {/* Podium for top 3 */}
            {leaderboard.length > 0 ? (
              <div className="mb-8">
                <div className="flex items-end justify-center gap-3 md:gap-6 px-4">
                  {/* 3rd place */}
                  {leaderboard[2] && (() => {
                    const entry = leaderboard[2];
                    const isMe = entry.username === getUsername();
                    return (
                      <div className="flex flex-col items-center gap-3 flex-1 max-w-[140px]">
                        <div className="text-3xl">🥉</div>
                        <div className="w-full rounded-xl p-4 flex flex-col items-center gap-1"
                          style={{
                            background: '#111116',
                            border: '1.5px solid rgba(205,127,50,0.4)',
                            boxShadow: '0 0 20px rgba(205,127,50,0.08)',
                          }}>
                          <span className="font-display font-semibold text-sm truncate w-full text-center"
                            style={{ color: isMe ? '#06b6d4' : '#f4f4f5' }}>
                            {entry.username}
                            {isMe && <span style={{ color: '#f59e0b' }}> (you)</span>}
                          </span>
                          <span className="font-mono text-2xl font-bold" style={{ color: '#cd7f32' }}>
                            {entry.points.toLocaleString()}
                          </span>
                          <span className="font-mono text-xs" style={{ color: '#52525b' }}>
                            {entry.solves_count || 0} solves
                          </span>
                        </div>
                        <div className="w-full rounded-t-xl flex items-center justify-center py-3"
                          style={{ background: 'rgba(205,127,50,0.15)', border: '1.5px solid rgba(205,127,50,0.4)', borderBottom: 'none', height: '60px' }}>
                          <span className="font-mono text-xs font-bold" style={{ color: '#cd7f32' }}>#3</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 1st place */}
                  {leaderboard[0] && (() => {
                    const entry = leaderboard[0];
                    const isMe = entry.username === getUsername();
                    return (
                      <div className="flex flex-col items-center gap-3 flex-1 max-w-[160px]">
                        <div className="text-4xl">🥇</div>
                        <div className="w-full rounded-xl p-5 flex flex-col items-center gap-1"
                          style={{
                            background: '#111116',
                            border: '1.5px solid rgba(245,158,11,0.5)',
                            boxShadow: '0 0 30px rgba(245,158,11,0.12)',
                          }}>
                          <span className="font-display font-semibold text-base truncate w-full text-center"
                            style={{ color: isMe ? '#06b6d4' : '#f4f4f5' }}>
                            {entry.username}
                            {isMe && <span style={{ color: '#f59e0b' }}> (you)</span>}
                          </span>
                          <span className="font-mono text-3xl font-bold" style={{ color: '#f59e0b' }}>
                            {entry.points.toLocaleString()}
                          </span>
                          <span className="font-mono text-xs" style={{ color: '#52525b' }}>
                            {entry.solves_count || 0} solves
                          </span>
                        </div>
                        <div className="w-full rounded-t-xl flex items-center justify-center py-4"
                          style={{ background: 'rgba(245,158,11,0.2)', border: '1.5px solid rgba(245,158,11,0.5)', borderBottom: 'none', height: '80px' }}>
                          <span className="font-mono text-sm font-bold" style={{ color: '#f59e0b' }}>#1</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 2nd place */}
                  {leaderboard[1] && (() => {
                    const entry = leaderboard[1];
                    const isMe = entry.username === getUsername();
                    return (
                      <div className="flex flex-col items-center gap-3 flex-1 max-w-[140px]">
                        <div className="text-3xl">🥈</div>
                        <div className="w-full rounded-xl p-4 flex flex-col items-center gap-1"
                          style={{
                            background: '#111116',
                            border: '1.5px solid rgba(163,163,173,0.4)',
                            boxShadow: '0 0 20px rgba(163,163,173,0.06)',
                          }}>
                          <span className="font-display font-semibold text-sm truncate w-full text-center"
                            style={{ color: isMe ? '#06b6d4' : '#f4f4f5' }}>
                            {entry.username}
                            {isMe && <span style={{ color: '#f59e0b' }}> (you)</span>}
                          </span>
                          <span className="font-mono text-2xl font-bold" style={{ color: '#a1a1aa' }}>
                            {entry.points.toLocaleString()}
                          </span>
                          <span className="font-mono text-xs" style={{ color: '#52525b' }}>
                            {entry.solves_count || 0} solves
                          </span>
                        </div>
                        <div className="w-full rounded-t-xl flex items-center justify-center py-3"
                          style={{ background: 'rgba(161,161,170,0.12)', border: '1.5px solid rgba(163,163,173,0.4)', borderBottom: 'none', height: '60px' }}>
                          <span className="font-mono text-xs font-bold" style={{ color: '#a1a1aa' }}>#2</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="rounded-xl p-8 text-center font-mono text-sm mb-8"
                style={{ background: '#111116', border: '1px solid #1e1e24', color: '#52525b' }}>
                No submissions yet. Be the first!
              </div>
            )}

            {/* Rest of leaderboard (positions 4+) */}
            {leaderboard.length > 3 && (
              <div className="rounded-xl overflow-hidden" style={{ background: '#111116', border: '1px solid #1e1e24' }}>
                {leaderboard.slice(3).map((entry: any, i: number) => {
                  const isMe = entry.username === getUsername();
                  return (
                    <div key={i}
                      className="flex items-center gap-4 px-6 py-4"
                      style={{
                        borderBottom: i < leaderboard.slice(3).length - 1 ? '1px solid #1e1e24' : undefined,
                        background: isMe ? 'rgba(6,182,212,0.05)' : undefined,
                      }}>
                      <span className="font-mono font-bold text-sm w-5"
                        style={{ color: '#3f3f46' }}>
                        #{i + 4}
                      </span>
                      <span className="font-mono text-sm flex-1"
                        style={{ color: isMe ? '#06b6d4' : '#f4f4f5', fontWeight: isMe ? 600 : 400 }}>
                        {entry.username} {isMe ? '(you)' : ''}
                      </span>
                      <span className="font-mono text-xs" style={{ color: '#52525b' }}>{entry.solves_count || 0} solves</span>
                      <span className="font-mono text-sm font-bold" style={{ color: '#22c55e' }}>
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
            style={{ background: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
            <div className="w-full max-w-lg rounded-2xl p-4 md:p-8"
              style={{ background: '#111116', border: '1px solid #1e1e24' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display font-bold text-lg" style={{ color: '#f4f4f5' }}>{ch.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: d.bg, color: d.color }}>{ch.difficulty}</span>
                    <span className="font-mono text-[10px]" style={{ color: '#f59e0b' }}>{ch.points} pts</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: '#16161c', color: '#71717a' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1e1e24')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#16161c')}>
                  ✕
                </button>
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color: '#71717a' }}>{ch.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {(ch.tags || []).map((tag: string) => (
                  <span key={tag} className="font-mono text-[10px] px-2 py-0.5 rounded"
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#52525b', border: '1px solid #1e1e24' }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Hints section */}
              {hints.length > 0 ? (
                <div className="space-y-3 mb-5">
                  {hints.map((hint, i) => {
                    const isUnlocked = unlockedHints.includes(hint.id);
                    const cost = hint.unlock_cost ?? 50;
                    return (
                      <div key={hint.id}
                        className="rounded-lg p-4"
                        style={{
                          background: isUnlocked ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.02)',
                          border: isUnlocked ? '1px solid rgba(34,197,94,0.2)' : '1px solid #1e1e24',
                        }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-semibold" style={{ color: '#71717a' }}>
                            Hint {i + 1}
                          </span>
                          {!isUnlocked && (
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded"
                              style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                              🔒 {cost} pts
                            </span>
                          )}
                          {isUnlocked && (
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded"
                              style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
                              ✓ Unlocked
                            </span>
                          )}
                        </div>
                        {isUnlocked ? (
                          <p className="font-mono text-xs" style={{ color: '#22c55e' }}>{hint.hint_text}</p>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs" style={{ color: '#3f3f46' }}>Spend {cost} pts to reveal</span>
                            <button
                              onClick={() => handleUnlockHint(hint.id, cost)}
                              disabled={userPoints < cost}
                              className="font-mono text-[10px] px-3 py-1 rounded-md border transition-all"
                              style={{
                                borderColor: userPoints >= cost ? 'rgba(245,158,11,0.4)' : '#1e1e24',
                                color: userPoints >= cost ? '#f59e0b' : '#3f3f46',
                                background: userPoints >= cost ? 'rgba(245,158,11,0.08)' : 'transparent',
                                cursor: userPoints >= cost ? 'pointer' : 'not-allowed',
                              }}>
                              Unlock — {cost} pts
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="font-mono text-xs mb-5" style={{ color: '#3f3f46' }}>Hints coming soon</p>
              )}

              {feedback && (
                <div className="rounded-lg p-3 mb-4 font-mono text-xs"
                  style={{
                    background: feedback.ok ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                    color: feedback.ok ? '#22c55e' : '#ef4444',
                    border: feedback.ok ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(239,68,68,0.2)',
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
                  className="tool-input flex-1"
                  disabled={submitting}
                />
                <button
                  onClick={() => handleSubmitFlag(ch.id, answer, ch.points)}
                  disabled={submitting}
                  className="btn-primary">
                  {submitting ? (
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1V4M7 10V13M1 7H4M10 7H13M3.05 3.05L5.28 5.28M8.72 8.72L10.95 10.95M3.05 10.95L5.28 8.72M8.72 5.28L10.95 3.05"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ) : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* FOOTER */}
      <footer className="px-6 py-12" style={{ borderTop: '1px solid #1e1e24' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="#06b6d4" strokeWidth="1.5" fill="rgba(6,182,212,0.1)"/>
              <path d="M9 14L12 17L19 10" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="font-display font-bold text-sm" style={{ color: '#f4f4f5' }}>
              Sec<span style={{ color: '#06b6d4' }}>Lab</span><span style={{ color: '#f59e0b' }}>NG</span>
            </span>
          </div>
          <p className="font-mono text-xs" style={{ color: '#3f3f46' }}>© 2026 SecLab Nigeria · Powered by Supabase</p>
        </div>
      </footer>
    </div>
  );
}