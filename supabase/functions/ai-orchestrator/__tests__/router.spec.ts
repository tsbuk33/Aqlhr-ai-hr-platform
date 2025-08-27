// Basic router test for provider selection
// This would be run with a test framework like Deno Test

import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

// Mock the selectBestProvider function logic for testing
function selectBestProvider(query: string, context: any): string {
  const queryLower = query.toLowerCase();
  
  // Use Genspark for cost-sensitive queries
  if (queryLower.includes('cost') || queryLower.includes('cheap') || 
      queryLower.includes('economy') || queryLower.includes('budget') ||
      queryLower.includes('efficient')) {
    return 'genspark';
  }
  
  // Use ChatGPT 5 for complex analytical queries
  if (queryLower.includes('analyze') || queryLower.includes('predict') || 
      queryLower.includes('forecast') || queryLower.includes('calculate') ||
      context.module === 'analytics' || context.module === 'executive') {
    return 'chatgpt5';
  }
  
  // Use Manus for general HR queries and explanations  
  if (queryLower.includes('explain') || queryLower.includes('how to') ||
      queryLower.includes('what is') || context.module === 'employees' ||
      context.module === 'compliance') {
    return 'manus';
  }
  
  // Default to ChatGPT 5 for other cases
  return 'chatgpt5';
}

async function mockHandleWithConfig(req: any, cfg: any) {
  // Mock tenant config selection
  let selected = 'chatgpt5';
  if (cfg?.default_model?.toLowerCase?.().startsWith('genspark')) {
    selected = 'genspark';
  } else {
    selected = selectBestProvider(req.message, req);
  }
  
  return { selectedProvider: selected };
}

Deno.test('selects GENSPARK when tenant default_model is genspark:*', async () => {
  const req = {
    tenantId: 't-1', 
    userId: 'u-1', 
    lang: 'en',
    moduleContext: 'corehr.employees', 
    pageType: 'dashboard',
    intent: 'general', 
    message: 'hello'
  };
  
  const cfg = {
    default_model: 'genspark:gpt-5',
    allow_models: ['genspark:gpt-5', 'openai:gpt-5', 'manus:writer'],
  };
  
  const { selectedProvider } = await mockHandleWithConfig(req, cfg);
  assertEquals(selectedProvider, 'genspark');
});

Deno.test('selects GENSPARK for cost-sensitive queries', async () => {
  const req = {
    tenantId: 't-1',
    userId: 'u-1', 
    lang: 'en',
    moduleContext: 'corehr.employees',
    pageType: 'dashboard', 
    intent: 'cost',
    message: 'What is the most cost-effective way to manage payroll?'
  };
  
  const cfg = {
    default_model: 'openai:gpt-5',
    allow_models: ['genspark:gpt-5', 'openai:gpt-5', 'manus:writer'],
  };
  
  const { selectedProvider } = await mockHandleWithConfig(req, cfg);
  assertEquals(selectedProvider, 'genspark');
});

Deno.test('selects CHATGPT5 for analytical queries', async () => {
  const req = {
    tenantId: 't-1',
    userId: 'u-1',
    lang: 'en', 
    moduleContext: 'analytics',
    pageType: 'dashboard',
    intent: 'analytics',
    message: 'Analyze our workforce trends'
  };
  
  const cfg = {
    default_model: 'genspark:gpt-5',
    allow_models: ['genspark:gpt-5', 'openai:gpt-5', 'manus:writer'],
  };
  
  const { selectedProvider } = await mockHandleWithConfig(req, cfg);
  assertEquals(selectedProvider, 'chatgpt5');
});

Deno.test('selects MANUS for general HR explanations', async () => {
  const req = {
    tenantId: 't-1',
    userId: 'u-1', 
    lang: 'en',
    moduleContext: 'employees',
    pageType: 'dashboard',
    intent: 'explanation',
    message: 'Explain how to onboard new employees'
  };
  
  const cfg = {
    default_model: 'genspark:gpt-5', 
    allow_models: ['genspark:gpt-5', 'openai:gpt-5', 'manus:writer'],
  };
  
  const { selectedProvider } = await mockHandleWithConfig(req, cfg);
  assertEquals(selectedProvider, 'manus');
});