/**
 * AQLHR API Service
 * Enhanced frontend integration with security-hardened backend
 */

class AQLHRApiService {
  constructor() {
    this.baseURL = 'https://api.aqlhr.com';
    this.timeout = 30000;
    this.token = localStorage.getItem('aqlhr_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('aqlhr_token', token);
  }

  // Get default headers
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'GET',
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }

  // Executive Intelligence Center
  async getExecutiveMetrics() {
    const [employees, vision2030, aiStatus] = await Promise.all([
      this.request('/api/employees/statistics/summary'),
      this.request('/api/vision2030/kpis'),
      this.request('/api/ai/status')
    ]);

    return {
      totalEmployees: employees.total_employees,
      saudizationRate: employees.saudization_rate,
      vision2030Progress: vision2030.overall_progress,
      aiInsights: aiStatus.insights,
      lastUpdated: new Date().toISOString()
    };
  }

  // AI Services
  async processAIQuery(query, language = 'en', userRole = 'USER') {
    return this.request('/api/ai/prompt', {
      method: 'POST',
      body: JSON.stringify({
        text: query,
        language,
        user_role: userRole
      })
    });
  }

  // Government Integrations
  async getGovernmentStatus() {
    const [gosi, qiwa, hrsd, absher] = await Promise.allSettled([
      this.request('/api/gosi/status'),
      this.request('/api/qiwa/status'),
      this.request('/api/hrsd/status'),
      this.request('/api/absher/status')
    ]);

    return {
      gosi: gosi.status === 'fulfilled' ? gosi.value : { status: 'error' },
      qiwa: qiwa.status === 'fulfilled' ? qiwa.value : { status: 'error' },
      hrsd: hrsd.status === 'fulfilled' ? hrsd.value : { status: 'error' },
      absher: absher.status === 'fulfilled' ? absher.value : { status: 'error' }
    };
  }

  // Employee Management
  async getEmployeeStatistics() {
    return this.request('/api/employees/statistics/summary');
  }

  async getEmployeeDetails(employeeId) {
    return this.request(`/api/employees/${employeeId}`);
  }

  // Vision 2030 KPIs
  async getVision2030KPIs() {
    return this.request('/api/vision2030/kpis');
  }

  // Real-time updates
  setupRealTimeUpdates(callback, interval = 30000) {
    const updateInterval = setInterval(async () => {
      try {
        const data = await this.getExecutiveMetrics();
        callback(data);
      } catch (error) {
        console.error('Real-time update failed:', error);
      }
    }, interval);

    return () => clearInterval(updateInterval);
  }
}

// Export singleton instance
window.aqlhrApi = new AQLHRApiService();
export default window.aqlhrApi;
