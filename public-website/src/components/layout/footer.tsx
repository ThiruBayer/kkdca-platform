import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, ExternalLink, Download } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Rainbow top bar */}
      <div className="h-1 rainbow-bar" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-400">
                <Image
                  src="/images/logo/KKDCA_LOGO.jpg"
                  alt="KKDCA Logo"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <span className="font-bold text-white text-lg block">KKDCA</span>
                <span className="text-xs text-gray-500">Est. 2019</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Kallakurichi District Chess Association - The official governing body for chess
              activities in Kallakurichi District, affiliated with TNSCA &amp; AICF.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-yellow-400 transition-colors">About KKDCA</Link></li>
              <li><Link href="/tournaments" className="hover:text-yellow-400 transition-colors">Tournaments</Link></li>
              <li><Link href="/players" className="hover:text-yellow-400 transition-colors">Players</Link></li>
              <li><Link href="/associations" className="hover:text-yellow-400 transition-colors">Taluk Associations</Link></li>
              <li><Link href="/academies" className="hover:text-yellow-400 transition-colors">Chess Academies</Link></li>
              <li><Link href="/news" className="hover:text-yellow-400 transition-colors">News &amp; Updates</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-5">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/images/downloads/LawsOfChess.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                  <Download className="h-3.5 w-3.5" /> Laws of Chess
                </a>
              </li>
              <li>
                <a href="/images/downloads/District Tournament Bidform.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                  <Download className="h-3.5 w-3.5" /> District Tournament Bid Form
                </a>
              </li>
              <li>
                <a href="/images/downloads/State Tournament Bidform.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                  <Download className="h-3.5 w-3.5" /> State Tournament Bid Form
                </a>
              </li>
              <li>
                <a href="https://www.tnsca.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" /> TNSCA
                </a>
              </li>
              <li>
                <a href="https://www.aicf.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" /> AICF
                </a>
              </li>
              <li>
                <a href="https://www.fide.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" /> FIDE
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-pink-400 flex-shrink-0" />
                <span>24C, Anna Nagar, Kallakurichi,<br />Tamil Nadu, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <a href="tel:+918760289729" className="hover:text-yellow-400 transition-colors">+91 87602 89729</a>
                  <span className="text-xs text-gray-500 block">A. Ravichandran (Secretary)</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:kallaichess@gmail.com" className="hover:text-yellow-400 transition-colors">kallaichess@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Kallakurichi District Chess Association (KKDCA). All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link>
            <Link href="https://register.kallaichess.com/register" className="hover:text-yellow-400 transition-colors">Register</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
