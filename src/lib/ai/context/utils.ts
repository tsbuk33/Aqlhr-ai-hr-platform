import { 
  IntentType, 
  AIProvider, 
  CostTarget, 
  Language,
  IntentStats,
  RoutingPerformance,
  AIIntentLabel,
  ProviderConfig
} from './types';

// Intent label definitions with localization
export const INTENT_LABELS: AIIntentLabel[] = [
  {
    intent: 'question',
    name_en: 'Question',
    name_ar: 'سؤال',
    description_en: 'Information seeking or clarification request',
    description_ar: 'طلب معلومات أو توضيح',
    color: '#3B82F6', // blue
    icon: 'HelpCircle'
  },
  {
    intent: 'task',
    name_en: 'Task',
    name_ar: 'مهمة',
    description_en: 'Action or operation to be performed',
    description_ar: 'إجراء أو عملية يجب تنفيذها',
    color: '#10B981', // green
    icon: 'CheckSquare'
  },
  {
    intent: 'analysis',
    name_en: 'Analysis',
    name_ar: 'تحليل',
    description_en: 'Data examination or evaluation request',
    description_ar: 'طلب فحص أو تقييم البيانات',
    color: '#8B5CF6', // purple
    icon: 'BarChart'
  },
  {
    intent: 'generation',
    name_en: 'Generation',
    name_ar: 'إنشاء',
    description_en: 'Content or document creation request',
    description_ar: 'طلب إنشاء محتوى أو وثيقة',
    color: '#F59E0B', // amber
    icon: 'FileText'
  },
  {
    intent: 'search',
    name_en: 'Search',
    name_ar: 'بحث',
    description_en: 'Information retrieval or lookup',
    description_ar: 'استرجاع المعلومات أو البحث',
    color: '#6B7280', // gray
    icon: 'Search'
  },
  {
    intent: 'conversation',
    name_en: 'Conversation',
    name_ar: 'محادثة',
    description_en: 'Interactive dialogue or chat',
    description_ar: 'حوار تفاعلي أو دردشة',
    color: '#EC4899', // pink
    icon: 'MessageCircle'
  },
  {
    intent: 'troubleshooting',
    name_en: 'Troubleshooting',
    name_ar: 'حل المشاكل',
    description_en: 'Problem diagnosis and resolution',
    description_ar: 'تشخيص المشاكل وحلولها',
    color: '#EF4444', // red
    icon: 'AlertTriangle'
  },
  {
    intent: 'other',
    name_en: 'Other',
    name_ar: 'أخرى',
    description_en: 'Miscellaneous or unclassified request',
    description_ar: 'طلب متنوع أو غير مصنف',
    color: '#64748B', // slate
    icon: 'MoreHorizontal'
  }
];

/**
 * Get localized intent label
 */
export function getIntentLabel(intent: IntentType, lang: Language = 'en'): AIIntentLabel | undefined {
  return INTENT_LABELS.find(label => label.intent === intent);
}

/**
 * Get intent display name
 */
export function getIntentName(intent: IntentType, lang: Language = 'en'): string {
  const label = getIntentLabel(intent, lang);
  return lang === 'ar' ? (label?.name_ar || intent) : (label?.name_en || intent);
}

/**
 * Get intent description
 */
export function getIntentDescription(intent: IntentType, lang: Language = 'en'): string {
  const label = getIntentLabel(intent, lang);
  return lang === 'ar' ? (label?.description_ar || '') : (label?.description_en || '');
}

/**
 * Get intent color
 */
export function getIntentColor(intent: IntentType): string {
  const label = getIntentLabel(intent);
  return label?.color || '#64748B';
}

/**
 * Get intent icon
 */
export function getIntentIcon(intent: IntentType): string {
  const label = getIntentLabel(intent);
  return label?.icon || 'MoreHorizontal';
}

/**
 * Format urgency score for display
 */
