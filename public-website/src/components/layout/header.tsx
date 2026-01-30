'use client';

import Link from 'next/link';
import Image from 'next/image';
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
      { name: 'Taluk Associations', href: '/associations' },
      { name: 'Chess Academies', href: '/academies' },
    ],
  },
  { name: 'News', href: '/news' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      {/* Rainbow top bar */}
      <div className="h-1 rainbow-bar" />

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-orange-400 shadow-md shadow-orange-200">
              <Image
                src="/images/logo/KKDCA_LOGO.jpg"
                alt="KKDCA Logo"
                width={44}
                height={44}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <span className="font-extrabold bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent text-lg leading-none">KKDCA</span>
              <span className="hidden md:block text-[11px] text-gray-500 leading-tight">
                Kallakurichi District Chess Association
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.name} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all"
                  >
                    {item.name}
                    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all"
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
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    pathname === item.href
                      ? 'text-purple-700 bg-purple-50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* CTA buttons */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <Link
              href="https://register.kallaichess.com/login"
              className="text-sm font-medium text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all"
            >
              Login
            </Link>
            <Link
              href="https://register.kallaichess.com/register"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-lg hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              Register Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-xl">
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
                      className="block px-6 py-2.5 text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
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
                  className={`block px-4 py-2.5 text-base font-medium rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-purple-50 text-purple-700'
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
                className="block px-4 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Login
              </Link>
              <Link
                href="https://register.kallaichess.com/register"
                className="block px-4 py-2.5 text-base font-semibold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-lg text-center shadow-md"
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
