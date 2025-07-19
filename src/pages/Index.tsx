import { Header } from "@/components/Header";
import { JobSearch } from "@/components/JobSearch";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <JobSearch />
      <Footer />
    </div>
  );
};

export default Index;
