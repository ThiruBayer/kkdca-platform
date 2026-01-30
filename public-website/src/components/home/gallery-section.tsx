'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const galleryImages = [
  { src: '/images/gallery/image9.png', alt: 'Kallakurichi Chess Foundation - Prize Distribution', span: 'col-span-2' },
  { src: '/images/gallery/chesstournament.jfif', alt: 'Chess Tournament in Progress', span: '' },
  { src: '/images/gallery/chessboardsponsor_govtschool.jfif', alt: 'Chess Boards for Government Schools', span: '' },
  { src: '/images/gallery/image10.png', alt: 'Award Ceremony', span: '' },
  { src: '/images/gallery/image12.jpg', alt: 'Tournament Participants', span: '' },
  { src: '/images/gallery/image13.jpg', alt: 'Chess Tournament Group Photo', span: 'col-span-2' },
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
            <span className="inline-flex items-center gap-2 text-saffron-600 font-semibold mb-4 bg-saffron-50 px-4 py-1.5 rounded-full text-sm">
              Gallery
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Moments of <span className="text-saffron-600">Excellence</span>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
