'use client';

import { useEffect, useState } from 'react';

const PRODUCTS = [
  {
    id: 'ctf',
    name: 'CTF Platform',
    short: 'Practice',
    icon: '🚩',
    tagline: 'Compete. Learn. Level up.',
    description: 'Hands-on CTF challenges across Web, Crypto, Network, and Forensics. Free to start, Pro for hints and private leaderboard.',
    cta: 'Start Solving',
    href: '/ctf',
    tier: 'FREE',
    tierColor: '#00FF41',
    stats: ['6 Live Challenges', '147 Members', 'Weekly events'],
  },
  {
    id: 'courses',
    name: 'Security Training',
    short: 'Learn',
    icon: '📚',
    tagline: 'Learn by breaking things.',
    description: 'Practical courses with real labs. Web pentesting, Python automation, Burp Suite mastery. Free and paid tiers.',
    cta: 'Browse Courses',
    href: '/courses',
    tier: 'FREE + PAID',
    tierColor: '#FFB700',
    stats: ['4 Courses', '1,107 Students', '4.8 avg rating'],
  },
  {
    id: 'recon',
    name: 'Vulnerability Recon',
    short: 'Recon',
    icon: '🔍',
    tagline: 'Know your attack surface.',
    description: 'Automated recon SaaS. Subdomain enumeration, port scanning, CVE lookup, tech fingerprinting, and PDF reports.',
    cta: 'Run First Scan',
    href: '/recon',
    tier: 'FREE TIER',
    tierColor: '#00FF41',
    stats: ['5 scans/day free', 'CVE database', 'PDF reports'],
  },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  useEffect(() => { setVisible(true); }, []);

  const bootMessages = [
    '> Initializing SecLab Nigeria...',
    '> Loading product suite...',
    '> CTF Platform: online',
    '> Training Platform: online',
    '> Recon Scanner: online',
    '> All systems nominal.',
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootMessages.length) {
        setTerminalLines(prev => [...prev, bootMessages[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 350);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-[#E8E8E8]">

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-2.5 group">
            <span className="text-[#00FF41] font-mono font-black text-xl leading-none group-hover:drop-shadow-[0_0_8px_rgba(0,255,65,0.6)] transition-all">⬡</span>
            <span className="font-mono font-bold text-sm tracking-[0.15em] uppercase">Sec<span className="text-[#00FF41]">Lab</span><span className="text-[#FFB700]">NG</span></span>
          </button>
          <div className="flex gap-6 text-xs font-mono tracking-wider">
            {[
              ['/ctf', 'CTF Platform'],
              ['/courses', 'Training'],
              ['/recon', 'Recon'],
            ].map(([href, label]) => (
              <a key={href} href={href}
                className="text-[#888] hover:text-[#00FF41] transition-colors duration-200 uppercase tracking-widest">
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center grid-bg mesh-gradient overflow-hidden">

        {/* Ambient glows */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#00FF41]/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#FFB700]/4 blur-[80px] pointer-events-none" />

        {/* Terminal card */}
        <div className="absolute top-[20%] right-[5%] w-72 glass border border-[#1A1A1A] p-4 float hidden lg:block">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-2.5 h-2.5 bg-[#FF4444] rounded-full" />
            <span className="w-2.5 h-2.5 bg-[#FFB700] rounded-full" />
            <span className="w-2.5 h-2.5 bg-[#00FF41] rounded-full" />
            <span className="ml-2 text-[#555] font-mono text-[10px] tracking-wider">seclab@root:~</span>
          </div>
          <div className="space-y-1 min-h-[100px]">
            {terminalLines.map((line, i) => (
              <p key={i} className="text-[#00FF41] font-mono text-xs">{line}</p>
            ))}
            {terminalLines.length < bootMessages.length && <span className="cursor-blink text-[#00FF41] font-mono text-xs" />}
          </div>
        </div>

        <div className={`relative z-10 text-center px-6 max-w-5xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF41]" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#888]">Nigeria&apos;s Cybersecurity Product Suite</span>
          </div>

          <h1 className="font-mono font-black text-5xl md:text-7xl lg:text-8xl leading-[1] mb-5 tracking-tight">
            <span className="text-white block">Break.</span>
            <span className="text-[#00FF41] neon-flicker block">Learn.</span>
            <br />
            <span className="text-white block">Build.</span>
            <span className="text-[#FFB700] glow-amber block">Ship.</span>
          </h1>

          <p className="text-[#888] text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Three products for the cybersecurity community. Practice on our CTF platform, learn with structured courses, and audit your own infrastructure with our recon scanner.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14">
            <a href="/ctf" className="btn-neon">Try CTF Platform →</a>
            <a href="/courses" className="btn-ghost">Browse Courses</a>
            <a href="/recon" className="btn-ghost">Run Recon Scan</a>
          </div>

          {/* Product cards row */}
          <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {PRODUCTS.map(p => (
              <a key={p.id} href={p.href}
                className="group glass border border-[#1A1A1A] p-5 text-left card-hover">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{p.icon}</span>
                  <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 border"
                    style={{ borderColor: `${p.tierColor}40`, color: p.tierColor, background: `${p.tierColor}08` }}>
                    {p.tier}
                  </span>
                </div>
                <div className="font-mono font-bold text-sm text-[#E8E8E8] mb-1 group-hover:text-[#00FF41] transition-colors">{p.name}</div>
                <div className="font-mono text-[10px] text-[#444] mb-3">{p.tagline}</div>
                {p.stats.map(s => (
                  <div key={s} className="font-mono text-[10px] text-[#555] flex items-center gap-1.5 mb-1">
                    <span style={{ color: p.tierColor }}>▸</span> {s}
                  </div>
                ))}
              </a>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] text-[#333] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#00FF41]/40 to-transparent" />
        </div>
      </section>

      {/* ── PRODUCTS DEEP DIVE ── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">// WHAT WE BUILD</span>
            <h2 className="font-mono font-black text-4xl md:text-5xl mt-3 mb-4">
              Three <span className="text-[#00FF41]">Products</span>.
              <br />One <span className="text-[#FFB700]">Ecosystem</span>.
            </h2>
            <p className="text-[#555] text-sm max-w-lg mx-auto">Each product stands alone. Together they form a complete learning and testing platform for web application security.</p>
          </div>

          {PRODUCTS.map((product, i) => (
            <div key={product.id} className={`grid lg:grid-cols-2 gap-8 items-center mb-20 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Info side */}
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{product.icon}</span>
                  <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 border"
                    style={{ borderColor: `${product.tierColor}40`, color: product.tierColor, background: `${product.tierColor}08` }}>
                    {product.tier}
                  </span>
                </div>
                <h3 className="font-mono font-black text-3xl mb-2">{product.name}</h3>
                <p className="font-mono text-[11px] text-[#00FF41] tracking-wider mb-4">{product.tagline}</p>
                <p className="text-[#666] text-sm leading-relaxed mb-6">{product.description}</p>
                <div className="space-y-2 mb-8">
                  {product.stats.map(s => (
                    <div key={s} className="flex items-center gap-2 font-mono text-[12px] text-[#555]">
                      <span style={{ color: product.tierColor }}>✓</span> {s}
                    </div>
                  ))}
                </div>
                <a href={product.href} className="font-mono text-sm py-2.5 px-6 border tracking-wider transition-all duration-200 inline-block"
                  style={{ borderColor: product.tierColor, color: product.tierColor }}
                  onMouseEnter={e => (e.currentTarget.style.background = `${product.tierColor}15`)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {product.cta} →
                </a>
              </div>

              {/* Visual placeholder */}
              <div className={`glass border border-[#1A1A1A] h-72 flex items-center justify-center relative overflow-hidden ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, ${product.tierColor}20 0%, transparent 60%)`,
                }} />
                <div className="text-center">
                  <div className="text-6xl mb-4">{product.icon}</div>
                  <div className="font-mono text-[11px] text-[#555]">{product.name} — Live Product</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#1A1A1A] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[#00FF41] font-mono font-black">⬡</span>
            <span className="font-mono text-sm font-bold tracking-[0.15em]">Sec<span className="text-[#00FF41]">Lab</span><span className="text-[#FFB700]">NG</span></span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-mono text-[11px] text-[#444]">
            <a href="/ctf" className="hover:text-[#00FF41] transition-colors">CTF Platform</a>
            <a href="/courses" className="hover:text-[#00FF41] transition-colors">Training</a>
            <a href="/recon" className="hover:text-[#00FF41] transition-colors">Vulnerability Recon</a>
            <a href="https://github.com/mamuaminu" target="_blank" rel="noopener noreferrer" className="hover:text-[#00FF41] transition-colors">GitHub</a>
            <a href="mailto:Mamuaminu31@gmail.com" className="hover:text-[#00FF41] transition-colors">Contact</a>
          </div>
          <div className="font-mono text-[10px] text-[#333]">
            © 2026 SecLab Nigeria · Built in Nigeria
          </div>
        </div>
      </footer>
    </div>
  );
}