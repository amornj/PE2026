'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Activity, Calculator, ClipboardList, BookOpen, Home, MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/assessment', label: 'Assessment', icon: ClipboardList },
  { href: '/calculators', label: 'Calculators', icon: Calculator },
  { href: '/reference', label: 'Reference', icon: BookOpen },
  { href: '/chat', label: 'Ask PE Guide', icon: MessageCircle },
];

export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/40 transition-opacity duration-200',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-200',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-label="Mobile navigation"
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
          <span className="flex items-center gap-2 font-semibold text-gray-900">
            <Activity className="h-5 w-5 text-blue-600" aria-hidden="true" />
            PE2026 Guide
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ul className="space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
