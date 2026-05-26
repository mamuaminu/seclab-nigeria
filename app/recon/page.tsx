'use client';

import { useState } from 'react';

const PLANS = [
  { name: 'Free', price: '$0', period: 'forever', scans: '5/day', features: ['Subdomain enumeration', 'Top 100 ports', 'Tech detection', 'Email harvest (basic)', 'PDF report'], color: '#71717a' },
  { name: 'Pro', price: '$25', period: '/month', scans: '100/day', features: ['Everything in Free', 'All 65,535 ports', 'CVE lookup', 'Service versioning', 'XML/JSON export', 'Priority support'], color: '#00c9a7', highlight: true },
  { name: 'API', price: '$75', period: '/month', scans: 'Unlimited', features: ['Everything in Pro', 'REST API access', 'Webhook delivery', 'Bulk scanning', 'Custom profiles', 'Dedicated support'], color: '#f0a500' },
];

const SAMPLE = {
  domain: 'example.com',
  ip: '93.184.216.34',
  asn: 'AS15135 Verizon',
  country: 'United States',
  openPorts: [80, 443, 8080],
  subdomains: ['www.example.com', 'mail.example.com', 'api.example.com', 'cdn.example.com', 'admin.example.com'],
  tech: [
    { name: 'nginx', version: '1.25.3', category: 'Web Server' },
    { name: 'Cloudflare', version: null, category: 'CDN/WAF' },
    { name: 'React', version: '18.2.0', category: 'JS Framework' },
  ],
  cves: [
    { id: 'CVE-2023-44487', severity: 'CRITICAL', cvss: 8.6, title: 'HTTP/2 Rapid Reset', product: 'nginx < 1.24.0' },
    { id: 'CVE-2023-46747', severity: 'HIGH', cvss: 8.8, title: 'nginx ngx_http_js_module', product: 'nginx < 1.24.0' },
  ],
  emails: ['contact@example.com', 'admin@example.com', 'support@example.com'],
};

function sevColor(s: string) {
  return s === 'CRITICAL' ? '#ef4444' : s === 'HIGH' ? '#f0a500' : s === 'MEDIUM' ? '#00c9a7' : '#10b981';
}

