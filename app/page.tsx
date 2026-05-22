'use client';

import { useEffect, useState } from 'react';
import { XSSSimulator } from '@/lib/tools/XSSSimulator';
import { CipherEncoder } from '@/lib/tools/CipherEncoder';
import { HashIdentifier } from '@/lib/tools/HashIdentifier';

const CTF_WRITEUPS = [
  {
    title: 'NepFest CTF 2024 — "Login Bypass" Writeup',
    difficulty: 'Easy',
    tags: ['SQLi', 'SQLMAP', 'Auth Bypass'],
    description: 'Exploited a misconfigured login endpoint using classic OR 1=1 injection, then escalated via exposed admin panel.',
    link: '#',
    date: 'Nov 2024',
  },
  {
    title: 'HackTheBox — "Meow" Walkthrough',
    difficulty: 'Beginner',
    tags: ['Nmap', 'Telnet', 'Network Enum'],
    description: 'Initial access via exposed Telnet service with default credentials. A clean introductory box for new hackers.',
    link: '#',
    date: 'Oct 2024',
  },
  {
    title: 'PortSwigger Lab: DOM XSS via Web Message',
    difficulty: 'Medium',
    tags: ['XSS', 'JavaScript', 'DOM'],
    description: 'Injected payload through postMessage() to trigger DOM-based XSS in a poorly isolated iframe.',
    link: '#',
    date: 'Sep 2024',
  },
  {
    title: 'CTFlearn — "BaseApp" Crypto Challenge',
    difficulty: 'Medium',
    tags: ['Crypto', 'Python', 'AES-CTR'],
    description: 'Recovered a AES-CTR keystream by XORing known plaintext against ciphertext. Wrote a Python solver.',
    link: '#',
    date: 'Aug 2024',
  },
];

const PROJECTS = [
  {
    name: 'malware_tool',
    description: 'Static malware analysis CLI with VT lookup, PE parsing, YARA scanning, and suspicious term detection.',
    tech: ['Python', 'YARA', 'VirusTotal API', 'Flask'],
    link: 'https://github.com/mamuaminu/malware_tool',
    stars: '47',
    language: 'Python',
    icon: '🛡',
  },
  {
    name: 'Hawkeye Intelligence',
    description: 'Real-time OSINT platform for tracking incidents, fleet movements, and market data across West Africa.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    link: 'https://github.com/mamuaminu/Hawkeye-Intelligence',
    stars: '23',
    language: 'JavaScript',
    icon: '👁',
  },
  {
    name: 'Hayaku Express',
    description: 'WhatsApp delivery bot with WebSocket rider tracking, Paystack payments, and automated order flows.',
    tech: ['Node.js', 'Twilio', 'WebSocket', 'PM2'],
    link: 'https://github.com/mamuaminu/hayaku-express',
    stars: '12',
    language: 'JavaScript',
    icon: '⚡',
  },
  {
    name: 'PostForge AI',
    description: 'Multi-platform social media automation with JWT auth, platform adapters (FB, X, IG, LinkedIn), and GPT-4o.',
    tech: ['FastAPI', 'Celery', 'Redis', 'Docker'],
    link: 'https://github.com/mamuaminu/postforge',
    stars: '8',
    language: 'Python',
    icon: '✦',
  },
];

const STATS = [
  { value: '4', label: 'Live Tools' },
  { value: '∞', label: 'Free Uses' },
  { value: '0B', label: 'Data Sent' },
  { value: '24/7', label: 'Availability' },
];

