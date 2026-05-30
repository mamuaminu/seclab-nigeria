# SecLab Nigeria

> Nigeria's Premier Cybersecurity Lab — interactive demos, CTF writeups, and open-source security tools.

[Live Site](https://mamuaminu.github.io/seclab-nigeria) · [mamuaminu](https://github.com/mamuaminu)

---

## What is this?

SecLab Nigeria is a cybersecurity portal with live, working demos. Every tool on the site runs directly in the browser — no sign-up, no server calls.

---

## Live Tools

### 🔓 XSS Simulator
Type or paste XSS payloads and see them execute in real time. Includes quick-payload buttons with explanations. Completely client-side.

### 🔐 Cipher Encoder
Encrypt and decrypt classic ciphers:
- **Caesar** — shift alphabet characters by N positions
- **ROT13** — standard rotation cipher
- **Base64** — encode/decode binary-to-text
- **Reverse** — character reversal cipher

### #️⃣ Hash Identifier
Paste any cryptographic hash and get instant analysis:
- Hash type detection (MD5, SHA-1, SHA-256, SHA-384, SHA-512, Bcrypt, etc.)
- Strength assessment
- Common length reference table

---

## CTF Writeups

Detailed walkthroughs of challenges from HackTheBox, PortSwigger Academy, CTFlearn, and NepFest. Each covers step-by-step exploitation, key commands, and tooling.

---

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

The repo includes a GitHub Actions workflow that deploys on every push to `main`. Enable GitHub Pages in repo settings pointing to the `gh-pages` branch.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** GitHub Pages (CI via GitHub Actions)

---

## License

MIT — use it, learn from it, improve it.
