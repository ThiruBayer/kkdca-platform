'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target, Award, Users, BookOpen, CheckCircle } from 'lucide-react';

const achievements = [
  'First place in State-level Chess Tournament (2022)',
  'World Record: 3,065 chess boards in single event',
  '450+ chess boards donated to government schools',
  'Free chess training to 100+ schools',
  'Affiliated with TNSCA, AICF & FIDE',
];

const features = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To promote chess as a tool for intellectual development and bring world-class chess infrastructure to Kallakurichi district.',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    border: 'border-blue-200',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Organizing FIDE-rated tournaments and nurturing talent to compete at state, national, and international levels.',
    gradient: 'from-yellow-500 to-orange-500',
    bg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    border: 'border-yellow-200',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building a vibrant chess community across all 6 taluks with active associations and training academies.',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
  },
  {
    icon: BookOpen,
    title: 'Education',
    description: 'Partnering with schools to introduce chess as part of curriculum and develop cognitive skills in young minds.',
    gradient: 'from-pink-500 to-purple-600',
    bg: 'bg-gradient-to-br from-pink-50 to-purple-50',
    border: 'border-pink-200',
  },
];

export function AboutSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-white via-purple-50/30 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 text-purple-600 font-semibold mb-4 bg-purple-50 px-4 py-1.5 rounded-full text-sm border border-purple-200">
                About KKDCA
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Nurturing Chess Excellence in{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Kallakurichi</span>
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                The Kallakurichi District Chess Association (KKDCA) is the official
                governing body for chess activities in Kallakurichi district,
                affiliated with the Tamil Nadu State Chess Association (TNSCA)
                and All India Chess Federation (AICF).
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in 2019 under the leadership of President V. Palani and
                Secretary A. Ravichandran, KKDCA has rapidly grown into one of the
                most active district chess associations in Tamil Nadu.
              </p>

              {/* Achievements */}
              <div className="space-y-3 mb-8">
                {achievements.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
              >
                Learn More About Us
              </Link>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 ${feature.bg} rounded-2xl hover:shadow-lg transition-all group border ${feature.border}`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
