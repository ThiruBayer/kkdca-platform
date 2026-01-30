'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const galleryImages = [
  { src: '/images/gallery/image9.png', alt: 'Kallakurichi Chess Foundation - Prize Distribution', span: 'col-span-2', color: 'from-yellow-500/80 to-orange-500/80' },
  { src: '/images/gallery/chesstournament.jfif', alt: 'Chess Tournament in Progress', span: '', color: 'from-blue-500/80 to-indigo-500/80' },
  { src: '/images/gallery/chessboardsponsor_govtschool.jfif', alt: 'Chess Boards for Government Schools', span: '', color: 'from-emerald-500/80 to-teal-500/80' },
  { src: '/images/gallery/image10.png', alt: 'Award Ceremony', span: '', color: 'from-pink-500/80 to-purple-500/80' },
  { src: '/images/gallery/image12.jpg', alt: 'Tournament Participants', span: '', color: 'from-orange-500/80 to-red-500/80' },
  { src: '/images/gallery/image13.jpg', alt: 'Chess Tournament Group Photo', span: 'col-span-2', color: 'from-purple-500/80 to-indigo-500/80' },
];

export function GallerySection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 text-orange-600 font-semibold mb-4 bg-orange-50 px-4 py-1.5 rounded-full text-sm border border-orange-200">
              Gallery
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Moments of <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Excellence</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Highlights from our tournaments, school programs, and community events across Kallakurichi district
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((img, index) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              className={`${img.span} relative aspect-video rounded-2xl overflow-hidden group cursor-pointer`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${img.color} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium">{img.alt}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
