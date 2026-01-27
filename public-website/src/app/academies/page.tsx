'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { MapPin, Star, Users, Phone, Search, GraduationCap, CheckCircle } from 'lucide-react';

const fetchAcademies = async (params: Record<string, string>) => {
  const searchParams = new URLSearchParams(params);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/academies?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch academies');
  return response.json();
};

interface Academy {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  taluk: string;
  rating: number;
  totalStudents: number;
  logo?: string;
  isVerified: boolean;
  contactPhone?: string;
  contactEmail?: string;
  facilities: string[];
}

export default function AcademiesPage() {
  const [search, setSearch] = useState('');
  const [taluk, setTaluk] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['academies', { search, taluk }],
    queryFn: () => fetchAcademies({
      ...(search && { search }),
      ...(taluk && { taluk }),
    }),
  });

  const academies: Academy[] = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Chess Academies</h1>
            <p className="text-xl text-primary-100">
              Find registered chess academies in Kallakurichi to begin or continue your chess journey
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search academies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <select
              value={taluk}
              onChange={(e) => setTaluk(e.target.value)}
              className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Taluks</option>
              <option value="KLK">Kallakurichi</option>
              <option value="CHI">Chinnasalem</option>
              <option value="ULU">Ulundurpet</option>
              <option value="SAN">Sankarapuram</option>
              <option value="TIR">Tirukovilur</option>
              <option value="KAL">Kalrayan Hills</option>
            </select>
          </div>
        </div>
      </section>

      {/* Academy List */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl border animate-pulse h-80" />
              ))}
            </div>
          ) : academies.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Academies Found
              </h3>
              <p className="text-gray-600 mb-6">
                {search || taluk
                  ? 'Try adjusting your filters'
                  : 'Academies will be listed here once registered'}
              </p>
              <Link
                href="https://register.kallaichess.com/register?role=academy"
                className="text-primary-600 font-medium hover:text-primary-700"
              >
                Register your academy
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {academies.map((academy) => (
                <div
                  key={academy.id}
                  className="bg-white rounded-xl border hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="h-32 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center relative">
                    {academy.isVerified && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                    {academy.logo ? (
                      <img
                        src={academy.logo}
                        alt={academy.name}
                        className="h-20 w-20 object-contain"
                      />
                    ) : (
                      <GraduationCap className="w-16 h-16 text-white/80" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                      {academy.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= academy.rating
                              ? 'text-accent-500 fill-accent-500'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-1">
                        ({academy.rating.toFixed(1)})
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {academy.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{academy.city}, {academy.taluk}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{academy.totalStudents}+ students trained</span>
                      </div>
                      {academy.contactPhone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{academy.contactPhone}</span>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/academies/${academy.id}`}
                      className="block w-full text-center py-2.5 bg-primary-50 text-primary-600 font-medium rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Register CTA */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-accent-400 to-accent-500 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-4">
              Run a Chess Academy?
            </h2>
            <p className="text-primary-800 mb-8 max-w-2xl mx-auto">
              Register your academy with KDCA to get verified status, appear in our directory,
              and connect with students looking to learn chess.
            </p>
            <Link
              href="https://register.kallaichess.com/register?role=academy"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-900 text-white font-semibold rounded-lg hover:bg-primary-800 transition-colors"
            >
              Register Your Academy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
