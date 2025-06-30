'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function TopNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
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

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
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
          
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="text-gray-500">Loading...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700">
                    {session.user?.name || session.user?.email}
                  </span>
                </div>
                <Link
                  href="/profile"
                  className={`text-sm ${isActive('/profile')}`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-600 hover:text-indigo-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm text-gray-600 hover:text-indigo-600"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 