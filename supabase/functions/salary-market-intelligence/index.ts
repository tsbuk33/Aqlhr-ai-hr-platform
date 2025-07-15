import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapingResult {
  source: string;
  position: string;
  salaries: number[];
  currency: string;
  success: boolean;
  error?: string;
}

interface SalaryData {
  minimum: number;
  midpoint: number;
  maximum: number;
  confidence: number;
  competitiveness: number;
  sources: string[];
  recommendations: string[];
  marketTrend: number;
}

// Market intelligence sources configuration
const MARKET_SOURCES = [
  {
    name: "Bayt.com",
    baseUrl: "https://www.bayt.com",
    selector: ".salary-range, .salary-info",
    active: true
  },
  {
    name: "LinkedIn Salary",
    baseUrl: "https://www.linkedin.com/salary",
    selector: ".salary-insight, .compensation-info",
    active: true
  },
  {
    name: "Glassdoor",
    baseUrl: "https://www.glassdoor.com",
    selector: ".salary-amount, .salary-estimate",
    active: true
  },
  {
    name: "Indeed Salaries",
    baseUrl: "https://www.indeed.com/salaries",
    selector: ".salary-snippet, .salary-range",
    active: true
  },
  {
    name: "PayScale",
    baseUrl: "https://www.payscale.com",
    selector: ".salary-data, .compensation-range",
    active: true
  },
  {
    name: "HRSD.gov.sa",
    baseUrl: "https://hrsd.gov.sa",
    selector: ".salary-guide, .wage-data",
    active: true
  }
];

