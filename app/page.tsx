'use client';

import { useEffect, useState, useRef } from 'react';
import { XSSSimulator } from '@/lib/tools/XSSSimulator';
import { SQLInjectionSimulator } from '@/lib/tools/SQLInjectionSimulator';
import { CipherEncoder } from '@/lib/tools/CipherEncoder';
import { HashIdentifier } from '@/lib/tools/HashIdentifier';
import { PasswordStrengthMeter } from '@/lib/tools/PasswordStrengthMeter';
import { EncodingDecoder } from '@/lib/tools/EncodingDecoder';

const TOOLS = [
  { component: XSSSimulator },
  { component: SQLInjectionSimulator },
  { component: CipherEncoder },
  { component: HashIdentifier },
  { component: PasswordStrengthMeter },
];

const CTF_WRITEUPS = [
  {
    title: 'HTB — "Meow" Walkthrough',
    difficulty: 'Beginner',
    tags: ['Telnet', 'Network Enum', 'Nmap'],
    description: 'Initial access via exposed Telnet service with default credentials. A clean introductory box covering basic enumeration with Nmap and telnet reconnaissance.',
    link: 'https://www.hackthebox.com/home/writeups/writeup/3861',
    date: 'Oct 2024',
  },
  {
    title: 'PortSwigger Lab: DOM XSS via Web Message',
    difficulty: 'Medium',
    tags: ['XSS', 'JavaScript', 'DOM'],
    description: 'Injected payload through postMessage() to trigger DOM-based XSS in a poorly isolated iframe. Covers message origin validation and DOM sink exploitation.',
    link: 'https://portswigger.net/web-security/dom-based-cross-site-scripting/lab-dom-xss-via-web-message',
    date: 'Sep 2024',
  },
  {
    title: 'CTFlearn — "BaseApp" Crypto Challenge',
    difficulty: 'Medium',
    tags: ['Crypto', 'Python', 'AES-CTR'],
    description: 'Recovered a AES-CTR keystream by XORing known plaintext against ciphertext. Wrote a Python solver to automate the process across multiple blocks.',
    link: 'https://ctflearn.com/challenge/396',
    date: 'Aug 2024',
  },
  {
    title: 'NepFest CTF 2024 — "Login Bypass"',
    difficulty: 'Easy',
    tags: ['SQLi', 'SQLMAP', 'Auth Bypass'],
    description: 'Exploited a misconfigured login endpoint using classic OR 1=1 injection, then escalated via exposed admin panel. Full SQLMAP enumeration walkthrough.',
    link: 'https://github.com/mamuaminu/ctf-writeups/blob/main/nepfest-2024-login-bypass.md',
    date: 'Nov 2024',
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
    name: 'SecLab Nigeria',
    description: 'This site — interactive cybersecurity demos, CTF writeups, and open-source tools for the community.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'GitHub Pages'],
    link: 'https://github.com/mamuaminu/seclab-nigeria',
    stars: '4',
    language: 'TypeScript',
    icon: '🎩',
  },
];

const SKILLS = [
  { category: 'Offensive Security', items: ['Web Pentesting', 'SQL Injection', 'XSS', 'CSRF', 'Auth Bypass'] },
  { category: 'Network', items: ['Nmap', 'Burp Suite', 'Wireshark', 'Nikto', 'Gobuster'] },
  { category: 'Automation', items: ['Python', 'Bash', 'n8n', 'Selenium', 'API Integration'] },
  { category: 'Infrastructure', items: ['Linux', 'Docker', 'PM2', 'Nginx', 'AWS'] },
  { category: 'Development', items: ['React/Next.js', 'Node.js', 'FastAPI', 'PostgreSQL', 'TypeScript'] },
  { category: 'Certifications', items: ['ISC2 CC', 'CISCO Pentest', 'Network+', 'Security+', 'CEH (pending)'] },
];

