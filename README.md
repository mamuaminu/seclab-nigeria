# SecLab Nigeria

> Nigeria's Premier Cybersecurity Lab — interactive demos, CTF writeups, and open-source security tools.

[Live Site](https://mamuaminu.github.io/seclab-nigeria) · [mamuaminu](https://github.com/mamuaminu)

---

## What is this?

SecLab Nigeria is a personal cybersecurity portal built to showcase real skills through live, working demos. It's not a blog or a static portfolio — every tool on the site actually runs in your browser. The goal: make recruiters and clients stop scrolling, click something, and come away knowing what you can actually do.

---

## Live Tools

### 🔓 XSS Simulator
A sandboxed environment where you can type or paste XSS payloads and see them execute in real time. Includes quick-payload buttons for common attack patterns with explanations of how each one works. Completely client-side — nothing is sent to any server.

### 🔐 Cipher Encoder
Encrypt and decrypt classic ciphers:
- **Caesar** — shift any alphabet character by N positions (configurable 1–25)
- **ROT13** — standard rotation cipher
- **Base64** — encode/decode binary-to-text
- **Reverse** — character reversal cipher

All processing happens in the browser.

### #️⃣ Hash Identifier
Paste any cryptographic hash and get instant analysis:
- Hash type detection (MD5, SHA-1, SHA-256, SHA-384, SHA-512, Bcrypt, etc.)
- Strength assessment — weak, moderate, or strong
- What the hash is typically used for
- Common length reference table

---

## CTF Writeups

Detailed walkthroughs of challenges solved on platforms including HackTheBox, PortSwigger Academy, CTFlearn, and NepFest. Each writeup covers:

- The challenge and its category
- Step-by-step exploitation process
- Key commands and tooling used
- What was learned

Browse the [Writeups section](#) on the live site.

---

## Project Showcase

Open-source projects featured on the site:

| Project | Description | Stack |
|---|---|---|
| **malware_tool** | Static malware analysis CLI with VT lookup, PE parsing, YARA scanning | Python, Flask, SQLite |
| **Hawkeye Intelligence** | OSINT platform for West African incidents, fleet tracking, market data | React, Node.js, PostgreSQL, Docker |
| **Hayaku Express** | WhatsApp delivery bot with WebSocket rider tracking and Paystack | Node.js, Twilio, WebSocket, PM2 |
| **PostForge AI** | Multi-platform social media automation with GPT-4o | FastAPI, Celery, Redis, Docker |

All repos: [github.com/mamuaminu](https://github.com/mamuaminu)

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** GitHub Pages (CI via GitHub Actions)
- **Hosting:** Free — $0 total cost

---

## Getting Started

### Run locally

```bash
# Clone the repo
git clone https://github.com/mamuaminu/seclab-nigeria.git
cd seclab-nigeria

# Install dependencies
npm install

# Start dev server
npm run dev
# Open http://localhost:3000
```

### Build for production

```bash
npm run build
npm start
```

### Deploy to GitHub Pages

The repo includes a GitHub Actions workflow that deploys the `out/` directory on every push to `main`. Just enable GitHub Pages in your repo settings and point it to the `gh-pages` branch.

---

## Why this matters

Most security portfolios list certifications and tools. This one demonstrates competence by letting visitors _use_ the tools directly. A recruiter can click the XSS simulator, try a payload, and see exactly how XSS works — in 30 seconds. That sticks.

Built by **Muhammad Aminu Musa** — ISC2 Certified in Cybersecurity, CISCO Pentest certified, 3+ years IT consulting. Nigerian developer building things that work.

---

## License

MIT — use it, learn from it, improve it.

---

_SecLab Nigeria · Built in Nigeria, deployed to the world._

## Deployment Status

✅ Build: passing  
🔄 Deploy: triggered on push to `main` via GitHub Actions  

Live at: https://mamuaminu.github.io/seclab-nigeria/