export function formatUrgency(urgency: number, lang: Language = 'en'): string {
  if (urgency >= 0.8) {
    return lang === 'ar' ? 'عاجل جداً' : 'Very Urgent';
  } else if (urgency >= 0.6) {
    return lang === 'ar' ? 'عاجل' : 'Urgent';
  } else if (urgency >= 0.4) {
    return lang === 'ar' ? 'متوسط' : 'Medium';
  } else if (urgency >= 0.2) {
    return lang === 'ar' ? 'منخفض' : 'Low';
  } else {
    return lang === 'ar' ? 'غير عاجل' : 'Not Urgent';
  }
}

/**
 * Format complexity score for display
 */
export function formatComplexity(complexity: number, lang: Language = 'en'): string {
  if (complexity >= 0.8) {
    return lang === 'ar' ? 'معقد جداً' : 'Very Complex';
  } else if (complexity >= 0.6) {
    return lang === 'ar' ? 'معقد' : 'Complex';
  } else if (complexity >= 0.4) {
    return lang === 'ar' ? 'متوسط' : 'Medium';
  } else if (complexity >= 0.2) {
    return lang === 'ar' ? 'بسيط' : 'Simple';
  } else {
    return lang === 'ar' ? 'بسيط جداً' : 'Very Simple';
  }
}

/**
 * Format confidence score for display
 */
export function formatConfidence(confidence: number, lang: Language = 'en'): string {
  if (confidence >= 0.9) {
    return lang === 'ar' ? 'عالية جداً' : 'Very High';
  } else if (confidence >= 0.7) {
    return lang === 'ar' ? 'عالية' : 'High';
  } else if (confidence >= 0.5) {
    return lang === 'ar' ? 'متوسطة' : 'Medium';
  } else if (confidence >= 0.3) {
    return lang === 'ar' ? 'منخفضة' : 'Low';
  } else {
    return lang === 'ar' ? 'منخفضة جداً' : 'Very Low';
  }
}

/**
 * Format cost target for display
 */
export function formatCostTarget(costTarget: CostTarget, lang: Language = 'en'): string {
  const translations: Record<CostTarget, { en: string; ar: string }> = {
    low: { en: 'Low Cost', ar: 'تكلفة منخفضة' },
    balanced: { en: 'Balanced', ar: 'متوازن' },
    high: { en: 'High Performance', ar: 'أداء عالي' }
  };
  
  return translations[costTarget][lang];
}

/**
 * Format provider name for display
 */
export function formatProviderName(provider: AIProvider): string {
  const names: Record<AIProvider, string> = {
    genspark: 'GenSpark AI',
    openai: 'OpenAI',
    manus: 'Manus AI',
    gemini: 'Google Gemini'
  };
  
  return names[provider] || provider;
}

/**
 * Get urgency color (for UI components)
 */
export function getUrgencyColor(urgency: number): string {
  if (urgency >= 0.8) return '#EF4444'; // red
  if (urgency >= 0.6) return '#F97316'; // orange  
  if (urgency >= 0.4) return '#F59E0B'; // amber
  if (urgency >= 0.2) return '#10B981'; // emerald
  return '#6B7280'; // gray
}

/**
 * Get complexity color (for UI components)
 */
export function getComplexityColor(complexity: number): string {
  if (complexity >= 0.8) return '#7C3AED'; // violet
  if (complexity >= 0.6) return '#8B5CF6'; // purple
  if (complexity >= 0.4) return '#3B82F6'; // blue
  if (complexity >= 0.2) return '#06B6D4'; // cyan
  return '#10B981'; // emerald
}

/**
 * Get confidence color (for UI components)
 */
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.9) return '#10B981'; // emerald
  if (confidence >= 0.7) return '#84CC16'; // lime
  if (confidence >= 0.5) return '#F59E0B'; // amber
  if (confidence >= 0.3) return '#F97316'; // orange
  return '#EF4444'; // red
}

/**
 * Calculate success rate percentage
 */
export function calculateSuccessRate(successful: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((successful / total) * 100);
}

/**
 * Format latency for display
 */
