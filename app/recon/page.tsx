'use client';

import { useState } from 'react';

const PLANS = [
  { name: 'Free', price: '$0', period: 'forever', scans: '5 scans/day', domains: '1 domain/scan', api: false, features: ['Subdomain enumeration', 'Port scan (top 100)', 'Technology detection', 'Email harvest (basic)', 'PDF report'], cta: 'Start Free', color: '#888888' },
  { name: 'Pro', price: '$25', period: '/month', scans: '100 scans/day', domains: '5 domains/scan', api: false, features: ['Everything in Free', 'Full port scan (all 65535)', 'Service version detection', 'CVE lookup', 'XML/JSON export', 'Priority support'], cta: 'Go Pro', color: '#00FF41', highlight: true },
  { name: 'API', price: '$75', period: '/month', scans: 'Unlimited', domains: 'Unlimited', api: true, features: ['Everything in Pro', 'REST API access', 'Webhook results', 'Bulk scan', 'Custom scan profiles', 'Dedicated support'], cta: 'Get API Key', color: '#FFB700' },
];

const SAMPLE_RESULTS = {
  domain: 'example.com',
  ip: '93.184.216.34',
  country: 'United States',
  asn: 'AS15135 Verizon',
  openPorts: [80, 443, 8080],
  subdomains: ['www.example.com', 'mail.example.com', 'api.example.com', 'cdn.example.com', 'admin.example.com'],
  technologies: [
    { name: 'nginx', version: '1.25.3', category: 'Web Server' },
    { name: 'Cloudflare', version: null, category: 'CDN/WAF' },
    { name: 'React', version: '18.2.0', category: 'JavaScript Framework' },
    { name: 'Amazon S3', version: null, category: 'Cloud Storage' },
  ],
  cves: [
    { id: 'CVE-2023-44487', severity: 'CRITICAL', cvss: 8.6, title: 'HTTP/2 Rapid Reset Attack', product: 'nginx < 1.24.0' },
    { id: 'CVE-2023-46747', severity: 'HIGH', cvss: 8.8, title: 'nginx ngx_http_js_module', product: 'nginx < 1.24.0' },
  ],
  emails: ['contact@example.com', 'admin@example.com', 'support@example.com'],
};

type ScanResult = typeof SAMPLE_RESULTS | null;

function simulateScan(domain: string): Promise<typeof SAMPLE_RESULTS> {
  return new Promise(resolve => {
    setTimeout(() => {
      const result = JSON.parse(JSON.stringify(SAMPLE_RESULTS));
      result.domain = domain;
      resolve(result);
    }, 2200);
  });
}

