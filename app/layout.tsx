import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SecLab Nigeria — Interactive Cybersecurity Lab',
  description: 'Live security demos, CTF writeups, and cybersecurity tools. Built by a Nigerian security professional.',
  keywords: 'cybersecurity, CTF, XSS, cipher, hash, Nigeria, hacking, security tools',
  authors: [{ name: 'Muhammad Aminu Musa' }],
  openGraph: {
    title: 'SecLab Nigeria',
    description: 'Interactive cybersecurity demos and CTF writeups',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
