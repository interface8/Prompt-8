'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              PromptSearch
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Discover, create, and monetize high-quality AI prompts across all domains.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Explore Prompts</Link></li>
              <li><Link href="/marketplace" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Marketplace</Link></li>
              <li><Link href="/creator" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Creator Studio</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Tutorials</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">API</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">About</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Privacy</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400 text-center">
            © {currentYear} PromptSearch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
