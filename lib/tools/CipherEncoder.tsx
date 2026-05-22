'use client';

import { useState } from 'react';

type Mode = 'caesar' | 'rot13' | 'base64' | 'reverse';

const caesar = (text: string, n: number, decode = false) =>
  text.replace(/[a-z]/gi, (c) => {
    const base = c <= 'Z' ? 65 : 97;
    const dir = decode ? -n : n;
    return String.fromCharCode(((c.charCodeAt(0) - base + dir + 26) % 26) + base);
  });

const rot13 = (text: string, decode = false) => caesar(text, 13, decode);
const base64Enc = (text: string) => btoa(text);
const base64Dec = (text: string) => { try { return atob(text); } catch { return 'Invalid Base64 string'; } };
const reverse = (text: string) => text.split('').reverse().join('');

const MODES: { key: Mode; label: string }[] = [
  { key: 'caesar', label: 'CAESAR' },
  { key: 'rot13', label: 'ROT13' },
  { key: 'base64', label: 'BASE64' },
  { key: 'reverse', label: 'REVERSE' },
];

const CIPHER_INFO: Record<Mode, { title: string; desc: string }> = {
  caesar: { title: 'Caesar Cipher', desc: 'Shifts each letter by a fixed number. Used by Julius Caesar. Vulnerable to frequency analysis.' },
  rot13: { title: 'ROT13', desc: 'Special Caesar cipher with shift of 13. Since the alphabet has 26 letters, encoding twice returns the original.' },
  base64: { title: 'Base64', desc: 'Encodes binary data as ASCII text using 64 characters. Not encryption — easily decoded.' },
  reverse: { title: 'Reverse Cipher', desc: 'Simply flips the text backwards. No security value — used in beginner CTF challenges.' },
};

export function CipherEncoder() {
  const [mode, setMode] = useState<Mode>('caesar');
  const [input, setInput] = useState('Hello Nigeria!');
  const [shift, setShift] = useState(3);
  const [activeTab, setActiveTab] = useState<'encode' | 'info'>('encode');

  const encode = () => {
    switch (mode) {
      case 'caesar': return caesar(input, shift);
      case 'rot13': return rot13(input);
      case 'base64': return base64Enc(input);
      case 'reverse': return reverse(input);
    }
  };

  const decode = () => {
    switch (mode) {
      case 'caesar': return caesar(input, shift, true);
      case 'rot13': return rot13(input, true);
      case 'base64': return base64Dec(input);
      case 'reverse': return reverse(input);
    }
  };

  const result = encode();

  return (
    <div className="glass border border-[#1A1A1A] p-7 font-mono">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#00FF41] text-sm" aria-hidden="true">⬡</span>
            <h3 className="text-[#E8E8E8] font-bold text-base tracking-tight">Cipher Encoder</h3>
          </div>
          <p className="text-[#555] text-[11px] leading-relaxed max-w-[240px]">Encrypt and decrypt classic ciphers entirely in your browser.</p>
        </div>
        <span className="text-[10px] font-mono text-[#333] border border-[#1A1A1A] px-2 py-0.5">BROWSER-ONLY</span>
      </div>

      {/* Mode selector */}
      <div className="flex flex-wrap gap-0 mb-6" role="group" aria-label="Cipher mode selector">
        {MODES.map(({ key, label }) => (
          <button key={key} type="button" onClick={() => setMode(key)}
            aria-pressed={mode === key}
            className={`font-mono text-[10px] tracking-widest uppercase px-3 py-2 border border-[#1A1A1A] -ml-px transition-colors ${
              mode === key
                ? 'bg-[#00FF41]/10 border-[#00FF41]/40 text-[#00FF41]'
                : 'text-[#555] hover:text-[#888]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Shift control */}
      {mode === 'caesar' && (
        <div className="mb-5">
          <label className="text-[#555] font-mono text-[10px] tracking-widest uppercase block mb-2" htmlFor="shift-slider">
            SHIFT: <span className="text-[#00FF41]">{shift}</span>
          </label>
          <input id="shift-slider" type="range" min={1} max={25} value={shift}
            onChange={(e) => setShift(Number(e.target.value))}
            className="w-full accent-[#00FF41] h-1"
            aria-label="Caesar shift amount"
            aria-valuemin={1} aria-valuemax={25} aria-valuenow={shift}
          />
        </div>
      )}

      {/* Tab toggle */}
      <div className="flex gap-0 mb-5" role="tablist" aria-label="Cipher Encoder tabs">
        {(['encode', 'info'] as const).map(tab => (
          <button key={tab} type="button" role="tab" aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`font-mono text-[10px] tracking-widest uppercase px-4 py-2 border border-[#1A1A1A] -ml-px transition-colors ${
              activeTab === tab
                ? 'bg-[#FFB700]/10 border-[#FFB700]/40 text-[#FFB700]'
                : 'text-[#555] hover:text-[#888]'
            }`}
          >
            {tab === 'encode' ? 'Encode / Decode' : 'About'}
          </button>
        ))}
      </div>

      {activeTab === 'encode' ? (
        <>
          <div className="mb-4">
            <label className="text-[#555] font-mono text-[10px] tracking-widest uppercase block mb-2" htmlFor="cipher-input">INPUT</label>
            <input id="cipher-input" value={input} onChange={(e) => setInput(e.target.value)}
              className="tool-input" aria-label="Text to encode or decode" />
          </div>

          <div className="flex gap-2 mb-4">
            <button type="button" onClick={() => setInput(encode())}
              className="btn-neon flex-1 text-center">ENCRYPT →</button>
            <button type="button" onClick={() => setInput(decode())}
              className="flex-1 text-center"
              style={{ background: 'rgba(255,183,0,0.1)', border: '1px solid rgba(255,183,0,0.3)', color: '#FFB700', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.05em', padding: '0.625rem 1.5rem', cursor: 'pointer', transition: 'all 0.15s ease' }}
            >DECRYPT ←</button>
          </div>

          <div className="bg-black border border-[#1A1A1A] p-4" aria-live="polite" aria-label="Encoding result">
            <label className="text-[#555] font-mono text-[10px] tracking-widest uppercase block mb-2">OUTPUT</label>
            <span className="text-[#00FF41] text-xs break-all leading-relaxed">{result}</span>
          </div>
        </>
      ) : (
        <div className="bg-black/60 border border-[#1A1A1A] p-4" role="tabpanel">
          <div className="text-[#FFB700] font-mono text-[10px] font-semibold tracking-wider uppercase mb-2">{CIPHER_INFO[mode].title}</div>
          <div className="text-[#555] font-mono text-[11px] leading-relaxed">{CIPHER_INFO[mode].desc}</div>
        </div>
      )}
    </div>
  );
}