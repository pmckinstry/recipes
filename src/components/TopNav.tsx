'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function TopNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => {
    // Only show active state after component is mounted (client-side)
    if (!mounted) {
      return 'text-gray-600 hover:text-indigo-600';
    }
    return pathname === path ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600';
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link
              href="/"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/')}`}
            >
              Home
            </Link>
            <Link
              href="/recipes"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/recipes')}`}
            >
              Recipes
            </Link>
            <Link
              href="/help"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/help')}`}
            >
              Help
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 