import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SecLab Nigeria — Cybersecurity Tools, CTF & Training',
  description: 'Nigerian cybersecurity platform. Free CTF challenges, free courses, and vulnerability recon scanner. Built for the security community in Africa.',
  keywords: 'cybersecurity, CTF, pentesting, web security, Nigeria, ethical hacking, bug bounty',
  authors: [{ name: 'Muhammad Aminu Musa' }],
  openGraph: {
    title: 'SecLab Nigeria — Cybersecurity Tools, CTF & Training',
    description: 'Nigerian cybersecurity platform. Free CTF challenges, free courses, and vulnerability recon scanner.',
    type: 'website',
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="%2306b6d4" stroke-width="1.5" fill="rgba(6,182,212,0.1)"/><path d="M9 14L12 17L19 10" stroke="%2306b6d4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}