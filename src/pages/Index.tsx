import { Header } from "@/components/Header";
import { HeroSearch } from "@/components/HeroSearch";
import { TrendingJobs } from "@/components/TrendingJobs";
import { SalaryInsights } from "@/components/SalaryInsights";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSearch />
      <TrendingJobs />
      <SalaryInsights />
      <Footer />
    </div>
  );
};

export default Index;