export default function ReconPage() {
  const [domain, setDomain] = useState('');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'ports' | 'subdomains' | 'tech' | 'cves' | 'emails'>('overview');
  const [freeScans, setFreeScans] = useState(5);

  const runScan = async () => {
    const d = domain.trim().replace(/^https?:\/\//, '').split('/')[0];
    if (!d) return;
    if (freeScans <= 0) {
      alert('Daily free scan limit reached. Upgrade to Pro for 100 scans/day.');
      return;
    }
    setScanning(true);
    setResults(null);
    const res = await simulateScan(d);
    setResults(res);
    setFreeScans(n => n - 1);
    setScanning(false);
    setActiveTab('overview');
  };

  const severityColor = (s: string) =>
    s === 'CRITICAL' ? '#FF4444' : s === 'HIGH' ? '#FFB700' : s === 'MEDIUM' ? '#00BFFF' : '#00FF41';

  return (
    <div className="min-h-screen bg-black text-[#E8E8E8]">
      {/* Header */}
      <div className="border-b border-[#1A1A1A] px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <span className="section-label">// VULNERABILITY RECON SAAS</span>
              <h1 className="font-mono font-black text-3xl mt-2">
                <span className="text-[#00FF41]">Sec</span>Lab <span className="text-[#FFB700]">Recon</span>
              </h1>
              <p className="text-[#555] text-sm font-mono mt-1">Automated vulnerability surface analysis. Subdomains, ports, CVEs, tech stack.</p>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-1">Free Scans Today</div>
              <div className="font-mono text-2xl text-[#00FF41] font-black">{freeScans}/5</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scanner input */}
      <div className="border-b border-[#1A1A1A] px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass border border-[#1A1A1A] p-6 max-w-3xl mx-auto">
            <p className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-3">Enter target domain</p>
            <div className="flex gap-3">
              <input
                value={domain}
                onChange={e => setDomain(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runScan()}
                placeholder="target.com"
                className="tool-input flex-1 text-base"
              />
              <button
                onClick={runScan}
                disabled={scanning}
                className="btn-neon whitespace-nowrap min-w-[120px]">
                {scanning ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="animate-spin">⟳</span> Scanning
                  </span>
                ) : 'Scan →'}
              </button>
            </div>
            <div className="flex gap-4 mt-3">
              {['Subdomains', 'Open Ports', 'Tech Stack', 'CVE Lookup', 'Email Harvest'].map(item => (
                <span key={item} className="font-mono text-[10px] text-[#444]">{item} ·</span>
              ))}
              <span className="font-mono text-[10px] text-[#333]">Powered by SecLab Recon API</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Domain info banner */}
          <div className="glass border border-[#00FF41]/20 p-5 mb-6 flex flex-wrap items-center gap-6">
            <div>
              <div className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-1">Target</div>
              <div className="font-mono font-bold text-[#E8E8E8] text-lg">{results.domain}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-1">IP Address</div>
              <div className="font-mono text-sm text-[#00FF41]">{results.ip}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-1">ASN</div>
              <div className="font-mono text-sm text-[#888]">{results.asn}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-1">Country</div>
              <div className="font-mono text-sm text-[#888]">{results.country}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-1">Open Ports</div>
              <div className="font-mono text-sm text-[#FFB700]">{results.openPorts.join(', ')}</div>
            </div>
            <div className="ml-auto">
              <button className="font-mono text-[11px] border border-[#00FF41]/30 text-[#00FF41] px-4 py-2 hover:bg-[#00FF41]/10 transition-all">
                ↓ Download PDF Report
              </button>
            </div>
          </div>

          {/* Result tabs */}
          <div className="flex flex-wrap gap-1 border-b border-[#1A1A1A] pb-0 mb-6">
            {[
              ['overview', 'Overview'],
              ['ports', 'Ports'],
              ['subdomains', `Subdomains (${results.subdomains.length})`],
              ['tech', `Tech Stack (${results.technologies.length})`],
              ['cves', `CVEs (${results.cves.length})`],
              ['emails', `Emails (${results.emails.length})`],
            ].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id as typeof activeTab)}
                className={`font-mono text-[11px] pb-3 px-3 border-b-2 transition-all duration-200 ${
                  activeTab === id ? 'border-[#00FF41] text-[#00FF41]' : 'border-transparent text-[#555] hover:text-[#888]'
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && (
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="glass border border-[#1A1A1A] p-5">
                <div className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-3">Open Ports</div>
                <div className="space-y-2">
                  {results.openPorts.map(port => (
                    <div key={port} className="flex items-center gap-3 font-mono text-sm">
                      <span className="text-[#00FF41]">▸</span>
                      <span className="text-[#E8E8E8]">Port {port}</span>
                      <span className="text-[#555] ml-auto">{port === 80 ? 'HTTP' : port === 443 ? 'HTTPS' : port === 8080 ? 'HTTP-Alt' : 'Unknown'}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass border border-[#1A1A1A] p-5">
                <div className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-3">Technology Stack</div>
                <div className="space-y-2">
                  {results.technologies.map(t => (
                    <div key={t.name} className="flex items-center gap-3 font-mono text-sm">
                      <span className="text-[#00FF41]">▸</span>
                      <span className="text-[#E8E8E8]">{t.name}</span>
                      {t.version && <span className="text-[#555] text-[11px]">v{t.version}</span>}
                      <span className="ml-auto font-mono text-[10px] text-[#555] bg-[#111] px-2 py-0.5">{t.category}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass border border-[#1A1A1A] p-5">
                <div className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-3">Discovered CVEs</div>
                {results.cves.map(cve => (
                  <div key={cve.id} className="mb-3 p-3 border border-[#1A1A1A]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-[#E8E8E8]">{cve.id}</span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 border" style={{ borderColor: `${severityColor(cve.severity)}40`, color: severityColor(cve.severity) }}>
                        {cve.severity} · CVSS {cve.cvss}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-[#666]">{cve.title}</div>
                    <div className="font-mono text-[10px] text-[#444] mt-1">{cve.product}</div>
                  </div>
                ))}
              </div>
              <div className="glass border border-[#1A1A1A] p-5">
                <div className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-3">Subdomains ({results.subdomains.length})</div>
                <div className="space-y-1.5">
                  {results.subdomains.map(s => (
                    <div key={s} className="font-mono text-[12px] text-[#666] flex items-center gap-2">
                      <span className="text-[#333]">▸</span>
                      <span className="hover:text-[#00FF41] cursor-pointer transition-colors">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ports' && (
            <div className="glass border border-[#1A1A1A] p-5">
              <div className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-4">Full Port Scan</div>
              <div className="grid sm:grid-cols-3 gap-3">
                {results.openPorts.map(port => (
                  <div key={port} className="border border-[#1A1A1A] p-4 text-center">
                    <div className="font-mono text-xl text-[#00FF41] font-black">{port}</div>
                    <div className="font-mono text-[11px] text-[#555] mt-1">{port === 80 ? 'HTTP' : port === 443 ? 'HTTPS' : 'HTTP-Alt'}</div>
                    <div className="font-mono text-[10px] text-[#333] mt-2">{results.ip}</div>
                  </div>
                ))}
              </div>
              <p className="font-mono text-[11px] text-[#444] mt-5 text-center">
                Upgrade to Pro for full 65,535 port scan + service version detection →
              </p>
            </div>
          )}

          {activeTab === 'subdomains' && (
            <div className="glass border border-[#1A1A1A] p-5">
              <div className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-4">Discovered Subdomains</div>
              <div className="space-y-2">
                {results.subdomains.map(s => (
                  <div key={s} className="flex items-center gap-4 p-3 border border-[#1A1A1A] hover:border-[#00FF41]/20 transition-colors">
                    <span className="text-[#00FF41]">▸</span>
                    <span className="font-mono text-sm text-[#E8E8E8] flex-1">{s}</span>
                    <span className="font-mono text-[10px] text-[#444]">A record</span>
                    <span className="font-mono text-[10px] text-[#00FF41] cursor-pointer hover:underline">Scan →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="glass border border-[#1A1A1A] p-5">
              <div className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-4">Technology Stack Detection</div>
              <div className="space-y-3">
                {results.technologies.map(t => (
                  <div key={t.name} className="flex items-center gap-5 p-4 border border-[#1A1A1A]">
                    <div className="flex-1">
                      <div className="font-mono font-bold text-[#E8E8E8] text-sm">{t.name}</div>
                      {t.version && <div className="font-mono text-[11px] text-[#555]">Version: {t.version}</div>}
                    </div>
                    <span className="font-mono text-[10px] text-[#555] bg-[#111] px-3 py-1">{t.category}</span>
                    <span className="font-mono text-[10px] text-[#00FF41]">DETECTED</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cves' && (
            <div className="space-y-4">
              {results.cves.map(cve => (
                <div key={cve.id} className="glass border border-[#1A1A1A] p-6">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="flex-1">
                      <div className="font-mono font-bold text-[#E8E8E8] text-sm mb-1">{cve.id}</div>
                      <div className="font-mono text-[11px] text-[#555]">{cve.title}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-black" style={{ color: severityColor(cve.severity) }}>{cve.severity}</div>
                      <div className="font-mono text-[11px] text-[#555]">CVSS {cve.cvss}</div>
                    </div>
                  </div>
                  <div className="font-mono text-[11px] text-[#444] bg-[#0D0D0D] p-3">Affected: {cve.product}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'emails' && (
            <div className="glass border border-[#1A1A1A] p-5">
              <div className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-4">Email Harvest</div>
              <div className="space-y-2">
                {results.emails.map(email => (
                  <div key={email} className="flex items-center gap-3 p-3 border border-[#1A1A1A]">
                    <span className="text-[#00FF41]">▸</span>
                    <span className="font-mono text-sm text-[#E8E8E8]">{email}</span>
                    <span className="ml-auto font-mono text-[10px] text-[#555]">SMTP MX check: ✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scanning animation */}
      {scanning && (
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-block animate-spin text-5xl text-[#00FF41] mb-6">⟳</div>
          <p className="font-mono text-[#555] text-sm">Enumerating subdomains...</p>
          <div className="max-w-md mx-auto mt-6 space-y-2 text-left">
            {['DNS resolution', 'Subdomain bruteforce', 'Port scan (top 100)', 'Technology fingerprinting', 'CVE database lookup'].map((step, i) => (
              <div key={i} className="font-mono text-[11px] text-[#333] flex items-center gap-2">
                <span className="text-[#00FF41]">◌</span> {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing */}
      {!scanning && (
        <div className="border-t border-[#1A1A1A] mt-20 px-6 py-10">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-center text-[10px] tracking-widest uppercase text-[#555] mb-8">SCAN PLANS</p>
            <div className="grid md:grid-cols-3 gap-5">
              {PLANS.map(plan => (
                <div key={plan.name}
                  className={`glass border p-6 text-center ${plan.highlight ? 'border-[#00FF41]/40' : 'border-[#1A1A1A]'}`}>
                  <div className="font-mono text-sm font-bold mb-1" style={{ color: plan.color }}>{plan.name}</div>
                  <div className="font-mono font-black text-3xl mb-1">{plan.price}<span className="text-sm font-normal text-[#555]">{plan.period}</span></div>
                  <div className="font-mono text-[11px] text-[#555] mb-4">{plan.scans} · {plan.domains}</div>
                  <div className="h-px bg-[#1A1A1A] mb-4" />
                  {plan.features.map(f => (
                    <div key={f} className="font-mono text-[11px] text-[#666] py-1 flex items-center gap-2">
                      <span style={{ color: plan.color }}>✓</span> {f}
                    </div>
                  ))}
                  <button className="w-full mt-6 font-mono text-[11px] py-2.5 tracking-wider border transition-all duration-200"
                    style={{ borderColor: plan.color, color: plan.color }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${plan.color}15`)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}