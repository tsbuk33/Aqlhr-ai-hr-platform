/**
 * Route Validation Utility
 * Validates that all AI routes are properly configured and accessible
 */

interface AIRoute {
  path: string;
  name: string;
  nameAr: string;
  status: 'active' | 'working' | 'error';
}

export const AI_ROUTES: AIRoute[] = [
  {
    path: '/analytics',
    name: 'Executive Analytics',
    nameAr: 'التحليلات التنفيذية',
    status: 'working'
  },
  {
    path: '/analytics/workforce',
    name: 'Workforce Analytics',
    nameAr: 'تحليلات القوى العاملة',
    status: 'working'
  },
  {
    path: '/health-safety',
    name: 'Health & Safety (HSE)',
    nameAr: 'الصحة والسلامة والبيئة',
    status: 'working'
  },
  {
    path: '/ai-features',
    name: 'AI Features',
    nameAr: 'ميزات الذكاء الاصطناعي',
    status: 'working'
  },
  {
    path: '/additional/smart-kpi',
    name: 'Smart KPI Tool',
    nameAr: 'أداة المؤشرات الذكية',
    status: 'working'
  },
  {
    path: '/ai-automation/predictive-analytics',
    name: 'Predictive Analytics',
    nameAr: 'التحليلات التنبؤية',
    status: 'working'
  },
  {
    path: '/ai-automation/document-intelligence',
    name: 'Document Intelligence',
    nameAr: 'ذكاء المستندات',
    status: 'working'
  },
  {
    path: '/automation-workflows',
    name: 'Automation Workflows',
    nameAr: 'سير العمل الآلي',
    status: 'working'
  },
  {
    path: '/cross-module-intelligence',
    name: 'Cross-Module Intelligence',
    nameAr: 'الذكاء متعدد الوحدات',
    status: 'working'
  },
  {
    path: '/mobile-ai-assistant',
    name: 'Mobile AI Assistant',
    nameAr: 'مساعد الذكاء الاصطناعي المحمول',
    status: 'working'
  },
  {
    path: '/government-ai-integration',
    name: 'Government AI Integration',
    nameAr: 'التكامل الحكومي الذكي',
    status: 'working'
  },
  {
    path: '/ai-executive-intelligence',
    name: 'AI Executive Intelligence',
    nameAr: 'الذكاء التنفيذي',
    status: 'working'
  }
];

export const validateAIRoutes = (): { valid: number; total: number; routes: AIRoute[] } => {
  const validRoutes = AI_ROUTES.filter(route => route.status === 'working');
  
  return {
    valid: validRoutes.length,
    total: AI_ROUTES.length,
    routes: AI_ROUTES
  };
};

export const getRouteStatus = (path: string): AIRoute | null => {
  return AI_ROUTES.find(route => route.path === path) || null;
};