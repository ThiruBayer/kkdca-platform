'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';

const fetchNews = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/news?limit=3`);
  if (!response.ok) throw new Error('Failed to fetch news');
  return response.json();
};

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  publishedAt: string;
  category: string;
  slug: string;
}

export function NewsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['latest-news'],
    queryFn: fetchNews,
  });

  const news: NewsItem[] = data?.data || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Latest News & Updates
            </h2>
            <p className="text-gray-600">
              Stay updated with the latest happenings in Kallakurichi chess
            </p>
          </div>
          <Link
            href="/news"
            className="hidden sm:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            View all news
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl animate-pulse h-80" />
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border">
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No News Yet
            </h3>
            <p className="text-gray-600">
              Check back soon for the latest updates and announcements!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/news/${item.slug}`}>
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4">
                    {item.featuredImage ? (
                      <img
                        src={item.featuredImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                        <Newspaper className="w-12 h-12 text-primary-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(item.publishedAt)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {item.excerpt}
                  </p>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        <Link
          href="/news"
          className="sm:hidden flex items-center justify-center gap-2 mt-8 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
        >
          View all news
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
