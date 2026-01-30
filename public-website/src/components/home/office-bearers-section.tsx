'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

const officeBearers = [
  {
    name: 'Sridhar G',
    designation: 'Honorary President',
    image: '/images/office-bearers/honorablepresident_1.jpg',
  },
  {
    name: 'Nalli Shanmugam',
    designation: 'Honorary President',
    image: '/images/office-bearers/honorablepresident_2.jpg',
  },
  {
    name: 'V. Palani',
    designation: 'President',
    phone: '9442890289',
    image: '/images/office-bearers/president.jpg',
  },
  {
    name: 'A. Ravichandran',
    designation: 'Secretary',
    phone: '8760289729',
    image: '/images/office-bearers/secreatary.jpg',
  },
  {
    name: 'M. Azhwar',
    designation: 'Treasurer',
    phone: '9486935444',
    image: '/images/office-bearers/treasurer.jpg',
  },
];

export function OfficeBearersSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-primary-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 text-primary-600 font-semibold mb-4 bg-primary-50 px-4 py-1.5 rounded-full text-sm">
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
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full p-[3px]">
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
                <p className="text-sm text-primary-600 font-medium mb-1">{person.designation}</p>
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
