'use client';

import { useState, useEffect } from 'react';
import { openCheckout, isTierConfigured, type TierName } from '@/lib/checkout';

const CHALLENGES = [
  {
    id: 1,
    title: 'Login Bypass 101',
    category: 'Web',
    difficulty: 'Easy',
    points: 100,
    solves: 142,
    description: 'A login form is misconfigured. Use classic SQLi to bypass authentication and access the admin panel. Hint: classic OR injection.',
    flag: 'seclab{sql_1nj3ct10n_b4s1cs}',
    hint: 'Try: admin\' OR \'1\'=\'1',
    active: true,
    tags: ['SQLi', 'Auth Bypass', 'SQL'],
  },
  {
    id: 2,
    title: 'DOM Ghost',
    category: 'Web',
    difficulty: 'Medium',
    points: 250,
    solves: 67,
    description: 'This page uses postMessage to communicate with an iframe. Can you craft a payload to execute arbitrary JavaScript in the parent context?',
    flag: 'seclab{d0m_xss_v14_p0st_m3ss4g3}',
    hint: 'Check the message event listener and iframe src.',
    active: true,
    tags: ['XSS', 'DOM', 'postMessage'],
  },
  {
    id: 3,
    title: 'Hash Harvester',
    category: 'Crypto',
    difficulty: 'Easy',
    points: 150,
    solves: 98,
    description: 'A password hash was intercepted during transmission. Identify the hash type and crack it. Hash: 5f4dcc3b5aa765d61d8327deb882cf99',
    flag: 'seclab{p4ssw0rd_was_password}',
    hint: 'It\'s a classic MD5 hash. Try cracking it with a wordlist.',
    active: true,
    tags: ['Crypto', 'Hash', 'MD5'],
  },
  {
    id: 4,
    title: 'Cipher Break',
    category: 'Crypto',
    difficulty: 'Medium',
    points: 300,
    solves: 44,
    description: 'Encrypted message: "U2FsdGVkX1+门槛ZJQ5Y2". Determine the cipher and recover the plaintext. The key is "seclab".',
    flag: 'seclab{cbc_m0de_b7ock_c1ph3r}',
    hint: 'OpenSSL-compatible AES-256-CBC format. Key: seclab.',
    active: true,
    tags: ['Crypto', 'AES', 'Cipher'],
  },
  {
    id: 5,
    title: 'SSRF Scanner',
    category: 'Web',
    difficulty: 'Hard',
    points: 500,
    solves: 18,
    description: 'A web app fetches URLs provided by users. Abuse the functionality to access the internal metadata service at 169.254.169.254.',
    flag: 'seclab{aws_m3t4d4t4_1c3}',
    hint: 'Try requesting http://169.254.169.254/latest/meta-data/',
    active: true,
    tags: ['SSRF', 'AWS', 'Info Disclosure'],
  },
  {
    id: 6,
    title: 'XSS Filter Evasion',
    category: 'Web',
    difficulty: 'Medium',
    points: 275,
    solves: 53,
    description: 'The developer added an XSS filter. Prove it\'s insufficient by injecting a payload that bypasses the blacklist.',
    flag: 'seclab{f1lter_3v4s10n_w0rk5}',
    hint: 'The filter blocks <script>. Try event handlers on non-filtered elements.',
    active: true,
    tags: ['XSS', 'Filter Bypass', 'WAF'],
  },
];

const TIERS = [
  { name: 'Free', price: '$0', period: 'forever', features: ['3 challenges/month', 'Community writeups', 'Basic leaderboard', 'Forum access'], cta: 'Start Free', color: '#888888' },
  { name: 'Pro', price: '$15', period: '/month', features: ['Unlimited challenges', 'Hint system', 'Full writeups', 'Private leaderboard', 'Downloadable VMs'], cta: 'Go Pro', color: '#00FF41', highlight: true },
  { name: 'Elite', price: '$40', period: '/month', features: ['Everything in Pro', 'Live CTF events', '1-on-1 mentoring', 'Certificate of completion', 'Job referral network'], cta: 'Go Elite', color: '#FFB700' },
];

