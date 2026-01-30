'use client';

import { motion } from 'framer-motion';
import { Trophy, School, GraduationCap, Clock, Star, Globe } from 'lucide-react';

const milestones = [
  {
    year: '2007',
    title: 'Chess Foundation Established',
    description:
      'A. Ravichandran established the Chess Foundation in Kallakurichi (then under Villupuram District). V. Palani served as President, A. Ravichandran as Secretary, and M. Azhwar as Treasurer.',
  },
  {
    year: '2007–2019',
    title: '12 Years of District-Level Leadership',
    description:
      'A. Ravichandran served as Vice President of the Villupuram District Chess Association for 12 years, building a strong chess culture across the region.',
  },
  {
    year: '2019',
    title: 'KKDCA Formally Established',
    description:
      'When Kallakurichi was carved out as a separate district, the Kallakurichi District Chess Association (KKDCA) was formally established to serve the new district.',
  },
  {
    year: '2022',
    title: 'Historic Olympiad Milestone',
    description:
      'KKDCA achieved the highest participation from any district in Tamil Nadu during the 44th International Chess Olympiad trials in Chennai. TNSCA awarded special recognition for this achievement.',
  },
  {
    year: '',
    title: 'World Record Event',
    description:
      'Organized a landmark event featuring 3,065 international chess boards, setting a world record and putting Kallakurichi on the global chess map.',
  },
  {
    year: '',
    title: 'Government School Support',
    description:
      'In collaboration with Corona Academy and Eye Tex company, KKDCA provided chessboards to 450 government schools across the district.',
  },
  {
    year: '',
    title: 'Free Training Initiative',
    description:
      'Secretary A. Ravichandran provides free chess training to over 100 government schools, nurturing talent at the grassroots level.',
  },
  {
    year: '',
    title: 'Digital Platform Launch',
    description:
      'KKDCA established a digital platform with the vision of making Kallakurichi a chess hub, enabling online registrations, ratings, and tournament management.',
  },
];

const stats = [
  {
    icon: Globe,
    value: '3,065',
    label: 'Chess Boards',
    subtitle: 'World Record Event',
  },
  {
    icon: School,
    value: '450+',
    label: 'Schools',
    subtitle: 'Chessboards Donated',
  },
  {
    icon: GraduationCap,
    value: '100+',
    label: 'Schools',
    subtitle: 'Free Training',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const statVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HistorySection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Badge + Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <span className="inline-block rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-semibold text-teal-700">
            <Clock className="mr-1.5 inline-block h-4 w-4 -translate-y-px" />
            Our Journey
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            History of <span className="text-teal-700">KKDCA</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-500">
            From a small chess foundation to a district-wide movement transforming lives through chess.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="relative ml-4 border-l-2 border-teal-200 pl-8 sm:ml-8 sm:pl-10"
        >
          {milestones.map((m, i) => (
            <motion.div key={i} variants={itemVariants} className="relative mb-10 last:mb-0">
              {/* Dot */}
              <span className="absolute -left-[calc(2rem+5px)] top-1.5 flex h-3 w-3 items-center justify-center sm:-left-[calc(2.5rem+5px)]">
                <span className="h-3 w-3 rounded-full bg-teal-500 ring-4 ring-teal-100" />
              </span>

              {m.year && (
                <span className="mb-1 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                  {m.year}
                </span>
              )}
              {!m.year && (
                <span className="mb-1 inline-block rounded bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-800">
                  <Star className="mr-1 inline-block h-3 w-3 -translate-y-px" />
                  Milestone
                </span>
              )}
              <h3 className="mt-1 text-lg font-semibold text-gray-900">{m.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{m.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievement Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-16 grid gap-6 sm:grid-cols-3"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={statVariants}
              className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-6 text-center shadow-sm"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <s.icon className="h-6 w-6" />
              </div>
              <p className="text-3xl font-extrabold text-teal-700">{s.value}</p>
              <p className="text-sm font-semibold text-gray-900">{s.label}</p>
              <p className="mt-0.5 text-xs text-gray-500">{s.subtitle}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