export function formatLatency(latencyMs: number, lang: Language = 'en'): string {
  if (latencyMs < 1000) {
    return `${latencyMs}${lang === 'ar' ? ' مللي ثانية' : 'ms'}`;
  } else if (latencyMs < 60000) {
    const seconds = (latencyMs / 1000).toFixed(1);
    return `${seconds}${lang === 'ar' ? ' ثانية' : 's'}`;
  } else {
    const minutes = Math.floor(latencyMs / 60000);
    const seconds = Math.floor((latencyMs % 60000) / 1000);
    return lang === 'ar' 
      ? `${minutes} دقيقة ${seconds} ثانية`
      : `${minutes}m ${seconds}s`;
  }
}

/**
 * Format token count for display
 */
export function formatTokens(tokens: number, lang: Language = 'en'): string {
  if (tokens < 1000) {
    return `${tokens} ${lang === 'ar' ? 'رمز' : 'tokens'}`;
  } else if (tokens < 1000000) {
    const k = (tokens / 1000).toFixed(1);
    return `${k}${lang === 'ar' ? 'ألف رمز' : 'K tokens'}`;
  } else {
    const m = (tokens / 1000000).toFixed(1);
    return `${m}${lang === 'ar' ? 'مليون رمز' : 'M tokens'}`;
  }
}

/**
 * Format cost estimate for display
 */
export function formatCost(cost: number, currency: string = 'USD', lang: Language = 'en'): string {
  if (cost < 0.01) {
    return `<$0.01`;
  } else if (cost < 1) {
    return `$${cost.toFixed(3)}`;
  } else {
    return `$${cost.toFixed(2)}`;
  }
}

/**
 * Determine best provider based on requirements
 */
export function selectOptimalProvider(
  requirements: {
    urgency: number;
    complexity: number;
    costTarget: CostTarget;
    streaming?: boolean;
  },
  availableProviders: ProviderConfig[]
): ProviderConfig | null {
  if (availableProviders.length === 0) return null;

  // Score each provider based on requirements
  const scoredProviders = availableProviders.map(provider => {
    let score = 0;
    
    // Base priority score
    score += (5 - provider.priority) * 20; // Higher priority = higher score
    
    // Adjust for urgency (prefer faster providers for urgent requests)
    if (requirements.urgency > 0.7) {
      if (provider.provider === 'genspark') score += 15;
      if (provider.provider === 'openai') score += 10;
    }
    
    // Adjust for complexity (prefer more capable providers for complex tasks)
    if (requirements.complexity > 0.7) {
      if (provider.provider === 'genspark') score += 20;
      if (provider.provider === 'gemini') score += 15;
      if (provider.provider === 'openai') score += 10;
    }
    
    // Adjust for cost target
    if (requirements.costTarget === 'low') {
      if (provider.provider === 'manus') score += 15;
      if (provider.provider === 'genspark') score += 10;
    } else if (requirements.costTarget === 'high') {
      if (provider.provider === 'genspark') score += 20;
      if (provider.provider === 'openai') score += 15;
    }
    
    // Streaming preference
    if (requirements.streaming && provider.streaming) {
      score += 10;
    }
    
    return { provider, score };
  });

  // Sort by score and return the best
  scoredProviders.sort((a, b) => b.score - a.score);
  return scoredProviders[0].provider;
}

/**
 * Generate analytics summary
 */
export function generateAnalyticsSummary(
  intentStats: IntentStats, 
  routingPerformance: RoutingPerformance,
  lang: Language = 'en'
): {
  totalRequests: number;
  overallSuccessRate: number;
  avgLatency: number;
  topIntent: string;
  topProvider: string;
  insights: string[];
} {
  const topIntent = intentStats.intent_distribution[0]?.intent || 'unknown';
  const topProvider = routingPerformance.provider_performance
    .sort((a, b) => b.total_requests - a.total_requests)[0]?.provider || 'unknown';

  const insights: string[] = [];
  
  // Generate insights based on data
  if (routingPerformance.success_rate < 0.9) {
    insights.push(lang === 'ar' 
      ? 'معدل النجاح منخفض - يُنصح بمراجعة إعدادات التوجيه'
      : 'Low success rate - consider reviewing routing configuration');
  }
  
  if (routingPerformance.avg_latency_ms > 5000) {
    insights.push(lang === 'ar'
      ? 'زمن الاستجابة مرتفع - قد تحتاج لتحسين الأداء'
      : 'High latency detected - performance optimization may be needed');
  }
  
  const hourlyPeak = routingPerformance.hourly_performance
    .sort((a, b) => b.total_requests - a.total_requests)[0];
  if (hourlyPeak) {
    insights.push(lang === 'ar'
      ? `ذروة الاستخدام في الساعة ${hourlyPeak.hour}`
      : `Peak usage at hour ${hourlyPeak.hour}`);
  }

  return {
    totalRequests: intentStats.total_intents,
    overallSuccessRate: routingPerformance.success_rate,
    avgLatency: routingPerformance.avg_latency_ms,
    topIntent: getIntentName(topIntent as IntentType, lang),
    topProvider: formatProviderName(topProvider as AIProvider),
    insights
  };
}

