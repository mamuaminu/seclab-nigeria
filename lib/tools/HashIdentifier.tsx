'use client';

import { useState, useEffect } from 'react';

type HashResult = {
  type: string;
  strength: string;
  info: string;
  color: 'green' | 'amber' | 'red' | 'gray';
};

const PATTERNS: [RegExp, string, string, 'green' | 'amber' | 'red' | 'gray'][] = [
  [/^[a-f0-9]{32}$/i, 'MD5', 'Fast but insecure for passwords. Cracked via rainbow tables.', 'red'],
  [/^[a-f0-9]{40}$/i, 'SHA-1', 'Deprecated for security. Still used in git commits.', 'red'],
  [/^[a-f0-9]{64}$/i, 'SHA-256', 'Current standard. Good for integrity checks.', 'amber'],
  [/^[a-f0-9]{96}$/i, 'SHA-384', 'Used in TLS certificates and high-security contexts.', 'amber'],
  [/^[a-f0-9]{128}$/i, 'SHA-512', 'Highest SHA-2 standard. Use with salt for passwords.', 'amber'],
  [/^\$2[ayb]\$\d{2}\$.{53}$/, 'Bcrypt', 'Adaptive hash. Slow by design. Best for password storage.', 'green'],
  [/^\$P\$\w{31}$/, 'WordPress MD5', 'Portable PHPass variant. Weak — do not use.', 'red'],
  [/^[a-f0-9]{16}$|^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i, 'UUID / Hex', 'Not a hash. Could be a UUID or machine identifier.', 'gray'],
];

const EXAMPLES = [
  { hash: '5ebe2294ecd0e0f08eab7690d2a6ee69', type: 'MD5' },
  { hash: 'b6a5d2ce6cd6bf6d7ed09c4f6f46118a05b3de2d', type: 'SHA-1' },
  { hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', type: 'SHA-256' },
];

const STRENGTH_LABEL: Record<string, string> = {
  green: '🟢 Strong — safe for production',
  amber: '🟡 Moderate — ok for integrity checks',
  red: '🔴 Weak — do not use for passwords',
  gray: '❓ Unknown format',
};

const STRENGTH_COLOR: Record<string, string> = {
  green: 'text-[#00FF41]',
  amber: 'text-[#FFB700]',
  red: 'text-[#FF4444]',
  gray: 'text-[#888]',
};

export function HashIdentifier() {
  const [hash, setHash] = useState('');
  const [result, setResult] = useState<HashResult | null>(null);

  const analyze = () => {
    if (!hash.trim()) { setResult(null); return; }
    for (const [re, type, info, color] of PATTERNS) {
      if (re.test(hash.trim())) {
        setResult({ type, strength: STRENGTH_LABEL[color], info, color });
        return;
      }
    }
    setResult({ type: 'Unknown', strength: STRENGTH_LABEL.gray, info: 'Could not identify this format. May be truncated, modified, or a custom algorithm.', color: 'gray' });
  };

  useEffect(() => { analyze(); }, [hash]);

  const fillExample = (ex: { hash: string; type: string }) => {
    setHash(ex.hash);
  };

  return (
    <div className="glass border border-[#1A1A1A] p-7 font-mono">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#00FF41] text-sm" aria-hidden="true">⬡</span>
            <h3 className="text-[#E8E8E8] font-bold text-base tracking-tight">Hash Identifier</h3>
          </div>
          <p className="text-[#555] text-[11px] leading-relaxed max-w-[240px]">Paste any hash — get its type, strength rating, and usage info.</p>
        </div>
        <span className="text-[10px] font-mono text-[#333] border border-[#1A1A1A] px-2 py-0.5">BROWSER-ONLY</span>
      </div>

      <div className="mb-5">
        <label className="text-[#555] font-mono text-[10px] tracking-widest uppercase block mb-2" htmlFor="hash-input">
          HASH INPUT
        </label>
        <input
          id="hash-input"
          type="text"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          placeholder="e.g. 5ebe2294ecd0e0f08eab7690d2a6ee69"
          className="tool-input"
          aria-label="Hash to identify"
          aria-describedby="hash-result"
          spellCheck={false}
        />
      </div>

      {/* Example hashes */}
      <div className="mb-5">
        <label className="text-[#555] font-mono text-[10px] tracking-widest uppercase block mb-2">TRY AN EXAMPLE</label>
        <div className="grid grid-cols-3 gap-2">
          {EXAMPLES.map((ex) => (
            <button key={ex.type} type="button"
              onClick={() => fillExample(ex)}
              className="tool-btn text-center"
              aria-label={`Load example ${ex.type} hash`}
            >
              <span className="text-[#FFB700] text-[9px]">{ex.type}</span>
              <div className="text-[#333] text-[8px] mt-0.5 truncate">{ex.hash.slice(0, 8)}...</div>
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="border border-[#1A1A1A] bg-black/60 p-5" id="hash-result" aria-live="polite" role="status">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className={`font-bold text-xl ${
                result.color === 'green' ? 'text-[#00FF41]' :
                result.color === 'amber' ? 'text-[#FFB700]' :
                result.color === 'red' ? 'text-[#FF4444]' : 'text-[#888]'
              }`}>
                {result.type}
              </span>
            </div>
            <span className="font-mono text-[9px] text-[#333] tracking-widest uppercase">ID&apos;d</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`font-mono text-xs font-semibold ${STRENGTH_COLOR[result.color]}`}>{result.strength}</span>
            </div>
            <p className="text-[#555] text-[11px] leading-relaxed">{result.info}</p>
          </div>
        </div>
      )}

      {!result && hash.trim() && (
        <div className="border border-[#1A1A1A] bg-black/60 p-5 text-center" aria-live="polite" role="status">
          <span className="font-mono text-[#333] text-xs">Analyzing...</span>
        </div>
      )}
    </div>
  );
}