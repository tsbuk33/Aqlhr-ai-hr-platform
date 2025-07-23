import React, { useState } from 'react';

const AqlHRComplianceOverview = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const [activeAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'انتهاء صلاحية التأشيرات',
      description: '5 تأشيرات موظفين تنتهي خلال 30 يوماً',
      priority: 'high'
    },
    {
      id: 2,
      type: 'warning', 
      title: 'هدف السعودة',
      description: 'قسم الهندسة أقل من النسبة المطلوبة',
      priority: 'medium'
    }
  ]);

  const [saudizationData] = useState({
    currentRatio: 67.5,
    targetRatio: 70.0,
    nitaqatBand: 'yellow',
    departments: [
      { name: 'الإدارة العامة', ratio: 85.2, target: 80, status: 'good' },
      { name: 'الهندسة', ratio: 45.8, target: 60, status: 'warning' },
      { name: 'المبيعات', ratio: 72.3, target: 70, status: 'good' },
      { name: 'التسويق', ratio: 68.9, target: 65, status: 'good' }
    ]
  });

  const [governmentIntegrations] = useState([
    { platform: 'HRSD', status: 'connected', description: 'وزارة الموارد البشرية والتنمية الاجتماعية' },
    { platform: 'Qiwa', status: 'connected', description: 'منصة قوى' },
    { platform: 'GOSI', status: 'connected', description: 'المؤسسة العامة للتأمينات الاجتماعية' },
    { platform: 'Absher', status: 'connected', description: 'منصة أبشر' },
    { platform: 'MOL', status: 'connected', description: 'وزارة العمل' }
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-white" dir="rtl">
      <div className="container mx-auto px-6 py-8">
        
        {/* Header - Matching AqlHR Style */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                نظرة عامة على الامتثال والحوكمة
              </h1>
              <p className="text-gray-400 text-lg">
                منصة الموارد البشرية الأكثر شمولية للامتثال في المملكة العربية السعودية
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                تصدير التقرير
              </button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                تحديث البيانات
              </button>
            </div>
          </div>
        </div>

        {/* Critical Alerts - AqlHR Card Style */}
        {activeAlerts.length > 0 && (
          <div className="mb-8 space-y-4">
            {activeAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-xl border-r-4 ${
                alert.type === 'critical' 
                  ? 'bg-red-900/20 border-red-500 border border-red-500/30' 
                  : 'bg-yellow-900/20 border-yellow-500 border border-yellow-500/30'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      alert.type === 'critical' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                    }`}>
                      <svg className={`w-5 h-5 ${
                        alert.type === 'critical' ? 'text-red-400' : 'text-yellow-400'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    alert.priority === 'high' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-yellow-500 text-black'
                  }`}>
                    {alert.priority === 'high' ? 'عاجل' : 'متوسط'}
                  </span>
                </div>
                <p className="text-gray-300">{alert.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Key Metrics - AqlHR Grid Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          
          {/* Overall Compliance */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-all duration-300">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">الامتثال العام</h3>
            <div className="text-3xl font-bold text-green-400 mb-2">94.2%</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500" style={{width: '94.2%'}}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">+2.4% من الشهر الماضي</p>
          </div>

          {/* Saudization */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-all duration-300">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">نسبة السعودة</h3>
            <div className="text-3xl font-bold text-blue-400 mb-2">{saudizationData.currentRatio}%</div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-gray-400">النطاق الأصفر</span>
            </div>
          </div>

          {/* Government Integration */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-all duration-300">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">التكامل الحكومي</h3>
            <div className="text-3xl font-bold text-purple-400 mb-2">5/5</div>
            <p className="text-sm text-gray-400 mb-2">منصات متصلة</p>
            <div className="flex gap-1">
              {governmentIntegrations.map((_, index) => (
                <div key={index} className="w-2 h-2 rounded-full bg-green-400"></div>
              ))}
            </div>
          </div>

          {/* Active Alerts */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-all duration-300">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 4.828A4 4 0 015.5 4H9v1a3 3 0 006 0V4h3.5c.312 0 .625.078.906.234M4.828 4.828L19 19M4.828 4.828A4 4 0 004 7v10a2 2 0 002 2h10M19 19a2 2 0 01-2 2H6a2 2 0 01-2-2V7a4 4 0 01.172-1.172" />
                </svg>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">التنبيهات النشطة</h3>
            <div className="text-3xl font-bold text-yellow-400 mb-2">{activeAlerts.length}</div>
            <p className="text-sm text-gray-400">تحتاج إلى اهتمام</p>
          </div>

          {/* Audit Trails */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-all duration-300">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">مسارات التدقيق</h3>
            <div className="text-3xl font-bold text-green-400 mb-2">15,678+</div>
            <p className="text-sm text-gray-400">سجلات كاملة</p>
          </div>
        </div>

        {/* Tabs - AqlHR Style */}
        <div className="mb-8">
          <div className="flex border-b border-gray-700 mb-6">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
              { id: 'saudization', label: 'إدارة السعودة', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              { id: 'integration', label: 'التكامل الحكومي', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9' },
              { id: 'reports', label: 'التقارير', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-blue-400'
                    : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Regulatory Compliance */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">إدارة الامتثال التنظيمي</h3>
                  </div>
                  <p className="text-gray-400 mb-4">مراقبة الامتثال لقانون العمل السعودي ونظام حماية البيانات الشخصية</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">قانون العمل السعودي</span>
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">98.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">امتثال حماية البيانات</span>
                      <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium">95.4%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">المراقبة المستمرة</span>
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">24/7</span>
                    </div>
                  </div>
                </div>

                {/* Committee Management */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">نظام إدارة اللجان</h3>
                  </div>
                  <p className="text-gray-400 mb-4">إشراف شامل على الحوكمة</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">لجان مجلس الإدارة</span>
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">3 نشطة</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">لجان الموارد البشرية</span>
                      <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium">4 نشطة</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">حضور الاجتماعات</span>
                      <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-medium">96%</span>
                    </div>
                  </div>
                </div>

                {/* Audit Trail Management */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">إدارة مسارات التدقيق</h3>
                  </div>
                  <p className="text-gray-400 mb-4">تسجيل وتتبع كامل للأنشطة</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">فحوصات الامتثال اليومية</span>
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">أنشطة المستخدمين المسجلة</span>
                      <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium">15,678+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">سلامة البيانات</span>
                      <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-medium">99.8%</span>
                    </div>
                  </div>
                </div>

                {/* Risk Management */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">إطار إدارة المخاطر</h3>
                  </div>
                  <p className="text-gray-400 mb-4">تحديد وتخفيف المخاطر بشكل منهجي</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">تقييمات المخاطر النشطة</span>
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">استراتيجيات التخفيف</span>
                      <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium">18</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">مستوى المخاطر</span>
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">منخفض</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Saudization Tab */}
            {activeTab === 'saudization' && (
              <div className="space-y-6">
                
                {/* Saudization Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      نظرة عامة على السعودة
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-300">النسبة الحالية</span>
                          <span className="text-2xl font-bold text-blue-400">{saudizationData.currentRatio}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                            style={{width: `${saudizationData.currentRatio}%`}}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-300">الهدف المطلوب</span>
                        <span className="text-lg font-semibold text-gray-400">{saudizationData.targetRatio}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                        <span className="text-sm text-gray-300">النطاق الأصفر - نتاقات</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      الاتجاهات الشهرية
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">هذا الشهر</span>
                        <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">+1.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">الشهر الماضي</span>
                        <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium">+0.8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">المتوسط السنوي</span>
                        <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-medium">+0.9%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Department Breakdown */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    تفصيل الأقسام
                  </h3>
                  <div className="space-y-6">
                    {saudizationData.departments.map((dept, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-white">{dept.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-white">{dept.ratio}%</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              dept.status === 'good' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-yellow-500 text-black'
                            }`}>
                              {dept.status === 'good' ? 'جيد' : 'يحتاج تحسين'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                dept.status === 'good' 
                                  ? 'bg-gradient-to-r from-green-400 to-green-500' 
                                  : 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                              }`}
                              style={{width: `${dept.ratio}%`}}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400">الهدف: {dept.target}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Integration Tab */}
            {activeTab === 'integration' && (
              <div className="space-y-6">
                
                {/* Government Platforms */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {governmentIntegrations.map((integration, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-blue-500/20 rounded-lg">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-white">{integration.platform}</h3>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          integration.status === 'connected' ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{integration.description}</p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">الحالة</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            integration.status === 'connected' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-red-500 text-white'
                          }`}>
                            {integration.status === 'connected' ? 'متصل' : 'غير متصل'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">آخر مزامنة</span>
                          <span className="text-xs text-gray-400">منذ 5 دقائق</span>
                        </div>
                        <button className="w-full mt-3 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          مزامنة الآن
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Integration Summary */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    ملخص حالة التكامل
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border border-gray-600 rounded-lg">
                      <div className="text-2xl font-bold text-green-400 mb-1">5</div>
                      <div className="text-sm text-gray-400">منصات متصلة</div>
                    </div>
                    <div className="text-center p-4 border border-gray-600 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400 mb-1">24/7</div>
                      <div className="text-sm text-gray-400">مراقبة مستمرة</div>
                    </div>
                    <div className="text-center p-4 border border-gray-600 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400 mb-1">99.9%</div>
                      <div className="text-sm text-gray-400">وقت التشغيل</div>
                    </div>
                    <div className="text-center p-4 border border-gray-600 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400 mb-1">15 ثانية</div>
                      <div className="text-sm text-gray-400">متوسط وقت الاستجابة</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="text-center py-16">
                <div className="mb-6">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-400 mb-3">قسم التقارير المحسن</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">تقارير شاملة للامتثال والسعودة والتكامل الحكومي</p>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 mx-auto">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  قريباً...
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PIF Partnership Readiness - AqlHR Style */}
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-8 rounded-xl border border-blue-500/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">جاهزية الامتثال للشراكات الاستراتيجية</h3>
          </div>
          <p className="text-gray-300 mb-6 text-lg">منصة الموارد البشرية الأكثر امتثالاً في المملكة العربية السعودية ومعدة للشراكات الاستراتيجية</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="text-2xl font-bold text-green-400 mb-1">94.2%</div>
              <div className="text-sm text-gray-300">نقاط الامتثال العامة</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="text-2xl font-bold text-blue-400 mb-1">{saudizationData.currentRatio}%</div>
              <div className="text-sm text-gray-300">نسبة السعودة</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="text-2xl font-bold text-purple-400 mb-1">5/5</div>
              <div className="text-sm text-gray-300">التكامل الحكومي</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="text-2xl font-bold text-green-400 mb-1">15</div>
              <div className="text-sm text-gray-300">وحدات الامتثال</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="text-2xl font-bold text-yellow-400 mb-1">مؤسسي</div>
              <div className="text-sm text-gray-300">درجة الأمان</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AqlHRComplianceOverview;
