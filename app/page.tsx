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
    color: '#00c9a7',
    stats: ['6 Live Challenges', 'Weekly competitions', 'Community writeups'],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 12L10.5 14.5L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'courses',
    name: 'Security Training',
    tagline: 'Learn by breaking things.',
    description: 'Free structured courses that take you from beginner to competent. Real labs, practical methodology, no filler. Built by a working pentester.',
    cta: 'Browse Courses',
    href: '/courses',
    color: '#f0a500',
    stats: ['7 Free Courses', 'Beginner to Advanced', 'Hands-on labs'],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 19V5M10 19V11M16 19V7M2 19H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'recon',
    name: 'Vulnerability Recon',
    tagline: 'Know your attack surface.',
    description: 'Automated recon scanner. Subdomain enumeration, port scanning, CVE lookup, and technology fingerprinting — with actionable PDF reports.',
    cta: 'Run First Scan',
    href: '/recon',
    color: '#10b981',
    stats: ['5 free scans/day', 'CVE database', 'PDF reports'],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M11 7V11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen mesh-bg" style={{ background: 'var(--bg)' }}>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 glass">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00c9a7 0%, #00e8c6 100%)', boxShadow: '0 0 20px rgba(0,201,167,0.3)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke="black" strokeWidth="1.5"/>
                <path d="M8 12L10.5 14.5L16 9" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-sm tracking-tight" style={{ color: 'var(--text)' }}>
              Sec<span style={{ color: '#00c9a7' }}>Lab</span><span style={{ color: '#f0a500' }}>.ng</span>
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
              className="font-mono text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              style={{ background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border-2)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
            </a>
          </div>

          <button className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: 'var(--surface-2)' }}
            onClick={() => setMobileOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4H16M2 9H16M2 14H16" stroke="var(--text-2)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(11,11,16,0.97)', backdropFilter: 'blur(20px)' }}
          onClick={(e) => e.target === e.currentTarget && setMobileOpen(false)}>
          <div className="flex items-center justify-between px-6 h-16" style={{ borderBottom: '1px solid var(--border)' }}>
            <a href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #00c9a7 0%, #00e8c6 100%)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke="black" strokeWidth="1.5"/>
                  <path d="M8 12L10.5 14.5L16 9" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>
                Sec<span style={{ color: '#00c9a7' }}>Lab</span><span style={{ color: '#f0a500' }}>.ng</span>
              </span>
            </a>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface-2)' }}
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
                  className="font-display font-bold text-3xl" style={{ color: 'var(--text-2)' }}>
                  {labels[i]}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="relative pt-20 pb-24 px-6 text-center overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,201,167,0.07) 0%, transparent 70%)' }} />

        <div className="relative max-w-3xl mx-auto pt-16 pb-20">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00c9a7', boxShadow: '0 0 8px #00c9a7' }} />
            <span className="font-mono text-xs" style={{ color: 'var(--text-2)' }}>Free forever · No credit card</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] tracking-tight mb-6" style={{ color: 'var(--text)' }}>
            The practical path to
            <br />
            <span className="gradient-text">cybersecurity competency.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--text-2)' }}>
            CTF challenges, free structured courses, and a recon scanner — all in one platform.
            No paid walls. No fluff.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a href="/ctf" className="btn-primary text-sm px-7 py-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 12L10.5 14.5L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Start Solving CTFs
            </a>
            <a href="/courses" className="btn-outline text-sm px-7 py-3">Browse Free Courses</a>
          </div>
        </div>

        {/* Thin gradient rule */}
        <div className="max-w-3xl mx-auto" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-2), transparent)' }} />
      </section>

      {/* ── THREE PRODUCTS ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <span className="section-label">// THE PLATFORM</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-2 mb-4" style={{ color: 'var(--text)' }}>
              Three tools. One mission.
            </h2>
            <p className="text-base max-w-md mx-auto" style={{ color: 'var(--text-2)' }}>
              Each product covers a different aspect of security learning. Use them together or start with whichever fits your goal.
            </p>
          </div>

          <div className="space-y-24">
            {PRODUCTS.map((product, i) => (
              <div key={product.id}
                className={`grid lg:grid-cols-2 gap-14 items-center ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
                style={{ direction: i % 2 === 1 ? 'rtl' : 'ltr' }}>

                {/* Text side */}
                <div style={{ direction: 'ltr' }}>
                  <div className="inline-flex items-center gap-2.5 mb-6">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: `${product.color}18`, border: `1px solid ${product.color}30` }}>
                      <span style={{ color: product.color }}>{product.icon}</span>
                    </div>
                    <span className="font-mono text-xs font-medium uppercase tracking-wider" style={{ color: product.color }}>
                      {product.id === 'ctf' ? 'Free Access' : product.id === 'courses' ? 'Free Forever' : 'Free Tier'}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-3xl mb-1" style={{ color: 'var(--text)' }}>
                    {product.name}
                  </h3>
                  <p className="font-mono text-sm mb-5" style={{ color: product.color }}>{product.tagline}</p>
                  <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-2)' }}>{product.description}</p>

                  <div className="space-y-3 mb-8">
                    {product.stats.map(s => (
                      <div key={s} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-2)' }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="5.5" stroke={product.color} strokeWidth="1.2"/>
                          <path d="M4.5 7L6.5 9L9.5 5" stroke={product.color} strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                        {s}
                      </div>
                    ))}
                  </div>

                  <a href={product.href}
                    className="inline-flex items-center gap-2.5 text-sm font-semibold transition-all group"
                    style={{ color: product.color }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                    {product.cta}
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-1">
                      <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </a>
                </div>

                {/* Visual side — product mockup card */}
                <div style={{ direction: 'ltr' }}>
                  <div className="rounded-2xl overflow-hidden"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border-2)', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>

                    {/* Mockup header bar */}
                    <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="w-3 h-3 rounded-full" style={{ background: '#f05252' }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: '#f0a500' }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: '#00c9a7' }} />
                      <div className="flex-1 mx-4 h-5 rounded-md mx-auto" style={{ background: 'var(--surface-3)' }} />
                    </div>

                    {/* Product-specific visual content */}
                    <div className="p-6 space-y-3">
                      {[0, 1, 2].map(j => (
                        <div key={j} className="flex items-center gap-3 p-3 rounded-xl"
                          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                          <div className="w-8 h-8 rounded-lg flex-shrink-0"
                            style={{ background: `${product.color}15`, border: `1px solid ${product.color}25` }}>
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full" style={{ background: product.color }} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="h-2 rounded-md mb-2" style={{ background: 'var(--surface-3)', width: `${60 + j * 15}%` }} />
                            <div className="h-1.5 rounded-md" style={{ background: 'var(--surface-3)', width: `${40 + j * 20}%` }} />
                          </div>
                          <span className="font-mono text-[10px] px-2 py-1 rounded-md"
                            style={{ background: `${product.color}12`, color: product.color }}>
                            {['Active', 'Live', 'New'][j]}
                          </span>
                        </div>
                      ))}

                      {/* Bottom visual element */}
                      <div className="rounded-xl p-4 mt-2"
                        style={{ background: `linear-gradient(135deg, ${product.color}08 0%, transparent 60%)`, border: `1px solid ${product.color}18` }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: `${product.color}15` }}>
                            <span style={{ color: product.color, fontSize: '18px' }}>
                              {['🛡️', '📚', '🔍'][i]}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="h-2.5 rounded-md mb-2" style={{ background: 'var(--surface-3)', width: '70%' }} />
                            <div className="h-2 rounded-md" style={{ background: 'var(--surface-3)', width: '45%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-16 px-6" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              ['6', 'Live Challenges'],
              ['7', 'Free Courses'],
              ['5', 'Scans per Day'],
              ['100%', 'Free Access'],
            ].map(([val, label]) => (
              <div key={label}>
                <div className="font-display font-extrabold text-3xl mb-1 gradient-text">{val}</div>
                <div className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 py-14" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #00c9a7 0%, #00e8c6 100%)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke="black" strokeWidth="1.5"/>
                  <path d="M8 12L10.5 14.5L16 9" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>
                Sec<span style={{ color: '#00c9a7' }}>Lab</span><span style={{ color: '#f0a500' }}>.ng</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
              {[['CTF Platform', '/ctf'], ['Free Courses', '/courses'], ['Recon Scanner', '/recon']].map(([label, href]) => (
                <a key={href} href={href} className="text-sm transition-colors" style={{ color: 'var(--text-2)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}>
                  {label}
                </a>
              ))}
              <a href="https://github.com/mamuaminu" target="_blank" rel="noopener noreferrer"
                className="text-sm transition-colors flex items-center gap-1.5" style={{ color: 'var(--text-2)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>

          <div className="divider mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-mono text-xs" style={{ color: 'var(--text-3)' }}>
              © 2026 SecLab Nigeria. Built with purpose.
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