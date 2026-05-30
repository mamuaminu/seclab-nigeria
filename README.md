# SecLab Nigeria

> Nigeria's Premier Cybersecurity Lab — interactive demos, CTF writeups, and open-source security tools.

[Live Site](https://mamuaminu.github.io/seclab-nigeria) · [mamuaminu](https://github.com/mamuaminu)

---

## What is this?

SecLab Nigeria is a cybersecurity learning portal with three pillars:

1. **Live Tool Demos** — security tools that run directly in the browser, no install needed
2. **CTF Writeups** — step-by-step walkthroughs of challenges from HackTheBox, PortSwigger Academy, CTFlearn, and NepFest
3. **Open Source Tools** — lightweight security tools you can download and run locally

## Live Tools

### 🔓 XSS Simulator
A sandboxed environment to type or paste XSS payloads and see them execute in real time. Includes one-click payload buttons with explanations of each attack technique. Completely client-side — nothing is sent to any server.

### 🔐 Cipher Encoder
Encrypt and decrypt classic ciphers directly in the browser:
- **Caesar** — shift any alphabet character by N positions (1–25)
- **ROT13** — standard rotation cipher
- **Base64** — encode/decode binary-to-text
- **Reverse** — character reversal cipher

All processing happens in the browser. No data leaves your machine.

### #️⃣ Hash Identifier
Paste any cryptographic hash and get instant analysis:
- Hash type detection (MD5, SHA-1, SHA-256, SHA-384, SHA-512, Bcrypt, etc.)
- Strength assessment — weak, moderate, or strong
- What the hash is typically used for
- Common length reference table

## CTF Writeups

Detailed walkthroughs of challenges from:
- **HackTheBox** — retired machines and active challenges
- **PortSwigger Academy** — Web Academy labs
- **CTFlearn** — beginner to intermediate challenges
- **NepFest** — community CTF events

Each writeup covers:
- Challenge category and difficulty rating
- Step-by-step exploitation process
- Tooling and commands used
- What was learned and key takeaways

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** GitHub Pages (CI via GitHub Actions)
- **Hosting cost:** $0

## Getting Started

### Run locally

```bash
git clone https://github.com/mamuaminu/seclab-nigeria.git
cd seclab-nigeria
npm install
npm run dev
# Open http://localhost:3000
```

### Build for production

```bash
npm run build
npm start
```

### Deploy to GitHub Pages

The repo includes a GitHub Actions workflow that deploys the `out/` directory on every push to `main`. Enable GitHub Pages in your repo settings and point it to the `gh-pages` branch.

## License

MIT — use it, learn from it, improve it.
