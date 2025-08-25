/**
 * PDPL-compliant employee data masking utilities
 * Admin users see full data, non-admin users see masked PII
 */

export interface Employee {
  id: string;
  employee_number?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  iqama_number?: string;
  saudi_id?: string;
  position?: string;
  department?: string;
  status?: string;
  hire_date?: string;
  salary?: number;
  is_saudi?: boolean;
  [key: string]: any;
}

export interface MaskedEmployee extends Employee {
  displayName: string;
  iqamaMasked?: string;
  emailMasked?: string;
  phoneMasked?: string;
  saudiIdMasked?: string;
}

interface MaskingOptions {
  isAdmin: boolean;
}

/**
 * Masks employee PII data based on user role
 * Admin users see full data, non-admin users see masked data
 */
export function maskEmployee(emp: Employee, options: MaskingOptions): MaskedEmployee {
  const { isAdmin } = options;
  
  if (isAdmin) {
    // Admin sees full data
    return {
      ...emp,
      displayName: emp.full_name || `Employee ${emp.employee_number || emp.id?.slice(0, 8)}`,
      iqamaMasked: emp.iqama_number,
      emailMasked: emp.email,
      phoneMasked: emp.phone,
      saudiIdMasked: emp.saudi_id
    };
  }

  // Non-admin sees masked data
  const displayName = emp.employee_number 
    ? `Employee ${emp.employee_number}`
    : `EMP-${emp.id?.slice(0, 8) || 'UNKNOWN'}`;

  return {
    ...emp,
    displayName,
    full_name: displayName, // Override original name
    iqamaMasked: maskIqama(emp.iqama_number),
    emailMasked: maskEmail(emp.email),
    phoneMasked: maskPhone(emp.phone),
    saudiIdMasked: maskSaudiId(emp.saudi_id),
    email: maskEmail(emp.email),
    phone: maskPhone(emp.phone),
    iqama_number: maskIqama(emp.iqama_number),
    saudi_id: maskSaudiId(emp.saudi_id)
  };
}

/**
 * Mask Iqama number - show only last 4 digits
 */
function maskIqama(iqama?: string): string | undefined {
  if (!iqama) return undefined;
  if (iqama.length <= 4) return '****';
  return `****${iqama.slice(-4)}`;
}

/**
 * Mask email - show only domain
 */
function maskEmail(email?: string): string | undefined {
  if (!email) return undefined;
  const [, domain] = email.split('@');
  return domain ? `****@${domain}` : '****@****';
}

/**
 * Mask phone - show only last 4 digits
 */
function maskPhone(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 4) return '****';
  return `****${digits.slice(-4)}`;
}

/**
 * Mask Saudi ID - show only last 4 digits
 */
function maskSaudiId(saudiId?: string): string | undefined {
  if (!saudiId) return undefined;
  if (saudiId.length <= 4) return '****';
  return `****${saudiId.slice(-4)}`;
}

/**
 * Batch mask multiple employees
 */
export function maskEmployees(employees: Employee[], options: MaskingOptions): MaskedEmployee[] {
  return employees.map(emp => maskEmployee(emp, options));
}