// Module Context Detection Utilities
// Determines the appropriate AI module context based on application state

export type ModuleContext = 
  | 'gov.qiwa'
  | 'gov.gosi' 
  | 'gov.mudad'
  | 'gov.absher'
  | 'employee'
  | 'payroll'
  | 'policy'
  | 'compliance'
  | 'analytics'
  | 'reports'
  | 'documents'
  | 'ask-aql'
  | 'general';

/**
 * Detect module context from pathname
 */
export function detectModuleContext(pathname: string): ModuleContext {
  // Remove language prefix for consistent matching
  const cleanPath = pathname.replace(/^\/(en|ar)/, '');

  // Government integrations
  if (cleanPath.includes('/government/qiwa') || cleanPath.includes('/qiwa')) {
    return 'gov.qiwa';
  }
  if (cleanPath.includes('/government/gosi') || cleanPath.includes('/gosi')) {
    return 'gov.gosi';
  }
  if (cleanPath.includes('/government/mudad') || cleanPath.includes('/mudad')) {
    return 'gov.mudad';
  }
  if (cleanPath.includes('/government/absher') || cleanPath.includes('/absher')) {
    return 'gov.absher';
  }

  // Employee management
  if (cleanPath.includes('/employees') || cleanPath.includes('/employee')) {
    return 'employee';
  }
  if (cleanPath.includes('/payroll') || cleanPath.includes('/salary') || cleanPath.includes('/wages')) {
    return 'payroll';
  }

  // Compliance and policy
  if (cleanPath.includes('/compliance')) {
    return 'compliance';
  }
  if (cleanPath.includes('/policy') || cleanPath.includes('/policies')) {
    return 'policy';
  }

  // Analytics and reporting
  if (cleanPath.includes('/analytics') || cleanPath.includes('/dashboard')) {
    return 'analytics';
  }
  if (cleanPath.includes('/reports') || cleanPath.includes('/report')) {
    return 'reports';
  }

  // Document management
  if (cleanPath.includes('/documents') || cleanPath.includes('/files')) {
    return 'documents';
  }

  // Ask Aql assistant
  if (cleanPath.includes('/ask') || cleanPath.includes('/assistant') || cleanPath.includes('/chat')) {
    return 'ask-aql';
  }

  // Default fallback
  return 'general';
}

/**
 * Get module display name with i18n support
 */
export function getModuleDisplayName(moduleContext: ModuleContext, lang: 'en' | 'ar' = 'en'): string {
  const moduleNames: Record<ModuleContext, { en: string; ar: string }> = {
    'gov.qiwa': { 
      en: 'QIWA Integration', 
      ar: 'تكامل قوى' 
    },
    'gov.gosi': { 
      en: 'GOSI Integration', 
      ar: 'تكامل التأمينات الاجتماعية' 
    },
    'gov.mudad': { 
      en: 'Mudad Platform', 
      ar: 'منصة مداد' 
    },
    'gov.absher': { 
      en: 'Absher Integration', 
      ar: 'تكامل أبشر' 
    },
    'employee': { 
      en: 'Employee Management', 
      ar: 'إدارة الموظفين' 
    },
    'payroll': { 
      en: 'Payroll & Benefits', 
      ar: 'الرواتب والمزايا' 
    },
    'policy': { 
      en: 'Policy Management', 
      ar: 'إدارة السياسات' 
    },
    'compliance': { 
      en: 'Compliance & Legal', 
      ar: 'الامتثال والقانونية' 
    },
    'analytics': { 
      en: 'Analytics & Insights', 
      ar: 'التحليلات والرؤى' 
    },
    'reports': { 
      en: 'Reports & Documentation', 
      ar: 'التقارير والتوثيق' 
    },
    'documents': { 
      en: 'Document Management', 
      ar: 'إدارة الوثائق' 
    },
    'ask-aql': { 
      en: 'Ask Aql Assistant', 
      ar: 'مساعد اسأل عقل' 
    },
    'general': { 
      en: 'General Assistant', 
      ar: 'المساعد العام' 
    }
  };

  return moduleNames[moduleContext][lang];
}

/**
 * Get module icon (for UI components)
 */
export function getModuleIcon(moduleContext: ModuleContext): string {
  const moduleIcons: Record<ModuleContext, string> = {
    'gov.qiwa': 'Building2',
    'gov.gosi': 'Shield',
    'gov.mudad': 'FileText',
    'gov.absher': 'Users',
    'employee': 'User',
    'payroll': 'DollarSign',
    'policy': 'FileCheck',
    'compliance': 'Scale',
    'analytics': 'BarChart3',
    'reports': 'FileBarChart',
    'documents': 'FolderOpen',
    'ask-aql': 'MessageCircle',
    'general': 'Bot'
  };

  return moduleIcons[moduleContext];
}

/**
 * Get module color theme (for UI components)
 */
export function getModuleColor(moduleContext: ModuleContext): string {
  const moduleColors: Record<ModuleContext, string> = {
    'gov.qiwa': '#059669',    // emerald-600
    'gov.gosi': '#0284c7',    // sky-600
    'gov.mudad': '#7c2d12',   // orange-800
    'gov.absher': '#4338ca',  // indigo-600
    'employee': '#0d9488',    // teal-600
    'payroll': '#ca8a04',     // yellow-600
    'policy': '#9333ea',      // purple-600
    'compliance': '#dc2626',  // red-600
    'analytics': '#2563eb',   // blue-600
    'reports': '#16a34a',     // green-600
    'documents': '#ea580c',   // orange-600
    'ask-aql': '#8b5cf6',     // violet-500
    'general': '#6b7280'      // gray-500
  };

  return moduleColors[moduleContext];
}