const NAV_LINKS = [
  { label: 'Demos', id: 'demos' },
  { label: 'Writeups', id: 'writeups' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact', id: 'contact' },
];

export default function Home() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const bootMessages = [
      '> Initializing SecLab Nigeria v1.0...',
      '> Loading threat intelligence modules...',
      '> Connecting to CTF infrastructure...',
      '> All systems nominal.',
      '> Welcome to SecLab Nigeria.',
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootMessages.length) {
        setTerminalLines(prev => [...prev, bootMessages[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 450);
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
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-2.5 group">
            <span className="text-[#00FF41] font-mono font-black text-xl leading-none group-hover:drop-shadow-[0_0_8px_rgba(0,255,65,0.6)] transition-all">⬡</span>
            <span className="font-mono font-bold text-sm tracking-[0.15em] uppercase">Sec<span className="text-[#00FF41]">Lab</span><span className="text-[#FFB700]">NG</span></span>
          </button>
          <div className="flex gap-8 text-xs font-mono tracking-wider">
            {NAV_LINKS.map(({ label, id }) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="text-[#888] hover:text-[#00FF41] transition-colors duration-200 uppercase tracking-widest">
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center grid-bg mesh-gradient overflow-hidden">
        {/* Ambient corner glows */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#00FF41]/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#FFB700]/4 blur-[80px] pointer-events-none" />

        {/* Floating terminal card */}
        <div className="absolute top-[18%] right-[6%] w-80 glass border border-[#1A1A1A] rounded-none p-4 float hidden lg:block">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-2.5 h-2.5 bg-[#FF4444] rounded-full" />
            <span className="w-2.5 h-2.5 bg-[#FFB700] rounded-full" />
            <span className="w-2.5 h-2.5 bg-[#00FF41] rounded-full" />
            <span className="ml-2 text-[#555] font-mono text-[10px] tracking-wider">seclab@root:~</span>
          </div>
          <div className="space-y-1.5 min-h-[100px]">
            {terminalLines.map((line, i) => (
              <p key={i} className="text-[#00FF41] font-mono text-xs leading-relaxed">{line}</p>
            ))}
            {terminalLines.length < 5 && <span className="cursor-blink text-[#00FF41] font-mono text-xs" />}
          </div>
        </div>

        {/* Rotating decoration */}
        <div className="absolute left-[8%] top-1/3 w-24 h-24 border border-[#00FF41]/10 rounded-full spin-slow hidden lg:block" />
        <div className="absolute right-[15%] bottom-[25%] w-16 h-16 border border-[#FFB700]/10 spin-slow hidden lg:block" />

        {/* Main content */}
        <div className={`relative z-10 text-center px-6 max-w-4xl transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF41]" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#888]">Nigeria&apos;s Premier Cybersecurity Lab</span>
          </div>

          {/* Headline */}
          <h1 className="font-mono font-black text-5xl md:text-7xl lg:text-8xl leading-[1] mb-6 tracking-tight">
            <span className="text-white block">Break.</span>
            <span className="text-[#00FF41] neon-flicker block">Protect.</span>
            <br />
            <span className="text-white block">Build.</span>
            <span className="text-[#FFB700] glow-amber block">Repeat.</span>
          </h1>

          {/* Sub */}
          <p className="text-[#888] text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Interactive security demos, CTF writeups, and real tools — built and maintained by a Nigerian cybersecurity professional.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => scrollTo('demos')} className="btn-neon">
              Try Live Demos →
            </button>
            <button onClick={() => scrollTo('projects')} className="btn-ghost">
              View Projects
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mt-16 max-w-2xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="stat-block">
                <div className="font-mono font-black text-xl text-[#00FF41]">{s.value}</div>
                <div className="font-mono text-[10px] text-[#555] mt-1 tracking-wider uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] text-[#333] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#00FF41]/40 to-transparent" />
        </div>
      </section>

      {/* ── LIVE DEMOS ── */}
      <section id="demos" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="section-label">// LIVE TOOLS</span>
            <h2 className="font-mono font-black text-4xl md:text-5xl mt-3 mb-4">
              Interactive <span className="text-[#00FF41]">Demos</span>
            </h2>
            <p className="text-[#555] text-sm max-w-md mx-auto">Hands-on security tools running entirely in your browser. No data leaves your machine.</p>
          </div>

          {/* Tool cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <XSSSimulator />
            <CipherEncoder />
            <HashIdentifier />
          </div>

          {/* Trust row */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-[#555] font-mono text-xs">
            {['100% Client-side', 'Zero data transmission', 'Unlimited uses', 'Always online'].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="text-[#00FF41]">✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTF WRITEUPS ── */}
      <section id="writeups" className="py-28 px-6 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">// CTF JOURNAL</span>
            <h2 className="font-mono font-black text-4xl md:text-5xl mt-3 mb-4">
              CTF <span className="text-[#00FF41]">Writeups</span>
            </h2>
            <p className="text-[#555] text-sm max-w-md mx-auto">Detailed walkthroughs of challenges solved. Think out loud, learn by doing.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {CTF_WRITEUPS.map((w, i) => (
              <a key={i} href={w.link}
                className="group glass border border-[#1A1A1A] p-7 card-hover block relative overflow-hidden">
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#00FF41]/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-[10px] px-2 py-0.5 tracking-wider uppercase border ${
                      w.difficulty === 'Easy' ? 'border-[#00FF41]/30 text-[#00FF41]/70 bg-[#00FF41]/5' :
                      w.difficulty === 'Medium' ? 'border-[#FFB700]/30 text-[#FFB700]/70 bg-[#FFB700]/5' :
                      'border-[#FF4444]/30 text-[#FF4444]/70 bg-[#FF4444]/5'
                    }`}>{w.difficulty}</span>
                    <span className="font-mono text-[10px] text-[#444] tracking-wider">{w.date}</span>
                  </div>
                  <span className="text-[#00FF41] text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200">↗</span>
                </div>

                <h3 className="font-mono font-bold text-[#E8E8E8] text-sm mb-3 leading-snug group-hover:text-[#00FF41] transition-colors duration-200">{w.title}</h3>
                <p className="text-[#555] text-xs leading-relaxed mb-5">{w.description}</p>

                <div className="flex flex-wrap gap-2">
                  {w.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECT SHOWCASE ── */}
      <section id="projects" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">// WHAT I BUILD</span>
            <h2 className="font-mono font-black text-4xl md:text-5xl mt-3 mb-4">
              Project <span className="text-[#00FF41]">Showcase</span>
            </h2>
            <p className="text-[#555] text-sm max-w-md mx-auto">Security tools, automation platforms, and full-stack apps. Everything open source.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {PROJECTS.map((p, i) => (
              <a key={i} href={p.link} target="_blank" rel="noopener noreferrer"
                className="group glass border border-[#1A1A1A] p-7 card-hover block relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#00FF41]/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-start gap-4 mb-4">
                  <span className="text-2xl mt-0.5">{p.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-mono font-bold text-[#E8E8E8] text-sm group-hover:text-[#00FF41] transition-colors duration-200">{p.name}</h3>
                      <span className="font-mono text-[10px] text-[#555] flex items-center gap-1">
                        <span className="text-[#FFB700]">★</span> {p.stars}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#444] tracking-wider uppercase">{p.language}</span>
                  </div>
                </div>

                <p className="text-[#666] text-xs leading-relaxed mb-5">{p.description}</p>

                <div className="flex flex-wrap gap-2">
                  {p.tech.map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-28 px-6 bg-[#050505]">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label">// CONNECT</span>
          <h2 className="font-mono font-black text-4xl md:text-5xl mt-3 mb-4">
            Let&apos;s <span className="text-[#00FF41]">Talk</span>
          </h2>
          <p className="text-[#555] text-sm mb-14">Open to security consulting, freelance dev work, and interesting collaborations.</p>

          <div className="grid sm:grid-cols-3 gap-4 mb-16">
            {[
              {
                label: 'GitHub',
                value: 'mamuaminu',
                sub: 'View all projects',
                href: 'https://github.com/mamuaminu',
                symbol: '⌨',
              },
              {
                label: 'LinkedIn',
                value: 'Muhammad Aminu Musa',
                sub: 'Professional profile',
                href: '#',
                symbol: '💼',
              },
              {
                label: 'Email',
                value: 'Mamuaminu31@gmail.com',
                sub: 'Reach out directly',
                href: 'mailto:Mamuaminu31@gmail.com',
                symbol: '✉',
              },
            ].map(({ label, value, sub, href, symbol }) => (
              <a key={label} href={href}
                className="group glass border border-[#1A1A1A] p-6 card-hover block text-center">
                <span className="text-2xl mb-3 block">{symbol}</span>
                <div className="font-mono text-[10px] text-[#555] tracking-widest uppercase mb-1">{label}</div>
                <div className="font-mono text-xs text-[#888] group-hover:text-[#00FF41] transition-colors duration-200 break-all">{value}</div>
                <div className="font-mono text-[10px] text-[#333] mt-1">{sub}</div>
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-[#1A1A1A] pt-8">
            <p className="font-mono text-[10px] text-[#333] tracking-widest uppercase">
              SecLab Nigeria · Muhammad Aminu Musa · ISC2 CC · CISCO Pentest
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}