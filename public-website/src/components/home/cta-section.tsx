'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserPlus, Building2, ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Join the Kallakurichi Chess Community
            </h2>
            <p className="text-primary-100 max-w-2xl mx-auto text-lg">
              Whether you're a player looking to compete or an academy wanting to
              connect with talented students, KDCA is your gateway.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-shadow"
          >
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Register as Player
            </h3>
            <p className="text-gray-600 mb-6">
              Create your KDCA player profile, participate in tournaments,
              track your progress, and connect with the chess community.
            </p>
            <Link
              href="https://register.kallaichess.com/register?role=player"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Register Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-shadow"
          >
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-8 h-8 text-accent-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Register Academy
            </h3>
            <p className="text-gray-600 mb-6">
              List your chess academy with KDCA, get verified status,
              attract students, and participate in district programs.
            </p>
            <Link
              href="https://register.kallaichess.com/register?role=academy"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-primary-900 font-semibold rounded-lg hover:bg-accent-400 transition-colors"
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
