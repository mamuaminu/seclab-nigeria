'use client';

import { useState } from 'react';

type SQLiType = 'classic' | 'union' | 'boolean' | 'time';

const SQLI_TYPES: { key: SQLiType; label: string; desc: string }[] = [
  { key: 'classic', label: 'CLASSIC', desc: 'Classic OR-based injection — appends OR 1=1 to bypass authentication.' },
  { key: 'union', label: 'UNION', desc: 'UNION-based injection — appends a second SELECT query to extract data from other tables.' },
  { key: 'boolean', label: 'BOOLEAN', desc: 'Forces TRUE/FALSE responses from the database by chaining conditions with AND.' },
  { key: 'time', label: 'TIME-BASED', desc: 'Uses SLEEP() or WAITFOR to infer data character-by-character from response time.' },
];

const EXAMPLE_QUERIES = [
  { label: 'Login Form', query: "SELECT * FROM users WHERE username='admin' AND password='x'" },
  { label: 'Search Bar', query: "SELECT * FROM products WHERE name LIKE '%widget%'" },
  { label: 'User Profile', query: "SELECT * FROM users WHERE id=42" },
];

const PAYLOADS: Record<SQLiType, string[]> = {
  classic: ["' OR '1'='1", "' OR '1'='1' --", "' OR 1=1 --", "admin' OR '1'='1"],
  union: ["' UNION SELECT NULL,NULL--", "' UNION SELECT username,password FROM users--", "' UNION SELECT table_name,null FROM information_schema.tables--"],
  boolean: ["' AND 1=1--", "' AND 1=2--", "' AND (SELECT COUNT(*) FROM users)>0--", "' AND ASCII(SUBSTRING((SELECT database()),1,1))>64--"],
  time: ["'; SLEEP(5)--", "'; WAITFOR DELAY '0:0:5'--", "'; SELECT SLEEP(5)--", "1' AND (SELECT COUNT(*) FROM users) > 0 AND SLEEP(5)--"],
};

