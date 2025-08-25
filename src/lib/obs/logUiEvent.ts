import { supabase } from '@/integrations/supabase/client';

interface UiEventLog {
  level: 'info' | 'error' | 'warn';
  page: string;
  message: string;
  details?: Record<string, any>;
}

/**
 * Get user company ID safely
 */
async function getTenantId(): Promise<string | null> {
  try {
    // Try to get from existing functions or auth metadata
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    // Try to get company_id from user_roles table
    const { data: roles } = await supabase
      .from('user_roles')
      .select('company_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();
    
    return roles?.company_id || null;
  } catch (err) {
    return null;
  }
}

/**
 * Log UI events for observability without including PII
 * Sanitizes all data before logging to prevent sensitive information leaks
 */
export async function logUiEvent(event: UiEventLog) {
  try {
    // Get tenant and user IDs
    const { data: { user } } = await supabase.auth.getUser();
    const tenantId = await getTenantId();
    
    // Skip logging if we can't identify the tenant
    if (!tenantId) {
      console.warn('Cannot log UI event: no tenant ID available');
      return;
    }

    // Sanitize details to remove any potential PII
    const sanitizedDetails = sanitizeDetails(event.details);
    
    // Prepare the log entry
    const logEntry = {
      tenant_id: tenantId,
      user_id: user?.id || null,
      level: event.level,
      page: event.page,
      message: event.message,
      details: sanitizedDetails,
      created_at: new Date().toISOString()
    };

    // Insert into ui_events table
    const { error } = await supabase
      .from('ui_events')
      .insert([logEntry]);

    if (error) {
      console.warn('Failed to log UI event:', error.message);
    }
  } catch (err) {
    // Don't let logging failures break the app
    console.warn('UI event logging error:', err);
  }
}

/**
 * Sanitize details object to remove PII and sensitive data
 */
function sanitizeDetails(details?: Record<string, any>): Record<string, any> | null {
  if (!details) return null;

  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(details)) {
    // Skip known PII fields
    if (isPIIField(key)) {
      continue;
    }
    
    // Sanitize string values
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    }
    // Keep safe primitive values
    else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    }
    // Recursively sanitize objects
    else if (typeof value === 'object' && value !== null) {
      const sanitizedNested = sanitizeDetails(value);
      if (sanitizedNested && Object.keys(sanitizedNested).length > 0) {
        sanitized[key] = sanitizedNested;
      }
    }
  }
  
  return Object.keys(sanitized).length > 0 ? sanitized : null;
}

/**
 * Check if a field name suggests it contains PII
 */
function isPIIField(fieldName: string): boolean {
  const piiFields = [
    'email', 'phone', 'name', 'address', 'iqama', 'saudi_id', 'passport',
    'salary', 'birth', 'personal', 'private', 'password', 'token', 'secret'
  ];
  
  const lowerField = fieldName.toLowerCase();
  return piiFields.some(pii => lowerField.includes(pii));
}

/**
 * Sanitize string values to remove potential PII patterns
 */
function sanitizeString(value: string): string {
  // Remove email patterns
  let sanitized = value.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
  
  // Remove phone patterns
  sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');
  
  // Remove ID patterns (10+ consecutive digits)
  sanitized = sanitized.replace(/\b\d{10,}\b/g, '[ID]');
  
  // Truncate very long strings
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200) + '...';
  }
  
  return sanitized;
}

/**
 * Log page view events
 */
export function logPageView(page: string, details?: Record<string, any>) {
  logUiEvent({
    level: 'info',
    page,
    message: 'Page viewed',
    details
  });
}

/**
 * Log user action events
 */
export function logUserAction(page: string, action: string, details?: Record<string, any>) {
  logUiEvent({
    level: 'info',
    page,
    message: `User action: ${action}`,
    details
  });
}

/**
 * Log error events
 */
export function logError(page: string, error: string, details?: Record<string, any>) {
  logUiEvent({
    level: 'error',
    page,
    message: error,
    details
  });
}
