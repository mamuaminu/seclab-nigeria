'use client';

import { useEffect, useRef } from 'react';

const PRODUCTS = [
  {
    id: 'ctf',
    name: 'CTF Platform',
    icon: '⬡',
    iconColor: '#06b6d4',
    tagline: 'Compete. Learn. Level up.',
    description: 'Hands-on CTF challenges across Web, Crypto, Network, and Forensics. Practice against real vulnerability patterns used in security competitions worldwide.',
    cta: 'Start Solving',
    href: '/ctf',
    color: '#06b6d4',
    colorDim: 'rgba(6,182,212,0.1)',
    stats: ['6 Live Challenges', 'Weekly competitions', 'Community writeups'],
  },
  {
    id: 'courses',
    name: 'Security Training',
    icon: '⬡',
    iconColor: '#f59e0b',
    tagline: 'Learn by breaking things.',
    description: 'Free structured courses that take you from beginner to competent. Real labs, practical methodology, no filler. Built by a working pentester.',
    cta: 'Browse Courses',
    href: '/courses',
    color: '#f59e0b',
    colorDim: 'rgba(245,158,11,0.1)',
    stats: ['4 Free Courses', 'Beginner to Intermediate', 'Hands-on labs'],
  },
  {
    id: 'recon',
    name: 'Vulnerability Recon',
    icon: '⬡',
    iconColor: '#22c55e',
    tagline: 'Know your attack surface.',
    description: 'Automated recon scanner. Subdomain enumeration, port scanning, CVE lookup, and technology fingerprinting — with actionable PDF reports.',
    cta: 'Run First Scan',
    href: '/recon',
    color: '#22c55e',
    colorDim: 'rgba(34,197,94,0.1)',
    stats: ['5 free scans/day', 'CVE database', 'PDF reports'],
  },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start = 0;
    const duration = 1500;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start = Math.min(start + increment, target);
      el.textContent = Math.floor(start).toLocaleString() + suffix;
      if (start >= target) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [target, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#09090b' }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(9,9,11,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1e1e24' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="#06b6d4" strokeWidth="1.5" fill="rgba(6,182,212,0.1)"/>
                <path d="M9 14L12 17L19 10" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-sm tracking-wide" style={{ color: '#f4f4f5' }}>
              Sec<span style={{ color: '#06b6d4' }}>Lab</span><span style={{ color: '#f59e0b' }}>NG</span>
            </span>
          </a>
          <div className="flex items-center gap-8">
            {[
              ['/ctf', 'CTF'],
              ['/courses', 'Courses'],
              ['/recon', 'Recon'],
            ].map(([href, label]) => (
              <a key={href} href={href} className="nav-link" style={{ color: '#a1a1aa' }}>
                {label}
              </a>
            ))}
            <a href="https://github.com/mamuaminu" target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs px-4 py-2 rounded-md transition-all"
              style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.2)' }}>
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        {/* subtle grid bg */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />
        {/* top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.08) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
            style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full" style={{ background: '#06b6d4', opacity: 0.5 }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#06b6d4' }} />
            </span>
            <span className="font-mono text-xs tracking-wider uppercase" style={{ color: '#06b6d4' }}>
              Nigeria&apos;s Cybersecurity Platform
            </span>
          </div>

          {/* headline */}
          <h1 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6"
            style={{ color: '#f4f4f5' }}>
            <span>Break things.</span>
            <br />
            <span style={{ color: '#06b6d4' }}>Learn fast.</span>
            <br />
            <span>Ship confidently.</span>
          </h1>

          {/* sub */}
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: '#71717a' }}>
            Three products for the security community. Practice on our CTF platform,
            learn with free structured courses, and audit your infrastructure with our recon scanner.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/ctf" className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L15 4.5V11.5L8 15L1 11.5V4.5L8 1Z" stroke="currentColor" strokeWidth="1.5"/></svg>
              Explore CTF Platform
            </a>
            <a href="/courses" className="btn-outline">Browse Free Courses</a>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="border-y" style={{ borderColor: '#1e1e24' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              ['6', 'Live Challenges', '#06b6d4'],
              ['0', 'Courses (Free)', '#f59e0b'],
              ['5', 'Scans/day free', '#22c55e'],
              ['24/7', 'Platform uptime', '#a1a1aa'],
            ].map(([val, label, color]) => (
              <div key={label}>
                <div className="font-display font-extrabold text-4xl mb-1" style={{ color }}>{val}</div>
                <div className="font-mono text-xs uppercase tracking-widest" style={{ color: '#52525b' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE PRODUCTS ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">// WHAT WE BUILD</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl mt-3 mb-4" style={{ color: '#f4f4f5' }}>
              Three products.
              <br /><span style={{ color: '#06b6d4' }}>One ecosystem.</span>
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: '#71717a' }}>
              Each product stands alone. Together they form a complete learning and testing platform for web application security.
            </p>
          </div>

          <div className="space-y-20">
            {PRODUCTS.map((product, i) => (
              <div key={product.id}
                className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
                style={{ direction: i % 2 === 1 ? 'rtl' : 'ltr' }}>
                {/* Text side */}
                <div style={{ direction: 'ltr' }}>
                  <div className="inline-flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: product.colorDim, border: `1px solid ${product.color}30` }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 1L18 5.5V14.5L10 19L2 14.5V5.5L10 1Z" stroke={product.color} strokeWidth="1.5"/>
                        <path d="M7 10L9 12L13 8" stroke={product.color} strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span className="badge" style={{
                      background: product.colorDim,
                      border: `1px solid ${product.color}30`,
                      color: product.color,
                    }}>
                      {product.id === 'ctf' ? 'FREE' : product.id === 'courses' ? 'FREE COURSES' : 'FREE TIER'}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-3xl mb-2" style={{ color: '#f4f4f5' }}>
                    {product.name}
                  </h3>
                  <p className="font-mono text-sm mb-4" style={{ color: product.color }}>{product.tagline}</p>
                  <p className="text-base leading-relaxed mb-6" style={{ color: '#71717a' }}>{product.description}</p>

                  <div className="space-y-2 mb-8">
                    {product.stats.map(s => (
                      <div key={s} className="flex items-center gap-3 font-mono text-sm" style={{ color: '#52525b' }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7L5.5 10.5L12 4" stroke={product.color} strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        {s}
                      </div>
                    ))}
                  </div>

                  <a href={product.href} className="btn-primary" style={{ background: product.color }}>
                    {product.cta}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </a>
                </div>

                {/* Visual side */}
                <div style={{ direction: 'ltr' }}>
                  <div className="rounded-2xl overflow-hidden p-8"
                    style={{ background: '#111116', border: `1px solid #1e1e24`, minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Product mock cards */}
                    <div className="w-full max-w-sm">
                      <div className="space-y-3">
                        {[0, 1, 2].map(j => (
                          <div key={j} className="flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer"
                            style={{ background: '#16161c', border: '1px solid #1e1e24' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = `${product.color}30`)}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e1e24')}>
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ background: product.colorDim }}>
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                {product.id === 'ctf' && <path d="M9 1L17 5V13L9 17L1 13V5L9 1Z" stroke={product.color} strokeWidth="1.5"/>}
                                {product.id === 'courses' && <path d="M3 14V4M8 14V8M13 14V4M1 14H17" stroke={product.color} strokeWidth="1.5" strokeLinecap="round"/>}
                                {product.id === 'recon' && <><circle cx="9" cy="9" r="7" stroke={product.color} strokeWidth="1.5"/><path d="M9 5V9L12 12" stroke={product.color} strokeWidth="1.5" strokeLinecap="round"/></>}
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="font-mono text-xs text-white">{product.id === 'ctf' ? ['SQL Injection Lab', 'XSS Challenge', 'Crypto Cipher'][j] : product.id === 'courses' ? ['Web Pentesting', 'Python Automation', 'CTF Fundamentals'][j] : ['Subdomain Enum', 'Port Scanner', 'CVE Lookup'][j]}</div>
                              <div className="font-mono text-[10px]" style={{ color: product.color }}>{product.id === 'ctf' ? ['Web · Easy', 'Web · Medium', 'Crypto · Hard'][j] : product.id === 'courses' ? ['Free · 12hrs', 'Free · 8hrs', 'Free · 6hrs'][j] : ['Top 100 ports', 'All ports', 'CVE DB'][j]}</div>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M5 3L9 7L5 11" stroke="#3f3f46" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-20 px-6" style={{ background: '#111116', borderTop: '1px solid #1e1e24', borderBottom: '1px solid #1e1e24' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label">// PLATFORM OVERVIEW</span>
            <h2 className="font-display font-bold text-3xl mt-3" style={{ color: '#f4f4f5' }}>
              Everything you need to get started
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#06b6d4" strokeWidth="1.5"/>
                    <path d="M8 12L11 15L16 9" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'CTF Platform',
                desc: '6 live challenges across Web, Crypto, Network. Free to start. Competitive leaderboard.',
                href: '/ctf',
                color: '#06b6d4',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4 19V5M10 19V9M16 19V13M2 19H22" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Free Courses',
                desc: '4 structured courses. No paid walls blocking fundamentals. Beginner to intermediate.',
                href: '/courses',
                color: '#f59e0b',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="#22c55e" strokeWidth="1.5"/>
                    <path d="M16 16L20 20" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M8 11H8.01M11 8V8.01M11 14V14.01" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Recon Scanner',
                desc: '5 free scans per day. Subdomains, ports, CVE lookup, tech detection, PDF export.',
                href: '/recon',
                color: '#22c55e',
              },
            ].map(card => (
              <a key={card.title} href={card.href}
                className="card p-6 rounded-xl group">
                <div className="mb-4">{card.icon}</div>
                <h3 className="font-display font-semibold text-base mb-2" style={{ color: '#f4f4f5' }}>{card.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#71717a' }}>{card.desc}</p>
                <span className="font-mono text-xs transition-colors" style={{ color: card.color }}>
                  Explore →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="sm:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="#06b6d4" strokeWidth="1.5" fill="rgba(6,182,212,0.1)"/>
                  <path d="M9 14L12 17L19 10" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-display font-bold text-sm" style={{ color: '#f4f4f5' }}>
                  Sec<span style={{ color: '#06b6d4' }}>Lab</span><span style={{ color: '#f59e0b' }}>NG</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#52525b' }}>
                Nigerian cybersecurity platform. Free tools, free education, built byMuhammad Aminu Musa.
              </p>
            </div>

            {/* Products */}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: '#3f3f46' }}>Products</p>
              <div className="space-y-3">
                {[['CTF Platform', '/ctf'], ['Free Courses', '/courses'], ['Recon Scanner', '/recon']].map(([label, href]) => (
                  <a key={label} href={href} className="block text-sm transition-colors" style={{ color: '#71717a' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f4f4f5')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: '#3f3f46' }}>Resources</p>
              <div className="space-y-3">
                {[['GitHub', 'https://github.com/mamuaminu'], ['Contact', 'mailto:Mamuaminu31@gmail.com']].map(([label, href]) => (
                  <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    className="block text-sm transition-colors" style={{ color: '#71717a' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f4f4f5')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Mission */}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: '#3f3f46' }}>Mission</p>
              <p className="text-sm leading-relaxed" style={{ color: '#52525b' }}>
                Making cybersecurity education accessible to every Nigerian and African developer who wants to learn.
              </p>
            </div>
          </div>

          <div className="divider mb-8" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs" style={{ color: '#3f3f46' }}>
              © 2026 SecLab Nigeria. Built in Nigeria.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/mamuaminu" target="_blank" rel="noopener noreferrer" className="font-mono text-xs transition-colors" style={{ color: '#3f3f46' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#06b6d4')}
                onMouseLeave={e => (e.currentTarget.style.color = '#3f3f46')}>
                GitHub
              </a>
              <a href="mailto:Mamuaminu31@gmail.com" className="font-mono text-xs transition-colors" style={{ color: '#3f3f46' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#06b6d4')}
                onMouseLeave={e => (e.currentTarget.style.color = '#3f3f46')}>
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}