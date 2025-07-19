import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    // Mock job data for demonstration (replace with actual scraping logic)
    const mockJobs: JobData[] = [
      {
        title: "Software Engineer",
        description: "We are looking for a skilled software engineer to join our team. Experience with React, TypeScript, and Node.js required.",
        company_name: "Tech Solutions Pte Ltd",
        location: "Singapore",
        category: "Technology",
        source_url: "https://sg.jobstreet.com/job/software-engineer-123",
        source_website: "jobstreet",
        employment_type: "Full-time",
        salary_min: 4000,
        salary_max: 6000,
        posted_date: new Date().toISOString()
      },
      {
        title: "Marketing Manager",
        description: "Join our marketing team to drive brand awareness and customer engagement. Digital marketing experience preferred.",
        company_name: "Myanmar Marketing Co",
        location: "Yangon",
        category: "Marketing",
        source_url: "https://www.joimyanmar.com/job/marketing-manager-456",
        source_website: "joimyanmar",
        employment_type: "Full-time",
        salary_min: 800,
        salary_max: 1200,
        posted_date: new Date().toISOString()
      },
      {
        title: "Data Analyst",
        description: "Analyze business data to provide insights and recommendations. SQL and Python experience required.",
        company_name: "Data Insights Singapore",
        location: "Singapore",
        category: "Technology",
        source_url: "https://sg.jobstreet.com/job/data-analyst-789",
        source_website: "jobstreet",
        employment_type: "Contract",
        salary_min: 3500,
        salary_max: 5000,
        posted_date: new Date().toISOString()
      }
    ];

    console.log(`Processing ${mockJobs.length} jobs...`);

    let processedJobs = 0;
    let errors = 0;

    for (const jobData of mockJobs) {
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
          const { data: newLocation, error: createLocationError } = await supabaseClient
            .from('locations')
            .insert([{ 
              city: jobData.location, 
              country: country,
              state: country === 'Singapore' ? 'Singapore' : jobData.location + ' Region'
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
        message: `Successfully processed ${processedJobs} jobs with ${errors} errors`
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