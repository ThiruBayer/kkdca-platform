'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target, Award, Users, BookOpen } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'To promote chess as a tool for intellectual development and bring world-class chess infrastructure to Kallakurichi district.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description:
      'Organizing FIDE-rated tournaments and nurturing talent to compete at state, national, and international levels.',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'Building a vibrant chess community across all 6 taluks with active associations and training academies.',
  },
  {
    icon: BookOpen,
    title: 'Education',
    description:
      'Partnering with schools to introduce chess as part of curriculum and develop cognitive skills in young minds.',
  },
];

export function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary-600 font-semibold mb-2 block">
                About KDCA
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Nurturing Chess Excellence in Kallakurichi
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                The Kallakurichi District Chess Association (KDCA) is the official
                governing body for chess activities in Kallakurichi district,
                affiliated with the Tamil Nadu State Chess Association (TNSCA)
                and All India Chess Federation (AICF).
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Since our establishment, we have been dedicated to promoting chess
                at the grassroots level, organizing quality tournaments, and
                producing players who have represented our district at various
                prestigious platforms.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Learn More About Us
              </Link>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
