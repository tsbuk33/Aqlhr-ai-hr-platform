src/components/compliance/ComplianceModule.jsx 
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  BarChart3,
  Globe,
  Lock,
  UserCheck,
  Building,
  Calendar,
  Target,
  Activity,
  Zap,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  Home,
  Menu,
  X,
  Settings
} from 'lucide-react';

// Compliance Dashboard Component
const ComplianceDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [complianceData, setComplianceData] = useState({
    overallScore: 94.2,
    criticalAlerts: 3,
    pendingActions: 12,
    saudizationRatio: 67.5,
    nitaqatBand: 'yellow'
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'انتهاء صلاحية التأشيرات',
      description: '5 تأشيرات موظفين تنتهي خلال 30 يوماً',
      timestamp: '2025-01-15T10:30:00Z',
      priority: 'high'
    },
    {
      id: 2,
      type: 'warning',
      title: 'هدف السعودة',
      description: 'قسم الهندسة أقل من النسبة المطلوبة',
      timestamp: '2025-01-15T09:15:00Z',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'info',
      title: 'مزامنة التأمينات مكتملة',
      description: 'تم مزامنة بيانات الاشتراكات الشهرية بنجاح',
      timestamp: '2025-01-15T08:45:00Z',
      priority: 'low'
    }
  ]);

  const complianceAreas = [
    { name: 'الالتزام بالسياسات', score: 96, status: 'good', trend: 'up' },
    { name: 'امتثال الصحة والسلامة', score: 92, status: 'good', trend: 'stable' },
    { name: 'أمن المعلومات', score: 89, status: 'warning', trend: 'up' },
    { name: 'نزاهة التوظيف', score: 94, status: 'good', trend: 'up' },
    { name: 'التكامل الحكومي', score: 98, status: 'good', trend: 'stable' }
  ];

  const saudizationData = {
    currentRatio: 67.5,
    targetRatio: 70.0,
    nitaqatBand: 'yellow',
    totalEmployees: 1848,
    saudiEmployees: 1247,
    nonSaudiEmployees: 601,
    departments: [
      { name: 'الهندسة', saudi: 45, total: 120, ratio: 37.5, band: 'red' },
      { name: 'العمليات', saudi: 89, total: 150, ratio: 59.3, band: 'yellow' },
      { name: 'المالية', saudi: 28, total: 35, ratio: 80.0, band: 'green' },
      { name: 'الموارد البشرية', saudi: 25, total: 30, ratio: 83.3, band: 'green' },
      { name: 'تقنية المعلومات', saudi: 15, total: 45, ratio: 33.3, band: 'red' }
    ]
  };

  const governmentIntegrations = [
    { platform: 'وزارة الموارد البشرية', status: 'connected', lastSync: '2025-01-15T12:00:00Z' },
    { platform: 'منصة قوى', status: 'connected', lastSync: '2025-01-15T11:30:00Z' },
    { platform: 'التأمينات الاجتماعية', status: 'connected', lastSync: '2025-01-15T11:00:00Z' },
    { platform: 'منصة أبشر', status: 'connected', lastSync: '2025-01-15T10:30:00Z' },
    { platform: 'وزارة العمل', status: 'connected', lastSync: '2025-01-15T10:00:00Z' }
  ];

  // Overview Tab Component
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300">الامتثال العام</h3>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{complianceData.overallScore}%</div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" 
              style={{ width: `${complianceData.overallScore}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300">التنبيهات الحرجة</h3>
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-400 mb-2">{complianceData.criticalAlerts}</div>
          <p className="text-xs text-gray-400">تتطلب اهتماماً فورياً</p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300">الإجراءات المعلقة</h3>
            <Clock className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-yellow-400 mb-2">{complianceData.pendingActions}</div>
          <p className="text-xs text-gray-400">في انتظار المراجعة</p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300">نسبة السعودة</h3>
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{complianceData.saudizationRatio}%</div>
          <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
            complianceData.nitaqatBand === 'green' ? 'bg-green-900 text-green-300' :
            complianceData.nitaqatBand === 'yellow' ? 'bg-yellow-900 text-yellow-300' :
            'bg-red-900 text-red-300'
          }`}>
            النطاق {complianceData.nitaqatBand === 'yellow' ? 'الأصفر' : complianceData.nitaqatBand === 'green' ? 'الأخضر' : 'الأحمر'}
          </div>
        </div>
      </div>

      {/* Compliance Areas and Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">نقاط الامتثال حسب المجال</h3>
          <div className="space-y-4">
            {complianceAreas.map((area, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`w-3 h-3 rounded-full ${
                    area.status === 'good' ? 'bg-green-400' : 
                    area.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <span className="text-sm font-medium text-gray-300">{area.name}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-sm font-bold text-white">{area.score}%</span>
                  <TrendingUp className={`h-4 w-4 ${
                    area.trend === 'up' ? 'text-green-400' : 
                    area.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">التنبيهات الحديثة</h3>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${
                alert.type === 'critical' ? 'border-red-500 bg-red-900/20' :
                alert.type === 'warning' ? 'border-yellow-500 bg-yellow-900/20' :
                'border-blue-500 bg-blue-900/20'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      alert.type === 'critical' ? 'text-red-400' :
                      alert.type === 'warning' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`} />
                    <div>
                      <h4 className="text-sm font-medium text-white">{alert.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">{alert.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">الإجراءات السريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            <FileText className="h-8 w-8 text-blue-400 mb-2" />
            <span className="text-xs text-gray-300">إنشاء تقرير</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            <RefreshCw className="h-8 w-8 text-green-400 mb-2" />
            <span className="text-xs text-gray-300">مزامنة البيانات</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            <Eye className="h-8 w-8 text-purple-400 mb-2" />
            <span className="text-xs text-gray-300">مراجعة الموافقات</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            <Settings className="h-8 w-8 text-orange-400 mb-2" />
            <span className="text-xs text-gray-300">إدارة الوثائق</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Saudization Tab Component
  const SaudizationTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">إدارة السعودة</h2>
        <button className="flex items-center space-x-2 space-x-reverse bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Download className="h-4 w-4" />
          <span>تصدير التقرير</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">نظرة عامة على السعودة</h3>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-400 mb-2">67.5%</div>
              <p className="text-sm text-gray-400">نسبة السعودة الحالية</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">1,247</div>
                <p className="text-xs text-gray-400">موظف سعودي</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">601</div>
                <p className="text-xs text-gray-400">موظف غير سعودي</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">1,848</div>
                <p className="text-xs text-gray-400">إجمالي الموظفين</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>الهدف: 70%</span>
                <span>الحالي: 67.5%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full" style={{ width: '67.5%' }}></div>
              </div>
              <p className="text-xs text-gray-400">2.5% أقل من الهدف</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">حالة نطاقات</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex px-4 py-2 rounded-full text-lg font-medium bg-yellow-900 text-yellow-300">
                النطاق الأصفر
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>النطاق الأخضر</span>
                <span>70%+</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-white">
                <span>الحالي</span>
                <span>67.5%</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>النطاق الأحمر</span>
                <span>&lt;60%</span>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-yellow-500 bg-yellow-900/20">
              <div className="flex items-start space-x-3 space-x-reverse">
                <Target className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-white">إجراء مطلوب</h4>
                  <p className="text-xs text-gray-400 mt-1">زيادة السعودة بنسبة 2.5% للوصول إلى النطاق الأخضر</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">التوزيع حسب الأقسام</h3>
        <div className="space-y-4">
          {saudizationData.departments.map((dept, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-600 rounded-lg">
              <div>
                <h4 className="font-medium text-white">{dept.name}</h4>
                <p className="text-sm text-gray-400">
                  {dept.saudi} سعودي / {dept.total} إجمالي
                </p>
              </div>
              <div className="text-left">
                <div className={`text-lg font-bold ${
                  dept.ratio >= 70 ? 'text-green-400' :
                  dept.ratio >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {dept.ratio}%
                </div>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  dept.ratio >= 70 ? 'bg-green-900 text-green-300' :
                  dept.ratio >= 60 ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'
                }`}>
                  {dept.ratio >= 70 ? 'أخضر' :
                   dept.ratio >= 60 ? 'أصفر' : 'أحمر'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Government Integration Tab Component
  const IntegrationTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">التكامل الحكومي</h2>
        <button className="flex items-center space-x-2 space-x-reverse bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
          <RefreshCw className="h-4 w-4" />
          <span>مزامنة الكل</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {governmentIntegrations.map((integration, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{integration.platform}</h3>
              <div className={`w-3 h-3 rounded-full ${
                integration.status === 'connected' ? 'bg-green-400' : 'bg-red-400'
              }`} />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">الحالة:</span>
                <span className={`font-medium ${
                  integration.status === 'connected' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {integration.status === 'connected' ? 'متصل' : 'غير متصل'}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">آخر مزامنة:</span>
                <span className="text-white">
                  {new Date(integration.lastSync).toLocaleString('ar-SA')}
                </span>
              </div>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                مزامنة الآن
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Integration Status Summary */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">ملخص حالة التكامل</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">5</div>
            <p className="text-sm text-gray-400">منصات متصلة</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
            <p className="text-sm text-gray-400">معدل النجاح</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
            <p className="text-sm text-gray-400">المراقبة المستمرة</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Main Navigation Tabs
  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: Home },
    { id: 'saudization', label: 'إدارة السعودة', icon: Users },
    { id: 'integration', label: 'التكامل الحكومي', icon: Globe },
    { id: 'reports', label: 'التقارير', icon: FileText },
    { id: 'settings', label: 'الإعدادات', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Shield className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-white">إدارة الامتثال والحوكمة</h1>
              <p className="text-sm text-gray-400">منصة متقدمة لإدارة الامتثال التنظيمي والحوكمة المؤسسية</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-gray-300" />
            </button>
            <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <Settings className="h-5 w-5 text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="px-6">
          <nav className="flex space-x-8 space-x-reverse">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 space-x-reverse py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'saudization' && <SaudizationTab />}
        {activeTab === 'integration' && <IntegrationTab />}
        {activeTab === 'reports' && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">قسم التقارير</h3>
            <p className="text-gray-500">قريباً...</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">الإعدادات</h3>
            <p className="text-gray-500">قريباً...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceDashboard;
