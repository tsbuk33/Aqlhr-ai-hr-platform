/**
 * Developer Mode Utilities
 * Provides functions to bypass authentication and entitlement checks for development/testing
 */

export const isDeveloperMode = (): boolean => {
  return (
    process.env.NODE_ENV === 'development' || 
    window.location.hostname === 'localhost' ||
    window.location.search.includes('dev=true') ||
    window.location.search.includes('developer=true')
  );
};

export const bypassEntitlement = (hasEntitlement: boolean): boolean => {
  return hasEntitlement || isDeveloperMode();
};

export const bypassAuth = (isAuthenticated: boolean): boolean => {
  return isAuthenticated || isDeveloperMode();
};

export const getMockCaseId = (): string => {
  return 'dev-mode-case-id';
};

export const getMockUserId = (): string => {
  return 'dev-mode-user-id';
};

export const getMockCompanyId = (): string => {
  return 'dev-mode-company-id';
};

export const logDeveloperMode = (module: string): void => {
  if (isDeveloperMode()) {
    console.log(`🔧 Developer Mode: ${module} - Bypassing authentication and entitlement checks`);
  }
};