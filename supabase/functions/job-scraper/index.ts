import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface JobData {
  title: string;
  description: string;
  company_name: string;
  location: string;
  category: string;
  source_url: string;
  source_website: string;
  employment_type?: string;
  salary_min?: number;
  salary_max?: number;
  posted_date?: string;
}

async function scrapeJobStreet(): Promise<JobData[]> {
  const jobs: JobData[] = [];
  
  try {
    console.log('Scraping JobStreet Singapore...');
    
    // JobStreet search URL for recent jobs in Singapore
    const searchUrl = 'https://sg.jobstreet.com/en/job-search/job-vacancy.php?ojs=10';
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch JobStreet:', response.status);
      return jobs;
    }
    
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    if (!doc) {
      console.error('Failed to parse JobStreet HTML');
      return jobs;
    }
    
    // Look for job cards/listings - adjust selectors based on actual site structure
    const jobElements = doc.querySelectorAll('[data-automation="jobListing"], .job-item, .job-card, article[data-job-id]');
    
    console.log(`Found ${jobElements.length} job elements on JobStreet`);
    
    for (let i = 0; i < Math.min(jobElements.length, 10); i++) {
      const element = jobElements[i];
      
      try {
        // Extract job details - adjust selectors based on actual HTML structure
        const titleElement = element.querySelector('h1, h2, h3, .job-title, [data-automation="jobTitle"] a, .position-title');
        const companyElement = element.querySelector('.company-name, [data-automation="jobCompany"], .employer-name');
        const locationElement = element.querySelector('.location, [data-automation="jobLocation"], .job-location');
        const descElement = element.querySelector('.job-summary, .job-description, .snippet');
        const linkElement = element.querySelector('a[href*="/job/"], a[href*="/en/job/"]') || titleElement?.querySelector('a');
        
        if (!titleElement || !companyElement) continue;
        
        const title = titleElement.textContent?.trim() || '';
        const company = companyElement.textContent?.trim() || '';
        const location = locationElement?.textContent?.trim() || 'Singapore';
        const description = descElement?.textContent?.trim() || '';
        const relativeUrl = linkElement?.getAttribute('href') || '';
        const fullUrl = relativeUrl.startsWith('http') ? relativeUrl : `https://sg.jobstreet.com${relativeUrl}`;
        
        if (title && company && fullUrl) {
          jobs.push({
            title,
            description,
            company_name: company,
            location: location.includes('Singapore') ? 'Singapore' : location,
            category: 'Technology', // Default category, could be enhanced with classification
            source_url: fullUrl,
            source_website: 'jobstreet',
            employment_type: 'Full-time',
            posted_date: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error parsing JobStreet job element:', error);
      }
    }
    
  } catch (error) {
    console.error('Error scraping JobStreet:', error);
  }
  
  return jobs;
}

async function scrapeJoiMyanmar(): Promise<JobData[]> {
  const jobs: JobData[] = [];
  
  try {
    console.log('Scraping JoiMyanmar...');
    
    const searchUrl = 'https://www.joimyanmar.com/job';
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch JoiMyanmar:', response.status);
      return jobs;
    }
    
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    if (!doc) {
      console.error('Failed to parse JoiMyanmar HTML');
      return jobs;
    }
    
    // Look for job listings - adjust selectors based on actual site structure
    const jobElements = doc.querySelectorAll('.job-item, .job-card, .job-listing, article, .position-item');
    
    console.log(`Found ${jobElements.length} job elements on JoiMyanmar`);
    
    for (let i = 0; i < Math.min(jobElements.length, 10); i++) {
      const element = jobElements[i];
      
      try {
        // Extract job details - adjust selectors based on actual HTML structure
        const titleElement = element.querySelector('h1, h2, h3, .job-title, .position-title, .title');
        const companyElement = element.querySelector('.company, .company-name, .employer');
        const locationElement = element.querySelector('.location, .job-location, .address');
        const descElement = element.querySelector('.description, .summary, .excerpt');
        const linkElement = element.querySelector('a[href*="/job/"]') || titleElement?.querySelector('a');
        
        if (!titleElement || !companyElement) continue;
        
        const title = titleElement.textContent?.trim() || '';
        const company = companyElement.textContent?.trim() || '';
        const location = locationElement?.textContent?.trim() || 'Yangon';
        const description = descElement?.textContent?.trim() || '';
        const relativeUrl = linkElement?.getAttribute('href') || '';
        const fullUrl = relativeUrl.startsWith('http') ? relativeUrl : `https://www.joimyanmar.com${relativeUrl}`;
        
        if (title && company && fullUrl) {
          jobs.push({
            title,
            description,
            company_name: company,
            location: location.includes('Yangon') ? 'Yangon' : location,
            category: 'Marketing', // Default category, could be enhanced with classification
            source_url: fullUrl,
            source_website: 'joimyanmar',
            employment_type: 'Full-time',
            posted_date: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error parsing JoiMyanmar job element:', error);
      }
    }
    
  } catch (error) {
    console.error('Error scraping JoiMyanmar:', error);
  }
  
  return jobs;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting job scraping process...');

    // Scrape both websites
    const [jobStreetJobs, joiMyanmarJobs] = await Promise.all([
      scrapeJobStreet(),
      scrapeJoiMyanmar()
    ]);

    const allJobs = [...jobStreetJobs, ...joiMyanmarJobs];
    console.log(`Total jobs scraped: ${allJobs.length}`);

    let processedJobs = 0;
    let errors = 0;

    for (const jobData of allJobs) {
      try {
        // Find or create company
        let { data: company, error: companyError } = await supabaseClient
          .from('companies')
          .select('id')
          .eq('name', jobData.company_name)
          .single();

        if (companyError && companyError.code === 'PGRST116') {
          // Company doesn't exist, create it
          const { data: newCompany, error: createCompanyError } = await supabaseClient
            .from('companies')
            .insert([{ name: jobData.company_name }])
            .select('id')
            .single();

          if (createCompanyError) {
            console.error('Error creating company:', createCompanyError);
            errors++;
            continue;
          }
          company = newCompany;
        } else if (companyError) {
          console.error('Error finding company:', companyError);
          errors++;
          continue;
        }

        // Find or create location
        let { data: location, error: locationError } = await supabaseClient
          .from('locations')
          .select('id')
          .eq('city', jobData.location)
          .single();

        if (locationError && locationError.code === 'PGRST116') {
          // Location doesn't exist, create it
          const country = jobData.source_website === 'jobstreet' ? 'Singapore' : 'Myanmar';
          const state = country === 'Singapore' ? 'Singapore' : `${jobData.location} Region`;
          
          const { data: newLocation, error: createLocationError } = await supabaseClient
            .from('locations')
            .insert([{ 
              city: jobData.location, 
              country: country,
              state: state
            }])
            .select('id')
            .single();

          if (createLocationError) {
            console.error('Error creating location:', createLocationError);
            errors++;
            continue;
          }
          location = newLocation;
        } else if (locationError) {
          console.error('Error finding location:', locationError);
          errors++;
          continue;
        }

        // Find category
        const { data: category, error: categoryError } = await supabaseClient
          .from('job_categories')
          .select('id')
          .eq('name', jobData.category)
          .single();

        if (categoryError) {
          console.error('Error finding category:', categoryError);
          errors++;
          continue;
        }

        // Check if job already exists
        const { data: existingJob } = await supabaseClient
          .from('jobs')
          .select('id')
          .eq('source_url', jobData.source_url)
          .single();

        if (existingJob) {
          console.log(`Job already exists: ${jobData.title}`);
          continue;
        }

        // Insert job
        const { error: jobError } = await supabaseClient
          .from('jobs')
          .insert([{
            title: jobData.title,
            description: jobData.description,
            company_id: company.id,
            location_id: location.id,
            category_id: category.id,
            source_url: jobData.source_url,
            source_website: jobData.source_website,
            employment_type: jobData.employment_type,
            salary_min: jobData.salary_min,
            salary_max: jobData.salary_max,
            posted_date: jobData.posted_date
          }]);

        if (jobError) {
          console.error('Error inserting job:', jobError);
          errors++;
        } else {
          console.log(`Successfully inserted job: ${jobData.title}`);
          processedJobs++;
        }

      } catch (error) {
        console.error('Error processing job:', error);
        errors++;
      }
    }

    console.log(`Job scraping completed. Processed: ${processedJobs}, Errors: ${errors}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: processedJobs, 
        errors: errors,
        scraped: allJobs.length,
        message: `Successfully scraped ${allJobs.length} jobs and processed ${processedJobs} with ${errors} errors`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in job scraper:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})