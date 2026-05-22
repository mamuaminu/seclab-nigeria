const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 55, right: 55 },
  info: {
    Title: 'Muhammad Aminu Musa - Security Researcher',
    Author: 'Muhammad Aminu Musa',
    Subject: 'Security Researcher & Developer Resume',
  }
});

const outPath = path.join(__dirname, '..', 'public', 'resume.pdf');
doc.pipe(fs.createWriteStream(outPath));

const GREEN = '#00FF41';
const AMBER = '#FFB700';
const DARK = '#111111';
const TEXT = '#222222';
const MUTED = '#666666';
const LINE = '#E0E0E0';

// ─── Helpers ───────────────────────────────────────────────
function sectionTitle(text) {
  doc.moveDown(0.6);
  doc.fontSize(8).fillColor(AMBER).text(text.toUpperCase(), { characterSpacing: 3 });
  doc.moveTo(55, doc.y).lineTo(547, doc.y).strokeColor(LINE).stroke();
  doc.moveDown(0.5);
}

function name(text, opts = {}) {
  doc.fontSize(opts.size || 26).fillColor(TEXT).text(text, opts.opts);
}

function meta(label, value) {
  doc.fontSize(8).fillColor(MUTED).text(`${label}: `, { continued: true })
     .fillColor(TEXT).text(value);
}

// ─── Header ─────────────────────────────────────────────────
doc.rect(0, 0, 595, 160).fill(DARK);

doc.rect(55, 55, 1, 70).fillColor(GREEN).fill(); // accent bar

doc.fontSize(28).fillColor('#FFFFFF').text('Muhammad Aminu Musa', 70, 55, { width: 400 });
doc.fontSize(10).fillColor(GREEN).text('Security Researcher  ·  Penetration Tester  ·  Full-Stack Developer', 70, 90, { width: 430 });

doc.fontSize(8).fillColor('#AAAAAA').text('Nigeria, West Africa', 70, 108);
doc.moveDown(0.5);
doc.fontSize(8).fillColor('#888888');
doc.text('Mamuaminu31@gmail.com    |    +234-XXX-XXXX    |    linkedin.com/in/muhammad-aminu-musa    |    github.com/mamuaminu', { width: 480 });

doc.moveTo(55, 148).lineTo(547, 148).strokeColor('#333333').stroke();

doc.rect(0, 0, 595, 160).fill(); // ensure filled

doc.fontSize(8).fillColor(GREEN);
doc.text('  ISC2 CC · CISCO Pentest Associate · OSCP Candidate', 55, 155, { width: 492 });

doc.moveDown(2.5);

// ─── Professional Summary ───────────────────────────────────
sectionTitle('Professional Summary');
doc.fontSize(9.5).fillColor(TEXT);
doc.moveTo(55, doc.y).text(
  'Security researcher and full-stack developer with a hands-on approach to web application security. ' +
  'ISC2 Certified in Cybersecurity and CISCO Pentest Associate with practical experience across offensive security, ' +
  'tool development, and secure system architecture. Passionate about breaking things to understand them — ' +
  'then building better. Active CTF competitor and security community contributor.',
  { width: 492, lineGap: 2 }
);

// ─── Skills ────────────────────────────────────────────────
sectionTitle('Core Skills');

const skillCols = [
  ['Offensive Security', 'Web Pentesting · SQL Injection · XSS · CSRF · Auth Bypass · SSRF · IDOR'],
  ['Security Tools', 'Burp Suite · Nmap · Nikto · Gobuster · SQLMap · Wireshark · Metasploit'],
  ['Automation & DevOps', 'Python · Bash · Node.js · Docker · PM2 · Nginx · AWS · n8n'],
  ['Development', 'React/Next.js · TypeScript · FastAPI · PostgreSQL · Redis · REST APIs'],
];

skillCols.forEach(([cat, items]) => {
  const y = doc.y;
  doc.fontSize(9).fillColor(TEXT).text(cat + ':', 55, y, { width: 140, continued: true });
  doc.fontSize(9).fillColor(MUTED).text(items, 195, y, { width: 352 });
  doc.moveDown(0.7);
});

doc.moveDown(0.5);

// ─── Certifications ────────────────────────────────────────
sectionTitle('Certifications & Education');

const certs = [
  ['ISC2 Certified in Cybersecurity (CC)', '2024', 'International Information System Security Certification Consortium'],
  ['CISCO Pentest Associate', '2024', 'CISCO'],
  ['CompTIA Network+', '2025 (pending)', 'CompTIA'],
  ['B.Sc. / HND in Computer Science', '2022–2024', 'University / Polytechnic, Nigeria'],
];

certs.forEach(([name, year, issuer]) => {
  const y = doc.y;
  doc.fontSize(9.5).fillColor(TEXT).text(name, 55, y, { width: 320, continued: true });
  doc.fontSize(9).fillColor(AMBER).text(year, 375, y, { width: 80, align: 'right', continued: true });
  doc.fontSize(8.5).fillColor(MUTED).text(issuer, 455, y, { width: 100 });
  doc.moveDown(0.6);
});

doc.moveDown(0.5);

// ─── Professional Experience ───────────────────────────────
sectionTitle('Professional Experience');

