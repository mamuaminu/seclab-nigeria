'use client';

import { useState, useRef } from 'react';

const PAYLOADS = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror="alert(1)">',
  '<svg onload="alert(1)">',
  "javascript:alert('XSS')",
  '<body onload="alert(1)">',
];

export function XSSSimulator() {
  const [payload, setPayload] = useState(PAYLOADS[0]);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'try' | 'reference'>('try');

  return (
    <div className="glass border border-[#1A1A1A] p-7 font-mono">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#00FF41] text-sm">⬡</span>
            <h3 className="text-[#E8E8E8] font-bold text-base tracking-tight">XSS Simulator</h3>
          </div>
          <p className="text-[#555] text-[11px] leading-relaxed max-w-[240px]">See how cross-site scripting executes in a sandboxed environment.</p>
        </div>
        <span className="text-[10px] font-mono text-[#333] border border-[#1A1A1A] px-2 py-0.5">BROWSER-ONLY</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-5">
        {(['try', 'reference'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`font-mono text-[10px] tracking-widest uppercase px-4 py-2 border border-[#1A1A1A] -ml-px transition-colors ${
              activeTab === tab
                ? 'bg-[#00FF41]/10 border-[#00FF41]/40 text-[#00FF41]'
                : 'text-[#555] hover:text-[#888]'
            }`}>
            {tab === 'try' ? 'Try It' : 'Reference'}
          </button>
        ))}
      </div>

      {activeTab === 'try' ? (
        <>
          <div className="mb-4">
            <label className="text-[#555] font-mono text-[10px] tracking-widest uppercase block mb-2">PAYLOAD INPUT</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste XSS payload here..."
              className="tool-input"
            />
          </div>

          <div className="mb-5">
            <label className="text-[#555] font-mono text-[10px] tracking-widest uppercase block mb-2">QUICK PAYLOADS</label>
            <div className="flex flex-wrap gap-1.5">
              {PAYLOADS.map((p, i) => (
                <button key={i} onClick={() => { setInput(p); setPayload(p); }}
                  className="tool-btn">{p.slice(0, 22)}{p.length > 22 ? '...' : ''}</button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="text-[#555] font-mono text-[10px] tracking-widest uppercase block mb-2">SANDBOX OUTPUT</label>
            <div className="bg-black border border-[#1A1A1A] p-4 min-h-[70px]">
              <div dangerouslySetInnerHTML={{ __html: input || payload }} />
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div className="bg-black/60 border border-[#1A1A1A] p-4">
            <div className="font-mono text-[10px] text-[#FFB700] mb-1">// REFLECTED XSS</div>
            <div className="font-mono text-[11px] text-[#555]">User input is echoed back without sanitization. Attackers inject scripts via URL parameters.</div>
          </div>
          <div className="bg-black/60 border border-[#1A1A1A] p-4">
            <div className="font-mono text-[10px] text-[#FFB700] mb-1">// STORED XSS</div>
            <div className="font-mono text-[11px] text-[#555]">Malicious scripts are saved on the server and served to all users who view the affected page.</div>
          </div>
          <div className="bg-black/60 border border-[#1A1A1A] p-4">
            <div className="font-mono text-[10px] text-[#FFB700] mb-1">// DOM-BASED XSS</div>
            <div className="font-mono text-[11px] text-[#555]">JavaScript reads and executes user-controlled data from the DOM without proper sanitization.</div>
          </div>
        </div>
      )}

      {/* Warning */}
      <div className="bg-[#FFB700]/5 border border-[#FFB700]/20 p-4 mt-2">
        <p className="text-[#FFB700] font-mono text-[10px] font-semibold tracking-wider uppercase mb-1">⚠ How it works</p>
        <p className="text-[#555] font-mono text-[11px] leading-relaxed">
          XSS injects scripts into web pages. Unvalidated input can steal cookies, hijack sessions, or redirect users. Always escape and validate server-side.
        </p>
      </div>
    </div>
  );
}