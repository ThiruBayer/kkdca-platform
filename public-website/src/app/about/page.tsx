import { Metadata } from 'next';
import { Target, Award, Users, BookOpen, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | KDCA',
  description: 'Learn about the Kallakurichi District Chess Association, our mission, and our commitment to promoting chess excellence.',
};

const milestones = [
  { year: '2020', event: 'KDCA officially formed under TNSCA affiliation' },
  { year: '2021', event: 'First District Championship with 200+ participants' },
  { year: '2022', event: 'Established taluk-level associations in all 6 taluks' },
  { year: '2023', event: 'Launched digital platform for player registration' },
  { year: '2024', event: 'Organized first FIDE-rated tournament in the district' },
];

const objectives = [
  'Promote chess as a sport and educational tool across Kallakurichi district',
  'Organize regular tournaments at taluk and district levels',
  'Identify and nurture talented players for state and national competitions',
  'Train and certify chess coaches and arbiters',
  'Partner with schools to introduce chess in curriculum',
  'Build infrastructure for international-standard chess events',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About KDCA
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              The Kallakurichi District Chess Association is committed to building a vibrant chess
              community and nurturing the next generation of chess champions.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  The Kallakurichi District Chess Association (KDCA) was established to serve as the
                  official governing body for chess activities in Kallakurichi district, Tamil Nadu.
                  Affiliated with the Tamil Nadu State Chess Association (TNSCA) and the All India
                  Chess Federation (AICF), we are dedicated to promoting and developing chess at the
                  grassroots level.
                </p>
                <p>
                  Our district, rich in talent and enthusiasm for the royal game, has shown remarkable
                  growth in chess participation over the years. From school children to senior citizens,
                  chess has become a unifying force that brings our community together.
                </p>
                <p>
                  With a network of 6 taluk associations, numerous registered academies, and hundreds
                  of active players, KDCA continues to work towards making Kallakurichi a hub for
                  chess excellence in Tamil Nadu.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8 lg:p-12">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-700 mb-2">6</div>
                  <div className="text-sm text-gray-600">Taluk Associations</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-700 mb-2">500+</div>
                  <div className="text-sm text-gray-600">Registered Players</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-700 mb-2">20+</div>
                  <div className="text-sm text-gray-600">Tournaments/Year</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-700 mb-2">15+</div>
                  <div className="text-sm text-gray-600">Chess Academies</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To promote chess as a tool for intellectual development, character building,
                and academic excellence. We strive to make chess accessible to all sections
                of society and create pathways for talented players to achieve recognition
                at state, national, and international levels.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-accent-600" />
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
      <section className="py-16 bg-white">
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
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
              >
                <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{objective}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Key milestones in KDCA's growth and development
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-primary-200 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <p className="text-gray-700 bg-white p-4 rounded-xl shadow-sm">
                    {milestone.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliations */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Affiliations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              KDCA is proud to be affiliated with these prestigious chess organizations
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-primary-700 mb-2">AICF</div>
              <p className="text-sm text-gray-600">All India Chess Federation</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-primary-700 mb-2">TNSCA</div>
              <p className="text-sm text-gray-600">Tamil Nadu State Chess Association</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-primary-700 mb-2">FIDE</div>
              <p className="text-sm text-gray-600">World Chess Federation</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
