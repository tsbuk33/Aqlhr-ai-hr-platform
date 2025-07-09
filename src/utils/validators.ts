/**
 * Validation utilities with comprehensive logging
 * Saudi-specific validation rules for government compliance
 */

import { logger } from './logger';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Saudi National ID validation
export const validateSaudiNationalId = (id: string): ValidationResult => {
  const timer = logger.startTimer('validate-saudi-national-id');
  
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!id || typeof id !== 'string') {
    result.isValid = false;
    result.errors.push('National ID is required');
    timer();
    return result;
  }

  // Remove any spaces or dashes
  const cleanId = id.replace(/[\s-]/g, '');

  // Must be exactly 10 digits
  if (!/^\d{10}$/.test(cleanId)) {
    result.isValid = false;
    result.errors.push('National ID must be exactly 10 digits');
    timer();
    return result;
  }

  // Check if it starts with 1 or 2 (Saudi nationals)
  if (!cleanId.startsWith('1') && !cleanId.startsWith('2')) {
    result.warnings.push('National ID should start with 1 or 2 for Saudi nationals');
  }

  // Validate check digit using Luhn algorithm
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = parseInt(cleanId[i]);
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  if (checkDigit !== parseInt(cleanId[9])) {
    result.isValid = false;
    result.errors.push('Invalid National ID check digit');
  }

  timer();
  logger.debug('Saudi National ID validation completed', {
    idLength: cleanId.length,
    startsWithValid: cleanId.startsWith('1') || cleanId.startsWith('2'),
    isValid: result.isValid
  }, 'validation');

  return result;
};

// Iqama number validation
export const validateIqamaNumber = (iqama: string): ValidationResult => {
  const timer = logger.startTimer('validate-iqama-number');
  
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!iqama || typeof iqama !== 'string') {
    result.isValid = false;
    result.errors.push('Iqama number is required');
    timer();
    return result;
  }

  // Remove any spaces or dashes
  const cleanIqama = iqama.replace(/[\s-]/g, '');

  // Must be exactly 10 digits
  if (!/^\d{10}$/.test(cleanIqama)) {
    result.isValid = false;
    result.errors.push('Iqama number must be exactly 10 digits');
    timer();
    return result;
  }

  // Should start with 3-9 for non-Saudis
  if (cleanIqama.startsWith('1') || cleanIqama.startsWith('2')) {
    result.warnings.push('Iqama numbers typically start with 3-9 for non-Saudi residents');
  }

  timer();
  logger.debug('Iqama number validation completed', {
    iqamaLength: cleanIqama.length,
    isValid: result.isValid
  }, 'validation');

  return result;
};

// Saudi phone number validation
export const validateSaudiPhoneNumber = (phone: string): ValidationResult => {
  const timer = logger.startTimer('validate-saudi-phone');
  
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!phone || typeof phone !== 'string') {
    result.isValid = false;
    result.errors.push('Phone number is required');
    timer();
    return result;
  }

  // Remove all non-digits
  const cleanPhone = phone.replace(/\D/g, '');

  // Check various valid formats
  if (cleanPhone.startsWith('966')) {
    // International format +966XXXXXXXXX
    if (cleanPhone.length !== 12) {
      result.isValid = false;
      result.errors.push('International phone number must be 12 digits including country code');
    } else if (!cleanPhone.substring(3).match(/^5[0-9]{8}$/)) {
      result.isValid = false;
      result.errors.push('Saudi mobile numbers must start with 5 after country code');
    }
  } else if (cleanPhone.startsWith('05')) {
    // National format 05XXXXXXXX
    if (cleanPhone.length !== 10) {
      result.isValid = false;
      result.errors.push('National phone number must be 10 digits');
    }
  } else if (cleanPhone.startsWith('5')) {
    // Mobile format 5XXXXXXXX
    if (cleanPhone.length !== 9) {
      result.isValid = false;
      result.errors.push('Mobile number must be 9 digits');
    }
  } else {
    result.isValid = false;
    result.errors.push('Phone number must be a valid Saudi mobile number');
  }

  timer();
  logger.debug('Saudi phone validation completed', {
    phoneLength: cleanPhone.length,
    format: cleanPhone.startsWith('966') ? 'international' : 
            cleanPhone.startsWith('05') ? 'national' : 
            cleanPhone.startsWith('5') ? 'mobile' : 'unknown',
    isValid: result.isValid
  }, 'validation');

  return result;
};

// Email validation with Arabic domain support
export const validateEmail = (email: string): ValidationResult => {
  const timer = logger.startTimer('validate-email');
  
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!email || typeof email !== 'string') {
    result.isValid = false;
    result.errors.push('Email is required');
    timer();
    return result;
  }

  // Basic email regex that supports international domains
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    result.isValid = false;
    result.errors.push('Invalid email format');
  }

  // Check for common Saudi government domains
  const govDomains = ['.gov.sa', '.edu.sa', '.org.sa'];
  const isGovEmail = govDomains.some(domain => email.toLowerCase().endsWith(domain));
  
  if (isGovEmail) {
    logger.info('Government email detected', { email, domain: email.split('@')[1] }, 'validation');
  }

  timer();
  logger.debug('Email validation completed', {
    isValid: result.isValid,
    isGovernment: isGovEmail
  }, 'validation');

  return result;
};

