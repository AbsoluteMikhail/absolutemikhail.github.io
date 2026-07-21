import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProofSection from "@/components/ProofSection";
import ProductionExperienceSection from "@/components/ProductionExperienceSection";
import EngineeringFoundationSection from "@/components/EngineeringFoundationSection";
import TimelineSection from "@/components/TimelineSection";
import GamesSection from "@/components/GamesSection";
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
      <HeroSection />
      <ProofSection />
      <ProductionExperienceSection />
      <EngineeringFoundationSection />
      <GamesSection />
      <ReviewsSection />
      <TimelineSection />
      <MentoringSection />
      <MenteeReviewsSection />
      <FAQSection />
      <FinalTrustSection />

      <SiteFooter />
      <ScrollToTop />
    </div>
  );
};

export default Index;