export function SQLInjectionSimulator() {
  const [sqlType, setSqlType] = useState<SQLiType>('classic');
  const [query, setQuery] = useState(EXAMPLE_QUERIES[0].query);
  const [payload, setPayload] = useState('');
  const [activeTab, setActiveTab] = useState<'try' | 'reference'>('try');
  const [simulateResult, setSimulateResult] = useState<string | null>(null);
  const [vulnerable, setVulnerable] = useState(false);

  const buildInjectedQuery = () => {
    if (!payload.trim()) return 'Enter a payload above';
    const escaped = payload.replace(/'/g, "''");
    const separator = query.includes('WHERE') ? ' OR ' : ' WHERE ';
    const comment = sqlType === 'classic' ? " --" : "";
    return query + separator + "'" + escaped + "'" + comment + " → query becomes injectable";
  };

  const simulate = () => {
    if (!payload.trim()) return;
    setVulnerable(true);
    setSimulateResult(buildInjectedQuery());
  };

  const loadPayload = (p: string) => {
    setPayload(p);
    setVulnerable(false);
    setSimulateResult(null);
  };

  const loadQuery = (q: string) => {
    setQuery(q);
    setVulnerable(false);
    setSimulateResult(null);
    setPayload('');
  };

  return (
    <div className="glass border border-[#1A1A1A] p-7 font-mono">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#00FF41] text-sm" aria-hidden="true">⬡</span>
            <h3 className="text-[#E8E8E8] font-bold text-base tracking-tight">SQL Injection Simulator</h3>
          </div>
          <p className="text-[#555] text-[11px] leading-relaxed max-w-[240px]">Visualize how SQL injection bypasses queries. Watch payloads modify query logic in real time.</p>
        </div>
        <span className="text-[10px] font-mono text-[#333] border border-[#1A1A1A] px-2 py-0.5">BROWSER-ONLY</span>
      </div>

      {/* SQLi type selector */}
      <div className="flex flex-wrap gap-0 mb-5" role="group" aria-label="SQL injection type">
        {SQLI_TYPES.map(({ key, label }) => (
          <button key={key} type="button" onClick={() => { setSqlType(key); setVulnerable(false); setSimulateResult(null); }}
            aria-pressed={sqlType === key}
            className={`font-mono text-[9px] tracking-widest uppercase px-2.5 py-1.5 border border-[#1A1A1A] -ml-px transition-colors ${
              sqlType === key ? 'bg-[#00FF41]/10 border-[#00FF41]/40 text-[#00FF41]' : 'text-[#555] hover:text-[#888]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-5" role="tablist" aria-label="SQL Simulator tabs">
        {(['try', 'reference'] as const).map(tab => (
          <button key={tab} type="button" role="tab" aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`font-mono text-[10px] tracking-widest uppercase px-4 py-2 border border-[#1A1A1A] -ml-px transition-colors ${
              activeTab === tab ? 'bg-[#00FF41]/10 border-[#00FF41]/40 text-[#00FF41]' : 'text-[#555] hover:text-[#888]'
            }`}
          >
            {tab === 'try' ? 'Try It' : 'Reference'}
          </button>
        ))}
      </div>

      {activeTab === 'try' ? (
        <>
          {/* Simulated query display */}
          <div className="mb-4">
            <label className="text-[#555] font-mono text-[10px] tracking-widest uppercase block mb-2">SIMULATED QUERY</label>
            <div className="bg-black border border-[#1A1A1A] p-3 font-mono text-[11px] text-[#666] leading-relaxed overflow-x-auto">
              <span className="text-[#555]">$ </span>{query.replace(/'/g, '&#39;')}
            </div>
          </div>

          {/* Payload input */}
          <div className="mb-4">
            <label className="text-[#555] font-mono text-[10px] tracking-widest uppercase block mb-2">INJECTION PAYLOAD</label>
            <input type="text" value={payload} onChange={(e) => setPayload(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && simulate()}
              placeholder={`e.g. ${PAYLOADS[sqlType][0]}`}
              className="tool-input" aria-label="SQL injection payload"
            />
          </div>

          {/* Payloads */}
          <div className="mb-4">
            <label className="text-[#555] font-mono text-[10px] tracking-widest uppercase block mb-2">QUICK PAYLOADS</label>
            <div className="flex flex-wrap gap-1.5">
              {PAYLOADS[sqlType].map((p, i) => (
                <button key={i} type="button" onClick={() => loadPayload(p)}
                  className="tool-btn" aria-label={`Load payload: ${p}`}>
                  {p.slice(0, 28)}{p.length > 28 ? '...' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Query templates */}
          <div className="mb-5">
            <label className="text-[#555] font-mono text-[10px] tracking-widest uppercase block mb-2">QUERY TEMPLATES</label>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLE_QUERIES.map(({ label, query: q }) => (
                <button key={label} type="button" onClick={() => loadQuery(q)}
                  className="tool-btn" aria-label={`Load query template: ${label}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Simulate button */}
          <button type="button" onClick={simulate}
            className="btn-neon w-full text-center mb-4">
            INJECT →
          </button>

          {/* Result */}
          {simulateResult && (
            <div className={`border p-4 mb-4 ${vulnerable ? 'border-[#00FF41]/30 bg-[#00FF41]/5' : 'border-[#1A1A1A] bg-black/60'}`}
              aria-live="polite" role="status">
              <div className="font-mono text-[10px] tracking-widest uppercase mb-2 text-[#555]">MODIFIED QUERY</div>
              <div className={`font-mono text-[11px] leading-relaxed ${vulnerable ? 'text-[#00FF41]' : 'text-[#FF4444]'}`}>
                {query.replace(/'/g, '&#39;')} <span className="text-[#FFB700]"> → </span>
                {payload.replace(/'/g, '&#39;')}
              </div>
              {vulnerable && (
                <div className="mt-3 text-[#555] font-mono text-[10px] leading-relaxed">
                  <span className="text-[#00FF41]">✓ </span>Query logic altered — condition always evaluates TRUE
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-3" role="tabpanel">
          {SQLI_TYPES.map(({ key, label, desc }) => (
            <div key={key} className="bg-black/60 border border-[#1A1A1A] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#00FF41] font-mono text-[10px] font-semibold tracking-widest uppercase">{label}</span>
              </div>
              <div className="text-[#555] font-mono text-[11px] leading-relaxed">{desc}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PAYLOADS[key].slice(0, 3).map((p, i) => (
                  <button key={i} type="button" onClick={() => { setPayload(p); setActiveTab('try'); setSqlType(key); }}
                    className="tool-btn text-[9px]" aria-label={`Load ${label} payload: ${p}`}>
                    {p.slice(0, 25)}{p.length > 25 ? '...' : ''}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warning */}
      <div className="bg-[#FFB700]/5 border border-[#FFB700]/20 p-4 mt-2">
        <p className="text-[#FFB700] font-mono text-[10px] font-semibold tracking-wider uppercase mb-1">⚠ Defense</p>
        <p className="text-[#555] font-mono text-[11px] leading-relaxed">
          Prevent SQLi with parameterized queries, input validation, least privilege DB accounts, and stored procedures.
        </p>
      </div>
    </div>
  );
}