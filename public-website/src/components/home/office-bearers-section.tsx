'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

interface Bearer {
  name: string;
  designation: string;
  phone?: string;
  image: string;
  gradient: string;
}

const keyBearers: Bearer[] = [
  {
    name: 'Sridhar G',
    designation: 'Honorary President',
    image: '/images/office-bearers/honorablepresident_1.jpg',
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    name: 'Nalli Shanmugam',
    designation: 'Honorary President',
    image: '/images/office-bearers/honorablepresident_2.jpg',
    gradient: 'from-primary-500 to-primary-700',
  },
  {
    name: 'V. Palani',
    designation: 'President',
    phone: '9442890289',
    image: '/images/office-bearers/president.jpg',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'A. Ravichandran',
    designation: 'Secretary',
    phone: '8760289729',
    image: '/images/office-bearers/secreatary.jpg',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'M. Azhwar',
    designation: 'Treasurer',
    phone: '9486935444',
    image: '/images/office-bearers/treasurer.jpg',
    gradient: 'from-orange-500 to-red-500',
  },
];

const vicePresidents: Bearer[] = [
  {
    name: 'Venkatesh E',
    designation: 'Vice President',
    phone: '9787055951',
    image: '/images/office-bearers/vicepresident_1.png',
    gradient: 'from-teal-400 to-cyan-600',
  },
  {
    name: 'Kowsalya B',
    designation: 'Vice President',
    phone: '8754739169',
    image: '/images/office-bearers/vicePresident_2.png',
    gradient: 'from-teal-500 to-emerald-600',
  },
  {
    name: 'Sivasankar G',
    designation: 'Vice President',
    phone: '9443212464',
    image: '/images/office-bearers/vicePresident_3.png',
    gradient: 'from-cyan-500 to-teal-600',
  },
  {
    name: 'Radhakrishnan P',
    designation: 'Vice President',
    phone: '8012655876',
    image: '/images/office-bearers/vicePresident_4.png',
    gradient: 'from-teal-400 to-green-600',
  },
  {
    name: 'Shanmugam M',
    designation: 'Vice President',
    phone: '9443236940',
    image: '/images/office-bearers/vicePresident_5.png',
    gradient: 'from-emerald-400 to-teal-600',
  },
  {
    name: 'Rajendran R',
    designation: 'Vice President',
    phone: '9940883995',
    image: '/images/office-bearers/vicePresident_6.png',
    gradient: 'from-cyan-400 to-teal-600',
  },
];

const jointSecretaries: Bearer[] = [
  {
    name: 'Perumal R',
    designation: 'Joint Secretary',
    phone: '9443988056',
    image: '/images/office-bearers/jointsecretary_1.avif',
    gradient: 'from-teal-400 to-cyan-600',
  },
  {
    name: 'Sathish A',
    designation: 'Joint Secretary',
    phone: '7679908869',
    image: '/images/office-bearers/jointsecretary_2.avif',
    gradient: 'from-teal-500 to-emerald-600',
  },
  {
    name: 'Eswarakrishnan M',
    designation: 'Joint Secretary',
    phone: '9698805976',
    image: '/images/office-bearers/jointsecretary_3.avif',
    gradient: 'from-cyan-500 to-teal-600',
  },
  {
    name: 'Antony Amala Chandran J',
    designation: 'Joint Secretary',
    phone: '9500001444',
    image: '/images/office-bearers/jointsecretary_4.avif',
    gradient: 'from-teal-400 to-green-600',
  },
  {
    name: 'Nagarajan K',
    designation: 'Joint Secretary',
    phone: '9894669632',
    image: '/images/office-bearers/jointsecretary_5.avif',
    gradient: 'from-emerald-400 to-teal-600',
  },
  {
    name: 'Balakrishnan P',
    designation: 'Joint Secretary',
    phone: '9443771374',
    image: '/images/office-bearers/jointsecretary_6.png',
    gradient: 'from-cyan-400 to-teal-600',
  },
];

function BearerCard({ person, size = 'large', index }: { person: Bearer; size?: 'large' | 'medium'; index: number }) {
  const imgSize = size === 'large' ? 'w-36 h-36' : 'w-28 h-28';
  const imgPx = size === 'large' ? 144 : 112;
  const cardWidth = size === 'large' ? 'w-48' : 'w-40';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      viewport={{ once: true }}
      className={`group ${cardWidth}`}
    >
      <div className={`relative mx-auto ${imgSize} mb-3`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${person.gradient} rounded-full p-[3px] shadow-lg`}>
          <div className="w-full h-full rounded-full overflow-hidden bg-white">
            <Image
              src={person.image}
              alt={person.name}
              width={imgPx}
              height={imgPx}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
      <div className="text-center">
        <h3 className={`font-bold text-gray-900 ${size === 'large' ? 'text-base' : 'text-sm'}`}>{person.name}</h3>
        <p className={`bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent font-medium mb-1 ${size === 'large' ? 'text-sm' : 'text-xs'}`}>
          {person.designation}
        </p>
        {person.phone && (
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <Phone className="w-3 h-3" />
            {person.phone}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function OfficeBearersSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-cyan-50 to-secondary-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 text-primary-600 font-semibold mb-4 bg-primary-50 px-4 py-1.5 rounded-full text-sm border border-primary-200">
              Leadership
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              District Office Bearers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated team leading KKDCA&apos;s mission to promote chess excellence across Kallakurichi district
            </p>
          </motion.div>
        </div>

        {/* Key Office Bearers */}
        <div className="mb-14">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xl font-semibold text-gray-700 mb-8"
          >
            Key Office Bearers
          </motion.h3>
          <div className="flex flex-wrap justify-center gap-8">
            {keyBearers.map((person, index) => (
              <BearerCard key={person.name} person={person} size="large" index={index} />
            ))}
          </div>
        </div>

        {/* Vice Presidents */}
        <div className="mb-14">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xl font-semibold text-gray-700 mb-8"
          >
            Vice Presidents
          </motion.h3>
          <div className="flex flex-wrap justify-center gap-6">
            {vicePresidents.map((person, index) => (
              <BearerCard key={person.name} person={person} size="medium" index={index} />
            ))}
          </div>
        </div>

        {/* Joint Secretaries */}
        <div>
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xl font-semibold text-gray-700 mb-8"
          >
            Joint Secretaries
          </motion.h3>
          <div className="flex flex-wrap justify-center gap-6">
            {jointSecretaries.map((person, index) => (
              <BearerCard key={person.name} person={person} size="medium" index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