// Salary validation for Saudi market
export const validateSalary = (salary: number, position?: string): ValidationResult => {
  const timer = logger.startTimer('validate-salary');
  
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (salary === null || salary === undefined || isNaN(salary)) {
    result.isValid = false;
    result.errors.push('Salary is required');
    timer();
    return result;
  }

  // Minimum wage in Saudi Arabia (as of 2024)
  const MINIMUM_WAGE = 4000;
  const REASONABLE_MAX = 100000;

  if (salary < MINIMUM_WAGE) {
    result.isValid = false;
    result.errors.push(`Salary cannot be below minimum wage (${MINIMUM_WAGE} SAR)`);
  }

  if (salary > REASONABLE_MAX) {
    result.warnings.push('Salary is unusually high, please verify');
  }

  // Position-specific checks
  if (position) {
    const executivePositions = ['CEO', 'CTO', 'CFO', 'VP', 'Director'];
    const isExecutive = executivePositions.some(pos => 
      position.toLowerCase().includes(pos.toLowerCase())
    );

    if (isExecutive && salary < 15000) {
      result.warnings.push('Executive position salary seems low');
    }
  }

  timer();
  logger.debug('Salary validation completed', {
    salary,
    position,
    isValid: result.isValid
  }, 'validation');

  return result;
};

// GOSI contribution validation
export const validateGosiContribution = (
  employeeRate: number,
  employerRate: number,
  nationality: 'SAUDI' | 'NON_SAUDI'
): ValidationResult => {
  const timer = logger.startTimer('validate-gosi-contribution');
  
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Standard GOSI rates (as of 2024)
  const STANDARD_RATES = {
    SAUDI: { employee: 10, employer: 12 },
    NON_SAUDI: { employee: 2, employer: 2 }
  };

  const standardRates = STANDARD_RATES[nationality];

  if (employeeRate !== standardRates.employee) {
    result.warnings.push(
      `Employee GOSI rate (${employeeRate}%) differs from standard rate (${standardRates.employee}%)`
    );
  }

  if (employerRate !== standardRates.employer) {
    result.warnings.push(
      `Employer GOSI rate (${employerRate}%) differs from standard rate (${standardRates.employer}%)`
    );
  }

  timer();
  logger.debug('GOSI contribution validation completed', {
    employeeRate,
    employerRate,
    nationality,
    isValid: result.isValid
  }, 'validation');

  return result;
};

// Batch validation utility
export const validateEmployee = (employee: {
  nationalId?: string;
  iqamaNumber?: string;
  email?: string;
  phone?: string;
  salary?: number;
  position?: string;
  nationality?: 'SAUDI' | 'NON_SAUDI';
}): ValidationResult => {
  const timer = logger.startTimer('validate-employee-batch');
  
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Validate identification
  if (employee.nationality === 'SAUDI' && employee.nationalId) {
    const idResult = validateSaudiNationalId(employee.nationalId);
    result.errors.push(...idResult.errors);
    result.warnings.push(...idResult.warnings);
    if (!idResult.isValid) result.isValid = false;
  } else if (employee.nationality === 'NON_SAUDI' && employee.iqamaNumber) {
    const iqamaResult = validateIqamaNumber(employee.iqamaNumber);
    result.errors.push(...iqamaResult.errors);
    result.warnings.push(...iqamaResult.warnings);
    if (!iqamaResult.isValid) result.isValid = false;
  }

  // Validate contact information
  if (employee.email) {
    const emailResult = validateEmail(employee.email);
    result.errors.push(...emailResult.errors);
    result.warnings.push(...emailResult.warnings);
    if (!emailResult.isValid) result.isValid = false;
  }

  if (employee.phone) {
    const phoneResult = validateSaudiPhoneNumber(employee.phone);
    result.errors.push(...phoneResult.errors);
    result.warnings.push(...phoneResult.warnings);
    if (!phoneResult.isValid) result.isValid = false;
  }

  // Validate salary
  if (employee.salary !== undefined) {
    const salaryResult = validateSalary(employee.salary, employee.position);
    result.errors.push(...salaryResult.errors);
    result.warnings.push(...salaryResult.warnings);
    if (!salaryResult.isValid) result.isValid = false;
  }

  timer();
  logger.info('Employee validation completed', {
    employeeId: employee.nationalId || employee.iqamaNumber,
    nationality: employee.nationality,
    isValid: result.isValid,
    errorCount: result.errors.length,
    warningCount: result.warnings.length
  }, 'validation');

  return result;
};