'use client';

import { useState } from 'react';

const PLANS = [
  { name: 'Free', price: '$0', period: 'forever', scans: '5/day', features: ['Subdomain enumeration', 'Top 100 ports', 'Tech detection', 'Email harvest (basic)', 'PDF report'], color: 'var(--text-2)' },
  { name: 'Pro', price: '$25', period: '/month', scans: '100/day', features: ['Everything in Free', 'All 65,535 ports', 'CVE lookup', 'Service versioning', 'XML/JSON export', 'Priority support'], color: 'var(--brand)', highlight: true },
  { name: 'API', price: '$75', period: '/month', scans: 'Unlimited', features: ['Everything in Pro', 'REST API access', 'Webhook delivery', 'Bulk scanning', 'Custom profiles', 'Dedicated support'], color: 'var(--amber)' },
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
  return s === 'CRITICAL' ? 'var(--red)' : s === 'HIGH' ? 'var(--amber)' : s === 'MEDIUM' ? 'var(--brand)' : 'var(--green)';
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
        style={{ background: 'rgba(19,19,28,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-dim)', border: '1px solid var(--brand-border)' }}>
              <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="#00c9a7" strokeWidth="1.5" fill="rgba(0,201,167,0.1)"/>
                <path d="M9 14L12 17L19 10" stroke="#00c9a7" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>
              Sec<span style={{ color: 'var(--brand)' }}>Lab</span><span style={{ color: 'var(--amber)' }}>NG</span>
            </span>
          </a>
          <div className="flex items-center gap-1">
            {([
              { label: 'CTF', href: '/ctf', active: false },
              { label: 'Courses', href: '/courses', active: false },
              { label: 'Recon', href: '/recon', active: true },
            ]).map(({ label, href, active }) => (
              <a key={label} href={href}
                className="font-mono text-xs px-4 py-2 rounded-lg transition-all"
                style={{
                  color: active ? 'var(--brand)' : 'var(--text-2)',
                  background: active ? 'var(--brand-dim)' : 'transparent',
                  textDecoration: 'none',
                }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO HEADER */}
      <div className="pt-32 pb-0 px-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[180px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,201,167,0.05) 0%, transparent 70%)' }} />
        <div className="max-w-6xl mx-auto relative">
          <span className="section-label">// VULNERABILITY RECON</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-3 mb-8">
            <div>
              <h1 className="font-display font-bold text-4xl" style={{ color: 'var(--text)' }}>
                <span style={{ color: 'var(--brand)' }}>Sec</span>Lab{' '}
                <span style={{
                  background: 'linear-gradient(135deg, var(--brand) 0%, var(--green) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>Recon</span>
              </h1>
              <p className="font-mono text-sm mt-1" style={{ color: 'var(--text-3)' }}>
                Automated attack surface analysis. Subdomains, ports, CVE lookup, tech fingerprinting.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-4)' }}>Free Scans</div>
                <div className="font-display font-bold text-2xl" style={{ color: 'var(--green)' }}>{freeScans}/5</div>
              </div>
            </div>
          </div>
          {/* Gradient line */}
          <div className="h-px w-full mb-0" style={{
            background: 'linear-gradient(90deg, var(--brand) 0%, transparent 100%)',
            opacity: 0.3,
          }} />
        </div>
      </div>

      {/* SCANNER INPUT */}
      <div className="px-6 py-8" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="card rounded-2xl p-6">
            <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>Target Domain</p>
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
                style={{ background: 'var(--green)' }}>
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
                <span key={f} className="font-mono text-[10px]" style={{ color: 'var(--text-4)' }}>{f} ·</span>
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
                stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="24" cy="24" r="8" stroke="var(--green)" strokeWidth="1.5" strokeDasharray="20 10"/>
            </svg>
          </div>
          <p className="font-display font-semibold text-lg mb-2" style={{ color: 'var(--text)' }}>Scanning target...</p>
          <div className="max-w-sm mx-auto space-y-2 text-left mt-6">
            {['Resolving DNS', 'Enumerating subdomains', 'Scanning top ports', 'Fingerprinting technologies', 'Checking CVE database'].map((step, i) => (
              <div key={i} className="flex items-center gap-3 font-mono text-xs p-3 rounded-xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-3)' }}>
                <span style={{ color: 'var(--green)' }}>◌</span> {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESULTS */}
      {results && !scanning && (
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Domain banner */}
          <div className="card rounded-2xl p-5 mb-6 flex flex-wrap items-center gap-6">
            {[
              ['Target', results.domain, 'var(--text)'],
              ['IP', results.ip, 'var(--green)'],
              ['ASN', results.asn, 'var(--text-2)'],
              ['Country', results.country, 'var(--text-2)'],
              ['Open Ports', results.openPorts.join(', '), 'var(--amber)'],
            ].map(([label, val, color]) => (
              <div key={label as string}>
                <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-4)' }}>{label}</div>
                <div className="font-mono text-sm font-medium" style={{ color }}>{val}</div>
              </div>
            ))}
            <div className="ml-auto">
              <button className="font-mono text-xs px-4 py-2 rounded-xl transition-all"
                style={{ background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid var(--green-border)' }}>
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
                  borderColor: activeTab === id ? 'var(--green)' : 'transparent',
                  color: activeTab === id ? 'var(--green)' : 'var(--text-3)',
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="card rounded-xl p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: 'var(--text-4)' }}>Open Ports</p>
                <div className="space-y-2">
                  {results.openPorts.map(port => (
                    <div key={port} className="flex items-center gap-3 font-mono text-sm">
                      <span style={{ color: 'var(--green)' }}>▸</span>
                      <span style={{ color: 'var(--text)' }}>Port {port}</span>
                      <span className="ml-auto font-mono text-xs" style={{ color: 'var(--text-3)' }}>
                        {port === 80 ? 'HTTP' : port === 443 ? 'HTTPS' : 'HTTP-Alt'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card rounded-xl p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: 'var(--text-4)' }}>Technology Stack</p>
                <div className="space-y-2">
                  {results.tech.map(t => (
                    <div key={t.name} className="flex items-center gap-3 font-mono text-sm">
                      <span style={{ color: 'var(--green)' }}>▸</span>
                      <span style={{ color: 'var(--text)' }}>{t.name}</span>
                      {t.version && <span className="font-mono text-[11px]" style={{ color: 'var(--text-3)' }}>v{t.version}</span>}
                      <span className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: 'var(--surface-2)', color: 'var(--text-3)' }}>{t.category}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card rounded-xl p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: 'var(--text-4)' }}>Discovered CVEs</p>
                {results.cves.map(cve => (
                  <div key={cve.id} className="mb-3 p-3 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs" style={{ color: 'var(--text)' }}>{cve.id}</span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                        style={{ background: `${sevColor(cve.severity)}15`, color: sevColor(cve.severity), border: `1px solid ${sevColor(cve.severity)}30` }}>
                        {cve.severity} · {cve.cvss}
                      </span>
                    </div>
                    <div className="font-mono text-[11px]" style={{ color: 'var(--text-2)' }}>{cve.title}</div>
                    <div className="font-mono text-[10px] mt-1" style={{ color: 'var(--text-4)' }}>{cve.product}</div>
                  </div>
                ))}
              </div>
              <div className="card rounded-xl p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: 'var(--text-4)' }}>Subdomains ({results.subdomains.length})</p>
                {results.subdomains.map(s => (
                  <div key={s} className="font-mono text-sm flex items-center gap-2 py-1.5" style={{ color: 'var(--text-2)' }}>
                    <span style={{ color: 'var(--green)' }}>▸</span> {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ports' && (
            <div className="card rounded-xl p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: 'var(--text-4)' }}>Open Ports</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {results.openPorts.map(port => (
                  <div key={port} className="rounded-xl p-5 text-center" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                    <div className="font-display font-bold text-3xl mb-1" style={{ color: 'var(--green)' }}>{port}</div>
                    <div className="font-mono text-[11px]" style={{ color: 'var(--text-3)' }}>{port === 80 ? 'HTTP' : port === 443 ? 'HTTPS' : 'HTTP-Alt'}</div>
                  </div>
                ))}
              </div>
              <p className="font-mono text-xs text-center mt-5" style={{ color: 'var(--text-4)' }}>
                Upgrade to Pro for full 65,535 port scan + service version detection →
              </p>
            </div>
          )}

          {activeTab === 'subdomains' && (
            <div className="card rounded-xl p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: 'var(--text-4)' }}>Discovered Subdomains</p>
              <div className="space-y-2">
                {results.subdomains.map(s => (
                  <div key={s} className="flex items-center gap-4 p-3 rounded-xl transition-colors cursor-pointer"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--brand-border)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                    <span style={{ color: 'var(--green)' }}>▸</span>
                    <span className="font-mono text-sm flex-1" style={{ color: 'var(--text)' }}>{s}</span>
                    <span className="font-mono text-[10px]" style={{ color: 'var(--text-4)' }}>A record</span>
                    <span className="font-mono text-[10px]" style={{ color: 'var(--brand)' }}>Scan →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="card rounded-xl p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: 'var(--text-4)' }}>Technology Stack</p>
              <div className="space-y-3">
                {results.tech.map(t => (
                  <div key={t.name} className="flex items-center gap-5 p-4 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                    <div className="flex-1">
                      <div className="font-display font-semibold text-sm" style={{ color: 'var(--text)' }}>{t.name}</div>
                      {t.version && <div className="font-mono text-[11px]" style={{ color: 'var(--text-3)' }}>v{t.version}</div>}
                    </div>
                    <span className="font-mono text-[10px] px-3 py-1 rounded" style={{ background: 'var(--bg)', color: 'var(--text-3)' }}>{t.category}</span>
                    <span className="font-mono text-[10px]" style={{ color: 'var(--green)' }}>DETECTED</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cves' && (
            <div className="space-y-4">
              {results.cves.map(cve => (
                <div key={cve.id} className="card rounded-xl p-6">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="flex-1">
                      <div className="font-display font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>{cve.id}</div>
                      <div className="font-mono text-[11px]" style={{ color: 'var(--text-2)' }}>{cve.title}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold text-base" style={{ color: sevColor(cve.severity) }}>{cve.severity}</div>
                      <div className="font-mono text-[11px]" style={{ color: 'var(--text-3)' }}>CVSS {cve.cvss}</div>
                    </div>
                  </div>
                  <div className="font-mono text-[11px] p-3 rounded-xl" style={{ background: 'var(--surface-2)', color: 'var(--text-3)' }}>
                    Affected: {cve.product}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'emails' && (
            <div className="card rounded-xl p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: 'var(--text-4)' }}>Email Harvest</p>
              <div className="space-y-2">
                {results.emails.map(email => (
                  <div key={email} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--green)' }}>▸</span>
                    <span className="font-mono text-sm" style={{ color: 'var(--text)' }}>{email}</span>
                    <span className="ml-auto font-mono text-[10px]" style={{ color: 'var(--green)' }}>✓ SMTP valid</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PRICING */}
      {!scanning && (
        <div className="px-6 py-16" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="section-label">// SCAN PLANS</span>
              <h2 className="font-display font-bold text-3xl mt-3" style={{ color: 'var(--text)' }}>Start free. Scale as needed.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {PLANS.map(plan => (
                <div key={plan.name}
                  className="card rounded-2xl p-6 text-center"
                  style={{
                    background: plan.highlight ? 'var(--surface-2)' : 'var(--surface)',
                    border: `1px solid ${plan.highlight ? 'var(--brand-border)' : 'var(--border)'}`,
                  }}>
                  <div className="font-display font-semibold text-base mb-1" style={{ color: plan.color }}>{plan.name}</div>
                  <div className="font-display font-black text-4xl mb-1" style={{ color: plan.color }}>
                    {plan.price}
                    <span className="text-sm font-normal" style={{ color: 'var(--text-3)' }}>{plan.period}</span>
                  </div>
                  <div className="font-mono text-xs mb-4" style={{ color: 'var(--text-3)' }}>{plan.scans}</div>
                  <div className="h-px mb-4" style={{ background: 'var(--border)' }} />
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2 font-mono text-[11px] py-1.5" style={{ color: 'var(--text-2)' }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke={plan.color} strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      {f}
                    </div>
                  ))}
                  <button className="w-full mt-6 py-4 rounded-xl font-semibold text-sm transition-all"
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
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-dim)', border: '1px solid var(--brand-border)' }}>
              <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="#00c9a7" strokeWidth="1.5" fill="rgba(0,201,167,0.1)"/>
                <path d="M9 14L12 17L19 10" stroke="#00c9a7" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>
              Sec<span style={{ color: 'var(--brand)' }}>Lab</span><span style={{ color: 'var(--amber)' }}>NG</span>
            </span>
          </div>
          <p className="font-mono text-xs" style={{ color: 'var(--text-4)' }}>© 2026 SecLab Nigeria · 5 free scans/day</p>
        </div>
      </footer>
    </div>
  );
}