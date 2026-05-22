'use client';

import { useState, useEffect } from 'react';

const COURSES = [
  {
    id: 1,
    title: 'Web Penetration Testing from Scratch',
    description: 'Learn how web apps actually get broken. Covers the OWASP Top 10 with hands-on labs you run against real vulnerable targets.',
    instructor: 'Muhammad Aminu Musa',
    level: 'Beginner – Intermediate',
    duration: '12 hours',
    lessons: 28,
    rating: 4.8,
    students: 312,
    price: 79,
    free: false,
    badge: 'BESTSELLER',
    badgeColor: '#00FF41',
    image: '🌐',
    curriculum: [
      { module: 'Module 1: HTTP Fundamentals', topics: ['How browsers talk to servers', 'Headers, cookies, sessions', 'Burp Suite setup'] },
      { module: 'Module 2: Information Disclosure', topics: ['Robots.txt, source maps', 'Directory enumeration', 'Git exposure (git-dumper)'] },
      { module: 'Module 3: SQL Injection', topics: ['In-band, Blind, Time-based', 'SQLMap automation', 'WAF bypass basics'] },
      { module: 'Module 4: Cross-Site Scripting (XSS)', topics: ['Reflected, Stored, DOM', 'Filter evasion techniques', 'CSP bypass'] },
      { module: 'Module 5: Authentication Flaws', topics: ['Brute force protection', 'JWT manipulation', 'OAuth misconfiguration'] },
      { module: 'Module 6: SSRF & IDOR', topics: ['Cloud metadata exploitation', 'Parameter tampering', 'Access control testing'] },
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    reviews: [
      { user: 'Adebayo K.', country: '🇳🇬', text: 'Finally a course that doesn\'t skip steps. I went from zero to running my first pentest in 3 weeks.', rating: 5 },
      { user: 'Sarah M.', country: '🇬🇧', text: 'The SQL injection section alone is worth the price. Labs are hands-on and the explanations are clear.', rating: 5 },
      { user: 'Chen W.', country: '🇸🇬', text: 'Good intro to Burp Suite and web app testing methodology. The SSRF module opened my eyes.', rating: 4 },
    ],
  },
  {
    id: 2,
    title: 'Python for Security Automation',
    description: 'Stop doing everything manually. Learn to automate recon, scanning, and reporting with Python. Build your own security tools.',
    instructor: 'Muhammad Aminu Musa',
    level: 'Intermediate',
    duration: '8 hours',
    lessons: 18,
    rating: 4.9,
    students: 198,
    price: 59,
    free: false,
    badge: 'NEW',
    badgeColor: '#FFB700',
    image: '🐍',
    curriculum: [
      { module: 'Module 1: Python Refresher', topics: ['Requests, BeautifulSoup', 'Working with APIs', 'JSON parsing'] },
      { module: 'Module 2: Recon Automation', topics: ['Subdomain enumeration', 'Port scanning with socket', 'CORS misconfiguration checks'] },
      { module: 'Module 3: Vulnerability Scanning', topics: ['Writing a basic CVE scanner', 'XSS detection with requests', 'SQLi detection patterns'] },
      { module: 'Module 4: Reporting', topics: ['Generating PDF reports', 'HTML dashboards', 'Exporting to JSON/CSV'] },
    ],
    video: null,
    reviews: [
      { user: 'Felix O.', country: '🇳🇬', text: 'I now have a recon script that used to take 2 hours running in 4 minutes. This course pays for itself.', rating: 5 },
    ],
  },
  {
    id: 3,
    title: 'CTF Fundamentals — Win Your First Competition',
    description: 'A practical guide to competitive CTF. Learn the categories, tools, and thinking patterns that separate beginners from finishers.',
    instructor: 'Muhammad Aminu Musa',
    level: 'Beginner',
    duration: '6 hours',
    lessons: 15,
    rating: 4.7,
    students: 441,
    price: 0,
    free: true,
    badge: 'FREE',
    badgeColor: '#00FF41',
    image: '🚩',
    curriculum: [
      { module: 'Module 1: CTF Mindset', topics: ['Jeopardy vs Attack-Defense', 'Reading challenge descriptions', 'Flag formats and rules'] },
      { module: 'Module 2: Web Challenges', topics: ['Reading PHP source', 'Basic SQLi patterns', 'JavaScript deobfuscation'] },
      { module: 'Module 3: Crypto Basics', topics: ['Encoding: Base64, Hex, ROT13', 'Identifying hash types', 'XOR basics'] },
      { module: 'Module 4: OSINT for CTFs', topics: ['Google dorking', 'Metadata extraction', 'Finding hidden files'] },
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    reviews: [],
  },
  {
    id: 4,
    title: 'Burp Suite Mastery',
    description: 'Go beyond Repeater and Intruder. Full guide to active scanning, macro-based testing, JWT manipulation, and custom extensions.',
    instructor: 'Muhammad Aminu Musa',
    level: 'Intermediate – Advanced',
    duration: '10 hours',
    lessons: 22,
    rating: 4.9,
    students: 156,
    price: 99,
    free: false,
    badge: null,
    badgeColor: '#FFB700',
    image: '🔍',
    curriculum: [
      { module: 'Module 1: Proxy Deep Dive', topics: ['Scoped rules', 'Match & replace', 'Client-side TLS certs'] },
      { module: 'Module 2: Active Scanning', topics: ['Scan coverage settings', 'False positive management', 'Scheduler automation'] },
      { module: 'Module 3: Intruder Advanced', topics: ['Pitchfork mode for credential stuffing', 'Grep extracts for data extraction', 'Macros for multi-step flows'] },
      { module: 'Module 4: Extender', topics: ['Writing BApp Store extensions', 'Jython setup', 'Calling Burp APIs from Python'] },
    ],
    video: null,
    reviews: [],
  },
];

const FREE_COURSES = COURSES.filter(c => c.free);
const PAID_COURSES = COURSES.filter(c => !c.free);

export default function CoursesPage() {
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [tab, setTab] = useState<'all' | 'free' | 'paid'>('all');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('enrolled_courses');
      if (saved) setEnrolled(JSON.parse(saved));
    } catch {}
  }, []);

  const enroll = (id: number) => {
    const course = COURSES.find(c => c.id === id);
    if (!course) return;
    if (enrolled.includes(String(id))) return;
    if (course.price > 0) {
      window.open('https://gumroad.com/l/seclab-ng', '_blank');
      return;
    }
    const next = [...enrolled, String(id)];
    setEnrolled(next);
    localStorage.setItem('enrolled_courses', JSON.stringify(next));
  };

  const filtered = tab === 'all' ? COURSES : tab === 'free' ? FREE_COURSES : PAID_COURSES;

  return (
    <div className="min-h-screen bg-black text-[#E8E8E8]">
      {/* Header */}
      <div className="border-b border-[#1A1A1A] px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <span className="section-label">// SECURITY TRAINING</span>
          <h1 className="font-mono font-black text-3xl mt-2">
            <span className="text-[#00FF41]">Learn</span> by <span className="text-[#FFB700]">Breaking</span>
          </h1>
          <p className="text-[#555] text-sm font-mono mt-1">Practical courses with real labs, built by a working pentester.</p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="border-b border-[#1A1A1A] px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-8">
          {[['1,107', 'Students trained'], ['4.8', 'Average rating'], ['83', 'Lessons'], ['12h', 'Avg. course length']].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="font-mono font-black text-xl text-[#00FF41]">{v}</div>
              <div className="font-mono text-[10px] text-[#555] uppercase tracking-wider">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="flex gap-6 border-b border-[#1A1A1A] pb-0 mb-8">
          {[['all', `All (${COURSES.length})`], ['free', `Free (${FREE_COURSES.length})`], ['paid', `Paid (${PAID_COURSES.length})`]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id as typeof tab)}
              className={`font-mono text-sm pb-3 border-b-2 transition-all duration-200 ${
                tab === id ? 'border-[#00FF41] text-[#00FF41]' : 'border-transparent text-[#555] hover:text-[#888]'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Courses */}
        <div className="space-y-6 pb-20">
          {filtered.map(course => (
            <div key={course.id} className="glass border border-[#1A1A1A] overflow-hidden">
              <div className="flex flex-col lg:flex-row gap-0">
                {/* Left: info */}
                <div className="flex-1 p-7">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl">{course.image}</span>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        {course.badge && (
                          <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 border"
                            style={{ borderColor: `${course.badgeColor}40`, color: course.badgeColor, background: `${course.badgeColor}10` }}>
                            {course.badge}
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-[#555]">{course.level}</span>
                      </div>
                      <h2 className="font-mono font-bold text-[#E8E8E8] text-base">{course.title}</h2>
                    </div>
                  </div>

                  <p className="text-[#666] text-sm leading-relaxed mb-5">{course.description}</p>

                  <div className="flex flex-wrap gap-4 mb-5">
                    {[
                      ['⏱', course.duration],
                      ['📚', `${course.lessons} lessons`],
                      ['⭐', `${course.rating}/5`],
                      ['👤', `${course.students} students`],
                    ].map(([icon, val]) => (
                      <span key={val} className="font-mono text-[11px] text-[#555] flex items-center gap-1">
                        <span>{icon}</span> {val}
                      </span>
                    ))}
                  </div>

                  {/* Reviews */}
                  {course.reviews.length > 0 && (
                    <div className="mb-5">
                      <p className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-2">Student Reviews</p>
                      {course.reviews.map((r, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <span>{r.country}</span>
                          <div>
                            <div className="font-mono text-[10px] text-[#888]">{r.user} · {'★'.repeat(r.rating)}</div>
                            <div className="font-mono text-[11px] text-[#555] italic">"{r.text}"</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Curriculum */}
                  <button onClick={() => setExpanded(expanded === course.id ? null : course.id)}
                    className="font-mono text-[11px] text-[#FFB700] hover:underline mb-3">
                    {expanded === course.id ? '▲ Hide curriculum' : '▼ View curriculum'}
                  </button>

                  {expanded === course.id && (
                    <div className="space-y-3 mb-4">
                      {course.curriculum.map(mod => (
                        <div key={mod.module} className="border border-[#1A1A1A] p-4">
                          <p className="font-mono text-[11px] text-[#00FF41] mb-2">{mod.module}</p>
                          {mod.topics.map(t => (
                            <div key={t} className="font-mono text-[11px] text-[#555] py-0.5 flex gap-2">
                              <span className="text-[#333]">▸</span> {t}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => enroll(course.id)}
                      disabled={enrolled.includes(String(course.id))}
                      className={`font-mono text-sm py-2.5 px-6 tracking-wider border transition-all duration-200 ${
                        enrolled.includes(String(course.id))
                          ? 'border-[#00FF41]/30 text-[#00FF41] cursor-default'
                          : course.price > 0
                            ? 'border-[#FFB700]/40 text-[#FFB700] hover:bg-[#FFB700]/10'
                            : 'border-[#00FF41]/40 text-[#00FF41] hover:bg-[#00FF41]/10'
                      }`}>
                      {enrolled.includes(String(course.id)) ? '✓ Enrolled' : course.price > 0 ? `Enroll — $${course.price}` : 'Enroll Free'}
                    </button>
                    <span className="font-mono text-[11px] text-[#555]">by {course.instructor}</span>
                  </div>
                </div>

                {/* Right: video preview */}
                {course.video && (
                  <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-[#1A1A1A]">
                    <div className="aspect-video bg-[#0D0D0D] flex items-center justify-center relative">
                      <iframe
                        src={course.video}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={course.title}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}