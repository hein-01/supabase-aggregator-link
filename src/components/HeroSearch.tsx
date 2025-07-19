import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

export function HeroSearch() {
  const [jobSearch, setJobSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  return (
    <section className="bg-gradient-hero py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Search <span className="text-white/90">483,663</span> jobs now
        </h1>
        
        {/* Search Form */}
        <div className="mt-8 bg-white rounded-lg shadow-medium p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* What field */}
            <div className="md:col-span-5">
              <label htmlFor="job-search" className="block text-sm font-medium text-job-gray mb-2 text-left">
                What
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="job-search"
                  placeholder="Job title, company, keyword"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
            
            {/* Where field */}
            <div className="md:col-span-5">
              <label htmlFor="location-search" className="block text-sm font-medium text-job-gray mb-2 text-left">
                Where
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="location-search"
                  placeholder="City, district, state"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
            
            {/* Search button */}
            <div className="md:col-span-2 md:flex md:items-end">
              <Button variant="search" size="lg" className="w-full h-12">
                Search jobs
              </Button>
            </div>
          </div>
        </div>
        
        {/* Employer link */}
        <div className="mt-6">
          <p className="text-white/80 mb-2">Are you hiring?</p>
          <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-job-gray">
            Post a job
          </Button>
        </div>
      </div>
    </section>
  );
}