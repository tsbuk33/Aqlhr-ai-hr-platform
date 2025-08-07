import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PromptLogEntry {
  id: string;
  timestamp: string;
  category: string;
  title: string;
  description: string;
  status: 'implemented' | 'in-progress' | 'pending' | 'blocked';
  priority: 'high' | 'medium' | 'low';
  relatedCommits?: string[];
  implementation_notes?: string;
  technical_details?: string;
}

const promptHistory: PromptLogEntry[] = [
  {
    id: '001',
    timestamp: '2024-01-15T10:00:00Z',
    category: 'AI Infrastructure',
    title: 'AI Agent Orchestrator Implementation',
    description: 'Create multi-provider AI orchestration system with OpenAI, Claude, and Gemini support',
    status: 'implemented',
    priority: 'high',
    implementation_notes: 'useAIAgentOrchestrator hook created with provider fallback, confidence scoring',
    technical_details: 'Hook supports multiple providers, context passing, language detection, and best response selection'
  },
  {
    id: '002',
    timestamp: '2024-01-16T14:30:00Z',
    category: 'Authentication',
    title: 'Supabase Authentication Setup',
    description: 'Implement user authentication with Row Level Security policies',
    status: 'implemented',
    priority: 'high',
    implementation_notes: 'Auth components and RLS policies configured',
    technical_details: 'Login/signup flows, protected routes, user session management'
  },
  {
    id: '003',
    timestamp: '2024-01-17T09:15:00Z',
    category: 'Internationalization',
    title: 'Arabic Language Support',
    description: 'Add RTL support and Arabic/English language toggle with SimpleLanguageContext',
    status: 'implemented',
    priority: 'medium',
    implementation_notes: 'SimpleLanguageContext with Arabic/English toggle, RTL CSS support',
    technical_details: 'Context provider for language state, RTL text direction, Arabic font support'
  },
  {
    id: '004',
    timestamp: '2024-01-18T11:45:00Z',
    category: 'AI Features',
    title: 'AI Response Debugging',
    description: 'Fix AI assistant response display issues, formatting, and loading states',
    status: 'implemented',
    priority: 'high',
    implementation_notes: 'Updated AI model to gpt-4.1-2025-04-14, improved response handling',
    technical_details: 'Model upgrade, better error handling, response formatting fixes'
  },
  {
    id: '005',
    timestamp: '2024-01-19T16:20:00Z',
    category: 'System Architecture',
    title: 'Prompt Tracking System',
    description: 'Create comprehensive prompt log dashboard and export API endpoint',
    status: 'implemented',
    priority: 'medium',
    implementation_notes: 'PromptLog component with filtering, status tracking, and JSON export functionality',
    technical_details: 'React dashboard, Supabase edge function for export, status categorization'
  },
  {
    id: '006',
    timestamp: '2024-01-15T08:00:00Z',
    category: 'Project Setup',
    title: 'Initial AqlHR System Architecture',
    description: 'Set up comprehensive HR management system with AI integration',
    status: 'implemented',
    priority: 'high',
    implementation_notes: 'Core project structure, routing, and base components established',
    technical_details: 'React + TypeScript + Tailwind + Supabase stack'
  },
  {
    id: '007',
    timestamp: '2024-01-16T12:00:00Z',
    category: 'Database Design',
    title: 'HR Database Schema',
    description: 'Design and implement database tables for employees, departments, policies, etc.',
    status: 'implemented',
    priority: 'high',
    implementation_notes: 'Core HR tables with RLS policies for data security',
    technical_details: 'Employee profiles, department management, policy tracking, audit logs'
  },
  {
    id: '008',
    timestamp: '2024-01-17T15:30:00Z',
    category: 'AI Integration',
    title: 'AI Policy Analyzer',
    description: 'Implement AI-powered policy analysis and recommendation engine',
    status: 'implemented',
    priority: 'high',
    implementation_notes: 'Edge function for policy analysis with OpenAI integration',
    technical_details: 'Natural language processing for HR policies, compliance checking'
  },
  {
    id: '009',
    timestamp: '2024-01-18T13:15:00Z',
    category: 'Performance',
    title: 'Knowledge Crawler Optimization',
    description: 'Implement efficient knowledge base crawling and indexing system',
    status: 'implemented',
    priority: 'medium',
    implementation_notes: 'AQLHR knowledge crawler edge function with caching',
    technical_details: 'Web scraping, content indexing, search optimization'
  },
  {
    id: '010',
    timestamp: '2024-01-19T10:45:00Z',
    category: 'AI Features',
    title: 'Engagement Optimization AI',
    description: 'Create AI system for employee engagement analysis and recommendations',
    status: 'implemented',
    priority: 'medium',
    implementation_notes: 'AI-driven engagement metrics and improvement suggestions',
    technical_details: 'Engagement scoring, recommendation algorithms, trend analysis'
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const format = url.searchParams.get('format') || 'json';
    const category = url.searchParams.get('category');
    const status = url.searchParams.get('status');

    let filteredPrompts = promptHistory;

    // Apply filters
    if (category) {
      filteredPrompts = filteredPrompts.filter(p => 
        p.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (status) {
      filteredPrompts = filteredPrompts.filter(p => p.status === status);
    }

    // Sort by timestamp
    filteredPrompts.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const exportData = {
      meta: {
        total_prompts: filteredPrompts.length,
        export_timestamp: new Date().toISOString(),
        filters_applied: { category, status },
        status_summary: {
          implemented: filteredPrompts.filter(p => p.status === 'implemented').length,
          'in-progress': filteredPrompts.filter(p => p.status === 'in-progress').length,
          pending: filteredPrompts.filter(p => p.status === 'pending').length,
          blocked: filteredPrompts.filter(p => p.status === 'blocked').length
        }
      },
      prompts: filteredPrompts
    };

    if (format === 'csv') {
      // Convert to CSV format
      const csvHeaders = 'ID,Timestamp,Category,Title,Description,Status,Priority,Implementation Notes\n';
      const csvRows = filteredPrompts.map(p => 
        `"${p.id}","${p.timestamp}","${p.category}","${p.title}","${p.description}","${p.status}","${p.priority}","${p.implementation_notes || ''}"`
      ).join('\n');
      
      return new Response(csvHeaders + csvRows, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="aqlhr-prompt-log.csv"'
        },
      });
    }

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in prompt-log-export function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});