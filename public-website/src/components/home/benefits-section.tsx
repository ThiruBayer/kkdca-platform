'use client';

import { motion } from 'framer-motion';
import { Brain, Lightbulb, Clock, BookOpen, GraduationCap, Heart } from 'lucide-react';

const benefits = [
  {
    icon: Brain,
    title: 'Strategic Thinking',
    description:
      'Chess teaches planning ahead, evaluating options, and making calculated decisions that transfer to academics and life.',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Lightbulb,
    title: 'Problem-Solving Skills',
    description:
      'Every chess position is a puzzle. Players learn to analyze complex situations and find creative solutions.',
    gradient: 'from-amber-500 to-yellow-500',
  },
  {
    icon: Clock,
    title: 'Patience & Discipline',
    description:
      'Chess requires focus, patience, and disciplined thinking. Children develop better attention spans and self-control.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BookOpen,
    title: 'Memory & Concentration',
    description:
      'Regular chess practice improves memory, concentration, and cognitive abilities in children and adults alike.',
    gradient: 'from-cyan-500 to-teal-600',
  },
  {
    icon: GraduationCap,
    title: 'Academic Performance',
    description:
      'Studies show chess players perform better in mathematics, reading comprehension, and critical thinking.',
    gradient: 'from-gold-500 to-amber-500',
  },
  {
    icon: Heart,
    title: 'Sportsmanship & Social Skills',
    description:
      'Chess teaches graceful winning and losing, respect for opponents, and builds lasting friendships.',
    gradient: 'from-teal-600 to-emerald-500',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function BenefitsSection() {
  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-br from-primary-50 via-white to-secondary-50/30 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="flex justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-full bg-teal-100 px-4 py-1.5 text-sm font-semibold text-teal-700 ring-1 ring-teal-200"
          >
            Why Chess?
          </motion.span>
        </div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
        >
          Benefits of Learning Chess
        </motion.h2>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${benefit.gradient}`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
