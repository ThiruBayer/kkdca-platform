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

const newsColors = [
  { badge: 'bg-purple-50 text-purple-700 border border-purple-200', placeholder: 'from-purple-400 to-pink-500' },
  { badge: 'bg-blue-50 text-blue-700 border border-blue-200', placeholder: 'from-blue-400 to-indigo-500' },
  { badge: 'bg-orange-50 text-orange-700 border border-orange-200', placeholder: 'from-orange-400 to-red-500' },
];

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
            <span className="inline-flex items-center gap-2 text-pink-600 font-semibold mb-3 bg-pink-50 px-4 py-1.5 rounded-full text-sm border border-pink-200">
              Updates
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Latest News & Updates
            </h2>
            <p className="text-gray-600">
              Stay updated with the latest happenings in Kallakurichi chess
            </p>
          </div>
          <Link
            href="/news"
            className="hidden sm:flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
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
          <div className="text-center py-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-dashed border-purple-200">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Newspaper className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No News Yet
            </h3>
            <p className="text-gray-600">
              Check back soon for the latest updates and announcements!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {news.map((item, index) => {
              const colors = newsColors[index % newsColors.length];
              return (
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
                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${colors.placeholder}`}>
                          <Newspaper className="w-12 h-12 text-white/80" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 ${colors.badge} text-xs font-medium rounded-full`}>
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.excerpt}
                    </p>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        )}

        <Link
          href="/news"
          className="sm:hidden flex items-center justify-center gap-2 mt-8 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
        >
          View all news
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
