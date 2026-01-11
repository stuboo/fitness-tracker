'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PenSquare, Calendar, TrendingUp } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Entry', Icon: PenSquare },
    { href: '/heatmap', label: 'Heatmap', Icon: Calendar },
    { href: '/trends', label: 'Trends', Icon: TrendingUp },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass safe-area-inset-bottom z-50 border-t border-white/20">
      <div className="flex justify-around max-w-2xl mx-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.Icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative flex-1 flex flex-col items-center py-4 transition-all duration-300"
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-[var(--focus-indigo)] to-transparent rounded-full animate-slide-up" />
              )}

              {/* Icon Container */}
              <div
                className={`relative mb-1.5 transition-all duration-300 ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
              >
                <Icon
                  className={`w-6 h-6 transition-colors duration-300 ${
                    isActive ? 'text-[var(--focus-indigo)]' : 'text-gray-400'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />

                {/* Active Glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-[var(--focus-indigo)] opacity-20 blur-lg rounded-full animate-pulse" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? 'text-[var(--focus-indigo)]'
                    : 'text-gray-500'
                }`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
