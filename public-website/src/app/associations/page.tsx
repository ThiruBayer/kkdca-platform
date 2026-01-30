'use client';

import { useQuery } from '@tanstack/react-query';
import { MapPin, Users, Phone, Crown, Award } from 'lucide-react';
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
  photo?: string;
}

interface AssociationInfo {
  name: string;
  nameTamil: string;
  code: string;
  bearers: OfficeBearer[];
  vicePresidents: { name: string; phone: string }[];
  jointSecretaries: { name: string; phone: string }[];
  executiveMembers: { name: string; phone: string }[];
  hasData: boolean;
}

const associations: AssociationInfo[] = [
  {
    name: 'Chinnasalem',
    nameTamil: 'சின்னசேலம்',
    code: 'CHI',
    hasData: true,
    bearers: [
      { role: 'President', name: 'S. Solaikathir', phone: '90803 98749', photo: '/images/taluk-associations/chinnasalem/president.avif' },
      { role: 'Secretary', name: 'B. Kowsalya', phone: '87547 39169', photo: '/images/taluk-associations/chinnasalem/secreatary.avif' },
      { role: 'Treasurer', name: 'A. Anand', phone: '97918 61409', photo: '/images/taluk-associations/chinnasalem/treasurer.avif' },
    ],
    vicePresidents: [
      { name: 'Naseem Y', phone: '9942506414' },
      { name: 'Tharani S', phone: '9344384303' },
      { name: 'Monish P', phone: '9585738171' },
      { name: 'Balaji A', phone: '9994717053' },
      { name: 'Sarath Kumar D', phone: '9159343268' },
    ],
    jointSecretaries: [
      { name: 'Santhosh S', phone: '9942879615' },
      { name: 'Vasanth S', phone: '9597243366' },
      { name: 'Aravinth Kumar S', phone: '9677723270' },
      { name: 'Saravanan S', phone: '7502826932' },
      { name: 'Aravind Lara S', phone: '8667294404' },
    ],
    executiveMembers: [
      { name: 'S. Murugan', phone: '9629348503' },
      { name: 'V. Bharathidasan', phone: '9159570629' },
      { name: 'V. Navabharathi', phone: '7667679185' },
      { name: 'A. Deepa', phone: '6384241292' },
      { name: 'R. Murali', phone: '9677740767' },
      { name: 'H. Mohammed Yunus', phone: '9791810747' },
      { name: 'M. Naveen Prakash', phone: '9597228105' },
      { name: 'B. Kavasakar', phone: '8870160253' },
      { name: 'S. Shivanesan', phone: '6385323083' },
    ],
  },
  {
    name: 'Sangarapuram',
    nameTamil: 'சங்கரபுரம்',
    code: 'SAN',
    hasData: true,
    bearers: [
      { role: 'Honorary President', name: 'Edhayathulla M', phone: '78679 59159', photo: '/images/taluk-associations/sangarapuram/honorary_president.avif' },
      { role: 'President', name: 'Vijay Kumar V', phone: '94448 47326', photo: '/images/taluk-associations/sangarapuram/president.avif' },
      { role: 'Secretary', name: 'Kalaiyarasi A', phone: '95856 84719', photo: '/images/taluk-associations/sangarapuram/secretary.avif' },
      { role: 'Treasurer', name: 'P. Vijay Kumar', phone: '63852 23411' },
    ],
    vicePresidents: [
      { name: 'K. Vaithiyanathan', phone: '77082 83979' },
      { name: 'S. Lakshmi', phone: '96260 20096' },
      { name: 'A. Sunitha', phone: '99435 27773' },
    ],
    jointSecretaries: [
      { name: 'M. Vadivelu', phone: '88383 77239' },
      { name: 'D. A. Arockia Doss', phone: '90253 53197' },
      { name: 'J. Mohamed Kaleel', phone: '95669 63976' },
    ],
    executiveMembers: [
      { name: 'A. Anitha', phone: '96778 91889' },
      { name: 'M. Arulnayagi', phone: '95789 83964' },
      { name: 'S. Shajitha Begum', phone: '95854 83111' },
      { name: 'R. Dhinesh Kumar', phone: '81483 70332' },
      { name: 'A. Kalaiselvi', phone: '88389 50493' },
    ],
  },
  {
    name: 'Thirukoilur',
    nameTamil: 'திருக்கோயிலூர்',
    code: 'TIR',
    hasData: true,
    bearers: [
      { role: 'Honorary President', name: 'K. Umashankar MA, BL, D.Cop.', phone: '' },
      { role: 'President', name: 'A. Solomon', phone: '9842059083', photo: '/images/taluk-associations/thirukoilur/president.avif' },
      { role: 'Secretary', name: 'M. Eswarakrishnan', phone: '9698805976', photo: '/images/taluk-associations/thirukoilur/secretary.avif' },
      { role: 'Treasurer', name: 'V. Sabarishankar', phone: '9047407111', photo: '/images/taluk-associations/thirukoilur/treasurer.avif' },
    ],
    vicePresidents: [
      { name: 'P. Balasubramanian', phone: '9442995363' },
      { name: 'S. Thiyagarajan', phone: '9942406396' },
      { name: 'Manakkovulan', phone: '9944232645' },
      { name: 'Balaji A', phone: '9994717053' },
      { name: 'S. Sivaprakash', phone: '7448972231' },
    ],
    jointSecretaries: [
      { name: 'M. Jassim', phone: '9944192999' },
      { name: 'D. Malarkodi', phone: '9865792423' },
      { name: 'M. Balaji', phone: '9597141007' },
      { name: 'J. Sathish Kumar', phone: '8124176875' },
    ],
    executiveMembers: [
      { name: 'S. Mary Sophia', phone: '9626938966' },
      { name: 'K. M. Manimekalai', phone: '9698805975' },
      { name: 'C. Kewin Kristen', phone: '8825840813' },
      { name: 'Eshwar', phone: '6869715283' },
      { name: 'Angeswaran B', phone: '9095752264' },
      { name: 'M. Harish Kumar', phone: '7598161757' },
      { name: 'Nithish Kumar', phone: '9943577987' },
    ],
  },
  {
    name: 'Ulundurpet',
    nameTamil: 'உளுந்தூர்பேட்டை',
    code: 'ULU',
    hasData: true,
    bearers: [
      { role: 'Honorary President', name: 'Senthil Murugan', phone: '9787363112' },
      { role: 'President', name: 'S. Solaikathir', phone: '8072591227', photo: '/images/taluk-associations/ulundurpet/president.avif' },
      { role: 'Secretary', name: 'Sivanantharaja R', phone: '9600316004', photo: '/images/taluk-associations/ulundurpet/secretary.avif' },
      { role: 'Treasurer', name: 'Ramachandiran S', phone: '9962172584', photo: '/images/taluk-associations/ulundurpet/treasurer.avif' },
    ],
    vicePresidents: [
      { name: 'Aadhavan P', phone: '9842669187' },
      { name: 'A. Vijayakanth BA', phone: '8248185414' },
      { name: 'Eswaran S', phone: '9384367367' },
    ],
    jointSecretaries: [
      { name: 'Pandian K', phone: '9655413300' },
      { name: 'Venkatesan R', phone: '9994037053' },
      { name: 'M. Karnavelan MBA', phone: '7010039273' },
    ],
    executiveMembers: [
      { name: 'R. Mani Kumar BE', phone: '9629887572' },
      { name: 'R. Josephin Regina', phone: '7502013275' },
      { name: 'K. Arumugam (BRT)', phone: '9952748765' },
      { name: 'Ravi Ramachandran', phone: '9842301472' },
      { name: 'B. Balnath', phone: '9942551616' },
    ],
  },
  {
    name: 'Kallakurichi',
    nameTamil: 'கள்ளக்குறிச்சி',
    code: 'KLK',
    hasData: false,
    bearers: [],
    vicePresidents: [],
    jointSecretaries: [],
    executiveMembers: [],
  },
  {
    name: 'Kalrayan Hills',
    nameTamil: 'கல்ராயன் மலை',
    code: 'KAL',
    hasData: false,
    bearers: [],
    vicePresidents: [],
    jointSecretaries: [],
    executiveMembers: [],
  },
];