/**
 * Validate intent classification result
 */
export function validateIntentResult(result: any): boolean {
  return (
    result &&
    typeof result.intent === 'string' &&
    typeof result.urgency === 'number' &&
    typeof result.complexity === 'number' &&
    typeof result.confidence === 'number' &&
    result.urgency >= 0 && result.urgency <= 1 &&
    result.complexity >= 0 && result.complexity <= 1 &&
    result.confidence >= 0 && result.confidence <= 1 &&
    Array.isArray(result.riskHints)
  );
}

/**
 * Generate module context display name
 */
export function getModuleDisplayName(moduleContext: string, lang: Language = 'en'): string {
  const moduleNames: Record<string, { en: string; ar: string }> = {
    'ask-aql': { en: 'Ask Aql Assistant', ar: 'مساعد اسأل عقل' },
    'gov.qiwa': { en: 'Qiwa Government Services', ar: 'خدمات قوى الحكومية' },
    'employee': { en: 'Employee Management', ar: 'إدارة الموظفين' },
    'payroll': { en: 'Payroll & Benefits', ar: 'الرواتب والمزايا' },
    'compliance': { en: 'Compliance & Legal', ar: 'الامتثال والقانونية' },
    'analytics': { en: 'Analytics & Reports', ar: 'التحليلات والتقارير' },
    'documents': { en: 'Document Management', ar: 'إدارة الوثائق' },
    'reports': { en: 'Reporting System', ar: 'نظام التقارير' },
    'settings': { en: 'System Settings', ar: 'إعدادات النظام' },
    'general': { en: 'General Assistant', ar: 'المساعد العام' }
  };
  
  const names = moduleNames[moduleContext];
  if (!names) return moduleContext;
  
  return names[lang];
}

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(
  featureFlags: Record<string, boolean>, 
  feature: keyof typeof featureFlags
): boolean {
  return featureFlags[feature] === true;
}

/**
 * Get risk level from hints
 */
export function getRiskLevel(riskHints: string[]): 'low' | 'medium' | 'high' {
  const criticalHints = ['pii', 'financial', 'security', 'admin'];
  const mediumHints = ['sensitive', 'confidential', 'internal'];
  
  const hasCritical = riskHints.some(hint => 
    criticalHints.some(critical => hint.toLowerCase().includes(critical))
  );
  
  if (hasCritical) return 'high';
  
  const hasMedium = riskHints.some(hint => 
    mediumHints.some(medium => hint.toLowerCase().includes(medium))
  );
  
  if (hasMedium) return 'medium';
  return 'low';
}

/**
 * Format risk level for display
 */
export function formatRiskLevel(riskHints: string[], lang: Language = 'en'): string {
  const level = getRiskLevel(riskHints);
  
  const translations = {
    low: { en: 'Low Risk', ar: 'مخاطر منخفضة' },
    medium: { en: 'Medium Risk', ar: 'مخاطر متوسطة' },
    high: { en: 'High Risk', ar: 'مخاطر عالية' }
  };
  
  return translations[level][lang];
}

/**
 * Get risk color
 */
export function getRiskColor(riskHints: string[]): string {
  const level = getRiskLevel(riskHints);
  
  const colors = {
    low: '#10B981',    // green
    medium: '#F59E0B', // amber  
    high: '#EF4444'    // red
  };
  
  return colors[level];
}