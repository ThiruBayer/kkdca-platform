'use client';

import { useQuery } from '@tanstack/react-query';
import { MapPin, Users, Phone, Mail } from 'lucide-react';

const fetchTaluks = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/taluks`);
  if (!response.ok) throw new Error('Failed to fetch taluks');
  return response.json();
};

interface Taluk {
  id: string;
  code: string;
  name: string;
  nameTamil: string;
}

// Static association details - can be made dynamic via admin
const associationDetails: Record<string, { president?: string; secretary?: string; contact?: string }> = {
  KLK: { president: 'To be announced', secretary: 'To be announced' },
  CHI: { president: 'To be announced', secretary: 'To be announced' },
  ULU: { president: 'To be announced', secretary: 'To be announced' },
  SAN: { president: 'To be announced', secretary: 'To be announced' },
  TIR: { president: 'To be announced', secretary: 'To be announced' },
  KAL: { president: 'To be announced', secretary: 'To be announced' },
};

export default function AssociationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['taluks'],
    queryFn: fetchTaluks,
  });

  const taluks: Taluk[] = data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Taluk Chess Associations</h1>
            <p className="text-xl text-primary-100">
              KDCA operates through 6 taluk-level associations that promote chess at the grassroots level
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Grassroots Chess Development
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Each taluk in Kallakurichi district has its own chess association that works under KDCA
              to identify talent, organize local tournaments, and promote chess in schools and communities.
              These associations form the backbone of our chess development program.
            </p>
            <div className="grid grid-cols-3 gap-6 p-6 bg-gray-50 rounded-xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">6</div>
                <div className="text-sm text-gray-600">Taluk Associations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">50+</div>
                <div className="text-sm text-gray-600">Local Tournaments/Year</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">100+</div>
                <div className="text-sm text-gray-600">Schools Covered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Associations Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Taluk Associations</h2>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl border animate-pulse h-64" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {taluks.map((taluk) => {
                const details = associationDetails[taluk.code] || {};
                return (
                  <div
                    key={taluk.id}
                    className="bg-white rounded-xl border hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="h-24 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{taluk.code}</div>
                        <div className="text-primary-200 text-sm">{taluk.nameTamil}</div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {taluk.name} Taluk Chess Association
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                          <Users className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <span className="text-gray-500">President:</span>
                            <span className="ml-2 text-gray-900">{details.president}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Users className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <span className="text-gray-500">Secretary:</span>
                            <span className="ml-2 text-gray-900">{details.secretary}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span className="text-gray-600">{taluk.name}, Kallakurichi District</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Want to Get Involved?
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Contact your local taluk association to learn about upcoming events,
              register as a player, or volunteer for chess development activities.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact KDCA
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