function BearerCard({ bearer }: { bearer: OfficeBearer }) {
  return (
    <div className="flex flex-col items-center text-center">
      {bearer.photo ? (
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-teal-200 mb-2 shadow-md">
          <Image src={bearer.photo} alt={bearer.name} fill className="object-cover" />
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
      {bearer.phone && (
        <a href={`tel:${bearer.phone.replace(/\s/g, '')}`} className="text-xs text-teal-700 hover:text-teal-900 flex items-center gap-1 mt-0.5">
          <Phone className="w-3 h-3" />
          {bearer.phone}
        </a>
      )}
    </div>
  );
}

function MemberGroup({ title, members, color }: { title: string; members: { name: string; phone: string }[]; color: string }) {
  if (members.length === 0) return null;
  const colorClasses: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-800' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-800' },
    gray: { bg: 'bg-gray-50', text: 'text-gray-700' },
  };
  const c = colorClasses[color] || colorClasses.gray;
  return (
    <div className="mt-4">
      <h4 className={`text-xs font-semibold uppercase tracking-wider ${c.text} mb-2 px-1`}>{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {members.map((m) => (
          <div key={m.name} className={`flex items-center justify-between ${c.bg} rounded-lg px-3 py-2`}>
            <span className="text-sm font-medium text-gray-800">{m.name}</span>
            {m.phone && (
              <a href={`tel:${m.phone.replace(/\s/g, '')}`} className="text-xs text-teal-600 hover:text-teal-800 flex items-center gap-1 shrink-0 ml-2">
                <Phone className="w-3 h-3" />
                {m.phone}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AssociationCard({ assoc }: { assoc: AssociationInfo }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow overflow-hidden">
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
      <div className="p-6">
        {assoc.hasData ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {assoc.bearers.map((bearer) => (
                <BearerCard key={`${bearer.role}-${bearer.name}`} bearer={bearer} />
              ))}
            </div>
            <MemberGroup title="Vice Presidents" members={assoc.vicePresidents} color="blue" />
            <MemberGroup title="Joint Secretaries" members={assoc.jointSecretaries} color="purple" />
            <MemberGroup title="Executive Members" members={assoc.executiveMembers} color="gray" />
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Contact KKDCA for details</p>
            <a href="/contact" className="inline-block mt-3 text-sm text-teal-700 hover:text-teal-900 font-medium underline underline-offset-2">
              Get in touch
            </a>
          </div>
        )}
      </div>
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

  const taluks: Taluk[] = data || [];
  const mergedAssociations = associations.map((assoc) => {
    const apiTaluk = taluks.find((t: Taluk) => t.code === assoc.code);
    if (apiTaluk) return { ...assoc, name: apiTaluk.name || assoc.name, nameTamil: apiTaluk.nameTamil || assoc.nameTamil };
    return assoc;
  });

  const activeAssociations = mergedAssociations.filter((a) => a.hasData);
  const pendingAssociations = mergedAssociations.filter((a) => !a.hasData);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-amber-400" />
              <span className="text-sm font-semibold uppercase tracking-wider text-amber-400">Our Network</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Taluk Chess Associations</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              KKDCA operates through 6 taluk-level chess associations that promote chess at the grassroots level across Kallakurichi district.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Grassroots Chess Development</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Each taluk in Kallakurichi district has its own chess association that works under KKDCA to identify talent, organize local tournaments, and promote chess in schools and communities.
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

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Taluk Associations</h2>
          <p className="text-gray-500 mb-8">Meet the office bearers driving chess development in each taluk.</p>

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
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Other Taluk Associations</h3>
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

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-teal-700 to-teal-900 rounded-2xl p-8 md:p-12 text-white text-center">
            <Crown className="w-10 h-10 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to Get Involved?</h2>
            <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
              Contact your local taluk association to learn about upcoming events, register as a player, or volunteer for chess development activities.
            </p>
            <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-gray-900 font-semibold rounded-lg hover:bg-amber-300 transition-colors">
              Contact KKDCA
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
