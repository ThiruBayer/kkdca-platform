'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserPlus, Building2, ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-800 via-primary-900 to-primary-800 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-saffron-500/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Join the Kallakurichi Chess Community
            </h2>
            <p className="text-primary-200 max-w-2xl mx-auto text-lg">
              Whether you&apos;re a player looking to compete or an academy wanting to
              connect with talented students, KKDCA is your gateway.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 text-center hover:shadow-2xl transition-all group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <UserPlus className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Register as Player
            </h3>
            <p className="text-gray-600 mb-6">
              Create your KKDCA player profile, participate in tournaments,
              track your progress, and connect with the chess community.
            </p>
            <Link
              href="https://register.kallaichess.com/register?role=player"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-md"
            >
              Register Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 text-center hover:shadow-2xl transition-all group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Building2 className="w-8 h-8 text-secondary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Register Academy
            </h3>
            <p className="text-gray-600 mb-6">
              List your chess academy with KKDCA, get verified status,
              attract students, and participate in district programs.
            </p>
            <Link
              href="https://register.kallaichess.com/register?role=academy"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-semibold rounded-xl hover:from-secondary-600 hover:to-secondary-700 transition-all shadow-md"
            >
              Register Academy
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