export default function CTFPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ok: boolean; msg: string} | null>(null);
  const [showHint, setShowHint] = useState<number | null>(null);
  const [solved, setSolved] = useState<number[]>([]);
  const [filter, setFilter] = useState('All');
  const [tab, setTab] = useState<'challenges' | 'leaderboard'>('challenges');

  const categories = ['All', 'Web', 'Crypto', 'Network', 'Forensics'];
  const filtered = filter === 'All' ? CHALLENGES : CHALLENGES.filter(c => c.category === filter);

  const submitFlag = (id: number) => {
    const ch = CHALLENGES.find(c => c.id === id);
    if (!ch) return;
    if (answer.trim().toLowerCase() === ch.flag.toLowerCase()) {
      setFeedback({ ok: true, msg: `Correct! +${ch.points} points. Flag: ${ch.flag}` });
      setSolved(prev => [...prev, id]);
      setSelected(null);
      setAnswer('');
    } else {
      setFeedback({ ok: false, msg: 'Wrong flag. Try again.' });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="min-h-screen bg-black text-[#E8E8E8]">
      {/* Header */}
      <div className="border-b border-[#1A1A1A] px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <span className="section-label">// CTF PLATFORM</span>
              <h1 className="font-mono font-black text-3xl mt-2">
                <span className="text-[#00FF41]">Sec</span>Lab <span className="text-[#FFB700]">CTF</span>
              </h1>
              <p className="text-[#555] text-sm font-mono mt-1">{CHALLENGES.length} live challenges · {CHALLENGES.reduce((a, c) => a + c.solves, 0)} total solves</p>
            </div>
            <div className="flex gap-3">
              {['Free', 'Pro', 'Elite'].map(tier => (
                <button key={tier}
                  className={`font-mono text-[10px] tracking-wider px-3 py-1.5 border ${
                    tier === 'Free' ? 'border-[#1A1A1A] text-[#555] hover:border-[#00FF41]/40' :
                    tier === 'Pro' ? 'border-[#00FF41]/40 text-[#00FF41] hover:bg-[#00FF41]/10' :
                    'border-[#FFB700]/40 text-[#FFB700] hover:bg-[#FFB700]/10'
                  } transition-all duration-200`}>
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="flex gap-6 border-b border-[#1A1A1A] pb-0 mb-8">
          {[['challenges', 'Challenges'], ['leaderboard', 'Leaderboard']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id as typeof tab)}
              className={`font-mono text-sm pb-3 border-b-2 transition-all duration-200 ${
                tab === id ? 'border-[#00FF41] text-[#00FF41]' : 'border-transparent text-[#555] hover:text-[#888]'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'challenges' && (
          <>
            {/* Filter bar */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  className={`font-mono text-[10px] tracking-wider px-3 py-1.5 border transition-all duration-200 ${
                    filter === cat ? 'border-[#00FF41] text-[#00FF41] bg-[#00FF41]/5' : 'border-[#1A1A1A] text-[#555] hover:border-[#2A2A2A]'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Challenges grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(ch => (
                <div key={ch.id}
                  className={`glass border p-6 card-hover relative overflow-hidden ${solved.includes(ch.id) ? 'border-[#00FF41]/40' : 'border-[#2A2A2A]'}`}>
                  {solved.includes(ch.id) && (
                    <div className="absolute top-3 right-3 font-mono text-[10px] text-[#00FF41] border border-[#00FF41]/30 px-2 py-0.5 tracking-widest">SOLVED</div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 border"
                      style={{
                        borderColor: ch.difficulty === 'Easy' ? 'rgba(0,255,65,0.3)' : ch.difficulty === 'Medium' ? 'rgba(255,183,0,0.3)' : 'rgba(255,68,68,0.3)',
                        color: ch.difficulty === 'Easy' ? 'rgba(0,255,65,0.8)' : ch.difficulty === 'Medium' ? 'rgba(255,183,0,0.8)' : 'rgba(255,68,68,0.8)',
                        background: ch.difficulty === 'Easy' ? 'rgba(0,255,65,0.05)' : ch.difficulty === 'Medium' ? 'rgba(255,183,0,0.05)' : 'rgba(255,68,68,0.05)',
                      }}>
                      {ch.difficulty}
                    </span>
                    <span className="font-mono text-[9px] text-[#444] tracking-wider uppercase">{ch.category}</span>
                    <span className="font-mono text-[9px] text-[#FFB700] ml-auto">{ch.points} pts</span>
                  </div>

                  <h3 className="font-mono font-bold text-[#E8E8E8] text-sm mb-2">{ch.title}</h3>
                  <p className="text-[#555] text-xs leading-relaxed mb-4">{ch.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {ch.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#444]">{ch.solves} solves</span>
                    {solved.includes(ch.id) ? (
                      <span className="font-mono text-[10px] text-[#00FF41] tracking-wider">Done</span>
                    ) : (
                      <button onClick={() => { setSelected(ch.id); setAnswer(''); setShowHint(null); setFeedback(null); }}
                        className="font-mono text-[10px] text-[#00FF41] hover:underline">
                        Solve →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Solve modal */}
            {selected && (() => {
              const ch = CHALLENGES.find(c => c.id === selected)!;
              return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                  onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
                  <div className="glass border border-[#1A1A1A] p-8 max-w-lg w-full">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-mono font-bold text-[#E8E8E8] text-lg">{ch.title}</h2>
                      <button onClick={() => setSelected(null)} className="text-[#555] hover:text-[#888] text-xl">×</button>
                    </div>
                    <p className="text-[#666] text-xs font-mono mb-5 leading-relaxed">{ch.description}</p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {ch.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                    </div>

                    {!showHint && (
                      <button onClick={() => setShowHint(ch.id)}
                        className="font-mono text-[10px] text-[#FFB700] hover:underline mb-5">
                        [SHOW HINT]
                      </button>
                    )}
                    {showHint === ch.id && (
                      <div className="glass-subtle border border-[#FFB700]/20 p-4 mb-5">
                        <p className="font-mono text-[11px] text-[#FFB700]">Hint: {ch.hint}</p>
                      </div>
                    )}

                    {feedback && (
                      <div className={`border p-3 mb-4 font-mono text-xs ${
                        feedback.ok ? 'border-[#00FF41]/30 text-[#00FF41] bg-[#00FF41]/5' : 'border-[#FF4444]/30 text-[#FF4444] bg-[#FF4444]/5'
                      }`}>
                        {feedback.msg}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <input
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && submitFlag(ch.id)}
                        placeholder="seclab{...}"
                        className="tool-input flex-1"
                      />
                      <button onClick={() => submitFlag(ch.id)} className="btn-neon whitespace-nowrap">
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </>
        )}

        {tab === 'leaderboard' && (
          <div className="max-w-2xl">
            <div className="glass border border-[#1A1A1A] overflow-hidden">
              {[
                { rank: 1, name: '0xMub', score: 4820, country: '🇳🇬', solves: 28 },
                { rank: 2, name: 'ghost_r3con', score: 4310, country: '🇬🇧', solves: 24 },
                { rank: 3, name: 'nigerian_pr1me', score: 3980, country: '🇳🇬', solves: 21 },
                { rank: 4, name: 'k4li_us3r', score: 3650, country: '🇺🇸', solves: 19 },
                { rank: 5, name: 'b1nary_hunter', score: 3400, country: '🇮🇳', solves: 17 },
                { rank: 6, name: 'c0d3br34ker', score: 2950, country: '🇿🇦', solves: 15 },
                { rank: 7, name: 's3c_r1d3r', score: 2400, country: '🇳🇬', solves: 12 },
              ].map((entry, i) => (
                <div key={i} className={`flex items-center gap-4 px-6 py-4 border-b border-[#1A1A1A] last:border-0 ${i < 3 ? 'bg-[#00FF41]/3' : ''}`}>
                  <span className={`font-mono font-black text-sm w-6 ${
                    entry.rank === 1 ? 'text-[#FFB700]' : entry.rank === 2 ? 'text-[#CCCCCC]' : entry.rank === 3 ? 'text-[#CD7F32]' : 'text-[#555]'
                  }`}>#{entry.rank}</span>
                  <span className="text-lg">{entry.country}</span>
                  <span className="font-mono text-sm text-[#E8E8E8] flex-1">{entry.name}</span>
                  <span className="font-mono text-[10px] text-[#555]">{entry.solves} solves</span>
                  <span className="font-mono text-sm text-[#00FF41] font-bold">{entry.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pricing bar */}
      <div className="border-t border-[#1A1A1A] mt-20 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-center text-[10px] tracking-widest uppercase text-[#555] mb-8">UNLOCK EVERYTHING</p>
          <div className="grid md:grid-cols-3 gap-5">
            {TIERS.map(tier => (
              <div key={tier.name}
                className={`glass border p-6 text-center ${tier.highlight ? 'border-[#00FF41]/40' : 'border-[#2A2A2A]'}`}>
                <div className="font-mono text-sm font-bold mb-1" style={{ color: tier.color }}>{tier.name}</div>
                <div className="font-mono font-black text-3xl mb-1">{tier.price}<span className="text-sm font-normal text-[#555]">{tier.period}</span></div>
                <div className="h-px bg-[#1A1A1A] my-4" />
                {tier.features.map(f => (
                  <div key={f} className="font-mono text-[11px] text-[#666] py-1 flex items-center gap-2">
                    <span style={{ color: tier.color }}>▸</span> {f}
                  </div>
                ))}
                <button
                  onClick={() => {
                    if (tier.name === 'Free') return;
                    if (!isTierConfigured(tier.name as TierName)) {
                      alert('Checkout not configured yet. DM @mamuaminu on Telegram to get access!');
                      return;
                    }
                    openCheckout(tier.name as TierName);
                  }}
                  className="w-full mt-6 font-mono text-[11px] py-2.5 tracking-wider border transition-all duration-200"
                  style={{ borderColor: tier.color, color: tier.color }}
                  onMouseEnter={e => (e.currentTarget.style.background = `${tier.color}15`)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}