import React, { useState } from 'react';
import { Shield, Users, FileText, AlertTriangle, Download, Bell } from 'lucide-react';

const AqlHRComplianceOverview = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Helper function to format numbers with commas
  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

  // --- MOCK DATA (Replace with API calls) ---
  const complianceData = {
    overallScore: 94.2,
    saudizationRatio: 67.5,
    nitaqatBand: 'yellow',
    activeAlerts: 2,
    pifReadiness: 98.7,
    auditTrails: 15678,
  };

  const saudizationData = {
    departments: [
      { name: 'الهندسة', ratio: 37.5, band: 'red' },
      { name: 'العمليات', ratio: 59.3, band: 'yellow' },
      { name: 'المالية', ratio: 80.0, band: 'green' },
      { name: 'الموارد البشرية', ratio: 83.3, band: 'platinum' },
    ],
  };

  const integrations = [
    { name: 'منصة قوى', status: 'connected', lastSync: 'قبل 5 دقائق' },
    { name: 'التأمينات الاجتماعية (GOSI)', status: 'connected', lastSync: 'قبل 15 دقيقة' },
    { name: 'وزارة الموارد البشرية (HRSD)', status: 'connected', lastSync: 'قبل ساعة واحدة' },
    { name: 'منصة أبشر', status: 'warning', lastSync: 'قبل 6 ساعات' },
    { name: 'وزارة العمل (MOL)', status: 'connected', lastSync: 'قبل 8 ساعات' },
  ];
  // --- END OF MOCK DATA ---

  const getPillStyle = (band: string) => {
    switch (band.toLowerCase()) {
      case 'platinum': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'green': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'yellow': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'red': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const MetricCard = ({ icon, title, value, unit, pillText, pillColor }: any) => (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:bg-gray-800 transition-colors duration-300">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="bg-gray-700 p-3 rounded-lg">{icon}</div>
          {pillText && <span className={`px-3 py-1 text-xs font-semibold rounded-full ${pillColor}`}>{pillText}</span>}
        </div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}<span className="text-xl font-medium text-gray-300">{unit}</span></p>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      <MetricCard icon={<Shield className="text-blue-400" />} title="الامتثال العام" value={complianceData.overallScore} unit="%" />
      <MetricCard icon={<Users className="text-green-400" />} title="نسبة السعودة" value={complianceData.saudizationRatio} unit="%" pillText={`النطاق ${complianceData.nitaqatBand}`} pillColor={getPillStyle(complianceData.nitaqatBand)} />
      <MetricCard icon={<AlertTriangle className="text-red-400" />} title="تنبيهات نشطة" value={complianceData.activeAlerts} />
      <MetricCard icon={<FileText className="text-yellow-400" />} title="مسارات المراجعة" value={formatNumber(complianceData.auditTrails)} />
    </div>
  );

  const SaudizationTab = () => (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">تفاصيل السعودة</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {saudizationData.departments.map(dept => (
          <div key={dept.name} className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-white">{dept.name}</p>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${getPillStyle(dept.band)}`}>{dept.ratio.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3">
              <div className={`h-2.5 rounded-full ${getPillStyle(dept.band).split(' ')[0]}`} style={{ width: `${dept.ratio}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const IntegrationTab = () => (
     <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">حالة التكامل الحكومي</h3>
        <div className="space-y-3">
            {integrations.map(int => (
                <div key={int.name} className="flex justify-between items-center bg-gray-900/70 p-3 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${int.status === 'connected' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <p className="font-medium text-white">{int.name}</p>
                    </div>
                    <p className="text-sm text-gray-400">{int.lastSync}</p>
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <div dir="rtl" className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen text-white font-sans">
      <div className="max-w-screen-2xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">إدارة الامتثال والحوكمة</h1>
            <p className="text-gray-400 mt-1">نظرة شاملة على حالة الامتثال في المنظمة.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"><Bell size={20} /></button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold flex items-center gap-2"><Download size={16} /> إنشاء تقرير</button>
          </div>
        </header>

        <nav className="mb-8">
          <div className="flex border-b border-gray-700">
            <button onClick={() => setActiveTab('overview')} className={`px-4 py-3 font-medium ${activeT
