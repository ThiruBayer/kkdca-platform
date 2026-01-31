'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Search,
  GraduationCap,
  CheckCircle,
  Clock,
  Award,
  BookOpen,
  Monitor,
  Users,
  ChevronRight,
  Star,
} from 'lucide-react';

interface HardcodedAcademy {
  id: string;
  name: string;
  established: string;
  founder: string;
  founderTitle: string;
  description: string;
  logo: string;
  coachPhoto: string;
  levels?: string[];
  trainingModes?: string[];
  benefits?: string[];
  features?: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  location: string;
  isVerified: boolean;
  approvedBy?: string;
}

const HARDCODED_ACADEMIES: HardcodedAcademy[] = [
  {
    id: 'kallai-chess-academy',
    name: 'Kallai Chess Academy',
    established: 'May 2007',
    founder: 'A. Ravichandran',
    founderTitle: 'TN State Arbiter, Secretary KKDCA',
    description:
      'The first chess academy for kids in Kallakurichi, established in May 2007 by A. Ravichandran. With over 15 years of dedicated coaching, Kallai Chess Academy has been nurturing young chess talent and building a strong chess community in the district.',
    logo: '/images/academies/Kallai Chess Academy logo.avif',
    coachPhoto: '/images/academies/Kallai Chess Academy Coach.avif',
    levels: ['Beginner', 'Intermediate', 'Advanced', 'Rated Players'],
    benefits: ['Strategic thinking', 'Patience', 'Problem-solving skills'],
    contactName: 'A. Ravichandran',
    contactPhone: '8760289729',
    contactEmail: 'ravichess@gmail.com',
    location: '24C, Anna Nagar, Kallakurichi',
    isVerified: true,
    approvedBy: 'KKDCA',
  },
  {
    id: 'master-brain-chess-academy',
    name: 'Master Brain Chess Academy',
    established: '1st February 2024',
    founder: 'Mr. Nagaraj K',
    founderTitle: 'TN State Arbiter, School Instructor',
    description:
      'Approved by KKDCA, Master Brain Chess Academy was founded on 1st February 2024 by Mr. Nagaraj K. The academy offers multiple training modes including offline, online, and one-on-one coaching with dedicated facilities for game practice and engine analysis.',
    logo: '/images/academies/Master Brain Chess Academy logo.avif',
    coachPhoto: '/images/academies/Master Brain Chess Academy Coach.avif',
    trainingModes: ['Offline Classes', 'One-on-One', 'Online Classes', 'Open Classroom'],
    features: [
      'Dedicated game area',
      'Coach monitoring',
      'Chess engine practice',
      'Interactive online classes',
    ],
    approvedBy: 'KKDCA',
    contactName: 'Mr. Nagaraj K',
    contactPhone: '8760289729',
    contactEmail: 'masterbrainchess@gmail.com',
    location: 'Kallakurichi',
    isVerified: true,
  },
];

