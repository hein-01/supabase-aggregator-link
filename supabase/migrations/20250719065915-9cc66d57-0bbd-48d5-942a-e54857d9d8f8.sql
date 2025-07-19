-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create locations table
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'Singapore',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job categories table
CREATE TABLE public.job_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  company_id UUID REFERENCES public.companies(id),
  location_id UUID REFERENCES public.locations(id),
  category_id UUID REFERENCES public.job_categories(id),
  salary_min INTEGER,
  salary_max INTEGER,
  employment_type TEXT, -- full-time, part-time, contract, etc.
  source_url TEXT NOT NULL, -- original job posting URL
  source_website TEXT NOT NULL, -- jobstreet or joimyanmar
  posted_date TIMESTAMP WITH TIME ZONE,
  scraped_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no authentication required for job search)
CREATE POLICY "Anyone can view companies" 
ON public.companies 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view locations" 
ON public.locations 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view job categories" 
ON public.job_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view active jobs" 
ON public.jobs 
FOR SELECT 
USING (is_active = true);

-- Create indexes for better performance
CREATE INDEX idx_jobs_title ON public.jobs USING gin(to_tsvector('english', title));
CREATE INDEX idx_jobs_description ON public.jobs USING gin(to_tsvector('english', description));
CREATE INDEX idx_jobs_company_name ON public.companies USING gin(to_tsvector('english', name));
CREATE INDEX idx_jobs_location_id ON public.jobs(location_id);
CREATE INDEX idx_jobs_category_id ON public.jobs(category_id);
CREATE INDEX idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX idx_jobs_posted_date ON public.jobs(posted_date DESC);
CREATE INDEX idx_jobs_source_website ON public.jobs(source_website);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample job categories
INSERT INTO public.job_categories (name) VALUES 
('Technology'),
('Healthcare'),
('Finance'),
('Marketing'),
('Sales'),
('Human Resources'),
('Operations'),
('Customer Service'),
('Engineering'),
('Design');

-- Insert some sample locations
INSERT INTO public.locations (city, state, country) VALUES 
('Singapore', 'Singapore', 'Singapore'),
('Yangon', 'Yangon Region', 'Myanmar'),
('Mandalay', 'Mandalay Region', 'Myanmar'),
('Naypyidaw', 'Naypyidaw Union Territory', 'Myanmar');