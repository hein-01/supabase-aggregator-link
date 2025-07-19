import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, ExternalLink, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Job {
  id: string;
  title: string;
  description: string;
  source_url: string;
  source_website: string;
  posted_date: string;
  employment_type: string;
  salary_min: number;
  salary_max: number;
  companies: {
    name: string;
    logo_url: string;
  };
  locations: {
    city: string;
    state: string;
    country: string;
  };
  job_categories: {
    name: string;
  };
}

interface Location {
  id: string;
  city: string;
  state: string;
  country: string;
}

interface JobCategory {
  id: string;
  name: string;
}

export const JobSearch = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    searchJobs();
  }, [searchKeyword, selectedLocation, selectedCategory]);

  const fetchData = async () => {
    try {
      // Fetch locations
      const { data: locationsData } = await supabase
        .from('locations')
        .select('*')
        .order('city');

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('job_categories')
        .select('*')
        .order('name');

      setLocations(locationsData || []);
      setCategories(categoriesData || []);
      
      // Initial job search
      await searchJobs();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchJobs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('jobs')
        .select(`
          *,
          companies (name, logo_url),
          locations (city, state, country),
          job_categories (name)
        `)
        .eq('is_active', true)
        .order('posted_date', { ascending: false })
        .limit(20);

      // Apply keyword search
      if (searchKeyword.trim()) {
        query = query.or(`title.ilike.%${searchKeyword}%,description.ilike.%${searchKeyword}%`);
      }

      // Apply location filter
      if (selectedLocation && selectedLocation !== 'all') {
        query = query.eq('location_id', selectedLocation);
      }

      // Apply category filter
      if (selectedCategory && selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error searching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerScraper = async () => {
    setScraping(true);
    try {
      console.log('Triggering job scraper...');
      const { data, error } = await supabase.functions.invoke('job-scraper');
      
      if (error) {
        console.error('Error triggering scraper:', error);
        alert('Error triggering scraper: ' + error.message);
      } else {
        console.log('Scraper response:', data);
        alert(`Scraper completed! ${data.message}`);
        // Refresh the job list after scraping
        await searchJobs();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error triggering scraper');
    } finally {
      setScraping(false);
    }
  };

  const formatSalary = (min: number, max: number) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Job Search</h1>
        
        {/* Search Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search jobs, companies..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.city}, {location.state || location.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>Found {jobs.length} jobs</span>
          <Button 
            onClick={triggerScraper}
            disabled={scraping}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${scraping ? 'animate-spin' : ''}`} />
            {scraping ? 'Scraping...' : 'Refresh Jobs'}
          </Button>
        </div>
      </div>

      {/* Job Results */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No jobs found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.companies?.name || 'Company not specified'}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.locations ? `${job.locations.city}, ${job.locations.state || job.locations.country}` : 'Location not specified'}
                      </div>
                      {job.posted_date && (
                        <span>Posted {formatDate(job.posted_date)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge variant="secondary">
                      {job.source_website === 'jobstreet' ? 'JobStreet' : 'JoiMyanmar'}
                    </Badge>
                    {job.employment_type && (
                      <Badge variant="outline">{job.employment_type}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {job.description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {job.job_categories && (
                        <Badge variant="outline">{job.job_categories.name}</Badge>
                      )}
                      <span className="text-sm font-medium">
                        {formatSalary(job.salary_min, job.salary_max)}
                      </span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(job.source_url, '_blank')}
                      className="flex items-center gap-2"
                    >
                      Apply <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};