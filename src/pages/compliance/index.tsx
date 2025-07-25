import React, { useState } from 'react';

// A simple, error-proof version of the Compliance Overview component.
const AqlHRComplianceOverview = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Helper function to format numbers with commas
  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

  // --- MOCK DATA ---
  const complianceData = {
    overallScore: 94.2,
    saudizationRatio: 67.5,
    nitaqatBand: 'yellow',
    activeAlerts: 2,
    auditTrails: 15678,
  };

  const getPillStyle = (band: string) => {
    switch (band.toLowerCase()) {
      case 'platinum': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'green': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'yellow': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'red': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div dir="rtl" className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen text-white font-sans">
      <div className="max-w-screen-2xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">إدارة الامتثال والحوكمة</h1>
            <p className="text-gray-400 mt-1">نظرة شاملة على حالة الامتثال في المنظمة.</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold">إنشاء تقرير</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* MetricCard Component Inlined */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 shadow-lg">
                <p className="text-gray-400 text-sm mb-1">الامتثال العام</p>
                <p className="text-3xl font-bold text-white">{complianceData.overallScore}<span className="text-xl font-medium text-gray-300">%</span></p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 shadow-lg">
                <p className="text-gray-400 text-sm mb-1">نسبة السعودة</p>
                <p className="text-3xl font-bold text-white">{complianceData.saudizationRatio}<span className="text-xl font-medium text-gray-300">%</span></p>
                <span className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${getPillStyle(complianceData.nitaqatBand)}`}>النطاق {complianceData.nitaqatBand}</span>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 shadow-lg">
                <p className="text-gray-400 text-sm mb-1">تنبيهات نشطة</p>
                <p className="text-3xl font-bold text-white">{complianceData.activeAlerts}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 shadow-lg">
                <p className="text-gray-400 text-sm mb-1">مسارات المراجعة</p>
                <p className="text-3xl font-bold text-white">{formatNumber(complianceData.auditTrails)}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AqlHRComplianceOverview;
