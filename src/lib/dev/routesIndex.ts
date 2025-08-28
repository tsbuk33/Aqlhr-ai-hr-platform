export interface RouteInfo {
  path: string;
  module: string;
  title: string;
}

/**
 * Complete list of navigable routes extracted from AppRoutes.tsx
 * Includes all major application routes for comprehensive testing
 */
export const NAVIGABLE_ROUTES: RouteInfo[] = [
  // Dashboard & Main
  { path: '/dashboard', module: 'dashboard', title: 'Dashboard' },
  
  // Employee Management
  { path: '/employees', module: 'hr', title: 'Employee Master Data' },
  { path: '/people/employees', module: 'hr', title: 'Employee List' },
  
  // Core HR Modules
  { path: '/recruitment', module: 'recruitment', title: 'Recruitment' },
  { path: '/payroll', module: 'payroll', title: 'Payroll' },
  { path: '/performance', module: 'performance', title: 'Performance Management' },
  { path: '/training', module: 'training', title: 'Training & Development' },
  
  // Analytics & Business Intelligence
  { path: '/analytics', module: 'analytics', title: 'Analytics & Insights' },
  { path: '/company', module: 'company', title: 'Company Management' },
  
  // Diagnostic Hub & Analysis
  { path: '/diagnostic/hub', module: 'diagnostic', title: 'Diagnostic Hub' },
  { path: '/diagnostic/retention', module: 'diagnostic', title: 'Retention Analysis' },
  { path: '/diagnostic/osi', module: 'diagnostic', title: 'OSI Overview' },
  
  // Government & Compliance
  { path: '/government', module: 'government', title: 'Government Compliance' },
  { path: '/integrations', module: 'integrations', title: 'System Integrations' },
  
  // Executive Intelligence
  { path: '/executive-center', module: 'executive', title: 'Executive Intelligence Center' },
  
  // AI & Automation
  { path: '/ai-test', module: 'ai', title: 'AI System Testing' },
  { path: '/ai-ecosystem/workforce-optimizer', module: 'ai', title: 'Workforce Optimizer' },
  { path: '/ai-ecosystem/reporting-engine', module: 'ai', title: 'Reporting Engine' },
  
  // Tools & Utilities
  { path: '/tools', module: 'tools', title: 'Tools & Utilities' },
  { path: '/help', module: 'help', title: 'Help & Support' },
  
  // Administration
  { path: '/profile', module: 'profile', title: 'User Profile' },
  { path: '/admin/users', module: 'admin', title: 'User Management' },
  { path: '/admin/company', module: 'admin', title: 'Company Administration' },
  { path: '/admin/ai-integration', module: 'admin', title: 'AI Integration Management' },
  
  // Dev & System Health
  { path: '/_/ping', module: 'dev', title: 'Health Check' },
  { path: '/_/route-audit', module: 'dev', title: 'Route Audit System' },
  { path: '/_/smoke', module: 'dev', title: 'Smoke Test (Route Validation)' },
];

/**
 * Get all routes for a specific module
 */
export function getRoutesByModule(module: string): RouteInfo[] {
  return NAVIGABLE_ROUTES.filter(route => route.module === module);
}

/**
 * Get all available modules
 */
export function getAllModules(): string[] {
  return [...new Set(NAVIGABLE_ROUTES.map(route => route.module))];
}