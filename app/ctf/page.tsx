'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, fetchChallenges, fetchLeaderboard, submitFlag, getSolveCount, getUserSolvedChallenges, upsertProfile, getHints, unlockHint, getUnlockedHints } from '@/app/lib/supabase';
import StreakCounter, { addXP } from '@/app/components/StreakCounter';

const DIFFICULTY = {
  Easy:   { color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', text: '#10b981' },
  Medium: { color: '#f0a500', bg: 'rgba(240,165,0,0.08)', border: 'rgba(240,165,0,0.2)', text: '#f0a500' },
  Hard:   { color: '#f05252', bg: 'rgba(240,82,82,0.08)', border: 'rgba(240,82,82,0.2)', text: '#f05252' },
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
  const [tappedId, setTappedId] = useState<number | null>(null);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const categories = ['All', 'Web', 'Crypto', 'Network', 'Forensics'];

  useEffect(() => {
    const uid = getUserId();
    const uname = getUsername();
    setTempName(uname);
    upsertProfile(uid, uname).catch(console.error);
    loadData(uid);
  }, []);

  async function loadData(uid: string) {
    try {
      setLoading(true);
      const [chData, solvedIds, lbData] = await Promise.all([
        fetchChallenges(),
        getUserSolvedChallenges(uid),
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
      const result = await submitFlag(getUserId(), getUsername(), challengeId, answer.trim(), points);
      if (result.correct) {
        setSolved(prev => [...prev, challengeId]);
        setSolveCounts(prev => ({ ...prev, [challengeId]: (prev[challengeId] || 0) + 1 }));
        setUserPoints(result.newPoints > 0 ? result.newPoints : 0);
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
  }, [answer]);

  async function loadHintsForChallenge(challengeId: number) {
    const [h, unlocked] = await Promise.all([getHints(challengeId), getUnlockedHints(getUserId())]);
    setHints(h);
    setUnlockedHints(unlocked);
  }

  async function handleUnlockHint(hintId: number, cost: number) {
    if (userPoints < cost) return;
    await unlockHint(getUserId(), hintId);
    setUnlockedHints(prev => [...prev, hintId]);
    setUserPoints(prev => prev - cost);
  }

  const filtered = filterCat === 'All' ? challenges : challenges.filter(c => c.category === filterCat);
  const totalSolves = Object.values(solveCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 glass">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00c9a7 0%, #00e8c6 100%)', boxShadow: '0 0 20px rgba(0,201,167,0.3)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke="black" strokeWidth="1.5"/>
                <path d="M8 12L10.5 14.5L16 9" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-sm tracking-tight" style={{ color: 'var(--text)' }}>
              Sec<span style={{ color: '#00c9a7' }}>Lab</span><span style={{ color: '#f0a500' }}>.ng</span>
            </span>
          </a>
          <div className="flex items-center gap-6">
            <a href="/ctf" className="nav-link" style={{ color: '#00c9a7' }}>CTF</a>
            <a href="/courses" className="nav-link" style={{ color: 'var(--text-2)' }}>Courses</a>
            <a href="/recon" className="nav-link" style={{ color: 'var(--text-2)' }}>Recon</a>
          </div>
        </div>
      </nav>

      {/* ── HEADER ── */}
      <div className="pt-12 pb-0 px-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          <span className="section-label">// CTF PLATFORM</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-3 mb-8">
            <div>
              <h1 className="font-display font-bold text-4xl" style={{ color: 'var(--text)' }}>
                <span style={{ color: '#00c9a7' }}>Sec</span>Lab <span className="gradient-text">CTF</span>
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
                  <span style={{ color: '#00c9a7' }}>{userPoints.toLocaleString()}</span> pts ·{' '}
                  <span style={{ color: '#f0a500' }}>{solved.length}</span> solves
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
                  borderColor: tab === id ? '#00c9a7' : 'transparent',
                  color: tab === id ? '#00c9a7' : 'var(--text-3)',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {tab === 'challenges' && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex items-center gap-3 font-mono text-sm" style={{ color: 'var(--text-3)' }}>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1V4M8 12V15M1 8H4M12 8H15M3.05 3.05L5.28 5.28M10.72 10.72L12.95 12.95M3.05 12.95L5.28 10.72M10.72 5.28L12.95 3.05"
                      stroke="#00c9a7" strokeWidth="1.5" strokeLinecap="round"/>
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
                        borderColor: filterCat === cat ? '#00c9a7' : 'var(--border-2)',
                        color: filterCat === cat ? '#00c9a7' : 'var(--text-3)',
                        background: filterCat === cat ? 'rgba(0,201,167,0.06)' : 'transparent',
                      }}>
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Daily Challenge Banner */}
                {dailyChallenge && (
                  <div className="mb-8 rounded-2xl p-5"
                    style={{ background: 'rgba(240,165,0,0.06)', border: '1px solid rgba(240,165,0,0.2)', borderLeft: '4px solid #f0a500' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#f0a500' }}>
                        ⚡ Daily Challenge
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <p className="font-display font-bold text-base mb-1" style={{ color: 'var(--text)' }}>{dailyChallenge.title}</p>
                        <p className="font-mono text-xs" style={{ color: 'var(--text-2)' }}>{dailyChallenge.category} · {dailyChallenge.points} pts · {dailyChallenge.solve_count || 0} solves</p>
                      </div>
                      <button
                        onClick={() => { setSelected(dailyChallenge.id); loadHintsForChallenge(dailyChallenge.id); setTappedId(dailyChallenge.id); }}
                        className="font-mono text-xs px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap"
                        style={{ background: 'rgba(240,165,0,0.12)', color: '#f0a500', border: '1px solid rgba(240,165,0,0.25)' }}>
                        Attempt →
                      </button>
                    </div>
                  </div>
                )}

                {/* Challenge Grid */}
                <div className="grid gap-3">
                  {filtered.map(ch => {
                    const isSolved = solved.includes(ch.id);
                    const isSelected = selected === ch.id;
                    const diff = DIFFICULTY[ch.difficulty as keyof typeof DIFFICULTY];
                    return (
                      <div key={ch.id}
                        className="card p-5 cursor-pointer"
                        onClick={() => { setSelected(isSelected ? null : ch.id); if (!isSelected) { loadHintsForChallenge(ch.id); setAnswer(''); setFeedback(null); } }}
                        style={isSelected ? { borderColor: 'var(--brand-border)', background: 'var(--surface-2)' } : {}}>
                        <div className="flex items-start gap-4">
                          {/* Solved indicator */}
                          <div className="flex-shrink-0 mt-0.5">
                            {isSolved ? (
                              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
                                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                  <path d="M2 6L5 9L10 3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full" style={{ border: '1.5px solid var(--border-2)' }} />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-display font-semibold text-sm" style={{ color: 'var(--text)' }}>{ch.title}</span>
                              <span className="font-mono text-[10px] px-2 py-0.5 rounded-md"
                                style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}>
                                {ch.difficulty}
                              </span>
                              <span className="font-mono text-[10px] px-2 py-0.5 rounded-md"
                                style={{ background: 'var(--surface-3)', color: 'var(--text-3)' }}>
                                {ch.category}
                              </span>
                            </div>
                            <p className="font-mono text-xs truncate" style={{ color: 'var(--text-3)' }}>{ch.description}</p>
                          </div>

                          <div className="flex-shrink-0 text-right">
                            <div className="font-mono text-sm font-semibold" style={{ color: '#00c9a7' }}>{ch.points}</div>
                            <div className="font-mono text-[10px]" style={{ color: 'var(--text-4)' }}>{solveCounts[ch.id] || 0} solves</div>
                          </div>
                        </div>

                        {/* Expanded: solve panel */}
                        {isSelected && (
                          <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
                            {ch.flag && (
                              <p className="font-mono text-xs mb-4 px-4 py-3 rounded-xl"
                                style={{ background: 'var(--surface-3)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>
                                💡 <span style={{ color: 'var(--text-2)' }}>Hint:</span> {ch.flag}
                              </p>
                            )}

                            {/* Hints */}
                            {hints.length > 0 && (
                              <div className="space-y-2 mb-4">
                                <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--text-4)' }}>Hints</p>
                                {hints.map((hint, i) => {
                                  const isUnlocked = unlockedHints.includes(hint.id);
                                  const cost = hint.unlock_cost;
                                  return (
                                    <div key={hint.id} className="rounded-xl p-3"
                                      style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }}>
                                      <div className="flex items-center justify-between gap-3 mb-1">
                                        <span className="font-mono text-xs font-semibold" style={{ color: 'var(--text-2)' }}>
                                          Hint {i + 1}
                                        </span>
                                        {!isUnlocked && (
                                          <button
                                            onClick={() => handleUnlockHint(hint.id, cost)}
                                            disabled={userPoints < cost}
                                            className="font-mono text-[10px] px-3 py-1 rounded-md border"
                                            style={{
                                              borderColor: userPoints >= cost ? '#f0a500' : 'var(--border-2)',
                                              color: userPoints >= cost ? '#f0a500' : 'var(--text-3)',
                                              background: userPoints >= cost ? 'rgba(240,165,0,0.08)' : 'transparent',
                                              cursor: userPoints >= cost ? 'pointer' : 'not-allowed',
                                            }}>
                                            Unlock — {cost} pts
                                          </button>
                                        )}
                                        {isUnlocked && (
                                          <span className="font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981' }}>✓</span>
                                        )}
                                      </div>
                                      {isUnlocked && (
                                        <p className="font-mono text-xs" style={{ color: 'var(--text-2)' }}>{hint.hint_text}</p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {feedback && (
                              <div className="rounded-lg p-3 mb-4 font-mono text-xs"
                                style={{
                                  background: feedback.ok ? 'rgba(16,185,129,0.08)' : 'rgba(240,82,82,0.08)',
                                  color: feedback.ok ? '#10b981' : '#f05252',
                                  border: feedback.ok ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(240,82,82,0.2)',
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
                                disabled={submitting}
                              />
                              <button onClick={() => handleSubmitFlag(ch.id, answer, ch.points)}
                                disabled={submitting}
                                className="btn-primary">
                                {submitting ? 'Checking...' : 'Submit'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {tab === 'leaderboard' && (
          <div>
            <div className="card rounded-2xl overflow-hidden">
              {/* Leaderboard header */}
              <div className="grid grid-cols-3 px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                {['Rank', 'Player', 'Points'].map((h, i) => (
                  <div key={h} className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-4)' }}>{h}</div>
                ))}
              </div>
              {/* My entry */}
              <div className="grid grid-cols-3 px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,201,167,0.04)' }}>
                <div className="font-mono text-sm" style={{ color: '#00c9a7' }}>#{leaderboard.findIndex(p => p.username === getUsername()) + 1 || '—'}</div>
                <div className="font-mono text-sm font-semibold" style={{ color: '#00c9a7' }}>{getUsername()} (you)</div>
                <div className="font-mono text-sm font-semibold" style={{ color: '#00c9a7' }}>{userPoints}</div>
              </div>
              {/* Others */}
              {leaderboard.slice(0, 20).map((entry, i) => {
                const isMe = entry.username === getUsername();
                return (
                  <div key={i} className="grid grid-cols-3 px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)', background: isMe ? 'rgba(0,201,167,0.04)' : 'transparent' }}>
                    <div className="flex items-center gap-2">
                      {i < 3 ? (
                        <span className="font-mono text-sm" style={{ color: ['#f0a500','#a0a0b0','#cd7f32'][i] }}>
                          #{i + 1}
                        </span>
                      ) : (
                        <span className="font-mono text-xs" style={{ color: 'var(--text-4)' }}>#{i + 1}</span>
                      )}
                    </div>
                    <div className="font-mono text-sm" style={{ color: isMe ? '#00c9a7' : 'var(--text-2)' }}>{entry.username}</div>
                    <div className="font-mono text-sm font-semibold" style={{ color: isMe ? '#00c9a7' : 'var(--text-3)' }}>{entry.points}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="px-6 py-10" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00c9a7 0%, #00e8c6 100%)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke="black" strokeWidth="1.5"/>
                <path d="M8 12L10.5 14.5L16 9" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-xs" style={{ color: 'var(--text)' }}>
              Sec<span style={{ color: '#00c9a7' }}>Lab</span><span style={{ color: '#f0a500' }}>.ng</span>
            </span>
          </div>
          <p className="font-mono text-xs" style={{ color: 'var(--text-3)' }}>© 2026 SecLab Nigeria · Built in Nigeria</p>
        </div>
      </footer>
    </div>
  );
}