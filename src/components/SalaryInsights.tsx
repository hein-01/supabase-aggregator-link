import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp } from "lucide-react";

const salaryData = [
  {
    role: "Software Engineer",
    salary: "$95,000 - $130,000",
    trend: "+5.2%",
    category: "Technology"
  },
  {
    role: "Registered Nurse", 
    salary: "$65,000 - $85,000",
    trend: "+3.8%",
    category: "Healthcare"
  },
  {
    role: "Project Manager",
    salary: "$85,000 - $120,000", 
    trend: "+4.1%",
    category: "Management"
  },
  {
    role: "Data Analyst",
    salary: "$70,000 - $95,000",
    trend: "+6.3%", 
    category: "Analytics"
  },
  {
    role: "Marketing Manager",
    salary: "$75,000 - $105,000",
    trend: "+2.9%",
    category: "Marketing"
  },
  {
    role: "Teacher",
    salary: "$55,000 - $75,000",
    trend: "+1.8%",
    category: "Education"
  }
];

export function SalaryInsights() {
  return (
    <section className="py-16 px-4 bg-job-gray-light">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-3xl font-bold text-foreground">See average salaries in Australia</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay informed about competitive salary ranges across different industries and roles
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {salaryData.map((item, index) => (
            <Card 
              key={index} 
              className="hover:shadow-medium transition-shadow animate-slide-up bg-card border-border"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-card-foreground">
                      {item.role}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="flex items-center text-sm text-primary">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {item.trend}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold text-primary">{item.salary}</p>
                <p className="text-sm text-muted-foreground mt-1">per year</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline" size="lg">
            View all salary data
          </Button>
        </div>
      </div>
    </section>
  );
}