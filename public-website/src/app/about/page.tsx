import { Metadata } from 'next';
import Image from 'next/image';
import { Target, Award, Users, BookOpen, CheckCircle, Trophy, Star, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | KKDCA',
  description: 'Learn about the Kallakurichi District Chess Association — our history since 2007, achievements, mission, and commitment to chess excellence.',
};

const milestones = [
  { year: '2007', event: 'Chess Foundation established by A. Ravichandran in Kallakurichi (then part of Villupuram District)' },
  { year: '2019', event: 'KKDCA formally established when Kallakurichi became a separate district' },
  { year: '2022', event: 'Historic achievement at 44th International Chess Olympiad trials — highest district participation in Tamil Nadu' },
  { year: '2022', event: 'TNSCA special recognition awarded to KKDCA administrators in Chennai' },
  { year: '2023', event: 'World Record — 3,065 international chess boards in a single event' },
  { year: '2024', event: 'Digital platform launched for player registration and tournament management' },
];

const achievements = [
  {
    icon: Trophy,
    title: 'Highest District Participation',
    description: 'In 2022, KKDCA achieved the highest participation from any district in Tamil Nadu during the 44th International Chess Olympiad trials held in Chennai.',
  },
  {
    icon: Star,
    title: 'TNSCA Special Recognition',
    description: 'KKDCA administrators received special recognition from the Tamil Nadu State Chess Association (TNSCA) in Chennai for their outstanding contributions.',
  },
  {
    icon: Globe,
    title: 'World Record',
    description: '3,065 international chess boards were set up in a single event — a remarkable world record achievement.',
  },
  {
    icon: BookOpen,
    title: '450+ Chess Boards Donated',
    description: 'Over 450 chess boards donated to government schools in collaboration with Corona Academy and Eye Tex company.',
  },
  {
    icon: Users,
    title: 'Free Chess Training',
    description: 'Secretary A. Ravichandran personally provided free chess training to over 100 government schools across the district.',
  },
  {
    icon: CheckCircle,
    title: 'Digital Platform',
    description: 'Established a modern digital platform for player registration, tournament management, and community engagement.',
  },
];

const objectives = [
  'Promote chess as a sport and educational tool across Kallakurichi district',
  'Organize regular tournaments at taluk and district levels',
  'Identify and nurture talented players for state and national competitions',
  'Train and certify chess coaches and arbiters',
  'Partner with schools to introduce chess in curriculum',
  'Build infrastructure for international-standard chess events',
];

const affiliations = [
  {
    name: 'TNSCA',
    full: 'Tamil Nadu State Chess Association',
    href: 'https://tamilchess.com',
  },
  {
    name: 'AICF',
    full: 'All India Chess Federation',
    href: 'https://aicf.in',
  },
  {
    name: 'FIDE',
    full: 'World Chess Federation',
    href: 'https://www.fide.com',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About KKDCA
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              The Kallakurichi District Chess Association has been nurturing chess talent
              since 2007, building a vibrant community and producing champions across Tamil Nadu.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  The Chess Foundation was established in <strong>2007</strong> by{' '}
                  <strong>A. Ravichandran</strong> in Kallakurichi, which was then part of
                  Villupuram District. The founding leadership comprised{' '}
                  <strong>V. Palani</strong> as President,{' '}
                  <strong>A. Ravichandran</strong> as Secretary, and{' '}
                  <strong>M. Azhwar</strong> as Treasurer.
                </p>
                <p>
                  A. Ravichandran served as Vice President of the Villupuram District Chess
                  Association for 12 years, championing the growth of chess across the region
                  and building deep connections within the Tamil Nadu chess community.
                </p>
                <p>
                  In <strong>2019</strong>, when Kallakurichi was carved out as a separate
                  district, the Kallakurichi District Chess Association (KKDCA) was formally
                  established. The same dedicated leadership continued to guide the
                  association, bringing their years of experience and passion to this new chapter.
                </p>
                <p>
                  Affiliated with the Tamil Nadu State Chess Association (TNSCA), the All India
                  Chess Federation (AICF), and the World Chess Federation (FIDE), KKDCA
                  continues to work towards making Kallakurichi a hub for chess excellence in
                  Tamil Nadu.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 lg:p-12">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-teal-700 mb-2">2007</div>
                  <div className="text-sm text-gray-600">Founded</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-teal-700 mb-2">3,065</div>
                  <div className="text-sm text-gray-600">World Record Boards</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-teal-700 mb-2">450+</div>
                  <div className="text-sm text-gray-600">Boards Donated</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-teal-700 mb-2">100+</div>
                  <div className="text-sm text-gray-600">Schools Trained</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Achievements</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Milestones that showcase KKDCA&apos;s dedication to chess development in Kallakurichi and beyond
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To promote chess as a tool for intellectual development, character building,
                and academic excellence. We strive to make chess accessible to all sections
                of society and create pathways for talented players to achieve recognition
                at state, national, and international levels.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To establish Kallakurichi as a premier destination for chess in Tamil Nadu,
                known for producing national-level players, hosting international-standard
                tournaments, and having a thriving ecosystem of academies, coaches, and
                passionate chess enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Objectives</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We work towards these key objectives to fulfill our mission of chess development
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {objectives.map((objective, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-white rounded-xl"
              >
                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{objective}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Key milestones in KKDCA&apos;s growth and development
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-teal-200 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-xl shadow-sm">
                    {milestone.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliations */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Affiliations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              KKDCA is proud to be affiliated with these prestigious chess organizations
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {affiliations.map((org) => (
              <a
                key={org.name}
                href={org.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="text-2xl font-bold text-teal-700 mb-2 group-hover:text-teal-500 transition-colors">
                  {org.name}
                </div>
                <p className="text-sm text-gray-600">{org.full}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Certificate */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Certificate</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              KKDCA is a registered association committed to the promotion and development of chess in Kallakurichi district.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <Image
                src="/images/Registration_Certifictae_KKDCA.avif"
                alt="KKDCA Registration Certificate"
                width={800}
                height={1100}
                className="w-full h-auto"
                priority={false}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