const CTF_PLATFORMS = [
  { name: 'TryHackMe', href: 'https://tryhackme.com', icon: '🏴', desc: 'Guided labs for beginners' },
  { name: 'HackTheBox', href: 'https://app.hackthebox.com', icon: '📦', desc: 'Advanced penetration testing' },
  { name: 'PortSwigger', href: 'https://portswigger.net/web-security', icon: '🔓', desc: 'Web application security' },
  { name: 'CTFlearn', href: 'https://ctflearn.com', icon: '🚩', desc: 'Community CTF challenges' },
  { name: 'Root Me', href: 'https://www.root-me.org', icon: '🕵️', desc: 'Security challenges archive' },
];

const STATS = [
  { value: '5', label: 'Live Tools' },
  { value: '∞', label: 'Free Uses' },
  { value: '0B', label: 'Data Sent' },
  { value: '24/7', label: 'Availability' },
];

const NAV_LINKS = [
  { label: 'Demos', id: 'demos' },
  { label: 'Writeups', id: 'writeups' },
  { label: 'Research', id: 'research' },
  { label: 'Timeline', id: 'timeline' },
  { label: 'Contact', id: 'contact' },
];

const SOCIAL_LINKS = [
  { name: 'GitHub', href: 'https://github.com/mamuaminu', icon: '⌨️', label: 'Source code' },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/muhammad-aminu-musa', icon: '💼', label: 'Connect' },
  { name: 'Twitter', href: 'https://twitter.com/mamuaminu', icon: '🐦', label: 'Follow' },
  { name: 'Telegram', href: 'https://t.me/mamuaminu', icon: '✈️', label: 'Message' },
];

const BLOG_ARTICLES = [
  {
    title: 'How I Found My First XSS — A Beginner\'s Journey',
    excerpt: 'Walkthrough of my first cross-site scripting find on a real target. The payload that worked, why it worked, and the chain that followed.',
    tags: ['XSS', 'Web Security', 'Beginner'],
    date: 'May 2026',
    readTime: '5 min read',
    link: 'https://medium.com/@mamuaminu',
  },
  {
    title: 'Top 5 Recon Tools for Web Pentesting',
    excerpt: 'OSINT and enumeration are where most pentests are won or lost. Here are the five tools I reach for on every engagement — and how I use them together.',
    tags: ['Recon', 'OSINT', 'Pentesting'],
    date: 'Apr 2026',
    readTime: '8 min read',
    link: 'https://medium.com/@mamuaminu',
  },
  {
    title: 'Why Every Developer Should Learn SQL Injection',
    excerpt: 'SQL injection is 20 years old and still in the OWASP Top 10. Here\'s why understanding it makes you a better developer, not just a better pentester.',
    tags: ['SQLi', 'AppSec', 'Developer'],
    date: 'Mar 2026',
    readTime: '6 min read',
    link: 'https://medium.com/@mamuaminu',
  },
];

const BUG_BOUNTY = [
  {
    platform: 'Hack The Box',
    href: 'https://app.hackthebox.com',
    icon: '📦',
    label: 'Bug Bounty Program',
    desc: 'Vulnerability disclosure program with active scopes',
  },
  {
    platform: 'Bugcrowd',
    href: 'https://bugcrowd.com',
    icon: '🐛',
    label: 'Researcher Profile',
    desc: 'Submitted findings through enterprise programs',
  },
  {
    platform: 'OpenCVE',
    href: 'https://www.opencve.io',
    icon: '📋',
    label: 'CVE Monitoring',
    desc: 'Tracking CVEs by vendor, product, and CVSS score',
  },
];

