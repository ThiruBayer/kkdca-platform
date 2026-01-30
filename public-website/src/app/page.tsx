import { HeroSection } from '@/components/home/hero-section';
import { StatsSection } from '@/components/home/stats-section';
import { AboutSection } from '@/components/home/about-section';
import { BenefitsSection } from '@/components/home/benefits-section';
import { HistorySection } from '@/components/home/history-section';
import { OfficeBearersSection } from '@/components/home/office-bearers-section';
import { GallerySection } from '@/components/home/gallery-section';
import { TournamentsSection } from '@/components/home/tournaments-section';
import { AssociationsSection } from '@/components/home/associations-section';
import { AcademiesSection } from '@/components/home/academies-section';
import { NewsSection } from '@/components/home/news-section';
import { CTASection } from '@/components/home/cta-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <BenefitsSection />
      <HistorySection />
      <OfficeBearersSection />
      <GallerySection />
      <TournamentsSection />
      <AssociationsSection />
      <AcademiesSection />
      <NewsSection />
      <CTASection />
    </>
  );
}
