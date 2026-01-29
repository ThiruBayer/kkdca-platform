'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Players', href: '/players' },
  { name: 'Tournaments', href: '/tournaments' },
  {
    name: 'Organizations',
    href: '#',
    children: [
      { name: 'Associations', href: '/associations' },
      { name: 'Academies', href: '/academies' },
    ],
  },
  { name: 'News', href: '/news' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-gray-900">KKDCA</span>
              <span className="hidden md:inline text-gray-500 text-sm ml-2">
                Kallakurichi District Chess Association
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-6">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.name} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    {item.name}
                    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-lg shadow-lg border py-1 z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* CTA buttons */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <Link
              href="https://register.kallaichess.com/login"
              className="text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              Login
            </Link>
            <Link
              href="https://register.kallaichess.com/register"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Register Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b">
          <div className="px-4 py-4 space-y-1">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.name}>
                  <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {item.name}
                  </p>
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className="block px-6 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-2 text-base font-medium rounded-lg ${
                    pathname === item.href
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            )}
            <div className="pt-4 space-y-2 border-t mt-2">
              <Link
                href="https://register.kallaichess.com/login"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Login
              </Link>
              <Link
                href="https://register.kallaichess.com/register"
                className="block px-4 py-2 text-base font-medium text-white bg-primary-600 rounded-lg text-center"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
