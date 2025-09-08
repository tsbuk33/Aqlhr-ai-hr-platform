/**
 * AQLHR Recruitment Utilities
 * Expert-level utility functions for recruitment operations
 * @author AQLHR Development Team
 * @version 2.0.0
 */

import { Platform, InternationalAgent, ComplianceService, Job, Candidate } from '@/services/recruitment/RecruitmentAPIService';

// Types
export interface FilterOptions {
  status?: string[];
  category?: string[];
  region?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface RecruitmentMetrics {
  totalApplications: number;
  averageTimeToHire: number;
  costPerHire: number;
  sourceEffectiveness: Record<string, number>;
  conversionRates: Record<string, number>;
}

/**
 * Platform utility functions
 */
export const platformUtils = {
  /**
   * Filter platforms based on criteria
   */
  filterPlatforms: (
    platforms: Platform[],
    filters: FilterOptions
  ): Platform[] => {
    return platforms.filter(platform => {
      // Status filter
      if (filters.status?.length && !filters.status.includes(platform.status)) {
        return false;
      }

      // Category filter
      if (filters.category?.length && !filters.category.includes(platform.category)) {
        return false;
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesName = platform.name.toLowerCase().includes(searchLower) ||
                           platform.nameAr.toLowerCase().includes(searchLower);
        if (!matchesName) return false;
      }

      // Date range filter (last sync)
      if (filters.dateRange) {
        const syncDate = new Date(platform.lastSync);
        if (syncDate < filters.dateRange.start || syncDate > filters.dateRange.end) {
          return false;
        }
      }

      return true;
    });
  },

  /**
   * Sort platforms
   */
  sortPlatforms: (
    platforms: Platform[],
    sortOptions: SortOptions
  ): Platform[] => {
    return [...platforms].sort((a, b) => {
      let aValue: any = a[sortOptions.field as keyof Platform];
      let bValue: any = b[sortOptions.field as keyof Platform];

      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortOptions.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOptions.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  },

  /**
   * Paginate platforms
   */
  paginatePlatforms: (
    platforms: Platform[],
    pagination: PaginationOptions
  ): { data: Platform[]; total: number; pages: number } => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    
    return {
      data: platforms.slice(start, end),
      total: platforms.length,
      pages: Math.ceil(platforms.length / pagination.limit),
    };
  },

  /**
   * Get platform statistics
   */
  getPlatformStats: (platforms: Platform[]) => {
    const total = platforms.length;
    const active = platforms.filter(p => p.status === 'active').length;
    const maintenance = platforms.filter(p => p.status === 'maintenance').length;
    const error = platforms.filter(p => p.status === 'error').length;
    
    const totalJobs = platforms.reduce((sum, p) => sum + p.activeJobs, 0);
    const totalCandidates = platforms.reduce((sum, p) => sum + p.candidates, 0);
    
    const categoryBreakdown = platforms.reduce((acc, platform) => {
      acc[platform.category] = (acc[platform.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      active,
      maintenance,
      error,
      totalJobs,
      totalCandidates,
      categoryBreakdown,
      uptime: total > 0 ? (active / total) * 100 : 0,
    };
  },

  /**
   * Validate platform configuration
   */
  validatePlatform: (platform: Partial<Platform>): string[] => {
    const errors: string[] = [];

    if (!platform.name?.trim()) {
      errors.push('Platform name is required');
    }

    if (!platform.nameAr?.trim()) {
      errors.push('Arabic platform name is required');
    }

    if (!platform.url?.trim()) {
      errors.push('Platform URL is required');
    } else if (!isValidUrl(platform.url)) {
      errors.push('Platform URL is invalid');
    }

    if (!platform.category) {
      errors.push('Platform category is required');
    }

    if (platform.activeJobs !== undefined && platform.activeJobs < 0) {
      errors.push('Active jobs cannot be negative');
    }

    if (platform.candidates !== undefined && platform.candidates < 0) {
      errors.push('Candidates count cannot be negative');
    }

    return errors;
  },
};

/**
 * International agent utility functions
 */
export const agentUtils = {
  /**
   * Filter agents by region and specialization
   */
  filterAgents: (
    agents: InternationalAgent[],
    filters: FilterOptions
  ): InternationalAgent[] => {
    return agents.filter(agent => {
      // Region filter
      if (filters.region?.length && !filters.region.includes(agent.region)) {
        return false;
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesName = agent.name.toLowerCase().includes(searchLower) ||
                           agent.nameAr.toLowerCase().includes(searchLower);
        const matchesSpecialization = agent.specializations.some(spec => 
          spec.toLowerCase().includes(searchLower)
        );
        if (!matchesName && !matchesSpecialization) return false;
      }

      return true;
    });
  },

  /**
   * Get top performing agents
   */
  getTopPerformingAgents: (
    agents: InternationalAgent[],
    limit: number = 5
  ): InternationalAgent[] => {
    return [...agents]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  },

  /**
   * Calculate agent performance metrics
   */
  getAgentMetrics: (agents: InternationalAgent[]) => {
    const totalAgents = agents.reduce((sum, a) => sum + a.agents, 0);
    const totalCandidates = agents.reduce((sum, a) => sum + a.activeCandidates, 0);
    const averageRating = agents.length > 0 
      ? agents.reduce((sum, a) => sum + a.rating, 0) / agents.length 
      : 0;

    const regionBreakdown = agents.reduce((acc, agent) => {
      acc[agent.region] = {
        agents: (acc[agent.region]?.agents || 0) + agent.agents,
        candidates: (acc[agent.region]?.candidates || 0) + agent.activeCandidates,
        rating: (acc[agent.region]?.rating || 0) + agent.rating,
      };
      return acc;
    }, {} as Record<string, { agents: number; candidates: number; rating: number }>);

    // Calculate average ratings per region
    Object.keys(regionBreakdown).forEach(region => {
      const regionAgents = agents.filter(a => a.region === region);
      regionBreakdown[region].rating = regionAgents.length > 0 
        ? regionBreakdown[region].rating / regionAgents.length 
        : 0;
    });

    return {
      totalAgents,
      totalCandidates,
      averageRating: Math.round(averageRating * 10) / 10,
      regionBreakdown,
      totalClusters: agents.length,
    };
  },
};

/**
 * Compliance utility functions
 */
export const complianceUtils = {
  /**
   * Calculate overall compliance score
   */
  calculateOverallScore: (services: ComplianceService[]): number => {
    if (services.length === 0) return 0;
    const totalScore = services.reduce((sum, service) => sum + service.score, 0);
    return Math.round((totalScore / services.length) * 10) / 10;
  },

  /**
   * Get compliance status distribution
   */
  getStatusDistribution: (services: ComplianceService[]) => {
    return services.reduce((acc, service) => {
      acc[service.status] = (acc[service.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },

  /**
   * Get services requiring attention
   */
  getServicesRequiringAttention: (
    services: ComplianceService[]
  ): ComplianceService[] => {
    return services.filter(service => 
      service.status === 'warning' || service.status === 'critical'
    ).sort((a, b) => {
      // Sort by severity (critical first) then by score (lowest first)
      if (a.status === 'critical' && b.status !== 'critical') return -1;
      if (b.status === 'critical' && a.status !== 'critical') return 1;
      return a.score - b.score;
    });
  },

  /**
   * Generate compliance report
   */
  generateComplianceReport: (services: ComplianceService[]) => {
    const overallScore = complianceUtils.calculateOverallScore(services);
    const statusDistribution = complianceUtils.getStatusDistribution(services);
    const servicesRequiringAttention = complianceUtils.getServicesRequiringAttention(services);
    const totalIssues = services.reduce((sum, service) => sum + service.issues, 0);

    return {
      overallScore,
      statusDistribution,
      servicesRequiringAttention,
      totalIssues,
      totalServices: services.length,
      lastUpdated: new Date(),
      recommendations: generateComplianceRecommendations(services),
    };
  },
};

/**
 * Data analysis utilities
 */
export const analyticsUtils = {
  /**
   * Calculate recruitment funnel metrics
   */
  calculateFunnelMetrics: (
    applications: number,
    interviews: number,
    offers: number,
    hires: number
  ) => {
    return {
      applicationToInterview: applications > 0 ? (interviews / applications) * 100 : 0,
      interviewToOffer: interviews > 0 ? (offers / interviews) * 100 : 0,
      offerToHire: offers > 0 ? (hires / offers) * 100 : 0,
      overallConversion: applications > 0 ? (hires / applications) * 100 : 0,
    };
  },

  /**
   * Calculate time-based metrics
   */
  calculateTimeMetrics: (
    startDates: Date[],
    endDates: Date[]
  ) => {
    if (startDates.length !== endDates.length) {
      throw new Error('Start and end dates arrays must have the same length');
    }

    const durations = startDates.map((start, index) => {
      const end = endDates[index];
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // days
    });

    const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const medianDuration = durations.sort((a, b) => a - b)[Math.floor(durations.length / 2)];
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);

    return {
      average: Math.round(averageDuration * 10) / 10,
      median: Math.round(medianDuration * 10) / 10,
      min: Math.round(minDuration * 10) / 10,
      max: Math.round(maxDuration * 10) / 10,
    };
  },

  /**
   * Generate trend analysis
   */
  generateTrendAnalysis: (
    data: { date: Date; value: number }[],
    periods: number = 7
  ) => {
    if (data.length < periods) {
      return { trend: 'insufficient_data', change: 0, confidence: 0 };
    }

    const sortedData = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());
    const recentData = sortedData.slice(-periods);
    const previousData = sortedData.slice(-periods * 2, -periods);

    const recentAverage = recentData.reduce((sum, d) => sum + d.value, 0) / recentData.length;
    const previousAverage = previousData.reduce((sum, d) => sum + d.value, 0) / previousData.length;

    const change = previousAverage > 0 ? ((recentAverage - previousAverage) / previousAverage) * 100 : 0;
    const trend = change > 5 ? 'increasing' : change < -5 ? 'decreasing' : 'stable';

    return {
      trend,
      change: Math.round(change * 10) / 10,
      confidence: Math.min(data.length / (periods * 2), 1),
      recentAverage: Math.round(recentAverage * 10) / 10,
      previousAverage: Math.round(previousAverage * 10) / 10,
    };
  },
};

/**
 * Validation utilities
 */
export const validationUtils = {
  /**
   * Validate email format
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number (international format)
   */
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
  },

  /**
   * Validate Saudi national ID
   */
  isValidSaudiID: (id: string): boolean => {
    if (!/^\d{10}$/.test(id)) return false;
    
    // Luhn algorithm for Saudi ID validation
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let digit = parseInt(id[i]);
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(id[9]);
  },

  /**
   * Validate job requirements
   */
  validateJobRequirements: (job: Partial<Job>): string[] => {
    const errors: string[] = [];

    if (!job.title?.trim()) {
      errors.push('Job title is required');
    }

    if (!job.description?.trim()) {
      errors.push('Job description is required');
    }

    if (!job.location?.trim()) {
      errors.push('Job location is required');
    }

    if (job.salaryRange && !isValidSalaryRange(job.salaryRange)) {
      errors.push('Invalid salary range format');
    }

    return errors;
  },
};

/**
 * Helper functions
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidSalaryRange(range: string): boolean {
  const rangeRegex = /^\d+\s*-\s*\d+\s*(SAR|USD|EUR)?$/i;
  return rangeRegex.test(range);
}

function generateComplianceRecommendations(services: ComplianceService[]): string[] {
  const recommendations: string[] = [];
  
  const criticalServices = services.filter(s => s.status === 'critical');
  const warningServices = services.filter(s => s.status === 'warning');
  
  if (criticalServices.length > 0) {
    recommendations.push(`Immediate attention required for ${criticalServices.length} critical service(s)`);
  }
  
  if (warningServices.length > 0) {
    recommendations.push(`Monitor and improve ${warningServices.length} service(s) with warnings`);
  }
  
  const lowScoreServices = services.filter(s => s.score < 80);
  if (lowScoreServices.length > 0) {
    recommendations.push(`Review and optimize ${lowScoreServices.length} service(s) with low scores`);
  }
  
  return recommendations;
}

/**
 * Export utilities
 */
export const exportUtils = {
  /**
   * Export data to CSV format
   */
  exportToCSV: (data: any[], filename: string): void => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  },

  /**
   * Export data to JSON format
   */
  exportToJSON: (data: any, filename: string): void => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.json`;
    link.click();
  },
};

/**
 * Date utilities
 */
export const dateUtils = {
  /**
   * Format date for display
   */
  formatDate: (date: Date, locale: string = 'en-US'): string => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  },

  /**
   * Format relative time
   */
  formatRelativeTime: (date: Date, locale: string = 'en-US'): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return dateUtils.formatDate(date, locale);
  },

  /**
   * Get date range for common periods
   */
  getDateRange: (period: 'today' | 'week' | 'month' | 'quarter' | 'year'): { start: Date; end: Date } => {
    const now = new Date();
    const start = new Date();
    
    switch (period) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return { start, end: now };
  },
};

export default {
  platformUtils,
  agentUtils,
  complianceUtils,
  analyticsUtils,
  validationUtils,
  exportUtils,
  dateUtils,
};

