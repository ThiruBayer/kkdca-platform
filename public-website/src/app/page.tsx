import { HeroSection } from '@/components/home/hero-section';
import { StatsSection } from '@/components/home/stats-section';
import { TournamentsSection } from '@/components/home/tournaments-section';
import { AboutSection } from '@/components/home/about-section';
import { AssociationsSection } from '@/components/home/associations-section';
import { AcademiesSection } from '@/components/home/academies-section';
import { NewsSection } from '@/components/home/news-section';
import { CTASection } from '@/components/home/cta-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <TournamentsSection />
      <AboutSection />
      <AssociationsSection />
      <AcademiesSection />
      <NewsSection />
      <CTASection />
    </>
  );
}