/**
 * Check if module requires high security/compliance
 */
export function isHighSecurityModule(moduleContext: ModuleContext): boolean {
  const highSecurityModules: ModuleContext[] = [
    'gov.qiwa',
    'gov.gosi', 
    'gov.mudad',
    'gov.absher',
    'payroll',
    'compliance',
    'policy'
  ];

  return highSecurityModules.includes(moduleContext);
}

/**
 * Get default cost target for module based on business requirements
 */
export function getDefaultCostTarget(moduleContext: ModuleContext): 'low' | 'balanced' | 'high' {
  // High-performance modules (compliance, policy)
  if (['policy', 'compliance'].includes(moduleContext)) {
    return 'high';
  }

  // Cost-optimized modules (basic employee operations)
  if (['employee', 'payroll'].includes(moduleContext)) {
    return 'low';
  }

  // Balanced for everything else (government, analytics, documents)
  return 'balanced';
}

/**
 * Get priority level for module context
 */
export function getModulePriority(moduleContext: ModuleContext): number {
  const priorities: Record<ModuleContext, number> = {
    // Critical government integrations (highest priority)
    'gov.qiwa': 1,
    'gov.gosi': 1,
    'gov.mudad': 1,
    'gov.absher': 1,
    
    // Compliance and policy (high priority)
    'compliance': 2,
    'policy': 2,
    
    // Core operations (medium-high priority)
    'employee': 3,
    'payroll': 3,
    
    // Analytics and reporting (medium priority)
    'analytics': 4,
    'reports': 4,
    'documents': 4,
    
    // Assistant functions (lower priority)
    'ask-aql': 5,
    'general': 6
  };

  return priorities[moduleContext] || 6;
}

/**
 * Determine if module supports streaming by default
 */
export function supportsStreaming(moduleContext: ModuleContext): boolean {
  // Non-streaming modules (reports, analytics that need complete data)
  const nonStreamingModules: ModuleContext[] = [
    'payroll',
    'reports', 
    'analytics'
  ];

  return !nonStreamingModules.includes(moduleContext);
}

/**
 * Get module-specific timeout multiplier
 */
export function getTimeoutMultiplier(moduleContext: ModuleContext): number {
  const multipliers: Record<ModuleContext, number> = {
    // Government integrations may need more time
    'gov.qiwa': 1.5,
    'gov.gosi': 1.5,
    'gov.mudad': 1.5,
    'gov.absher': 1.5,
    
    // Complex compliance analysis needs more time
    'compliance': 2.0,
    'policy': 2.0,
    
    // Analytics may need processing time
    'analytics': 1.8,
    'reports': 1.8,
    
    // Standard modules
    'employee': 1.0,
    'payroll': 1.0,
    'documents': 1.2,
    'ask-aql': 1.0,
    'general': 1.0
  };

  return multipliers[moduleContext] || 1.0;
}

/**
 * Auto-detect module context from current browser environment
 */
export function detectCurrentModuleContext(): ModuleContext {
  if (typeof window === 'undefined') {
    return 'general';
  }

  return detectModuleContext(window.location.pathname);
}

/**
 * Get breadcrumb trail for module context (for UI navigation)
 */
export function getModuleBreadcrumbs(moduleContext: ModuleContext, lang: 'en' | 'ar' = 'en'): Array<{ label: string; href?: string }> {
  const breadcrumbs: Record<ModuleContext, Array<{ label: string; href?: string }>> = {
    'gov.qiwa': [
      { label: lang === 'ar' ? 'الحكومة' : 'Government', href: `/${lang}/government` },
      { label: lang === 'ar' ? 'قوى' : 'QIWA', href: `/${lang}/government/qiwa` }
    ],
    'gov.gosi': [
      { label: lang === 'ar' ? 'الحكومة' : 'Government', href: `/${lang}/government` },
      { label: lang === 'ar' ? 'التأمينات' : 'GOSI', href: `/${lang}/government/gosi` }
    ],
    'gov.mudad': [
      { label: lang === 'ar' ? 'الحكومة' : 'Government', href: `/${lang}/government` },
      { label: lang === 'ar' ? 'مداد' : 'Mudad', href: `/${lang}/government/mudad` }
    ],
    'gov.absher': [
      { label: lang === 'ar' ? 'الحكومة' : 'Government', href: `/${lang}/government` },
      { label: lang === 'ar' ? 'أبشر' : 'Absher', href: `/${lang}/government/absher` }
    ],
    'employee': [
      { label: lang === 'ar' ? 'الموظفين' : 'Employees', href: `/${lang}/employees` }
    ],
    'payroll': [
      { label: lang === 'ar' ? 'الرواتب' : 'Payroll', href: `/${lang}/payroll` }
    ],
    'policy': [
      { label: lang === 'ar' ? 'السياسات' : 'Policies', href: `/${lang}/policies` }
    ],
    'compliance': [
      { label: lang === 'ar' ? 'الامتثال' : 'Compliance', href: `/${lang}/compliance` }
    ],
    'analytics': [
      { label: lang === 'ar' ? 'التحليلات' : 'Analytics', href: `/${lang}/analytics` }
    ],
    'reports': [
      { label: lang === 'ar' ? 'التقارير' : 'Reports', href: `/${lang}/reports` }
    ],
    'documents': [
      { label: lang === 'ar' ? 'الوثائق' : 'Documents', href: `/${lang}/documents` }
    ],
    'ask-aql': [
      { label: lang === 'ar' ? 'اسأل عقل' : 'Ask Aql', href: `/${lang}/ask` }
    ],
    'general': [
      { label: lang === 'ar' ? 'عام' : 'General' }
    ]
  };

  return breadcrumbs[moduleContext] || [];
}