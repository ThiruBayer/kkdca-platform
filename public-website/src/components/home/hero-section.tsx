'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trophy, Users, Star, ChevronDown } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />

      {/* Chess pattern overlay */}
      <div className="absolute inset-0 bg-chess-pattern opacity-30" />

      {/* Colorful accent blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-secondary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-saffron-500/15 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-secondary-500/20 text-secondary-300 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-secondary-500/30">
              <span className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse" />
              Established 2019 &bull; Affiliated with TNSCA &amp; AICF
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Kallakurichi District
              <span className="block gradient-text mt-2">Chess Association</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-gray-300 max-w-xl mb-8 leading-relaxed">
              Nurturing the next generation of chess champions across 6 taluks
              in Kallakurichi District, Tamil Nadu. Join us and be part of the chess revolution.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="https://register.kallaichess.com/register"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-900 bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-xl hover:from-secondary-300 hover:to-secondary-400 transition-all shadow-lg hover:shadow-secondary-500/30 hover:scale-[1.02]"
              >
                Register Now
              </Link>
              <Link
                href="/tournaments"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/25 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all"
              >
                View Tournaments
              </Link>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-secondary-500/20 rounded-lg mb-2 mx-auto">
                  <Trophy className="w-5 h-5 text-secondary-400" />
                </div>
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-xs text-gray-400">Tournaments</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-emerald-500/20 rounded-lg mb-2 mx-auto">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-xs text-gray-400">Players</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-saffron-500/20 rounded-lg mb-2 mx-auto">
                  <Star className="w-5 h-5 text-saffron-400" />
                </div>
                <div className="text-2xl font-bold text-white">6</div>
                <div className="text-xs text-gray-400">Taluk Associations</div>
              </div>
            </div>
          </motion.div>

          {/* Right - Logo and images */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              {/* Main logo */}
              <div className="relative w-80 h-80 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl animate-float">
                <Image
                  src="/images/logo/KKDCA_LOGO.jpg"
                  alt="KKDCA Logo"
                  fill
                  className="object-contain bg-white p-4"
                  priority
                />
              </div>

              {/* Floating tournament image */}
              <div className="absolute -bottom-8 -left-12 w-40 h-28 rounded-xl overflow-hidden border-4 border-white/30 shadow-xl">
                <Image
                  src="/images/gallery/chesstournament.jfif"
                  alt="Chess Tournament"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating chess activity image */}
              <div className="absolute -top-6 -right-10 w-36 h-28 rounded-xl overflow-hidden border-4 border-secondary-400/40 shadow-xl">
                <Image
                  src="/images/gallery/chessboardsponsor_govtschool.jfif"
                  alt="Chess in Schools"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/40" />
      </div>
    </section>
  );
}
