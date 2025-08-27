// Cost mapping for different AI providers
export function getModelCostPer1K(model: string) {
  const m = model.toLowerCase();
  
  // OpenAI models
  if (m.startsWith('openai:gpt-5') || m === 'gpt-5-2025-08-07') {
    return { in: 0.01, out: 0.03 }; // Example costs
  }
  if (m.startsWith('openai:gpt-4') || m.includes('gpt-4')) {
    return { in: 0.005, out: 0.015 };
  }
  
  // Manus models (open source, no cost)
  if (m.startsWith('manus:') || m.includes('manus')) {
    return { in: 0, out: 0 };
  }
  
  // Genspark models (cost-effective)
  if (m.startsWith('genspark:')) {
    const input = Number(Deno.env.get('GENSPARK_INPUT_COST_PER_1K') ?? '0.001');
    const output = Number(Deno.env.get('GENSPARK_OUTPUT_COST_PER_1K') ?? '0.002');
    return { in: input, out: output };
  }
  
  // Default fallback
  return { in: 0, out: 0 };
}

export function calculateCost(model: string, tokensIn: number, tokensOut: number): number {
  const costs = getModelCostPer1K(model);
  return (tokensIn * costs.in / 1000) + (tokensOut * costs.out / 1000);
}