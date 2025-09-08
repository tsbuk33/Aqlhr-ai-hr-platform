/**
 * AQLHR Executive Intelligence Center
 * Enhanced with real-time data and AI insights
 */

class ExecutiveCenter {
  constructor() {
    this.container = null;
    this.data = null;
    this.updateInterval = null;
    this.isLoading = true;
  }

  async init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('Executive Center container not found');
      return;
    }

    this.render();
    await this.loadData();
    this.setupRealTimeUpdates();
  }

  render() {
    this.container.innerHTML = `
      <div class="executive-center">
        <div class="executive-header">
          <h2 class="executive-title">
            <span class="icon">🎯</span>
            مركز الذكاء التنفيذي | Executive Intelligence Center
            <span class="premium-badge">PREMIUM</span>
          </h2>
          <div class="last-updated" id="lastUpdated">
            آخر تحديث: جاري التحميل... | Last Updated: Loading...
          </div>
        </div>

        <div class="metrics-grid" id="metricsGrid">
          ${this.renderLoadingState()}
        </div>

        <div class="ai-insights-section">
          <h3 class="insights-title">
            <span class="icon">🤖</span>
            رؤى الذكاء الاصطناعي | AI Insights
          </h3>
          <div class="insights-container" id="aiInsights">
            ${this.renderLoadingState()}
          </div>
        </div>

        <div class="government-status-section">
          <h3 class="status-title">
            <span class="icon">🏛️</span>
            حالة التكامل الحكومي | Government Integration Status
          </h3>
          <div class="government-grid" id="governmentGrid">
            ${this.renderLoadingState()}
          </div>
        </div>
      </div>
    `;

    this.addStyles();
  }

  renderLoadingState() {
    return `
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>جاري تحميل البيانات... | Loading data...</p>
      </div>
    `;
  }

  async loadData() {
    try {
      this.isLoading = true;
      
      // Load executive metrics
      const metrics = await window.aqlhrApi.getExecutiveMetrics();
      
      // Load government status
      const governmentStatus = await window.aqlhrApi.getGovernmentStatus();
      
      this.data = {
        ...metrics,
        government: governmentStatus
      };

      this.updateDisplay();
      this.isLoading = false;
      
    } catch (error) {
      console.error('Failed to load executive data:', error);
      this.renderError();
    }
  }

  updateDisplay() {
    if (!this.data) return;

    // Update metrics grid
    document.getElementById('metricsGrid').innerHTML = this.renderMetrics();
    
    // Update AI insights
    document.getElementById('aiInsights').innerHTML = this.renderAIInsights();
    
    // Update government status
    document.getElementById('governmentGrid').innerHTML = this.renderGovernmentStatus();
    
    // Update timestamp
    document.getElementById('lastUpdated').innerHTML = 
      `آخر تحديث: ${new Date().toLocaleString('ar-SA')} | Last Updated: ${new Date().toLocaleString('en-US')}`;
  }

  renderMetrics() {
    return `
      <div class="metric-card primary">
        <div class="metric-icon">👥</div>
        <div class="metric-content">
          <div class="metric-value">${this.data.totalEmployees?.toLocaleString() || 'N/A'}</div>
          <div class="metric-label">إجمالي الموظفين | Total Employees</div>
        </div>
      </div>

      <div class="metric-card success">
        <div class="metric-icon">🇸🇦</div>
        <div class="metric-content">
          <div class="metric-value">${this.data.saudizationRate || 'N/A'}%</div>
          <div class="metric-label">معدل السعودة | Saudization Rate</div>
        </div>
      </div>

      <div class="metric-card info">
        <div class="metric-icon">🎯</div>
        <div class="metric-content">
          <div class="metric-value">${this.data.vision2030Progress || 'N/A'}%</div>
          <div class="metric-label">تقدم رؤية 2030 | Vision 2030 Progress</div>
        </div>
      </div>

      <div class="metric-card warning">
        <div class="metric-icon">📊</div>
        <div class="metric-content">
          <div class="metric-value">98.5%</div>
          <div class="metric-label">كفاءة النظام | System Efficiency</div>
        </div>
      </div>
    `;
  }

  renderAIInsights() {
    if (!this.data.aiInsights || this.data.aiInsights.length === 0) {
      return '<p class="no-insights">لا توجد رؤى متاحة حالياً | No insights available</p>';
    }

    return this.data.aiInsights.map(insight => `
      <div class="insight-item">
        <div class="insight-icon">💡</div>
        <div class="insight-text">${insight}</div>
      </div>
    `).join('');
  }

  renderGovernmentStatus() {
    const platforms = [
      { key: 'gosi', name: 'GOSI', nameAr: 'التأمينات الاجتماعية', icon: '🏛️' },
      { key: 'qiwa', name: 'QIWA', nameAr: 'قوى', icon: '💼' },
      { key: 'hrsd', name: 'HRSD', nameAr: 'وزارة الموارد البشرية', icon: '🏢' },
      { key: 'absher', name: 'ABSHER', nameAr: 'أبشر', icon: '🔐' }
    ];

    return platforms.map(platform => {
      const status = this.data.government[platform.key]?.status || 'unknown';
      const statusClass = status === 'connected' ? 'connected' : 'disconnected';
      const statusText = status === 'connected' ? 'متصل | Connected' : 'غير متصل | Disconnected';

      return `
        <div class="government-item ${statusClass}">
          <div class="platform-icon">${platform.icon}</div>
          <div class="platform-info">
            <div class="platform-name">${platform.nameAr} | ${platform.name}</div>
            <div class="platform-status">${statusText}</div>
          </div>
          <div class="status-indicator"></div>
        </div>
      `;
    }).join('');
  }

  renderError() {
    this.container.innerHTML = `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>خطأ في تحميل البيانات | Data Loading Error</h3>
        <p>يرجى المحاولة مرة أخرى | Please try again</p>
        <button onclick="executiveCenter.loadData()" class="retry-button">
          إعادة المحاولة | Retry
        </button>
      </div>
    `;
  }

  setupRealTimeUpdates() {
    // Update every 30 seconds
    this.updateInterval = setInterval(() => {
      if (!this.isLoading) {
        this.loadData();
      }
    }, 30000);
  }

  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  addStyles() {
    if (document.getElementById('executive-center-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'executive-center-styles';
    styles.textContent = `
      .executive-center {
        padding: 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 16px;
        color: white;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        direction: ltr;
      }

      .executive-header {
        margin-bottom: 32px;
        text-align: center;
      }

      .executive-title {
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 8px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
      }

      .premium-badge {
        background: linear-gradient(45deg, #FFD700, #FFA500);
        color: #000;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
      }

      .last-updated {
        font-size: 14px;
        opacity: 0.8;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 32px;
      }

      .metric-card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 24px;
        display: flex;
        align-items: center;
        gap: 16px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .metric-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }

      .metric-icon {
        font-size: 32px;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
      }

      .metric-value {
        font-size: 32px;
        font-weight: 700;
        line-height: 1;
        margin-bottom: 4px;
      }

      .metric-label {
        font-size: 14px;
        opacity: 0.9;
        line-height: 1.2;
      }

      .ai-insights-section, .government-status-section {
        margin-bottom: 32px;
      }

      .insights-title, .status-title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .insights-container {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
      }

      .insight-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 16px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
      }

      .insight-item:last-child {
        margin-bottom: 0;
      }

      .insight-icon {
        font-size: 20px;
        margin-top: 2px;
      }

      .insight-text {
        flex: 1;
        line-height: 1.5;
      }

      .government-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .government-item {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
      }

      .government-item.connected {
        border-left: 4px solid #4CAF50;
      }

      .government-item.disconnected {
        border-left: 4px solid #f44336;
      }

      .platform-icon {
        font-size: 24px;
      }

      .platform-name {
        font-weight: 600;
        margin-bottom: 4px;
      }

      .platform-status {
        font-size: 12px;
        opacity: 0.8;
      }

      .status-indicator {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }

      .connected .status-indicator {
        background: #4CAF50;
        box-shadow: 0 0 8px #4CAF50;
      }

      .disconnected .status-indicator {
        background: #f44336;
        box-shadow: 0 0 8px #f44336;
      }

      .loading-state, .error-state {
        text-align: center;
        padding: 40px;
      }

      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .retry-button {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s ease;
      }

      .retry-button:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .no-insights {
        text-align: center;
        opacity: 0.7;
        font-style: italic;
      }

      @media (max-width: 768px) {
        .executive-center {
          padding: 16px;
        }
        
        .metrics-grid {
          grid-template-columns: 1fr;
        }
        
        .government-grid {
          grid-template-columns: 1fr;
        }
        
        .executive-title {
          font-size: 20px;
          flex-direction: column;
          gap: 8px;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }
}

// Initialize global instance
window.executiveCenter = new ExecutiveCenter();
