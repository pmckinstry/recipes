'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function TopNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const getLinkClasses = (path: string) => {
    const baseClasses = 'inline-flex items-center px-1 pt-1 text-sm font-medium';
    const isActive = pathname === path;
    const stateClasses = isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600';
    return `${baseClasses} ${stateClasses}`;
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
              className={getLinkClasses('/')}
            >
              Home
            </Link>
            <Link
              href="/recipes"
              className={getLinkClasses('/recipes')}
            >
              Recipes
            </Link>
            <Link
              href="/labels"
              className={getLinkClasses('/labels')}
            >
              Labels
            </Link>
            <Link
              href="/help"
              className={getLinkClasses('/help')}
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
                  <Link
                    href="/profile"
                    className={`text-sm font-medium ${pathname === '/profile' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                  >
                    {session.user?.name || session.user?.email}
                  </Link>
                </div>
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