'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Activity, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileNav } from './MobileNav';

const navLinks = [
  { href: '/assessment', label: 'Assessment' },
  { href: '/calculators', label: 'Calculators' },
  { href: '/reference', label: 'Reference' },
  { href: '/chat', label: 'Ask PE Guide' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900">
            <Activity className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <span className="text-base">PE2026 Guide</span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 sm:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
