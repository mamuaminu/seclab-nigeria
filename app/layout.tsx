import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SecLab Nigeria — Cybersecurity Tools, CTF & Training',
  description: 'Interactive security demos, CTF challenges, training courses, and vulnerability recon. Built for the security community.',
  keywords: 'cybersecurity, CTF, pentesting, web security, SQL injection, XSS, bug bounty, Nigeria',
  authors: [{ name: 'Muhammad Aminu Musa' }],
  openGraph: {
    title: 'SecLab Nigeria',
    description: 'Cybersecurity tools, CTF challenges, and training — by Muhammad Aminu Musa',
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