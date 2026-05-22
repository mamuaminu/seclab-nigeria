'use client';

import { useEffect, useState } from 'react';
import { XSSSimulator, CipherEncoder, HashIdentifier } from '@/lib/tools';

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
  },
  {
    name: 'Hawkeye Intelligence',
    description: 'Real-time OSINT platform for tracking incidents, fleet movements, and market data across West Africa.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    link: 'https://github.com/mamuaminu/Hawkeye-Intelligence',
    stars: '23',
    language: 'JavaScript',
  },
  {
    name: 'Hayaku Express',
    description: 'WhatsApp delivery bot with WebSocket rider tracking, Paystack payments, and automated order flows.',
    tech: ['Node.js', 'Twilio', 'WebSocket', 'PM2'],
    link: 'https://github.com/mamuaminu/hayaku-express',
    stars: '12',
    language: 'JavaScript',
  },
  {
    name: 'PostForge AI',
    description: 'Multi-platform social media automation with JWT auth, platform adapters (FB, X, IG, LinkedIn), and GPT-4o.',
    tech: ['FastAPI', 'Celery', 'Redis', 'Docker'],
    link: 'https://github.com/mamuaminu/postforge',
    stars: '8',
    language: 'Python',
  },
];

const NAV_LINKS = ['Demos', 'Writeups', 'Projects', 'Contact'];