export default function ReconPage() {
  const [domain, setDomain] = useState('');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<typeof SAMPLE | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'ports' | 'subdomains' | 'tech' | 'cves' | 'emails'>('overview');
  const [freeScans, setFreeScans] = useState(5);

  const runScan = async () => {
    const d = domain.trim().replace(/^https?:\/\//, '').split('/')[0];
    if (!d) return;
    setScanning(true);
    setResults(null);
    await new Promise(r => setTimeout(r, 2200));
    const res = JSON.parse(JSON.stringify(SAMPLE));
    res.domain = d;
    setResults(res);
    setFreeScans(n => n - 1);
    setScanning(false);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6"
        style={{ background: 'rgba(9,9,11,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="#00c9a7" strokeWidth="1.5" fill="rgba(6,182,212,0.1)"/>
              <path d="M9 14L12 17L19 10" stroke="#00c9a7" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="font-display font-bold text-sm" style={{ color: '#f4f4f5' }}>
              Sec<span style={{ color: '#00c9a7' }}>Lab</span><span style={{ color: '#f0a500' }}>NG</span>
            </span>
          </a>
          <div className="flex items-center gap-6">
            <a href="/ctf" className="nav-link">CTF</a>
            <a href="/courses" className="nav-link">Courses</a>
            <a href="/recon" className="nav-link" style={{ color: '#00c9a7' }}>Recon</a>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <div className="pt-32 pb-0 px-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto">
          <span className="section-label">// VULNERABILITY RECON</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-3 mb-8">
            <div>
              <h1 className="font-display font-bold text-4xl" style={{ color: '#f4f4f5' }}>
                <span style={{ color: '#00c9a7' }}>Sec</span>Lab <span style={{ color: '#10b981' }}>Recon</span>
              </h1>
              <p className="font-mono text-sm mt-1" style={{ color: '#52525b' }}>
                Automated attack surface analysis. Subdomains, ports, CVE lookup, tech fingerprinting.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: '#3f3f46' }}>Free Scans</div>
                <div className="font-display font-bold text-2xl" style={{ color: '#10b981' }}>{freeScans}/5</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SCANNER INPUT */}
      <div className="px-6 py-8" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: '#3f3f46' }}>Target Domain</p>
            <div className="flex gap-3">
              <input
                value={domain}
                onChange={e => setDomain(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runScan()}
                placeholder="target.com"
                className="tool-input flex-1"
              />
              <button
                onClick={runScan}
                disabled={scanning}
                className="btn-primary whitespace-nowrap"
                style={{ background: '#10b981' }}>
                {scanning ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1V4M7 10V13M1 7H4M10 7H13M3.05 3.05L5.28 5.28M8.72 8.72L10.95 10.95M3.05 10.95L5.28 8.72M8.72 5.28L10.95 3.05"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Scanning
                  </span>
                ) : (
                  <>
                    Scan
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
            <div className="flex gap-3 mt-3 flex-wrap">
              {['Subdomains', 'Open Ports', 'Tech Stack', 'CVE Lookup', 'Email Harvest'].map(f => (
                <span key={f} className="font-mono text-[10px]" style={{ color: '#3f3f46' }}>{f} ·</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SCANNING ANIMATION */}
      {scanning && (
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-block mb-6">
            <svg className="animate-spin" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 4V10M24 38V44M4 24H10M38 24H44M8.5 8.5L13 13M35 35L39.5 39.5M8.5 39.5L13 35M35 13L39.5 8.5"
                stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="24" cy="24" r="8" stroke="#10b981" strokeWidth="1.5" strokeDasharray="20 10"/>
            </svg>
          </div>
          <p className="font-display font-semibold text-lg mb-2" style={{ color: '#f4f4f5' }}>Scanning target...</p>
          <div className="max-w-sm mx-auto space-y-2 text-left mt-6">
            {['Resolving DNS', 'Enumerating subdomains', 'Scanning top ports', 'Fingerprinting technologies', 'Checking CVE database'].map((step, i) => (
              <div key={i} className="flex items-center gap-3 font-mono text-xs p-3 rounded-lg"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: '#52525b' }}>
                <span style={{ color: '#10b981' }}>◌</span> {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESULTS */}
      {results && !scanning && (
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Domain banner */}
          <div className="rounded-2xl p-5 mb-6 flex flex-wrap items-center gap-6"
            style={{ background: 'var(--surface)', border: '1px solid rgba(34,197,94,0.2)' }}>
            {[
              ['Target', results.domain, '#f4f4f5'],
              ['IP', results.ip, '#10b981'],
              ['ASN', results.asn, '#71717a'],
              ['Country', results.country, '#71717a'],
              ['Open Ports', results.openPorts.join(', '), '#f0a500'],
            ].map(([label, val, color]) => (
              <div key={label as string}>
                <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: '#3f3f46' }}>{label}</div>
                <div className="font-mono text-sm font-medium" style={{ color }}>{val}</div>
              </div>
            ))}
            <div className="ml-auto">
              <button className="font-mono text-xs px-4 py-2 rounded-lg transition-all"
                style={{ background: 'rgba(34,197,94,0.1)', color: '#10b981', border: '1px solid rgba(34,197,94,0.2)' }}>
                ↓ Download PDF
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex flex-wrap gap-1 border-b border-[var(--border)] pb-0 mb-6">
            {[
              ['overview', `Overview`],
              ['ports', `Ports (${results.openPorts.length})`],
              ['subdomains', `Subdomains (${results.subdomains.length})`],
              ['tech', `Tech (${results.tech.length})`],
              ['cves', `CVEs (${results.cves.length})`],
              ['emails', `Emails (${results.emails.length})`],
            ].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id as typeof activeTab)}
                className="font-mono text-xs pb-3 px-3 border-b-2 transition-all"
                style={{
                  borderColor: activeTab === id ? '#10b981' : 'transparent',
                  color: activeTab === id ? '#10b981' : '#52525b',
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: '#3f3f46' }}>Open Ports</p>
                <div className="space-y-2">
                  {results.openPorts.map(port => (
                    <div key={port} className="flex items-center gap-3 font-mono text-sm">
                      <span style={{ color: '#10b981' }}>▸</span>
                      <span style={{ color: '#f4f4f5' }}>Port {port}</span>
                      <span className="ml-auto font-mono text-xs" style={{ color: '#52525b' }}>
                        {port === 80 ? 'HTTP' : port === 443 ? 'HTTPS' : 'HTTP-Alt'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: '#3f3f46' }}>Technology Stack</p>
                <div className="space-y-2">
                  {results.tech.map(t => (
                    <div key={t.name} className="flex items-center gap-3 font-mono text-sm">
                      <span style={{ color: '#10b981' }}>▸</span>
                      <span style={{ color: '#f4f4f5' }}>{t.name}</span>
                      {t.version && <span className="font-mono text-[11px]" style={{ color: '#52525b' }}>v{t.version}</span>}
                      <span className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: '#16161c', color: '#52525b' }}>{t.category}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: '#3f3f46' }}>Discovered CVEs</p>
                {results.cves.map(cve => (
                  <div key={cve.id} className="mb-3 p-3 rounded-lg" style={{ background: '#16161c', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs" style={{ color: '#f4f4f5' }}>{cve.id}</span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                        style={{ background: `${sevColor(cve.severity)}15`, color: sevColor(cve.severity), border: `1px solid ${sevColor(cve.severity)}30` }}>
                        {cve.severity} · {cve.cvss}
                      </span>
                    </div>
                    <div className="font-mono text-[11px]" style={{ color: '#71717a' }}>{cve.title}</div>
                    <div className="font-mono text-[10px] mt-1" style={{ color: '#3f3f46' }}>{cve.product}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: '#3f3f46' }}>Subdomains ({results.subdomains.length})</p>
                {results.subdomains.map(s => (
                  <div key={s} className="font-mono text-sm flex items-center gap-2 py-1.5" style={{ color: '#71717a' }}>
                    <span style={{ color: '#10b981' }}>▸</span> {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ports' && (
            <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: '#3f3f46' }}>Open Ports</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {results.openPorts.map(port => (
                  <div key={port} className="rounded-lg p-5 text-center" style={{ background: '#16161c', border: '1px solid var(--border)' }}>
                    <div className="font-display font-bold text-3xl mb-1" style={{ color: '#10b981' }}>{port}</div>
                    <div className="font-mono text-[11px]" style={{ color: '#52525b' }}>{port === 80 ? 'HTTP' : port === 443 ? 'HTTPS' : 'HTTP-Alt'}</div>
                  </div>
                ))}
              </div>
              <p className="font-mono text-xs text-center mt-5" style={{ color: '#3f3f46' }}>
                Upgrade to Pro for full 65,535 port scan + service version detection →
              </p>
            </div>
          )}

          {activeTab === 'subdomains' && (
            <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: '#3f3f46' }}>Discovered Subdomains</p>
              <div className="space-y-2">
                {results.subdomains.map(s => (
                  <div key={s} className="flex items-center gap-4 p-3 rounded-lg transition-colors cursor-pointer"
                    style={{ background: '#16161c', border: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(34,197,94,0.2)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                    <span style={{ color: '#10b981' }}>▸</span>
                    <span className="font-mono text-sm flex-1" style={{ color: '#f4f4f5' }}>{s}</span>
                    <span className="font-mono text-[10px]" style={{ color: '#3f3f46' }}>A record</span>
                    <span className="font-mono text-[10px]" style={{ color: '#10b981' }}>Scan →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: '#3f3f46' }}>Technology Stack</p>
              <div className="space-y-3">
                {results.tech.map(t => (
                  <div key={t.name} className="flex items-center gap-5 p-4 rounded-lg" style={{ background: '#16161c', border: '1px solid var(--border)' }}>
                    <div className="flex-1">
                      <div className="font-display font-semibold text-sm" style={{ color: '#f4f4f5' }}>{t.name}</div>
                      {t.version && <div className="font-mono text-[11px]" style={{ color: '#52525b' }}>v{t.version}</div>}
                    </div>
                    <span className="font-mono text-[10px] px-3 py-1 rounded" style={{ background: '#0d0d0f', color: '#52525b' }}>{t.category}</span>
                    <span className="font-mono text-[10px]" style={{ color: '#10b981' }}>DETECTED</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cves' && (
            <div className="space-y-4">
              {results.cves.map(cve => (
                <div key={cve.id} className="rounded-xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="flex items-start gap-4 mb-3">
                    <div className="flex-1">
                      <div className="font-display font-bold text-sm mb-1" style={{ color: '#f4f4f5' }}>{cve.id}</div>
                      <div className="font-mono text-[11px]" style={{ color: '#71717a' }}>{cve.title}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold text-base" style={{ color: sevColor(cve.severity) }}>{cve.severity}</div>
                      <div className="font-mono text-[11px]" style={{ color: '#52525b' }}>CVSS {cve.cvss}</div>
                    </div>
                  </div>
                  <div className="font-mono text-[11px] p-3 rounded-lg" style={{ background: '#16161c', color: '#52525b' }}>
                    Affected: {cve.product}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'emails' && (
            <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: '#3f3f46' }}>Email Harvest</p>
              <div className="space-y-2">
                {results.emails.map(email => (
                  <div key={email} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#16161c', border: '1px solid var(--border)' }}>
                    <span style={{ color: '#10b981' }}>▸</span>
                    <span className="font-mono text-sm" style={{ color: '#f4f4f5' }}>{email}</span>
                    <span className="ml-auto font-mono text-[10px]" style={{ color: '#10b981' }}>✓ SMTP valid</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PRICING */}
      {!scanning && (
        <div className="px-6 py-16" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="section-label">// SCAN PLANS</span>
              <h2 className="font-display font-bold text-3xl mt-3" style={{ color: '#f4f4f5' }}>Start free. Scale as needed.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {PLANS.map(plan => (
                <div key={plan.name}
                  className="rounded-2xl p-6 text-center"
                  style={{
                    background: 'var(--surface)',
                    border: `1px solid ${plan.highlight ? 'rgba(6,182,212,0.3)' : 'var(--border)'}`,
                  }}>
                  <div className="font-display font-semibold text-base mb-1" style={{ color: plan.color }}>{plan.name}</div>
                  <div className="font-display font-black text-4xl mb-1" style={{ color: plan.color }}>
                    {plan.price}
                    <span className="text-sm font-normal" style={{ color: '#52525b' }}>{plan.period}</span>
                  </div>
                  <div className="font-mono text-xs mb-4" style={{ color: '#52525b' }}>{plan.scans}</div>
                  <div className="h-px mb-4" style={{ background: 'var(--border)' }} />
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2 font-mono text-[11px] py-1.5" style={{ color: '#71717a' }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke={plan.color} strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      {f}
                    </div>
                  ))}
                  <button className="w-full mt-6 py-4 rounded-lg font-semibold text-sm transition-all"
                    style={{
                      background: plan.highlight ? plan.color : 'transparent',
                      color: plan.highlight ? '#000' : plan.color,
                      border: `1px solid ${plan.color}40`,
                    }}>
                    {plan.name === 'Free' ? 'Start Free' : plan.name === 'Pro' ? 'Go Pro' : 'Get API Key'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="px-6 py-12" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="#00c9a7" strokeWidth="1.5" fill="rgba(6,182,212,0.1)"/>
              <path d="M9 14L12 17L19 10" stroke="#00c9a7" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="font-display font-bold text-sm" style={{ color: '#f4f4f5' }}>
              Sec<span style={{ color: '#00c9a7' }}>Lab</span><span style={{ color: '#f0a500' }}>NG</span>
            </span>
          </div>
          <p className="font-mono text-xs" style={{ color: '#3f3f46' }}>© 2026 SecLab Nigeria · 5 free scans/day</p>
        </div>
      </footer>
    </div>
  );
}