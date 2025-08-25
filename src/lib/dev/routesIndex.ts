export interface RouteInfo {
  path: string;
  module: string;
  title: string;
}

/**
 * Complete list of navigable routes extracted from AppRoutes.tsx
 * Excludes auth redirects, 404s, and dynamic routes requiring IDs
 */
export const NAVIGABLE_ROUTES: RouteInfo[] = [
  // Dashboard
  { path: '/dashboard', module: 'dashboard', title: 'Dashboard' },
  
  // Diagnostic Hub
  { path: '/diagnostic/hub', module: 'diagnostic', title: 'Diagnostic Hub' },
  { path: '/diagnostic/retention', module: 'diagnostic', title: 'Retention Analysis' },
  { path: '/diagnostic/osi', module: 'diagnostic', title: 'OSI Overview' },
  
  // Dev routes (when ?dev=1)
  { path: '/_/ping', module: 'dev', title: 'Health Check' },

  // Add more routes as the application grows
  // Examples of routes to add when implemented:
  // { path: '/employees', module: 'hr', title: 'Employee Management' },
  // { path: '/reports', module: 'reports', title: 'Reports' },
  // { path: '/settings', module: 'settings', title: 'Settings' },
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