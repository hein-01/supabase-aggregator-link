import { Button } from "@/components/ui/button";

const partnersByRegion = {
  Africa: ["BrighterMonday", "Jobberman"],
  ANZ: ["SEEK Australia", "SEEK New Zealand"],
  Asia: ["JobStreet", "jobsDB", "Zhaopin", "Bdjobs"],
  "Latin America": ["Workana"]
};

export function Footer() {
  return (
    <footer className="bg-job-gray text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Partner info */}
        <div className="text-center mb-8">
          <p className="text-white/80 mb-6">
            JobHunt is partnering with job boards around the world to deliver more opportunities for job seekers.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {Object.entries(partnersByRegion).map(([region, partners]) => (
              <div key={region}>
                <h3 className="font-semibold mb-3 text-primary">{region}</h3>
                <div className="space-y-2">
                  {partners.map((partner) => (
                    <div key={partner}>
                      <Button 
                        variant="link" 
                        className="text-white/70 hover:text-primary p-0 h-auto font-normal"
                      >
                        {partner}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-white/60 text-sm">
            ©2025 Job Seeker Pty Ltd
          </p>
        </div>
      </div>
    </footer>
  );
}