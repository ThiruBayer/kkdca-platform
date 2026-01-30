'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

const officeBearers = [
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
    gradient: 'from-pink-500 to-purple-600',
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

export function OfficeBearersSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 text-indigo-600 font-semibold mb-4 bg-indigo-50 px-4 py-1.5 rounded-full text-sm border border-indigo-200">
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

        <div className="flex flex-wrap justify-center gap-8">
          {officeBearers.map((person, index) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group w-48"
            >
              <div className="relative mx-auto w-36 h-36 mb-4">
                <div className={`absolute inset-0 bg-gradient-to-br ${person.gradient} rounded-full p-[3px] shadow-lg`}>
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <Image
                      src={person.image}
                      alt={person.name}
                      width={144}
                      height={144}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-gray-900 text-base">{person.name}</h3>
                <p className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium mb-1">{person.designation}</p>
                {person.phone && (
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <Phone className="w-3 h-3" />
                    {person.phone}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
