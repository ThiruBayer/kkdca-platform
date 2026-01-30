'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    color: 'bg-primary-100 text-primary-600',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Organizing FIDE-rated tournaments and nurturing talent to compete at state, national, and international levels.',
    color: 'bg-secondary-100 text-secondary-600',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building a vibrant chess community across all 6 taluks with active associations and training academies.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: BookOpen,
    title: 'Education',
    description: 'Partnering with schools to introduce chess as part of curriculum and develop cognitive skills in young minds.',
    color: 'bg-saffron-100 text-saffron-600',
  },
];

export function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 text-primary-600 font-semibold mb-4 bg-primary-50 px-4 py-1.5 rounded-full text-sm">
                About KKDCA
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Nurturing Chess Excellence in{' '}
                <span className="text-primary-600">Kallakurichi</span>
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg"
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
                className="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all group border border-gray-100"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
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
