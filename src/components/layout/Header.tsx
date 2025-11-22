'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Prompt - 8
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link href="/feed" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                Feed
              </Link>
              <Link href="/" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                Explore
              </Link>
              <Link href="/marketplace" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                Marketplace
              </Link>
              <Link href="/creator" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                Creator Studio
              </Link>
            </nav>
          </div>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-indigo-400"
                >
                  <Search className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-indigo-400"
                >
                  <Bell className="w-5 h-5" />
                </Button>
                <Link href="/profile">
                  <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all">
                    {session.user?.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                  </Avatar>
                </Link>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="ghost" className="text-gray-300 hover:bg-gray-800 text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/feed"
                className="text-gray-300 hover:text-indigo-400 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Feed
              </Link>
              <Link
                href="/"
                className="text-gray-300 hover:text-indigo-400 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                href="/marketplace"
                className="text-gray-300 hover:text-indigo-400 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                href="/creator"
                className="text-gray-300 hover:text-indigo-400 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Creator Studio
              </Link>
              <div className="border-t border-gray-800 pt-4 space-y-3">
                {session ? (
                  <div className="flex items-center gap-3">
                    {session.user?.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <p className="text-sm text-gray-100 font-medium">{session.user?.name}</p>
                      <p className="text-xs text-gray-400">{session.user?.email}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-gray-700 text-gray-300">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
