import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProofSection from "@/components/ProofSection";
import ProductionExperienceSection from "@/components/ProductionExperienceSection";
import EngineeringFoundationSection from "@/components/EngineeringFoundationSection";
import TimelineSection from "@/components/TimelineSection";
import GamesSection from "@/components/GamesSection";
import AcademySection from "@/components/AcademySection";
import MentoringSection from "@/components/MentoringSection";
import FAQSection from "@/components/FAQSection";
import MenteeReviewsSection from "@/components/MenteeReviewsSection";
import FinalTrustSection from "@/components/FinalTrustSection";
import ReviewsSection from "@/components/ReviewsSection";
import ScrollToTop from "@/components/ScrollToTop";
import SiteFooter from "@/components/SiteFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
      <HeroSection />
      <GamesSection />
      <ReviewsSection />
      <AcademySection />
      <MentoringSection />
      <MenteeReviewsSection />
      <ProofSection />
      <ProductionExperienceSection />
      <EngineeringFoundationSection />
      <TimelineSection />
      <FAQSection />
      <FinalTrustSection />

      </main>
      <SiteFooter />
      <ScrollToTop />
    </div>
  );
};

export default Index;
