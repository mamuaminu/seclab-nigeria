'use client';

import { useState, useRef, useEffect } from 'react';

// =====================
// XSS Simulator
// =====================
export function XSSSimulator() {
  const [code, setCode] = useState('<script>alert("XSS")</script>');
  const [input, setInput] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const payloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror="alert(1)">',
    '<svg onload="alert(1)">',
    "javascript:alert('XSS')",
    '<body onload="alert(1)">',
  ];

  const runCode = (payload: string) => {
    setCode(payload);
  };

  return (
    <div className="glass rounded-xl p-6 font-mono text-sm">
      <h3 className="text-[#00FF41] font-bold text-lg mb-1">XSS Simulator</h3>
      <p className="text-gray-400 text-xs mb-4">See how cross-site scripting works in a sandboxed environment.</p>

      <div className="mb-4">
        <label className="text-xs text-gray-500 block mb-1">TRY IT:</label>
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); runCode(e.target.value); }}
          placeholder="Paste XSS payload here..."
          className="w-full bg-black/50 border border-[#1e1e1e] rounded px-3 py-2 text-[#00FF41] focus:outline-none focus:border-[#00FF41]/50"
        />
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-500 block mb-1">QUICK PAYLOADS:</label>
        <div className="flex flex-wrap gap-2">
          {payloads.map((p, i) => (
            <button key={i} onClick={() => { setInput(p); setCode(p); }} className="text-xs bg-black/60 border border-[#1e1e1e] hover:border-[#00FF41]/40 rounded px-2 py-1 text-gray-300 hover:text-[#00FF41] transition-colors">
              {p.length > 25 ? p.slice(0, 25) + '...' : p}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-500 block mb-1">SANDBOX OUTPUT:</label>
        <div className="bg-black border border-[#1e1e1e] rounded p-3 min-h-[60px] text-gray-400 text-xs">
          <div dangerouslySetInnerHTML={{ __html: code }} />
        </div>
      </div>

      <div className="bg-black/40 rounded p-3 border border-[#FFB700]/20">
        <p className="text-[#FFB700] text-xs font-semibold mb-1">⚠️ How it works</p>
        <p className="text-gray-500 text-xs leading-relaxed">
          XSS injects malicious scripts into web pages. When a site reflects user input without sanitization,
          attackers can steal cookies, session tokens, or redirect users. Always validate and escape user input server-side.
        </p>
      </div>
    </div>
  );
}

// =====================
// Cipher Encoder
// =====================
export function CipherEncoder() {
  const [input, setInput] = useState('Hello Nigeria!');
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<'caesar' | 'rot13' | 'base64' | 'reverse'>('caesar');

  const caesar = (text: string, n: number, decode = false) => {
    return text.replace(/[a-z]/gi, (c) => {
      const base = c <= 'Z' ? 65 : 97;
      const dir = decode ? -n : n;
      return String.fromCharCode(((c.charCodeAt(0) - base + dir + 26) % 26) + base);
    });
  };

  const rot13 = (text: string, decode = false) => caesar(text, 13, decode);
  const base64Enc = (text: string) => btoa(text);
  const base64Dec = (text: string) => { try { return atob(text); } catch { return 'Invalid Base64'; } };
  const reverse = (text: string) => text.split('').reverse().join('');

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

  return (
    <div className="glass rounded-xl p-6 font-mono text-sm">
      <h3 className="text-[#00FF41] font-bold text-lg mb-1">Cipher Encoder</h3>
      <p className="text-gray-400 text-xs mb-4">Encrypt and decrypt classic ciphers in your browser.</p>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(['caesar', 'rot13', 'base64', 'reverse'] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`text-xs px-3 py-1.5 rounded border transition-colors ${mode === m ? 'bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41]' : 'border-[#1e1e1e] text-gray-400 hover:border-[#00FF41]/30'}`}>
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {mode === 'caesar' && (
        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">SHIFT: {shift}</label>
          <input type="range" min={1} max={25} value={shift} onChange={(e) => setShift(Number(e.target.value))} className="w-full accent-[#00FF41]" />
        </div>
      )}

      <div className="mb-3">
        <label className="text-xs text-gray-500 block mb-1">INPUT</label>
        <input value={input} onChange={(e) => setInput(e.target.value)} className="w-full bg-black/50 border border-[#1e1e1e] rounded px-3 py-2 text-[#00FF41] focus:outline-none focus:border-[#00FF41]/50" />
      </div>

      <div className="flex gap-3 mb-3">
        <button onClick={() => setInput(encode())} className="flex-1 bg-[#00FF41] text-black font-bold text-xs py-2 rounded hover:bg-[#00cc33] transition-colors">ENCRYPT →</button>
        <button onClick={() => setInput(decode())} className="flex-1 bg-[#FFB700]/10 border border-[#FFB700]/40 text-[#FFB700] font-bold text-xs py-2 rounded hover:bg-[#FFB700]/20 transition-colors">DECRYPT ←</button>
      </div>

      <div className="bg-black/40 rounded p-3 border border-[#1e1e1e]">
        <label className="text-xs text-gray-500 block mb-1">OUTPUT</label>
        <span className="text-[#00FF41] break-all">{encode()}</span>
      </div>
    </div>
  );
}

// =====================
// Hash Identifier
// =====================
export function HashIdentifier() {
  const [hash, setHash] = useState('');
  const [result, setResult] = useState<{ type: string; strength: string; info: string } | null>(null);

  const patterns: [RegExp, string, string][] = [
    [/^[a-f0-9]{32}$/i, 'MD5', '128-bit hash. Fast but insecure for passwords. Cracked via rainbow tables.'],
    [/^[a-f0-9]{40}$/i, 'SHA-1', '160-bit hash. Deprecated for security uses. Still seen in git commits.'],
    [/^[a-f0-9]{64}$/i, 'SHA-256', '256-bit hash. Current standard for many security applications.'],
    [/^[a-f0-9]{96}$/i, 'SHA-384', '384-bit hash. Used in TLS certificates and high-security contexts.'],
    [/^[a-f0-9]{128}$/i, 'SHA-512', '512-bit hash. Highest SHA-2 standard. Used in password hashing (with salt).'],
    [/^\$2[ayb]\$\d{2}\$.{53}$/, 'Bcrypt', 'Adaptive hash. Slow by design. Used in password storage.'],
    [/^\$P\$\w{31}$/, 'WordPress MD5', 'Portable PHPass variant. Weak — avoid.'],
    [/^[a-f0-9]{16}$|^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i, 'UUID / Raw Hex', 'Not a hash — could be a UUID or machine identifier.'],
  ];

  const analyze = () => {
    if (!hash.trim()) { setResult(null); return; }
    for (const [re, type, info] of patterns) {
      if (re.test(hash.trim())) {
        const strength = ['MD5', 'SHA-1', 'WordPress MD5'].includes(type) ? '🔴 Weak — do not use for passwords' :
                         ['SHA-256', 'SHA-384', 'SHA-512'].includes(type) ? '🟡 Moderate — OK for integrity checks' : '🟢 Strong';
        setResult({ type, strength, info });
        return;
      }
    }
    setResult({ type: 'Unknown', strength: '❓ Unknown format', info: 'Could not identify this hash format. It may be truncated, modified, or a custom algorithm.' });
  };

  useEffect(() => { if (hash.length > 10) analyze(); else setResult(null); }, [hash]);

  return (
    <div className="glass rounded-xl p-6 font-mono text-sm">
      <h3 className="text-[#00FF41] font-bold text-lg mb-1">Hash Identifier</h3>
      <p className="text-gray-400 text-xs mb-4">Paste a hash — get its type, strength, and what it's used for.</p>

      <div className="mb-4">
        <input
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          placeholder="e.g. 5ebe2294ecd0e0f08eab7690d2a6ee69"
          className="w-full bg-black/50 border border-[#1e1e1e] rounded px-3 py-2 text-[#00FF41] focus:outline-none focus:border-[#00FF41]/50 font-mono text-xs"
        />
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-black/40 rounded p-2 border border-[#1e1e1e]">
            <span className="text-gray-500">5ebe2294...</span>
            <br/><span className="text-[#00FF41]">MD5</span>
          </div>
          <div className="bg-black/40 rounded p-2 border border-[#1e1e1e]">
            <span className="text-gray-500">b6a5d2ce...</span>
            <br/><span className="text-[#00FF41]">SHA-256</span>
          </div>
        </div>

        {result && (
          <div className="bg-black/60 rounded p-4 border border-[#00FF41]/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-[#00FF41]">{result.type}</span>
            </div>
            <p className="text-xs mb-2">{result.strength}</p>
            <p className="text-xs text-gray-400">{result.info}</p>
          </div>
        )}
      </div>
    </div>
  );
}
