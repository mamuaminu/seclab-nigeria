'use client';

import { useState, useEffect } from 'react';

type Strength = 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';

const getStrength = (password: string): { level: Strength; score: number; entropy: number; feedback: string[] } => {
  const chars = password.split('');
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  const entropy = password.length > 0 ? Math.log2(Math.pow(poolSize, password.length)) : 0;

  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score += 1; else feedback.push('Use 8+ characters');
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1; else feedback.push('Mix upper & lowercase');
  if (/[0-9]/.test(password)) score += 1; else feedback.push('Add numbers');
  if (/[^a-zA-Z0-9]/.test(password)) score += 1; else feedback.push('Add special chars (!@#$...)');
  if (!/(.)\1{2,}/.test(password)) score += 1; else feedback.push('Avoid repeated characters');

  let level: Strength;
  if (score <= 2) level = 'weak';
  else if (score <= 3) level = 'fair';
  else if (score <= 4) level = 'good';
  else if (score <= 5) level = 'strong';
  else level = 'very-strong';

  return { level, score: Math.min(score, 6), entropy, feedback: feedback.slice(0, 3) };
};

const STRENGTH_CONFIG = {
  weak: { label: 'WEAK', color: '#FF4444', bg: 'bg-[#FF4444]/10', border: 'border-[#FF4444]/30', text: 'text-[#FF4444]', desc: 'Easily cracked in seconds' },
  fair: { label: 'FAIR', color: '#FFB700', bg: 'bg-[#FFB700]/10', border: 'border-[#FFB700]/30', text: 'text-[#FFB700]', desc: 'Could be broken with GPU' },
  good: { label: 'GOOD', color: '#88FF00', bg: 'bg-[#88FF00]/10', border: 'border-[#88FF00]/30', text: 'text-[#88FF00]', desc: 'Requires dedicated resources' },
  strong: { label: 'STRONG', color: '#00FF41', bg: 'bg-[#00FF41]/10', border: 'border-[#00FF41]/30', text: 'text-[#00FF41]', desc: 'Very expensive to crack' },
  'very-strong': { label: 'VERY STRONG', color: '#00FF41', bg: 'bg-[#00FF41]/10', border: 'border-[#00FF41]/30', text: 'text-[#00FF41]', desc: 'Theoretical protection' },
};

const ENTROPY_BAR_STEPS = [
  { min: 0, label: '0', color: '#FF4444' },
  { min: 20, label: '20', color: '#FF4444' },
  { min: 40, label: '40', color: '#FFB700' },
  { min: 60, label: '60', color: '#88FF00' },
  { min: 80, label: '80', color: '#00FF41' },
  { min: 128, label: '128+', color: '#00FF41' },
];

const EXAMPLE_PASSWORDS = [
  { label: 'Weak', pass: 'password123', strength: 'weak' },
  { label: 'Fair', pass: 'MyD0g$Name', strength: 'fair' },
  { label: 'Good', pass: 'Tr0ub4dor&3', strength: 'good' },
  { label: 'Strong', pass: 'correct-horse-battery-staple', strength: 'strong' },
];

export function PasswordStrengthMeter() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { level, score, entropy, feedback } = getStrength(password);
  const cfg = STRENGTH_CONFIG[level];
  const entropyClamped = Math.min(entropy, 128);
  const entropyPercent = (entropyClamped / 128) * 100;

  return (
    <div className="glass border border-[#1A1A1A] p-7 font-mono">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#00FF41] text-sm" aria-hidden="true">⬡</span>
            <h3 className="text-[#E8E8E8] font-bold text-base tracking-tight">Password Strength Meter</h3>
          </div>
          <p className="text-[#555] text-[11px] leading-relaxed max-w-[240px]">Test passwords against entropy math — see exactly how hard they are to crack.</p>
        </div>
        <span className="text-[10px] font-mono text-[#333] border border-[#1A1A1A] px-2 py-0.5">BROWSER-ONLY</span>
      </div>

      {/* Password input */}
      <div className="mb-5">
        <label className="text-[#555] font-mono text-[10px] tracking-widest uppercase block mb-2" htmlFor="pwd-input">
          TEST PASSWORD
        </label>
        <div className="relative">
          <input
            id="pwd-input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a password to test..."
            className="tool-input pr-10"
            aria-label="Password to test"
            spellCheck={false}
          />
          <button type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#00FF41] text-xs font-mono transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? '[HIDE]' : '[SHOW]'}
          </button>
        </div>
      </div>

      {/* Entropy bar */}
      <div className="mb-5" aria-label={`Entropy: ${Math.round(entropy)} bits`}>
        <div className="flex justify-between items-center mb-2">
          <label className="text-[#555] font-mono text-[10px] tracking-widest uppercase">ENTROPY</label>
          <span className="font-mono text-[11px] text-[#888]">{Math.round(entropy)} <span className="text-[#555]">bits</span></span>
        </div>

        {/* Segmented bar */}
        <div className="h-2 w-full bg-black border border-[#1A1A1A] flex overflow-hidden gap-px">
          {[20, 20, 20, 20, 20].map((_, i) => {
            const threshold = (i + 1) * 20;
            const filled = entropyClamped >= threshold;
            const color = i < 2 ? '#FF4444' : i < 3 ? '#FFB700' : i < 4 ? '#88FF00' : '#00FF41';
            return (
              <div key={i} className="flex-1 transition-colors duration-300" style={{ backgroundColor: filled ? color : 'transparent' }} />
            );
          })}
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-1">
          {ENTROPY_BAR_STEPS.slice(0, 5).map((s, i) => (
            <span key={i} className="font-mono text-[8px] text-[#333]">{s.label}</span>
          ))}
        </div>
      </div>

      {/* Score display */}
      {password && (
        <div className={`border ${cfg.border} ${cfg.bg} p-4 mb-5`} aria-live="polite" role="status">
          <div className="flex items-center justify-between mb-2">
            <span className={`font-mono text-sm font-bold ${cfg.text}`}>{cfg.label}</span>
            <span className="font-mono text-[9px] text-[#555]">SCORE {score}/6</span>
          </div>
          <div className="text-[#555] font-mono text-[11px] mb-3">{cfg.desc}</div>

          {/* Score breakdown */}
          <div className="grid grid-cols-6 gap-1 mb-3">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-1 flex-1 transition-colors duration-200"
                style={{ backgroundColor: n <= score ? cfg.color : '#1A1A1A' }} />
            ))}
          </div>

          {/* Feedback */}
          {feedback.length > 0 && (
            <div className="space-y-1">
              {feedback.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[#FF4444] font-mono text-[10px]">✕</span>
                  <span className="text-[#555] font-mono text-[10px]">{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Example passwords */}
      <div>
        <label className="text-[#555] font-mono text-[10px] tracking-widest uppercase block mb-2">TRY EXAMPLES</label>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLE_PASSWORDS.map(({ label, pass }) => (
            <button key={label} type="button"
              onClick={() => setPassword(pass)}
              className="tool-btn"
              aria-label={`Load example: ${label} password`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Info note */}
      <div className="bg-[#00FF41]/5 border border-[#00FF41]/10 p-4 mt-4">
        <p className="text-[#555] font-mono text-[10px] leading-relaxed">
          Entropy = log₂(charset^length). Real-world attacks consider dictionary words, patterns, and GPU acceleration. Complexity alone isn&apos;t enough — length matters more.
        </p>
      </div>
    </div>
  );
}