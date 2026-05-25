'use client';

import { useState } from 'react';

const PRODUCTS = [
  {
    id: 'ctf',
    name: 'CTF Platform',
    tagline: 'Compete. Learn. Level up.',
    description: 'Hands-on CTF challenges across Web, Crypto, Network, and Forensics. Practice against real vulnerability patterns used in security competitions worldwide.',
    cta: 'Start Solving',
    href: '/ctf',
    color: '#0891b2',
    colorDim: 'rgba(8,145,178,0.08)',
    colorLight: '#e0f7fa',
    stats: ['6 Live Challenges', 'Weekly competitions', 'Community writeups'],
    mockLabel: 'SQL Injection Lab',
    mockLabel2: 'XSS Challenge',
    mockLabel3: 'Crypto Cipher',
  },
  {
    id: 'courses',
    name: 'Security Training',
    tagline: 'Learn by breaking things.',
    description: 'Free structured courses that take you from beginner to competent. Real labs, practical methodology, no filler. Built by a working pentester.',
    cta: 'Browse Courses',
    href: '/courses',
    color: '#d97706',
    colorDim: 'rgba(217,119,6,0.08)',
    colorLight: '#fef3c7',
    stats: ['7 Free Courses', 'Beginner to Advanced', 'Hands-on labs'],
    mockLabel: 'Web Penetration Testing',
    mockLabel2: 'Blue Team SOC Analyst',
    mockLabel3: 'Bug Bounty Hunter',
  },
  {
    id: 'recon',
    name: 'Vulnerability Recon',
    tagline: 'Know your attack surface.',
    description: 'Automated recon scanner. Subdomain enumeration, port scanning, CVE lookup, and technology fingerprinting — with actionable PDF reports.',
    cta: 'Run First Scan',
    href: '/recon',
    color: '#059669',
    colorDim: 'rgba(5,150,105,0.08)',
    colorLight: '#d1fae5',
    stats: ['5 free scans/day', 'CVE database', 'PDF reports'],
    mockLabel: 'Subdomain Enum',
    mockLabel2: 'Port Scanner',
    mockLabel3: 'CVE Lookup',
  },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0891b2' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L15 4.5V11.5L8 15L1 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M5.5 8L7 9.5L10.5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-sm tracking-tight" style={{ color: 'var(--text)' }}>
              Sec<span style={{ color: '#0891b2' }}>Lab</span><span style={{ color: '#d97706' }}>.ng</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {[
              ['/ctf', 'CTF'],
              ['/courses', 'Courses'],
              ['/recon', 'Recon'],
            ].map(([href, label]) => (
              <a key={href} href={href} className="nav-link" style={{ color: 'var(--text-2)' }}>
                {label}
              </a>
            ))}
            <a href="https://github.com/mamuaminu" target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs px-4 py-2 rounded-lg transition-all"
              style={{ background: 'var(--bg-3)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
              GitHub
            </a>
          </div>

          <button
            className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--bg-3)' }}
            onClick={() => setMobileOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4H16M2 9H16M2 14H16" stroke="var(--text-2)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'var(--bg)' }}
          onClick={(e) => e.target === e.currentTarget && setMobileOpen(false)}>
          <div className="flex items-center justify-between px-6 h-16" style={{ borderBottom: '1px solid var(--border)' }}>
            <a href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0891b2' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L15 4.5V11.5L8 15L1 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5"/>
                  <path d="M5.5 8L7 9.5L10.5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>
                Sec<span style={{ color: '#0891b2' }}>Lab</span><span style={{ color: '#d97706' }}>.ng</span>
              </span>
            </a>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-3)' }}
              onClick={() => setMobileOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3L13 13M13 3L3 13" stroke="var(--text-2)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
            {['/ctf', '/courses', '/recon'].map((href, i) => {
              const labels = ['CTF', 'Courses', 'Recon'];
              return (
                <a key={href} href={href} onClick={() => setMobileOpen(false)}
                  className="font-display font-bold text-2xl" style={{ color: 'var(--text-2)' }}>
                  {labels[i]}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="relative pt-20 pb-16 px-6 text-center" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto pt-16 pb-20">
          {/* eyebrow */}
          <p className="font-mono text-sm font-medium tracking-wide uppercase mb-6" style={{ color: '#0891b2' }}>
            Free Cybersecurity Training — Built for Africa
          </p>

          {/* headline */}
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl leading-[1.08] tracking-tight mb-6" style={{ color: 'var(--text)' }}>
            The practical path to
            <br />
            <span style={{ color: '#0891b2' }}>cybersecurity competency.</span>
          </h1>

          {/* subheadline */}
          <p className="text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--text-2)' }}>
            CTF challenges, free structured courses, and a recon scanner — all in one platform.
            No paid walls. No fluff. Built by a working pentester.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a href="/ctf" className="btn-primary">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L15 4.5V11.5L8 15L1 11.5V4.5L8 1Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Start Solving CTFs
            </a>
            <a href="/courses" className="btn-outline">Browse Free Courses</a>
          </div>
        </div>

        {/* Thin rule */}
        <div className="max-w-3xl mx-auto" style={{ borderTop: '1px solid var(--border)' }} />
      </section>

      {/* ── THREE PRODUCTS ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">// THE PLATFORM</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-2" style={{ color: 'var(--text)' }}>
              Three tools. One mission.
            </h2>
            <p className="text-base max-w-md mx-auto mt-3" style={{ color: 'var(--text-2)' }}>
              Each product covers a different aspect of security learning. Use them together or start with whichever fits your goal.
            </p>
          </div>

          <div className="space-y-16">
            {PRODUCTS.map((product, i) => (
              <div key={product.id}
                className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
                style={{ direction: i % 2 === 1 ? 'rtl' : 'ltr' }}>

                {/* Text side */}
                <div style={{ direction: 'ltr' }}>
                  <div className="inline-flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: product.colorLight }}>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                        {product.id === 'ctf' && <path d="M10 1L18 5.5V14.5L10 19L2 14.5V5.5L10 1Z" stroke={product.color} strokeWidth="1.5"/>}
                        {product.id === 'courses' && <path d="M3 14V4M8 14V8M13 14V4M1 14H17" stroke={product.color} strokeWidth="1.5" strokeLinecap="round"/>}
                        {product.id === 'recon' && <><circle cx="9" cy="9" r="7" stroke={product.color} strokeWidth="1.5"/><path d="M9 5V9L12 12" stroke={product.color} strokeWidth="1.5" strokeLinecap="round"/></>}
                      </svg>
                    </div>
                    <span className="font-mono text-xs font-medium uppercase tracking-wider" style={{ color: product.color }}>
                      {product.id === 'ctf' ? 'Free Access' : product.id === 'courses' ? 'Free Forever' : 'Free Tier'}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text)' }}>
                    {product.name}
                  </h3>
                  <p className="font-mono text-sm mb-4" style={{ color: product.color }}>{product.tagline}</p>
                  <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-2)' }}>{product.description}</p>

                  <div className="space-y-2 mb-8">
                    {product.stats.map(s => (
                      <div key={s} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-2)' }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7L5.5 10.5L12 4" stroke={product.color} strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        {s}
                      </div>
                    ))}
                  </div>

                  <a href={product.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-all"
                    style={{ color: product.color }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                    {product.cta}
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </a>
                </div>

                {/* Visual side */}
                <div style={{ direction: 'ltr' }}>
                  <div className="rounded-2xl overflow-hidden"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' }}>
                    <div className="p-6 space-y-2">
                      {[product.mockLabel, product.mockLabel2, product.mockLabel3].map((label, j) => (
                        <div key={j} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-2)' }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: product.colorLight }}>
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                              {product.id === 'ctf' && <path d="M8 1L15 4.5V11.5L8 15L1 11.5V4.5L8 1Z" stroke={product.color} strokeWidth="1.5"/>}
                              {product.id === 'courses' && <path d="M3 12V4M7 12V6M11 12V4" stroke={product.color} strokeWidth="1.5" strokeLinecap="round"/>}
                              {product.id === 'recon' && <><circle cx="8" cy="8" r="5" stroke={product.color} strokeWidth="1.5"/><path d="M8 5V8L10.5 10.5" stroke={product.color} strokeWidth="1.5" strokeLinecap="round"/></>}
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{label}</div>
                            <div className="text-xs" style={{ color: 'var(--text-3)' }}>
                              {product.id === 'ctf' ? ['Web · Easy', 'Web · Medium', 'Crypto · Hard'][j] :
                               product.id === 'courses' ? ['20 modules', '20 modules', '20 modules'][j] :
                               ['Top 100 ports', 'Full scan', 'CVE DB'][j]}
                            </div>
                          </div>
                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                            <path d="M5 3L9 7L5 11" stroke="var(--border-2)" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-12 px-6" style={{ background: 'var(--bg-3)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              ['6', 'Live Challenges'],
              ['7', 'Free Courses'],
              ['5', 'Scans per Day'],
              ['100%', 'Free Access'],
            ].map(([val, label]) => (
              <div key={label}>
                <div className="font-display font-extrabold text-3xl mb-1" style={{ color: 'var(--text)' }}>{val}</div>
                <div className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 py-14" style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0891b2' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L15 4.5V11.5L8 15L1 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5"/>
                  <path d="M5.5 8L7 9.5L10.5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>
                Sec<span style={{ color: '#0891b2' }}>Lab</span><span style={{ color: '#d97706' }}>.ng</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              {[['CTF Platform', '/ctf'], ['Free Courses', '/courses'], ['Recon Scanner', '/recon']].map(([label, href]) => (
                <a key={href} href={href} className="text-sm transition-colors" style={{ color: 'var(--text-2)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}>
                  {label}
                </a>
              ))}
              <a href="https://github.com/mamuaminu" target="_blank" rel="noopener noreferrer"
                className="text-sm transition-colors" style={{ color: 'var(--text-2)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}>
                GitHub
              </a>
            </div>
          </div>

          <div className="divider mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-mono text-xs" style={{ color: 'var(--text-3)' }}>
              © 2026 SecLab Nigeria. Built in Nigeria.
            </p>
            <p className="font-mono text-xs" style={{ color: 'var(--text-3)' }}>
              Free forever. No paid walls.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}