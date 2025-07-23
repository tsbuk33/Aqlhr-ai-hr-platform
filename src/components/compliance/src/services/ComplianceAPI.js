// Compliance API Integration
// Add this to your existing API services or create a new compliance API service

class ComplianceAPI {
  constructor(baseURL = '/api/compliance') {
    this.baseURL = baseURL;
  }

  // Helper method for making API requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Dashboard API methods
  async getDashboardData() {
    return this.request('/dashboard');
  }

  // Saudization API methods
  async getSaudizationData() {
    return this.request('/saudization');
  }

  async updateSaudizationTarget(departmentId, targetRatio) {
    return this.request(`/saudization/${departmentId}/target`, {
      method: 'PUT',
      body: JSON.stringify({ targetRatio }),
    });
  }

  // Alerts API methods
  async getAlerts() {
    return this.request('/alerts');
  }

  async acknowledgeAlert(alertId) {
    return this.request(`/alerts/${alertId}/acknowledge`, {
      method: 'POST',
    });
  }

  async dismissAlert(alertId) {
    return this.request(`/alerts/${alertId}/dismiss`, {
      method: 'POST',
    });
  }

  // Government Integration API methods
  async getIntegrations() {
    return this.request('/integrations');
  }

  async syncPlatform(platform) {
    return this.request(`/integrations/${platform}/sync`, {
      method: 'POST',
    });
  }

  async syncAllPlatforms() {
    return this.request('/integrations/sync-all', {
      method: 'POST',
    });
  }

  // Reports API methods
  async generateReport(reportType, options = {}) {
    return this.request('/reports/generate', {
      method: 'POST',
      body: JSON.stringify({
        type: reportType,
        ...options,
      }),
    });
  }

  async downloadReport(reportId) {
    const response = await fetch(`${this.baseURL}/reports/${reportId}/download`);
    if (!response.ok) {
      throw new Error(`Failed to download report: ${response.status}`);
    }
    return response.blob();
  }

  async getReportHistory() {
    return this.request('/reports/history');
  }

  // Compliance Score API methods
  async getComplianceScore() {
    return this.request('/compliance-score');
  }

  async getComplianceScoreHistory(period = '30d') {
    return this.request(`/compliance-score/history?period=${period}`);
  }

  // Audit Trail API methods
  async getAuditTrail(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/audit-trail${queryParams ? `?${queryParams}` : ''}`);
  }

  // Employee Compliance API methods
  async getEmployeeCompliance(employeeId) {
    return this.request(`/employees/${employeeId}/compliance`);
  }

  async updateEmployeeCompliance(employeeId, complianceData) {
    return this.request(`/employees/${employeeId}/compliance`, {
      method: 'PUT',
      body: JSON.stringify(complianceData),
    });
  }

  async getEmployeesWithExpiringVisas(days = 30) {
    return this.request(`/employees/expiring-visas?days=${days}`);
  }

  // Policy Compliance API methods
  async getPolicies() {
    return this.request('/policies');
  }

  async updatePolicy(policyId, policyData) {
    return this.request(`/policies/${policyId}`, {
      method: 'PUT',
      body: JSON.stringify(policyData),
    });
  }

  async checkPolicyCompliance(policyId) {
    return this.request(`/policies/${policyId}/compliance-check`, {
      method: 'POST',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// React Hook for Compliance API
import { useState, useEffect, useCallback } from 'react';

export const useComplianceAPI = () => {
  const [api] = useState(() => new ComplianceAPI());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeRequest = useCallback(async (requestFn) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestFn();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    api,
    loading,
    error,
    executeRequest,
  };
};

// React Hook for Dashboard Data
export const useComplianceDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const { api, loading, error, executeRequest } = useComplianceAPI();

  const fetchDashboardData = useCallback(async () => {
    const data = await executeRequest(() => api.getDashboardData());
    if (data?.success) {
      setDashboardData(data.data);
    }
    return data;
  }, [api, executeRequest]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};

// React Hook for Saudization Data
export const useSaudizationData = () => {
  const [saudizationData, setSaudizationData] = useState(null);
  const { api, loading, error, executeRequest } = useComplianceAPI();

  const fetchSaudizationData = useCallback(async () => {
    const data = await executeRequest(() => api.getSaudizationData());
    if (data?.success) {
      setSaudizationData(data.data);
    }
    return data;
  }, [api, executeRequest]);

  useEffect(() => {
    fetchSaudizationData();
  }, [fetchSaudizationData]);

  return {
    saudizationData,
    loading,
    error,
    refetch: fetchSaudizationData,
  };
};

// React Hook for Alerts
export const useComplianceAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const { api, loading, error, executeRequest } = useComplianceAPI();

  const fetchAlerts = useCallback(async () => {
    const data = await executeRequest(() => api.getAlerts());
    if (data?.success) {
      setAlerts(data.data);
    }
    return data;
  }, [api, executeRequest]);

  const acknowledgeAlert = useCallback(async (alertId) => {
    const data = await executeRequest(() => api.acknowledgeAlert(alertId));
    if (data?.success) {
      // Update local state
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true, acknowledgedAt: new Date().toISOString() }
          : alert
      ));
    }
    return data;
  }, [api, executeRequest]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return {
    alerts,
    loading,
    error,
    refetch: fetchAlerts,
    acknowledgeAlert,
  };
};

// React Hook for Government Integrations
export const useGovernmentIntegrations = () => {
  const [integrations, setIntegrations] = useState([]);
  const { api, loading, error, executeRequest } = useComplianceAPI();

  const fetchIntegrations = useCallback(async () => {
    const data = await executeRequest(() => api.getIntegrations());
    if (data?.success) {
      setIntegrations(data.data);
    }
    return data;
  }, [api, executeRequest]);

  const syncPlatform = useCallback(async (platform) => {
    const data = await executeRequest(() => api.syncPlatform(platform));
    if (data?.success) {
      // Update local state
      setIntegrations(prev => prev.map(integration => 
        integration.platform.toLowerCase() === platform.toLowerCase()
          ? { ...integration, lastSync: new Date().toISOString(), status: 'connected' }
          : integration
      ));
    }
    return data;
  }, [api, executeRequest]);

  const syncAllPlatforms = useCallback(async () => {
    const data = await executeRequest(() => api.syncAllPlatforms());
    if (data?.success) {
      // Refresh all integrations
      await fetchIntegrations();
    }
    return data;
  }, [api, executeRequest, fetchIntegrations]);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  return {
    integrations,
    loading,
    error,
    refetch: fetchIntegrations,
    syncPlatform,
    syncAllPlatforms,
  };
};

// Export the main API class and hooks
export default ComplianceAPI;
export {
  ComplianceAPI,
  useComplianceAPI,
  useComplianceDashboard,
  useSaudizationData,
  useComplianceAlerts,
  useGovernmentIntegrations,
};
