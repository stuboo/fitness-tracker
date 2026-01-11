'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Entry', icon: '📝' },
    { href: '/heatmap', label: 'Heatmap', icon: '📅' },
    { href: '/trends', label: 'Trends', icon: '📊' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-50">
      <div className="flex justify-around max-w-md mx-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex-1 flex flex-col items-center py-3 transition-colors ${
              pathname === link.href ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <span className="text-2xl mb-1">{link.icon}</span>
            <span className="text-xs font-medium">{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
