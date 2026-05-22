'use client';

import { useState } from 'react';

type Mode = 'base64' | 'hex' | 'url' | 'binary';

const ENCODINGS: { key: Mode; label: string; desc: string }[] = [
  { key: 'base64', label: 'BASE64', desc: 'Encodes binary data as ASCII using 64 characters. Not encryption.' },
  { key: 'hex', label: 'HEX', desc: 'Converts text to hexadecimal byte representation. Common in CTF forensics.' },
  { key: 'url', label: 'URL ENCODE', desc: 'Percent-encodes special characters for safe URL transmission.' },
  { key: 'binary', label: 'BINARY', desc: 'Represents each character as an 8-bit binary string. Raw data format.' },
];

const encodeText = (text: string, mode: Mode): string => {
  try {
    switch (mode) {
      case 'base64': return btoa(text);
      case 'hex': return Array.from(new TextEncoder().encode(text)).map(b => b.toString(16).padStart(2, '0')).join(' ');
      case 'url': return encodeURIComponent(text);
      case 'binary': return Array.from(new TextEncoder().encode(text)).map(b => b.toString(2).padStart(8, '0')).join(' ');
    }
  } catch { return 'Encoding error'; }
};

const decodeText = (text: string, mode: Mode): string => {
  try {
    switch (mode) {
      case 'base64': return atob(text);
      case 'hex': return new TextDecoder().decode(Uint8Array.from(text.split(/\s/).filter(Boolean).map(b => parseInt(b, 16))));
      case 'url': return decodeURIComponent(text);
      case 'binary': return new TextDecoder().decode(Uint8Array.from(text.split(/\s/).filter(Boolean).map(b => parseInt(b, 2))));
    }
  } catch { return 'Decoding error — check input format'; }
};

export function EncodingDecoder() {
  const [mode, setMode] = useState<Mode>('base64');
  const [input, setInput] = useState('Hello Nigeria! 🌍');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const handleEncode = () => {
    setError('');
    const result = encodeText(input, mode);
    setOutput(result);
  };

  const handleDecode = () => {
    setError('');
    const result = decodeText(input, mode);
    if (result === 'Decoding error — check input format') {
      setError('Invalid input for this encoding');
    } else {
      setOutput(result);
    }
  };

  return (
    <div className="glass border border-[#1A1A1A] p-7 font-mono">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#00FF41] text-sm" aria-hidden="true">⬡</span>
            <h3 className="text-[#E8E8E8] font-bold text-base tracking-tight">Encoding/Decoding</h3>
          </div>
          <p className="text-[#555] text-[11px] leading-relaxed max-w-[240px]">Convert between text, Base64, Hex, URL encoded, and binary formats.</p>
        </div>
        <span className="text-[10px] font-mono text-[#333] border border-[#1A1A1A] px-2 py-0.5">BROWSER-ONLY</span>
      </div>

      {/* Encoding mode selector */}
      <div className="flex flex-wrap gap-0 mb-5" role="group" aria-label="Encoding type">
        {ENCODINGS.map(({ key, label }) => (
          <button key={key} type="button" onClick={() => { setMode(key); setOutput(''); setError(''); }}
            aria-pressed={mode === key}
            className={`font-mono text-[9px] tracking-widest uppercase px-2.5 py-1.5 border border-[#1A1A1A] -ml-px transition-colors ${
              mode === key ? 'bg-[#00FF41]/10 border-[#00FF41]/40 text-[#00FF41]' : 'text-[#555] hover:text-[#888]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Encode/Decode tab toggle */}
      <div className="flex gap-0 mb-5" role="tablist" aria-label="Encode/Decode tabs">
        {(['encode', 'decode'] as const).map(tab => (
          <button key={tab} type="button" role="tab" aria-selected={activeTab === tab}
            onClick={() => { setActiveTab(tab); setOutput(''); setError(''); }}
            className={`font-mono text-[10px] tracking-widest uppercase px-4 py-2 border border-[#1A1A1A] -ml-px transition-colors ${
              activeTab === tab ? 'bg-[#00FF41]/10 border-[#00FF41]/40 text-[#00FF41]' : 'text-[#555] hover:text-[#888]'
            }`}
          >
            {tab === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="text-[#555] font-mono text-[10px] tracking-widest uppercase block mb-2" htmlFor="enc-input">
          INPUT {mode === 'binary' ? '(separate bytes with spaces)' : mode === 'hex' ? '(hex pairs separated by spaces)' : ''}
        </label>
        <textarea
          id="enc-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="tool-input resize-y min-h-[60px] py-2"
          aria-label="Text to encode or decode"
          rows={2}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-4">
        <button type="button" onClick={handleEncode}
          className="btn-neon flex-1 text-center">
          ENCODE →
        </button>
        <button type="button" onClick={handleDecode}
          className="flex-1 text-center"
          style={{ background: 'rgba(255,183,0,0.1)', border: '1px solid rgba(255,183,0,0.3)', color: '#FFB700', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.05em', padding: '0.625rem 1.5rem', cursor: 'pointer', transition: 'all 0.15s ease' }}
        >
          DECODE ←
        </button>
      </div>

      {/* Output */}
      {error && (
        <div className="border border-[#FF4444]/30 bg-[#FF4444]/5 p-4 mb-4">
          <span className="font-mono text-[#FF4444] text-[11px]">{error}</span>
        </div>
      )}

      {output && !error && (
        <div className="bg-black border border-[#1A1A1A] p-4" aria-live="polite">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[#555] font-mono text-[10px] tracking-widest uppercase">OUTPUT</label>
            <button type="button"
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-[#555] hover:text-[#00FF41] font-mono text-[10px] transition-colors"
              aria-label="Copy output to clipboard">
              [COPY]
            </button>
          </div>
          <div className="font-mono text-[11px] text-[#00FF41] leading-relaxed break-all whitespace-pre-wrap">{output}</div>
        </div>
      )}

      {/* Encoding info */}
      <div className="bg-black/60 border border-[#1A1A1A] p-4 mt-3">
        <div className="text-[#FFB700] font-mono text-[10px] font-semibold tracking-wider uppercase mb-1">{ENCODINGS.find(e => e.key === mode)?.label}</div>
        <div className="text-[#555] font-mono text-[11px] leading-relaxed">{ENCODINGS.find(e => e.key === mode)?.desc}</div>
      </div>
    </div>
  );
}