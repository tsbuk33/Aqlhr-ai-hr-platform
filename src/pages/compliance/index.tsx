import React, { useState } from 'react';

// Color-corrected and simplified version of the Compliance Overview component.
const AqlHRComplianceOverview = () => {
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
      case 'platinum': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'green': return 'bg-green-500/20 text-green-300 border-green-500/40';
      case 'yellow': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'red': return 'bg-red-500/20 text-red-300 border-red-500/40';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
  };

  return (
    <div dir="rtl" className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen text-white font-sans">
      <div className="max-w-screen-2xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">إدارة الامتثال والحوكمة</h1>
            <p className="text-gray-300 mt-1">نظرة شاملة على حالة الامتثال في المنظمة.</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-white">إنشاء تقرير</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* MetricCard Component Inlined with improved colors */}
            <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-6 shadow-lg">
                <p className="text-gray-300 text-sm mb-1">الامتثال العام</p>
                <p className="text-4xl font-bold text-blue-300">{complianceData.overallScore}<span className="text-2xl font-medium text-blue-200">%</span></p>
            </div>
            <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-6 shadow-lg">
                <p className="text-gray-300 text-sm mb-1">نسبة السعودة</p>
                <p className="text-4xl font-bold text-green-300">{complianceData.saudizationRatio}<span className="text-2xl font-medium text-green-200">%</span></p>
                <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${getPillStyle(complianceData.nitaqatBand)}`}>النطاق {complianceData.nitaqatBand}</span>
            </div>
            <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-6 shadow-lg">
                <p className="text-gray-300 text-sm mb-1">تنبيهات نشطة</p>
                <p className="text-4xl font-bold text-red-400">{complianceData.activeAlerts}</p>
            </div>
            <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-6 shadow-lg">
                <p className="text-gray-300 text-sm mb-1">مسارات المراجعة</p>
                <p className="text-4xl font-bold text-yellow-300">{formatNumber(complianceData.auditTrails)}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AqlHRComplianceOverview;