// Simulated web scraping function (replace with actual scraping logic)
async function scrapePositionSalary(position: string, location: string): Promise<ScrapingResult[]> {
  console.log(`Scraping salary data for ${position} in ${location}`);
  
  // Simulate realistic scraping results with some variance
  const basesSalary = getBaseSalaryForPosition(position);
  const results: ScrapingResult[] = [];
  
  for (const source of MARKET_SOURCES) {
    if (!source.active) continue;
    
    try {
      // Simulate scraping delay and potential failures
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
      // Simulate occasional failures
      if (Math.random() < 0.1) {
        results.push({
          source: source.name,
          position,
          salaries: [],
          currency: "SAR",
          success: false,
          error: "Request timeout"
        });
        continue;
      }
      
      // Generate realistic salary data with variance
      const variance = 0.2; // 20% variance
      const count = Math.floor(Math.random() * 5) + 3; // 3-7 data points
      const salaries: number[] = [];
      
      for (let i = 0; i < count; i++) {
        const factor = 1 + (Math.random() - 0.5) * variance;
        salaries.push(Math.round(basesSalary * factor));
      }
      
      results.push({
        source: source.name,
        position,
        salaries: salaries.sort((a, b) => a - b),
        currency: "SAR",
        success: true
      });
      
    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error);
      results.push({
        source: source.name,
        position,
        salaries: [],
        currency: "SAR",
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

function getBaseSalaryForPosition(position: string): number {
  // Base salary mapping for common positions in SAR
  const salaryMap: Record<string, number> = {
    "software engineer": 15000,
    "senior software engineer": 22000,
    "hr manager": 18000,
    "sales manager": 20000,
    "marketing specialist": 12000,
    "data analyst": 14000,
    "project manager": 25000,
    "financial analyst": 16000,
    "ux designer": 13000,
    "devops engineer": 20000,
    "ceo": 45000,
    "accountant": 12000
  };
  
  const normalizedPosition = position.toLowerCase();
  
  // Find closest match
  for (const [key, salary] of Object.entries(salaryMap)) {
    if (normalizedPosition.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedPosition)) {
      return salary;
    }
  }
  
  // Default salary if no match found
  return 15000;
}

function calculateSalaryBands(results: ScrapingResult[]): SalaryData {
  const successfulResults = results.filter(r => r.success);
  const allSalaries: number[] = [];
  
  // Collect all salary data points
  successfulResults.forEach(result => {
    allSalaries.push(...result.salaries);
  });
  
  if (allSalaries.length === 0) {
    throw new Error("No valid salary data found");
  }
  
  // Remove outliers (bottom 5% and top 5%)
  allSalaries.sort((a, b) => a - b);
  const cleanedSalaries = removeOutliers(allSalaries);
  
  // Calculate percentiles
  const minimum = percentile(cleanedSalaries, 10);
  const midpoint = percentile(cleanedSalaries, 50);
  const maximum = percentile(cleanedSalaries, 90);
  
  // Calculate confidence score based on data quality
  const confidence = calculateConfidence(successfulResults, cleanedSalaries.length);
  
  // Calculate market competitiveness (simulated)
  const competitiveness = Math.min(95, Math.max(60, 80 + Math.random() * 15));
  
  // Generate market trend (simulated)
  const marketTrend = (Math.random() - 0.4) * 8; // -3.2% to +4.8%
  
  // Generate AI recommendations
  const recommendations = generateRecommendations(minimum, midpoint, maximum, competitiveness, marketTrend);
  
  return {
    minimum: Math.round(minimum),
    midpoint: Math.round(midpoint),
    maximum: Math.round(maximum),
    confidence: Math.round(confidence),
    competitiveness: Math.round(competitiveness),
    sources: successfulResults.map(r => r.source),
    recommendations,
    marketTrend: Math.round(marketTrend * 10) / 10
  };
}

function removeOutliers(salaries: number[]): number[] {
  const q1Index = Math.floor(salaries.length * 0.25);
  const q3Index = Math.floor(salaries.length * 0.75);
  const q1 = salaries[q1Index];
  const q3 = salaries[q3Index];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  return salaries.filter(salary => salary >= lowerBound && salary <= upperBound);
}

function percentile(sortedArray: number[], p: number): number {
  const index = (p / 100) * (sortedArray.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;
  
  if (upper >= sortedArray.length) return sortedArray[sortedArray.length - 1];
  if (lower < 0) return sortedArray[0];
  
  return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
}

function calculateConfidence(results: ScrapingResult[], dataPoints: number): number {
  const sourceCount = results.length;
  const successRate = results.filter(r => r.success).length / sourceCount;
  
  // Base confidence on number of sources and data points
  let confidence = (sourceCount / MARKET_SOURCES.length) * 40; // Max 40 points for source coverage
  confidence += Math.min(40, (dataPoints / 20) * 40); // Max 40 points for data quantity
  confidence += successRate * 20; // Max 20 points for success rate
  
  return Math.min(100, confidence);
}

function generateRecommendations(min: number, mid: number, max: number, competitiveness: number, trend: number): string[] {
  const recommendations: string[] = [];
  
  if (competitiveness < 75) {
    recommendations.push("Consider salary adjustments to improve market competitiveness");
  }
  
  if (trend > 3) {
    recommendations.push("Market salaries are trending upward - review compensation strategy");
  } else if (trend < -2) {
    recommendations.push("Market salaries are declining - opportunity for cost optimization");
  }
  
  if (max - min > mid * 0.8) {
    recommendations.push("Wide salary range detected - consider refining band structure");
  }
  
  if (competitiveness > 90) {
    recommendations.push("Excellent market position - focus on retention strategies");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("Salary band is well-aligned with market standards");
  }
  
  return recommendations;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { position, department, level, location = "Saudi Arabia" } = await req.json();
    
    if (!position) {
      return new Response(
        JSON.stringify({ error: "Position is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing salary search for: ${position}, ${department}, ${level}, ${location}`);

    // Perform web scraping
    const scrapingResults = await scrapePositionSalary(position, location);
    
    // Calculate salary bands and intelligence
    const salaryData = calculateSalaryBands(scrapingResults);
    
    console.log(`Salary data calculated:`, salaryData);

    return new Response(
      JSON.stringify(salaryData),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in salary-market-intelligence function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        minimum: 0,
        midpoint: 0,
        maximum: 0,
        confidence: 0,
        competitiveness: 0,
        sources: [],
        recommendations: ["Unable to fetch market data at this time"],
        marketTrend: 0
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});