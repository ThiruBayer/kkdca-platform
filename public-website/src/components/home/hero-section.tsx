'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trophy, Users, Star, ChevronDown, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Vibrant multi-color background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900" />

      {/* Chess pattern overlay */}
      <div className="absolute inset-0 bg-chess-pattern opacity-20" />

      {/* Colorful accent blobs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-pink-500/25 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-pink-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-yellow-500/30">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Established 2019 &bull; Affiliated with TNSCA &amp; AICF
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Kallakurichi District
              <span className="block gradient-text mt-2">Chess Association</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-blue-100 max-w-xl mb-8 leading-relaxed">
              Nurturing the next generation of chess champions across 6 taluks
              in Kallakurichi District, Tamil Nadu. Join us and be part of the chess revolution.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="https://register.kallaichess.com/register"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 rounded-xl hover:from-yellow-300 hover:via-orange-300 hover:to-pink-400 transition-all shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02]"
              >
                Register Now
              </Link>
              <Link
                href="/tournaments"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all hover:border-yellow-400/50"
              >
                View Tournaments
              </Link>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-xl mb-2 mx-auto border border-yellow-500/20">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-xs text-blue-200">Tournaments</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-xl mb-2 mx-auto border border-emerald-500/20">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-xs text-blue-200">Players</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-xl mb-2 mx-auto border border-pink-500/20">
                  <Star className="w-5 h-5 text-pink-400" />
                </div>
                <div className="text-2xl font-bold text-white">6</div>
                <div className="text-xs text-blue-200">Taluk Associations</div>
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
              {/* Main logo with colorful border */}
              <div className="relative w-80 h-80 rounded-3xl overflow-hidden border-4 border-yellow-400/40 shadow-2xl shadow-purple-500/20 animate-float">
                <Image
                  src="/images/logo/KKDCA_LOGO.jpg"
                  alt="KKDCA Logo"
                  fill
                  className="object-contain bg-white p-4"
                  priority
                />
              </div>

              {/* Floating tournament image */}
              <div className="absolute -bottom-8 -left-12 w-40 h-28 rounded-xl overflow-hidden border-4 border-pink-400/40 shadow-xl shadow-pink-500/20">
                <Image
                  src="/images/gallery/chesstournament.jfif"
                  alt="Chess Tournament"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating chess activity image */}
              <div className="absolute -top-6 -right-10 w-36 h-28 rounded-xl overflow-hidden border-4 border-emerald-400/40 shadow-xl shadow-emerald-500/20">
                <Image
                  src="/images/gallery/chessboardsponsor_govtschool.jfif"
                  alt="Chess in Schools"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Decorative colored circles */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full opacity-60 animate-bounce" />
              <div className="absolute -bottom-2 right-4 w-6 h-6 bg-pink-500 rounded-full opacity-50 animate-pulse" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-yellow-400/60" />
      </div>
    </section>
  );
}
