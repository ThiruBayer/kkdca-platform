'use client';

import { useQuery } from '@tanstack/react-query';
import { MapPin, Users, Phone, Mail, Crown, Award } from 'lucide-react';
import Image from 'next/image';

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

interface OfficeBearer {
  role: string;
  name: string;
  phone: string;
  email?: string;
  photo?: string;
}

interface AssociationInfo {
  name: string;
  nameTamil: string;
  code: string;
  bearers: OfficeBearer[];
  hasData: boolean;
}

const associations: AssociationInfo[] = [
  {
    name: 'Chinnasalem',
    nameTamil: 'சின்னசேலம்',
    code: 'CHI',
    hasData: true,
    bearers: [
      {
        role: 'President',
        name: 'S. Solaikathir',
        phone: '90803 98749',
        email: 'ctca0122@gmail.com',
        photo: '/images/taluk-associations/chinnasalem/president.avif',
      },
      {
        role: 'Secretary',
        name: 'B. Kowsalya',
        phone: '87547 39169',
        email: 'ctca0122@gmail.com',
        photo: '/images/taluk-associations/chinnasalem/secreatary.avif',
      },
      {
        role: 'Treasurer',
        name: 'A. Anand',
        phone: '97918 61409',
        email: 'ctca0122@gmail.com',
        photo: '/images/taluk-associations/chinnasalem/treasurer.avif',
      },
    ],
  },
  {
    name: 'Sangarapuram',
    nameTamil: 'சங்கரபுரம்',
    code: 'SAN',
    hasData: true,
    bearers: [
      {
        role: 'Honorary President',
        name: 'Edhayathulla M',
        phone: '78679 59159',
        photo: '/images/taluk-associations/sangarapuram/honorary_president.avif',
      },
      {
        role: 'President',
        name: 'Vijay Kumar V',
        phone: '94448 47326',
        photo: '/images/taluk-associations/sangarapuram/president.avif',
      },
      {
        role: 'Secretary',
        name: 'Kalaiyarasi A',
        phone: '95856 84719',
        photo: '/images/taluk-associations/sangarapuram/secretary.avif',
      },
      {
        role: 'Treasurer',
        name: 'P. Vijay Kumar',
        phone: '63852 23411',
      },
    ],
  },
  {
    name: 'Thirukoilur',
    nameTamil: 'திருக்கோயிலூர்',
    code: 'TIR',
    hasData: true,
    bearers: [
      {
        role: 'President',
        name: 'A. Solomon',
        phone: '9842059083',
        email: 'solomonapostal@gmail.com',
        photo: '/images/taluk-associations/thirukoilur/president.avif',
      },
      {
        role: 'Secretary',
        name: 'M. Eswarakrishnan',
        phone: '9698805976',
        email: 'vsabarishankar@gmail.com',
        photo: '/images/taluk-associations/thirukoilur/secretary.avif',
      },
      {
        role: 'Treasurer',
        name: 'V. Sabarishankar',
        phone: '9047407111',
        photo: '/images/taluk-associations/thirukoilur/treasurer.avif',
      },
    ],
  },
  {
    name: 'Ulundurpet',
    nameTamil: 'உளுந்தூர்பேட்டை',
    code: 'ULU',
    hasData: true,
    bearers: [
      {
        role: 'President',
        name: 'S. Solaikathir',
        phone: '8072591227',
        photo: '/images/taluk-associations/ulundurpet/president.avif',
      },
      {
        role: 'Secretary',
        name: 'Sivanantharaja R',
        phone: '9600316004',
        photo: '/images/taluk-associations/ulundurpet/secretary.avif',
      },
      {
        role: 'Treasurer',
        name: 'Ramachandiran S',
        phone: '9962172584',
        photo: '/images/taluk-associations/ulundurpet/treasurer.avif',
      },
    ],
  },
  {
    name: 'Kallakurichi',
    nameTamil: 'கள்ளக்குறிச்சி',
    code: 'KLK',
    hasData: false,
    bearers: [],
  },
  {
    name: 'Kalrayan Hills',
    nameTamil: 'கல்ராயன் மலை',
    code: 'KAL',
    hasData: false,
    bearers: [],
  },
];