const jobs = [
  {
    title: 'Security Researcher & Developer',
    org: 'Freelance / SecLab Nigeria',
    period: '2022 – Present',
    points: [
      'Conducted web application penetration tests against own projects and contributed findings to open programs.',
      'Built Hayaku Express — full-stack WhatsApp delivery platform handling real customers; implemented Twilio WhatsApp API, WebSocket rider tracking, and Paystack payment integration.',
      'Developed Hawkeye Intelligence — real-time OSINT platform for West African incident tracking; deployed with Docker on Oracle Cloud.',
      'Authored malware_tool — static malware analysis CLI with VT API integration, PE parsing, YARA rule scanning, and Flask UI; 47 GitHub stars.',
    ]
  },
  {
    title: 'IT Support & Network Administration',
    org: 'Various Organizations',
    period: '2019 – 2022',
    points: [
      'Managed Windows Server and Linux-based network infrastructure for small-to-medium organizations.',
      'Configured firewalls, VPNs, and VLANs; performed routine vulnerability assessments and patch management.',
      'Provided end-user support, printer/server setup, and Active Directory management.',
    ]
  },
];

jobs.forEach(({ title, org, period, points }) => {
  const y = doc.y;
  doc.fontSize(10).fillColor(TEXT).text(title, 55, y, { width: 320, continued: true });
  doc.fontSize(8.5).fillColor(MUTED).text(period, 375, y, { width: 172, align: 'right' });
  doc.fontSize(8.5).fillColor(MUTED).text(org);
  doc.moveDown(0.2);
  points.forEach(p => {
    doc.fontSize(9).fillColor(MUTED).text('▸  ', { continued: true }).fillColor(TEXT).text(p, { width: 470 });
    doc.moveDown(0.45);
  });
  doc.moveDown(0.3);
});

// ─── CTF & Competitive Security ─────────────────────────────
sectionTitle('CTF & Competitive Security');

const ctfs = [
  'Active on HackTheBox, TryHackMe, PortSwigger Web Academy, and CTFlearn.',
  'HTB "Meow" (Beginner) — exploited Telnet with default credentials; Nmap + telnet enumeration.',
  'PortSwigger DOM XSS via postMessage — exploited Web Message injection in poorly isolated iframe.',
  'CTFlearn "BaseApp" Crypto — AES-CTR keystream recovery via known plaintext XOR attack.',
  'NepFest CTF 2024 "Login Bypass" — OR 1=1 injection, SQLMap escalation, admin panel access.',
];

ctfs.forEach(c => {
  doc.fontSize(9).fillColor(MUTED).text('▸  ', { continued: true }).fillColor(TEXT).text(c);
  doc.moveDown(0.4);
});

doc.moveDown(0.5);

// ─── Open Source Projects ───────────────────────────────────
sectionTitle('Open Source Projects');

const projects = [
  ['malware_tool', 'Python · YARA · VirusTotal API · Flask', 'Static malware analysis CLI with PE parsing, YARA scanning, VT lookups. 47 ★ on GitHub.'],
  ['Hawkeye Intelligence', 'React · Node.js · PostgreSQL · Docker', 'Real-time OSINT platform tracking West African incidents, fleet movements, market data.'],
  ['Hayaku Express', 'Node.js · Twilio · WebSocket · Paystack', 'WhatsApp delivery bot serving real customers; automated order flow with live rider tracking.'],
  ['SecLab Nigeria', 'Next.js · TypeScript · Tailwind CSS', 'This site — interactive security demos, CTF writeups, and open tools for the community.'],
];

projects.forEach(([name, tech, desc]) => {
  const y = doc.y;
  doc.fontSize(10).fillColor(TEXT).text(name, 55, y, { continued: true });
  doc.fontSize(8).fillColor(MUTED).text('  ' + tech, { y: y + 1.5 });
  doc.fontSize(9).fillColor(MUTED).text('    ' + desc, { width: 492 });
  doc.moveDown(0.5);
});

doc.moveDown(0.5);

// ─── Publications & Research ───────────────────────────────
sectionTitle('Publications & Research');

const pubs = [
  '"How I Found My First XSS — A Beginner\'s Journey" — Medium, May 2026',
  '"Top 5 Recon Tools for Web Pentesting" — Medium, April 2026',
  '"Why Every Developer Should Learn SQL Injection" — Medium, March 2026',
  'Security blog: mamuaminu.github.io/seclab-nigeria (live demos, writeups, tools)',
  'CVE monitoring pipeline: Tracking CVEs affecting West African banking, telecom, and government systems.',
];

pubs.forEach(p => {
  doc.fontSize(9).fillColor(MUTED).text('▸  ', { continued: true }).fillColor(TEXT).text(p);
  doc.moveDown(0.4);
});

// ─── Footer ───────────────────────────────────────────────
doc.rect(0, 780, 595, 1).fillColor(GREEN);
doc.fontSize(7.5).fillColor('#999999').text(
  'SecLab Nigeria · Muhammad Aminu Musa · ISC2 CC · CISCO Pentest · github.com/mamuaminu · linkedin.com/in/muhammad-aminu-musa',
  55, 788, { width: 492, align: 'center' }
);

doc.end();
console.log('Resume PDF written to:', outPath);
