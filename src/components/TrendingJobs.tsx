import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

const trendingSearches = [
  "software engineer", "registered nurse", "data analyst", "project manager",
  "marketing manager", "sales representative", "customer service", "teacher",
  "accountant", "graphic designer", "business analyst", "operations manager"
];

const popularRoles = [
  "General Practitioner", "Registered Nurse", "Occupational Therapist", 
  "Chef", "Project Manager", "Software Developer", "Teacher", "Electrician"
];

const popularLocations = [
  "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", 
  "Gold Coast", "Canberra", "Newcastle"
];

const popularCompanies = [
  "Woolworths", "Telstra", "ANZ", "Commonwealth Bank", 
  "Westpac", "Qantas", "BHP", "Wesfarmers"
];

export function TrendingJobs() {
  return (
    <section className="py-12 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-center mb-8">
          <TrendingUp className="w-5 h-5 text-primary mr-2" />
          <h2 className="text-2xl font-bold text-foreground">Discover trending jobs</h2>
        </div>
        
        {/* Tab navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-border">
          <Button variant="ghost" className="border-b-2 border-primary text-primary font-medium">
            Popular searches
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Role titles
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Locations
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Companies
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Job types
          </Button>
        </div>
        
        {/* Tag cloud */}
        <div className="flex flex-wrap gap-3 justify-center">
          {trendingSearches.map((search, index) => (
            <Button
              key={index}
              variant="tag"
              size="sm"
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {search}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}