function BearerCard({ bearer }: { bearer: OfficeBearer }) {
  return (
    <div className="flex flex-col items-center text-center">
      {bearer.photo ? (
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-teal-200 mb-2 shadow-md">
          <Image
            src={bearer.photo}
            alt={bearer.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center mb-2 border-2 border-teal-200 shadow-md">
          <Users className="w-8 h-8 text-teal-600" />
        </div>
      )}
      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-amber-100 text-amber-800 mb-1">
        {bearer.role}
      </span>
      <p className="font-semibold text-gray-900 text-sm">{bearer.name}</p>
      <a
        href={`tel:${bearer.phone.replace(/\s/g, '')}`}
        className="text-xs text-teal-700 hover:text-teal-900 flex items-center gap-1 mt-0.5"
      >
        <Phone className="w-3 h-3" />
        {bearer.phone}
      </a>
      {bearer.email && (
        <a
          href={`mailto:${bearer.email}`}
          className="text-xs text-teal-700 hover:text-teal-900 flex items-center gap-1 mt-0.5"
        >
          <Mail className="w-3 h-3" />
          {bearer.email}
        </a>
      )}
    </div>
  );
}

function AssociationCard({ assoc }: { assoc: AssociationInfo }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow overflow-hidden">
      {/* Header */}
      <div className="h-28 bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 flex items-center justify-between px-6">
        <div>
          <h3 className="text-xl font-bold text-white">{assoc.name}</h3>
          <p className="text-teal-200 text-sm">Taluk Chess Association</p>
          <p className="text-teal-300 text-xs mt-0.5">{assoc.nameTamil}</p>
        </div>
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
          <span className="text-lg font-bold text-amber-300">{assoc.code}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {assoc.hasData ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {assoc.bearers.map((bearer) => (
              <BearerCard key={bearer.role} bearer={bearer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Contact KKDCA for details</p>
            <a
              href="/contact"
              className="inline-block mt-3 text-sm text-teal-700 hover:text-teal-900 font-medium underline underline-offset-2"
            >
              Get in touch
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
        <MapPin className="w-3.5 h-3.5" />
        {assoc.name}, Kallakurichi District
      </div>
    </div>
  );
}

export default function AssociationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['taluks'],
    queryFn: fetchTaluks,
  });

  // Merge any API taluk data if available (for names/Tamil names)
  const taluks: Taluk[] = data || [];
  const mergedAssociations = associations.map((assoc) => {
    const apiTaluk = taluks.find((t: Taluk) => t.code === assoc.code);
    if (apiTaluk) {
      return {
        ...assoc,
        name: apiTaluk.name || assoc.name,
        nameTamil: apiTaluk.nameTamil || assoc.nameTamil,
      };
    }
    return assoc;
  });

  const activeAssociations = mergedAssociations.filter((a) => a.hasData);
  const pendingAssociations = mergedAssociations.filter((a) => !a.hasData);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-amber-400" />
              <span className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                Our Network
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Taluk Chess Associations
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              KKDCA operates through 6 taluk-level chess associations that promote chess at the
              grassroots level across Kallakurichi district.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Grassroots Chess Development
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Each taluk in Kallakurichi district has its own chess association that works under
              KKDCA to identify talent, organize local tournaments, and promote chess in schools
              and communities. These associations form the backbone of our chess development
              program.
            </p>
            <div className="grid grid-cols-3 gap-6 p-6 bg-teal-50 rounded-xl border border-teal-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-700">6</div>
                <div className="text-sm text-gray-600">Taluk Associations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-700">50+</div>
                <div className="text-sm text-gray-600">Local Tournaments/Year</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-700">100+</div>
                <div className="text-sm text-gray-600">Schools Covered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Associations */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Taluk Associations</h2>
          <p className="text-gray-500 mb-8">
            Meet the office bearers driving chess development in each taluk.
          </p>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl border animate-pulse h-80" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-8">
                {activeAssociations.map((assoc) => (
                  <AssociationCard key={assoc.code} assoc={assoc} />
                ))}
              </div>

              {pendingAssociations.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Other Taluk Associations
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {pendingAssociations.map((assoc) => (
                      <AssociationCard key={assoc.code} assoc={assoc} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-teal-700 to-teal-900 rounded-2xl p-8 md:p-12 text-white text-center">
            <Crown className="w-10 h-10 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Want to Get Involved?
            </h2>
            <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
              Contact your local taluk association to learn about upcoming events,
              register as a player, or volunteer for chess development activities.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-gray-900 font-semibold rounded-lg hover:bg-amber-300 transition-colors"
            >
              Contact KKDCA
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