export default function AcademiesPage() {
  const [search, setSearch] = useState('');

  const filteredAcademies = useMemo(() => {
    if (!search.trim()) return HARDCODED_ACADEMIES;
    const q = search.toLowerCase();
    return HARDCODED_ACADEMIES.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.founder.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-6 h-6 text-teal-400" />
              <span className="text-teal-400 font-semibold tracking-wide uppercase text-sm">
                KKDCA Registered
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Chess{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-yellow-400">
                Academies
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Discover registered chess academies in Kallakurichi district. Learn from experienced
              coaches and build your path from beginner to rated player.
            </p>
          </div>
        </div>
      </section>

      {/* Search / Filter */}
      <section className="py-6 bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search academies by name, coach, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            />
          </div>
        </div>
      </section>

      {/* Academy Cards */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          {filteredAcademies.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Academies Found</h3>
              <p className="text-gray-600">Try adjusting your search query.</p>
            </div>
          ) : (
            filteredAcademies.map((academy) => (
              <div
                key={academy.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Logo */}
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm flex-shrink-0 border-2 border-teal-400/30">
                      <Image
                        src={academy.logo}
                        alt={`${academy.name} logo`}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                          {academy.name}
                        </h2>
                        {academy.isVerified && (
                          <CheckCircle className="w-6 h-6 text-teal-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-300 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          Est. {academy.established}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-yellow-400" />
                          Founded by {academy.founder}
                        </span>
                        {academy.approvedBy && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Approved by {academy.approvedBy}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 md:p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Left: Description & Coach */}
                    <div className="md:col-span-2 space-y-6">
                      <p className="text-gray-700 leading-relaxed">{academy.description}</p>

                      {/* Coach Photo */}
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-teal-500">
                          <Image
                            src={academy.coachPhoto}
                            alt={`${academy.contactName}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{academy.contactName}</p>
                          <p className="text-sm text-teal-700">{academy.founderTitle}</p>
                        </div>
                      </div>

                      {/* Coaching Levels */}
                      {academy.levels && (
                        <div>
                          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                            <BookOpen className="w-5 h-5 text-teal-600" />
                            Coaching Levels
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {academy.levels.map((level) => (
                              <span
                                key={level}
                                className="px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm font-medium border border-teal-200"
                              >
                                {level}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Training Modes */}
                      {academy.trainingModes && (
                        <div>
                          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                            <Monitor className="w-5 h-5 text-teal-600" />
                            Training Modes
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {academy.trainingModes.map((mode) => (
                              <span
                                key={mode}
                                className="px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm font-medium border border-teal-200"
                              >
                                {mode}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Benefits */}
                      {academy.benefits && (
                        <div>
                          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                            <Star className="w-5 h-5 text-yellow-500" />
                            Key Benefits
                          </h3>
                          <ul className="space-y-2">
                            {academy.benefits.map((b) => (
                              <li key={b} className="flex items-center gap-2 text-gray-700">
                                <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Features */}
                      {academy.features && (
                        <div>
                          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                            <Star className="w-5 h-5 text-yellow-500" />
                            Academy Features
                          </h3>
                          <ul className="space-y-2">
                            {academy.features.map((f) => (
                              <li key={f} className="flex items-center gap-2 text-gray-700">
                                <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Right: Contact Card */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-teal-50 to-yellow-50 rounded-xl p-6 border border-teal-100">
                        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Contact Info</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 text-sm">
                            <Users className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900">{academy.contactName}</p>
                              <p className="text-gray-500">{academy.founderTitle}</p>
                            </div>
                          </div>
                          <a
                            href={`tel:${academy.contactPhone}`}
                            className="flex items-center gap-3 text-sm text-gray-700 hover:text-teal-700 transition"
                          >
                            <Phone className="w-4 h-4 text-teal-600 flex-shrink-0" />
                            {academy.contactPhone}
                          </a>
                          <a
                            href={`mailto:${academy.contactEmail}`}
                            className="flex items-center gap-3 text-sm text-gray-700 hover:text-teal-700 transition break-all"
                          >
                            <Mail className="w-4 h-4 text-teal-600 flex-shrink-0" />
                            {academy.contactEmail}
                          </a>
                          <div className="flex items-start gap-3 text-sm text-gray-700">
                            <MapPin className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                            {academy.location}
                          </div>
                        </div>
                      </div>

                      <a
                        href={`tel:${academy.contactPhone}`}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        Call Now
                      </a>
                      <a
                        href={`mailto:${academy.contactEmail}`}
                        className="flex items-center justify-center gap-2 w-full py-3 border-2 border-teal-600 text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Send Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Register CTA */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/pattern-chess.svg')] opacity-5" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Run a Chess Academy in Kallakurichi?
              </h2>
              <p className="text-teal-100 mb-8 max-w-2xl mx-auto text-lg">
                Register your academy with KKDCA to get verified status, appear in our directory,
                and connect with students looking to learn chess.
              </p>
              <Link
                href="https://register.kallaichess.com/register?role=academy"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors shadow-lg"
              >
                Register Your Academy
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