const CAREER_TIMELINE = [
  {
    year: '2024',
    title: 'ISC2 CC Certified',
    description: 'Earned the Certified in Cybersecurity certification from ISC2, validating foundational knowledge in security controls, risk management, and incident response.',
    icon: '🎓',
    tag: 'CERTIFICATION',
  },
  {
    year: '2024',
    title: 'CISCO Pentest Associate',
    description: 'Completed CISCO\'s penetration testing associate certification, covering reconnaissance, vulnerability exploitation, and reporting.',
    icon: '🛡️',
    tag: 'CERTIFICATION',
  },
  {
    year: '2024',
    title: 'Hayaku Express Launch',
    description: 'Built and shipped a full-stack WhatsApp delivery platform serving real customers in Nigeria. Handles orders, routing, and payments end-to-end.',
    icon: '⚡',
    tag: 'PROJECT',
  },
  {
    year: '2023',
    title: 'SecLab Nigeria Founded',
    description: 'Started the security research blog and tool repository to document findings and help others learn offensive security through real examples.',
    icon: '🎩',
    tag: 'MILESTONE',
  },
  {
    year: '2022',
    title: 'First CTF — CTFlearn',
    description: 'Competed in my first CTF on CTFlearn. Solved a crypto challenge involving AES-CTR keystream recovery. Hooked after that first flag.',
    icon: '🚩',
    tag: 'CTF',
  },
  {
    year: '2021',
    title: 'Started Learning Cybersecurity',
    description: 'Began the journey with TryHackMe and HackTheBox. Completed first 50 rooms on TryHackMe before touching any live targets.',
    icon: '🌱',
    tag: 'BEGINNING',
  },
];