export default function Home() {
  const [activeSection, setActiveSection] = useState('Hero');
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
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
    }, 400);

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => { clearInterval(interval); window.removeEventListener('scroll', handleScroll); };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200">

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#00FF41] font-mono font-bold text-lg">⬡</span>
            <span className="font-mono font-bold text-sm tracking-wider">SecLab<span className="text-[#00FF41]">NG</span></span>
          </div>
          <div className="flex gap-6 text-xs font-mono">
            {NAV_LINKS.map(link => (
              <button key={link} onClick={() => scrollTo(link)} className={`transition-colors ${activeSection === link ? 'text-[#00FF41]' : 'text-gray-500 hover:text-gray-300'}`}>
                {link}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center grid-bg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]" />

        {/* Floating terminal */}
        <div className="absolute top-1/4 right-[8%] w-80 glass rounded-xl p-4 font-mono text-xs hidden lg:block">
          <div className="flex gap-1.5 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"/>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"/>
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"/>
            <span className="ml-2 text-gray-500">seclab@root</span>
          </div>
          <div className="space-y-1">
            {terminalLines.map((line, i) => (
              <p key={i} className="text-[#00FF41] leading-relaxed">{line}</p>
            ))}
            {terminalLines.length < 5 && <span className="cursor-blink text-[#00FF41]" />}
          </div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
            <span className="text-xs font-mono text-gray-400">Nigeria's Premier Cybersecurity Lab</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
            <span className="text-white">Break.</span>
            <span className="text-[#00FF41] neon-flicker"> Protect.</span>
            <br />
            <span className="text-white">Build.</span>
            <span className="text-[#FFB700]"> Repeat.</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Interactive security demos, CTF writeups, and real tools — built and maintained by a Nigerian cybersecurity professional.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => scrollTo('Demos')} className="bg-[#00FF41] text-black font-bold px-8 py-3 rounded-lg hover:bg-[#00cc33] transition-all hover:shadow-[0_0_30px_rgba(0,255,65,0.3)]">
              Try Live Demos →
            </button>
            <button onClick={() => scrollTo('Projects')} className="border border-[#1e1e1e] text-gray-300 font-bold px-8 py-3 rounded-lg hover:border-[#00FF41]/40 hover:text-[#00FF41] transition-colors">
              View Projects
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="text-[#00FF41] text-2xl">↓</span>
        </div>
      </section>

      {/* LIVE DEMOS */}
      <section id="demos" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#FFB700] font-mono text-sm">// LIVE TOOLS</span>
            <h2 className="text-4xl font-black mt-2 mb-3">Interactive <span className="text-[#00FF41]">Demos</span></h2>
            <p className="text-gray-500 max-w-lg mx-auto">Hands-on security tools running entirely in your browser. No data leaves your machine.</p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            <XSSSimulator />
            <CipherEncoder />
            <HashIdentifier />
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { stat: '100%', label: 'Client-side' },
              { stat: '0', label: 'Data sent to server' },
              { stat: '∞', label: 'Free uses' },
              { stat: '24/7', label: 'Always available' },
            ].map(({ stat, label }) => (
              <div key={label} className="glass rounded-lg py-4">
                <div className="text-2xl font-black text-[#00FF41] font-mono">{stat}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTF WRITEUPS */}
      <section id="writeups" className="py-24 px-6 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#FFB700] font-mono text-sm">// CTF JOURNAL</span>
            <h2 className="text-4xl font-black mt-2 mb-3">CTF <span className="text-[#00FF41]">Writeups</span></h2>
            <p className="text-gray-500 max-w-lg mx-auto">Detailed walkthroughs of challenges solved. Think out loud, learn by doing.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {CTF_WRITEUPS.map((w, i) => (
              <a key={i} href={w.link} className="glass rounded-xl p-6 card-hover group block border border-[#1e1e1e] hover:border-[#00FF41]/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      w.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                      w.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>{w.difficulty}</span>
                    <span className="text-xs text-gray-600">{w.date}</span>
                  </div>
                  <span className="text-[#00FF41] text-sm group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <h3 className="font-bold text-white mb-2 text-sm leading-snug">{w.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-3">{w.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {w.tags.map(tag => (
                    <span key={tag} className="text-xs font-mono bg-black/40 border border-[#1e1e1e] rounded px-2 py-0.5 text-gray-400">{tag}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT SHOWCASE */}
      <section id="projects" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#FFB700] font-mono text-sm">// WHAT I BUILD</span>
            <h2 className="text-4xl font-black mt-2 mb-3">Project <span className="text-[#00FF41]">Showcase</span></h2>
            <p className="text-gray-500 max-w-lg mx-auto">Security tools, automation platforms, and full-stack apps. Everything open source.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PROJECTS.map((p, i) => (
              <a key={i} href={p.link} target="_blank" rel="noopener noreferrer" className="glass rounded-xl p-6 card-hover group border border-[#1e1e1e] hover:border-[#00FF41]/30 block">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold font-mono text-white text-sm group-hover:text-[#00FF41] transition-colors">{p.name}</h3>
                    <span className="text-xs text-gray-500">{p.language} · ★ {p.stars}</span>
                  </div>
                  <span className="text-xl">⚡</span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tech.map(t => (
                    <span key={t} className="text-xs font-mono bg-[#00FF41]/5 border border-[#00FF41]/20 text-[#00FF41]/80 rounded px-2 py-0.5">{t}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-6 bg-black/30">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-[#FFB700] font-mono text-sm">// CONNECT</span>
          <h2 className="text-4xl font-black mt-2 mb-3">Let's <span className="text-[#00FF41]">Talk</span></h2>
          <p className="text-gray-500 mb-10">Open to security consulting, freelance dev work, and interesting collaborations.</p>

          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[
              { label: 'GitHub', value: 'mamuaminu', icon: '⌨', href: 'https://github.com/mamuaminu' },
              { label: 'LinkedIn', value: 'Muhammad Aminu Musa', icon: '💼', href: '#' },
              { label: 'Email', value: 'Mamuaminu31@gmail.com', icon: '✉', href: 'mailto:Mamuaminu31@gmail.com' },
            ].map(({ label, value, icon, href }) => (
              <a key={label} href={href} className="glass rounded-xl p-5 card-hover group block border border-[#1e1e1e] hover:border-[#00FF41]/30">
                <span className="text-2xl mb-2 block">{icon}</span>
                <span className="text-xs text-gray-500 block mb-1">{label}</span>
                <span className="text-xs font-mono text-gray-300 group-hover:text-[#00FF41] transition-colors break-all">{value}</span>
              </a>
            ))}
          </div>

          <p className="text-xs text-gray-600 font-mono">
            SecLab Nigeria · Built by{' '}
            <span className="text-[#00FF41]">Muhammad Aminu Musa</span> · ISC2 CC · CISCO Pentest
          </p>
        </div>
      </section>
    </div>
  );
}