// Animated typing hook
function useTypingEffect(lines: string[], speed = 400, delay = 600) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) {
      const t = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(t);
    }
    if (currentLine >= lines.length) return;

    const line = lines[currentLine];
    if (currentChar < line.length) {
      const t = setTimeout(() => {
        setDisplayedLines(prev => {
          const next = [...prev];
          next[currentLine] = line.slice(0, currentChar + 1);
          return next;
        });
        setCurrentChar(c => c + 1);
      }, speed / line.length);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setCurrentLine(l => l + 1);
        setCurrentChar(0);
      }, speed);
      return () => clearTimeout(t);
    }
  }, [started, currentLine, currentChar, lines, speed, delay]);

  return { displayedLines, done: currentLine >= lines.length };
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [heroTypingDone, setHeroTypingDone] = useState(false);

  const heroLines = [
    '> whoami',
    '> Muhammad Aminu Musa — security researcher',
    '> cat skills.txt',
    '> Web Pentesting · Exploitation · AppSec · Automation',
    '> cat status.txt',
    '> [OK] ISC2 CC · CISCO Pentest Associate · OSCP pending',
    '> [OK] Open to work · Freelance · Collabs',
  ];

  const { displayedLines: heroLinesDisplay } = useTypingEffect(heroLines, 35, 800);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setHeroTypingDone(true), heroLines.length * 400 + 800 + 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetch('https://api.github.com/users/mamuaminu', {
      headers: { Accept: 'application/vnd.github.v3+json' },
    }).catch(() => {});
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-[#E8E8E8]">

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <button onClick={() => scrollTo('hero')} aria-label="SecLab Nigeria home"
            className="flex items-center gap-2.5 group">
            <span className="text-[#00FF41] font-mono font-black text-xl leading-none group-hover:drop-shadow-[0_0_8px_rgba(0,255,65,0.6)] transition-all">⬡</span>
            <span className="font-mono font-bold text-sm tracking-[0.15em] uppercase">Sec<span className="text-[#00FF41]">Lab</span><span className="text-[#FFB700]">NG</span></span>
          </button>
          <div className="flex gap-6 text-xs font-mono tracking-wider">
            {NAV_LINKS.map(({ label, id }) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="text-[#888] hover:text-[#00FF41] transition-colors duration-200 uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-[#00FF41] focus-visible:outline-none rounded px-1 py-0.5">
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ scrollMarginTop: '80px' }}
        className="relative min-h-screen flex items-center justify-center grid-bg mesh-gradient overflow-hidden">

        {/* Ambient glows */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#00FF41]/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#FFB700]/4 blur-[80px] pointer-events-none" />

        {/* Left — animated terminal */}
        <div className="absolute left-[4%] top-1/2 -translate-y-1/2 w-72 glass border border-[#1A1A1A] p-4 float hidden lg:block">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-2.5 h-2.5 bg-[#FF4444] rounded-full" />
            <span className="w-2.5 h-2.5 bg-[#FFB700] rounded-full" />
            <span className="w-2.5 h-2.5 bg-[#00FF41] rounded-full" />
            <span className="ml-2 text-[#555] font-mono text-[10px] tracking-wider">seclab@root:~</span>
          </div>
          <div className="space-y-0.5 min-h-[140px]">
            {heroLinesDisplay.map((line, i) => (
              <p key={i} className={`font-mono text-xs leading-relaxed ${line.startsWith('> ') && !line.startsWith('> cat') ? 'text-[#E8E8E8]' : 'text-[#00FF41]'}`}>
                {line}
                {i === heroLinesDisplay.length - 1 && !heroTypingDone && (
                  <span className="cursor-blink text-[#00FF41]" />
                )}
              </p>
            ))}
          </div>
        </div>

        {/* Right — floating key icon */}
        <div className="absolute right-[6%] top-[30%] text-5xl float hidden lg:block" style={{ animationDelay: '2s' }}>🔑</div>

        {/* Rotating decorations */}
        <div className="absolute left-[8%] top-1/3 w-24 h-24 border border-[#00FF41]/10 rounded-full spin-slow hidden lg:block" />
        <div className="absolute right-[15%] bottom-[25%] w-16 h-16 border border-[#FFB700]/10 spin-slow hidden lg:block" />

        {/* Main content */}
        <div className={`relative z-10 text-center px-6 max-w-5xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* Status badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF41]" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#888]">Nigeria&apos;s Premier Cybersecurity Lab</span>
          </div>

          {/* Headline */}
          <h1 className="font-mono font-black text-5xl md:text-7xl lg:text-8xl leading-[1] mb-5 tracking-tight">
            <span className="text-white block">Break.</span>
            <span className="text-[#00FF41] neon-flicker block">Protect.</span>
            <br />
            <span className="text-white block">Build.</span>
            <span className="text-[#FFB700] glow-amber block">Repeat.</span>
          </h1>

          {/* Sub */}
          <p className="text-[#888] text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Muhammad Aminu Musa — ISC2 CC, CISCO Pentest certified. I break things to understand how to protect them.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <button onClick={() => scrollTo('demos')} className="btn-neon">
              Try Live Demos →
            </button>
            <button onClick={() => scrollTo('writeups')} className="btn-ghost">
              Read CTF Writeups
            </button>
            {/* Resume download */}
            <a href="/resume.pdf" download="Muhammad-Aminu-Musa-Resume.pdf"
              className="btn-ghost flex items-center gap-2">
              📄 Download Resume
            </a>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {STATS.map((s) => (
              <div key={s.label} className="stat-block px-5 py-3">
                <div className="font-mono font-black text-xl text-[#00FF41]">{s.value}</div>
                <div className="font-mono text-[10px] text-[#555] mt-1 tracking-wider uppercase">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Social links row */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {SOCIAL_LINKS.map(({ name, href, icon, label }) => (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 border border-[#1A1A1A] px-3 py-1.5 font-mono text-[10px] text-[#555] hover:border-[#00FF41]/40 hover:text-[#00FF41] transition-all duration-200"
                title={label}>
                <span>{icon}</span>
                <span>{name}</span>
              </a>
            ))}
          </div>

          {/* CTF platforms row */}
          <div className="flex flex-wrap justify-center gap-3">
            {CTF_PLATFORMS.map(({ name, href, icon, desc }) => (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 border border-[#1A1A1A] px-3 py-1.5 font-mono text-[10px] text-[#555] hover:border-[#00FF41]/40 hover:text-[#00FF41] transition-all duration-200 group"
                title={desc}>
                <span>{icon}</span>
                <span>{name}</span>
                <span className="text-[#333] group-hover:text-[#00FF41]/50">↗</span>
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

      {/* ── LIVE DEMOS ── */}
      <section id="demos" style={{ scrollMarginTop: '80px' }} className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">// LIVE TOOLS</span>
            <h2 className="font-mono font-black text-4xl md:text-5xl mt-3 mb-4">
              Interactive <span className="text-[#00FF41]">Demos</span>
            </h2>
            <p className="text-[#555] text-sm max-w-md mx-auto">Hands-on security tools running entirely in your browser. No data leaves your machine.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {TOOLS.map(({ component: Tool }) => (
              <Tool key={Tool.name} />
            ))}
            <div className="md:col-span-2">
              <EncodingDecoder />
            </div>
          </div>

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
      <section id="writeups" style={{ scrollMarginTop: '80px' }} className="py-28 px-6 bg-[#050505]">
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
              <div key={i} className="glass border border-[#1A1A1A] p-7 card-hover relative overflow-hidden">
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
                </div>

                <h3 className="font-mono font-bold text-[#E8E8E8] text-sm mb-3 leading-snug group-hover:text-[#00FF41] transition-colors duration-200">{w.title}</h3>
                <p className="text-[#555] text-xs leading-relaxed mb-5">{w.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {w.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>

                <a href={w.link} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[10px] text-[#555] hover:text-[#00FF41] transition-colors duration-200">
                  Read full writeup <span className="text-[#00FF41]">↗</span>
                </a>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="font-mono text-[10px] text-[#555] tracking-widest uppercase mb-4">Train on these platforms</p>
            <div className="flex flex-wrap justify-center gap-3">
              {CTF_PLATFORMS.map(({ name, href, icon }) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-[#1A1A1A] px-4 py-2 font-mono text-[11px] text-[#555] hover:border-[#00FF41]/40 hover:text-[#00FF41] transition-all duration-200">
                  <span>{icon}</span>
                  <span>{name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECT SHOWCASE ── */}
      <section id="projects" style={{ scrollMarginTop: '80px' }} className="py-28 px-6">
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

      {/* ── SKILLS & CERTIFICATIONS ── */}
      <section id="skills" style={{ scrollMarginTop: '80px' }} className="py-28 px-6 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">// TOOLKIT</span>
            <h2 className="font-mono font-black text-4xl md:text-5xl mt-3 mb-4">
              Skills & <span className="text-[#00FF41]">Certifications</span>
            </h2>
            <p className="text-[#555] text-sm max-w-md mx-auto">The stack I use daily — from recon to exploitation to building solid defenses.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SKILLS.map(({ category, items }) => (
              <div key={category} className="glass border border-[#1A1A1A] p-6">
                <div className="font-mono text-[10px] tracking-widest uppercase text-[#FFB700] mb-4">{category}</div>
                <div className="flex flex-wrap gap-2">
                  {items.map(item => (
                    <span key={item} className="tag">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="font-mono text-[10px] text-[#555] tracking-widest uppercase mb-5">VERIFIED CREDENTIALS</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: 'ISC2 Cybersecurity Certified (CC)', issuer: 'ISC2', year: '2024' },
                { name: 'CISCO Pentest Associate', issuer: 'CISCO', year: '2024' },
                { name: 'CompTIA Network+ (pending)', issuer: 'CompTIA', year: '2025' },
              ].map(({ name, issuer, year }) => (
                <div key={name} className="glass border border-[#00FF41]/20 px-5 py-3 flex items-center gap-3">
                  <span className="text-[#00FF41] text-sm">✓</span>
                  <div className="text-left">
                    <div className="font-mono text-[11px] text-[#E8E8E8]">{name}</div>
                    <div className="font-mono text-[9px] text-[#555]">{issuer} · {year}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RESEARCH / BLOG ── */}
      <section id="research" style={{ scrollMarginTop: '80px' }} className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">// SECURITY RESEARCH</span>
            <h2 className="font-mono font-black text-4xl md:text-5xl mt-3 mb-4">
              Blog & <span className="text-[#00FF41]">Articles</span>
            </h2>
            <p className="text-[#555] text-sm max-w-md mx-auto">Thoughts on web security, pentesting methodology, and lessons from the field.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {BLOG_ARTICLES.map((article, i) => (
              <a key={i} href={article.link} target="_blank" rel="noopener noreferrer"
                className="group glass border border-[#1A1A1A] p-7 card-hover block relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFB700]/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center gap-2 mb-4">
                  <span className="font-mono text-[9px] text-[#555] tracking-wider uppercase">{article.date}</span>
                  <span className="text-[#333]">·</span>
                  <span className="font-mono text-[9px] text-[#555] tracking-wider">{article.readTime}</span>
                </div>

                <h3 className="font-mono font-bold text-[#E8E8E8] text-sm mb-3 leading-snug group-hover:text-[#FFB700] transition-colors duration-200">{article.title}</h3>
                <p className="text-[#555] text-xs leading-relaxed mb-5">{article.excerpt}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map(tag => (
                    <span key={tag} className="tag" style={{ borderColor: 'rgba(255,183,0,0.2)', color: 'rgba(255,183,0,0.7)', background: 'rgba(255,183,0,0.05)' }}>{tag}</span>
                  ))}
                </div>

                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#555] group-hover:text-[#FFB700] transition-colors duration-200">
                  Read article <span>↗</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUG BOUNTY + CVE ── */}
      <section id="bounty" style={{ scrollMarginTop: '80px' }} className="py-28 px-6 bg-[#050505]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">// BUG BOUNTY & CVE</span>
            <h2 className="font-mono font-black text-4xl md:text-5xl mt-3 mb-4">
              Hunting & <span className="text-[#FFB700]">Tracking</span>
            </h2>
            <p className="text-[#555] text-sm max-w-md mx-auto">Vulnerability research, CVE monitoring, and responsible disclosure efforts.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {BUG_BOUNTY.map((b, i) => (
              <a key={i} href={b.href} target="_blank" rel="noopener noreferrer"
                className="group glass border border-[#1A1A1A] p-7 card-hover block text-center">
                <span className="text-3xl mb-4 block">{b.icon}</span>
                <div className="font-mono text-[10px] text-[#555] tracking-widest uppercase mb-1">{b.label}</div>
                <div className="font-mono text-sm text-[#E8E8E8] group-hover:text-[#FFB700] transition-colors duration-200 mb-2">{b.platform}</div>
                <div className="font-mono text-[11px] text-[#555]">{b.desc}</div>
              </a>
            ))}
          </div>

          {/* CVE note */}
          <div className="mt-10 glass border border-[#1A1A1A] p-6 text-center">
            <div className="font-mono text-[10px] text-[#555] tracking-widest uppercase mb-3">CVE CONTRIBUTIONS</div>
            <p className="text-[#666] text-xs leading-relaxed">
              Currently building a CVE monitoring pipeline on OpenCVE. Tracking CVEs affecting products in the West African market — banking software, telecom infrastructure, and government systems.
            </p>
          </div>
        </div>
      </section>

      {/* ── CAREER TIMELINE ── */}
      <section id="timeline" style={{ scrollMarginTop: '80px' }} className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">// THE JOURNEY</span>
            <h2 className="font-mono font-black text-4xl md:text-5xl mt-3 mb-4">
              Career <span className="text-[#00FF41]">Timeline</span>
            </h2>
            <p className="text-[#555] text-sm max-w-md mx-auto">Milestones, certifications, and key moments from the security journey.</p>
          </div>

          {/* Vertical timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[22px] top-0 bottom-0 w-px bg-[#1A1A1A]" />

            <div className="space-y-8">
              {CAREER_TIMELINE.map((item, i) => (
                <div key={i} className="relative flex gap-6 pl-16">
                  {/* Year dot */}
                  <div className="absolute left-0 flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-[#050505] border border-[#1A1A1A] flex items-center justify-center font-mono text-[10px] text-[#FFB700] font-bold z-10">
                      {item.year.slice(2)}
                    </div>
                  </div>

                  <div className="flex-1 glass border border-[#1A1A1A] p-6 card-hover">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 border"
                        style={{
                          borderColor: 'rgba(0,255,65,0.2)',
                          color: 'rgba(0,255,65,0.7)',
                          background: 'rgba(0,255,65,0.05)',
                        }}>
                        {item.tag}
                      </span>
                      <span className="font-mono text-[10px] text-[#555] ml-auto">{item.year}</span>
                    </div>
                    <h3 className="font-mono font-bold text-[#E8E8E8] text-sm mb-2">{item.title}</h3>
                    <p className="text-[#555] text-xs leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ scrollMarginTop: '80px' }} className="py-28 px-6 bg-[#050505]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">// WHO IS BEHIND THIS</span>
            <h2 className="font-mono font-black text-4xl md:text-5xl mt-3 mb-4">
              About <span className="text-[#00FF41]">Me</span>
            </h2>
          </div>

          <div className="glass border border-[#1A1A1A] p-8 md:p-12 text-center">
            <div className="text-4xl mb-4">🎩</div>
            <h3 className="font-mono font-bold text-lg text-[#E8E8E8] mb-2">Muhammad Aminu Musa</h3>
            <p className="font-mono text-[11px] text-[#00FF41] tracking-widest uppercase mb-6">Security Researcher · Nigeria</p>

            <p className="text-[#666] text-sm leading-relaxed mb-8 max-w-2xl mx-auto">
              I got into cybersecurity because I wanted to understand how systems break — then I got hooked on the puzzle. Today I build tools, document my findings, and help others learn the same way: hands-on, no hype.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Focus Area', value: 'Web Application Security', icon: '🔓' },
                { label: 'Location', value: 'Nigeria, West Africa', icon: '🌍' },
                { label: 'Status', value: 'Open to work', icon: '💼' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="text-center">
                  <div className="text-xl mb-2">{icon}</div>
                  <div className="font-mono text-[10px] text-[#555] tracking-widest uppercase mb-1">{label}</div>
                  <div className="font-mono text-xs text-[#888]">{value}</div>
                </div>
              ))}
            </div>

            <a href="mailto:Mamuaminu31@gmail.com" className="btn-neon inline-block">
              Get in Touch →
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ scrollMarginTop: '80px' }} className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label">// CONNECT</span>
          <h2 className="font-mono font-black text-4xl md:text-5xl mt-3 mb-4">
            Let&apos;s <span className="text-[#00FF41]">Talk</span>
          </h2>
          <p className="text-[#555] text-sm mb-14">Open to security consulting, freelance dev work, and interesting collaborations.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {[
              { label: 'GitHub', value: 'mamuaminu', href: 'https://github.com/mamuaminu', symbol: '⌨️', desc: 'Source code' },
              { label: 'LinkedIn', value: 'Muhammad Aminu Musa', href: 'https://linkedin.com/in/muhammad-aminu-musa', symbol: '💼', desc: 'Connect' },
              { label: 'Twitter', value: '@mamuaminu', href: 'https://twitter.com/mamuaminu', symbol: '🐦', desc: 'Follow' },
              { label: 'Email', value: 'Mamuaminu31@gmail.com', href: 'mailto:Mamuaminu31@gmail.com', symbol: '✉️', desc: 'Message' },
            ].map(({ label, value, href, symbol, desc }) => (
              <a key={label} href={href} target={label === 'Email' ? undefined : '_blank'} rel="noopener noreferrer"
                className="group glass border border-[#1A1A1A] p-6 card-hover block text-center">
                <span className="text-2xl mb-3 block">{symbol}</span>
                <div className="font-mono text-[10px] text-[#555] tracking-widest uppercase mb-1">{label}</div>
                <div className="font-mono text-xs text-[#888] group-hover:text-[#00FF41] transition-colors duration-200 break-all">{value}</div>
                <div className="font-mono text-[10px] text-[#333] mt-1">{desc}</div>
              </a>
            ))}
          </div>

          {/* Resume download in contact */}
          <div className="mb-12">
            <a href="/resume.pdf" download="Muhammad-Aminu-Musa-Resume.pdf"
              className="btn-ghost inline-flex items-center gap-2">
              📄 Download PDF Resume
            </a>
          </div>

          {/* Divider */}
          <div className="border-t border-[#1A1A1A] pt-8">
            <p className="font-mono text-[10px] text-[#333] tracking-widest uppercase">
              SecLab Nigeria · Muhammad Aminu Musa · ISC2 CC · CISCO Pentest
            </p>
            <p className="font-mono text-[9px] text-[#222] mt-2">
              Built with Next.js · Deployed on GitHub Pages · All tools run 100% client-side
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}