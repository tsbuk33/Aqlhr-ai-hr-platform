import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  BarChart3,
  FileText,
  Download,
  Settings,
  Users,
  Calendar,
  Award,
  Globe,
  Building,
  Lightbulb,
  PlayCircle
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const roiData = [
  { initiative: 'AI Training Program', investment: 250000, projected_savings: 680000, roi: 172, timeframe: '18 months' },
  { initiative: 'Remote Work Setup', investment: 150000, projected_savings: 320000, roi: 113, timeframe: '12 months' },
  { initiative: 'Performance Management System', investment: 80000, projected_savings: 240000, roi: 200, timeframe: '24 months' },
  { initiative: 'Employee Wellness Program', investment: 120000, projected_savings: 280000, roi: 133, timeframe: '15 months' }
];

const competitiveData = [
  { metric: 'Employee Satisfaction', us: 8.7, competitor_avg: 7.9, industry_avg: 8.1, benchmark: 'above' },
  { metric: 'Turnover Rate', us: 4.2, competitor_avg: 6.8, industry_avg: 5.9, benchmark: 'above' },
  { metric: 'Time to Fill', us: 32, competitor_avg: 45, industry_avg: 38, benchmark: 'above' },
  { metric: 'Training Investment', us: 2100, competitor_avg: 1650, industry_avg: 1850, benchmark: 'above' },
  { metric: 'Internal Promotion Rate', us: 67, competitor_avg: 52, industry_avg: 58, benchmark: 'above' }
];

const scenarioResults = {
  conservative: { revenue_impact: 2.3, cost_savings: 1.8, risk_level: 'low', probability: 85 },
  optimistic: { revenue_impact: 4.7, cost_savings: 3.2, risk_level: 'medium', probability: 65 },
  aggressive: { revenue_impact: 7.1, cost_savings: 4.9, risk_level: 'high', probability: 35 }
};

const boardMetrics = [
  { category: 'Workforce Efficiency', score: 92, trend: 'up', details: '8% improvement in productivity metrics' },
  { category: 'Talent Retention', score: 88, trend: 'stable', details: 'Retention rate stable at 95.8%' },
  { category: 'Cost Management', score: 85, trend: 'up', details: '12% reduction in cost-per-hire' },
  { category: 'Innovation Index', score: 79, trend: 'up', details: '23% increase in internal innovation projects' },
  { category: 'Risk Mitigation', score: 91, trend: 'stable', details: 'All critical risks under management' }
];

export const DecisionSupportTools: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [selectedScenario, setSelectedScenario] = useState('conservative');
  const [roiInputs, setRoiInputs] = useState({ investment: 100000, timeframe: 12, expected_benefit: 200000 });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const calculateROI = () => {
    const roi = ((roiInputs.expected_benefit - roiInputs.investment) / roiInputs.investment) * 100;
    return Math.round(roi);
  };

  const generateBoardReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      // Trigger download
    }, 2000);
  };

  const getBenchmarkColor = (benchmark: string) => {
    return benchmark === 'above' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <Tabs defaultValue="strategic-planner" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="strategic-planner">
            {isArabic ? 'المخطط الاستراتيجي' : 'Strategic Planner'}
          </TabsTrigger>
          <TabsTrigger value="roi-calculator">
            {isArabic ? 'حاسبة العائد' : 'ROI Calculator'}
          </TabsTrigger>
          <TabsTrigger value="competitive-intelligence">
            {isArabic ? 'الذكاء التنافسي' : 'Competitive Intelligence'}
          </TabsTrigger>
          <TabsTrigger value="board-reporting">
            {isArabic ? 'تقارير مجلس الإدارة' : 'Board Reporting'}
          </TabsTrigger>
        </TabsList>

        {/* Strategic Planning Simulator */}
        <TabsContent value="strategic-planner" className="space-y-6 mt-6">
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                {isArabic ? 'محاكي التخطيط الاستراتيجي' : 'Strategic Planning Simulator'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scenario Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(scenarioResults).map(([scenario, data]) => (
                  <div 
                    key={scenario}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedScenario === scenario 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedScenario(scenario)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">{scenario.replace('_', ' ')}</h4>
                      <Badge variant={data.risk_level === 'low' ? 'default' : data.risk_level === 'medium' ? 'secondary' : 'destructive'}>
                        {data.risk_level} risk
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{isArabic ? 'تأثير الإيرادات:' : 'Revenue Impact:'}</span>
                        <span className="font-bold text-green-600">+{data.revenue_impact}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isArabic ? 'توفير التكاليف:' : 'Cost Savings:'}</span>
                        <span className="font-bold text-blue-600">+{data.cost_savings}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isArabic ? 'الاحتمالية:' : 'Probability:'}</span>
                        <span className="font-bold">{data.probability}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Scenario Details */}
              {selectedScenario && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-4">
                    {selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1)} {isArabic ? 'السيناريو' : 'Scenario'} - {isArabic ? 'التفاصيل' : 'Details'}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-3">{isArabic ? 'التأثيرات المتوقعة' : 'Expected Impacts'}</h5>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {selectedScenario === 'conservative' && (isArabic ? 'تحسن تدريجي في الإنتاجية' : 'Gradual productivity improvements')}
                          {selectedScenario === 'optimistic' && (isArabic ? 'نمو قوي في الأداء' : 'Strong performance growth')}
                          {selectedScenario === 'aggressive' && (isArabic ? 'تحول جذري في الأعمال' : 'Transformational business change')}
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          {selectedScenario === 'conservative' && (isArabic ? 'تحسينات تكلفة معتدلة' : 'Moderate cost optimizations')}
                          {selectedScenario === 'optimistic' && (isArabic ? 'توفير كبير في التكاليف' : 'Significant cost savings')}
                          {selectedScenario === 'aggressive' && (isArabic ? 'إعادة هيكلة التكاليف بالكامل' : 'Complete cost restructuring')}
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          {selectedScenario === 'conservative' && (isArabic ? 'مخاطر منخفضة ونتائج مضمونة' : 'Low risk with guaranteed outcomes')}
                          {selectedScenario === 'optimistic' && (isArabic ? 'مخاطر متوسطة مع عوائد عالية' : 'Medium risk with high returns')}
                          {selectedScenario === 'aggressive' && (isArabic ? 'مخاطر عالية مع إمكانية عوائد استثنائية' : 'High risk with exceptional return potential')}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium mb-3">{isArabic ? 'الإجراءات المطلوبة' : 'Required Actions'}</h5>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-orange-500" />
                          {selectedScenario === 'conservative' && (isArabic ? 'تحسين العمليات الحالية' : 'Optimize current processes')}
                          {selectedScenario === 'optimistic' && (isArabic ? 'استثمار في التقنيات الجديدة' : 'Invest in new technologies')}
                          {selectedScenario === 'aggressive' && (isArabic ? 'إعادة تصميم نموذج الأعمال' : 'Redesign business model')}
                        </li>
                        <li className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-500" />
                          {selectedScenario === 'conservative' && (isArabic ? 'تدريب الفرق الحالية' : 'Train existing teams')}
                          {selectedScenario === 'optimistic' && (isArabic ? 'توظيف مواهب متخصصة' : 'Hire specialized talent')}
                          {selectedScenario === 'aggressive' && (isArabic ? 'بناء قدرات جديدة بالكامل' : 'Build entirely new capabilities')}
                        </li>
                        <li className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          {selectedScenario === 'conservative' && (isArabic ? 'تنفيذ على 6-12 شهر' : 'Implement over 6-12 months')}
                          {selectedScenario === 'optimistic' && (isArabic ? 'تنفيذ على 12-18 شهر' : 'Implement over 12-18 months')}
                          {selectedScenario === 'aggressive' && (isArabic ? 'تنفيذ على 18-36 شهر' : 'Implement over 18-36 months')}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROI Calculator */}
        <TabsContent value="roi-calculator" className="space-y-6 mt-6">
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-green-600" />
                {isArabic ? 'حاسبة العائد على الاستثمار للمبادرات' : 'ROI Calculator for HR Initiatives'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ROI Input Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isArabic ? 'الاستثمار الأولي ($)' : 'Initial Investment ($)'}
                    </label>
                    <Input
                      type="number"
                      value={roiInputs.investment}
                      onChange={(e) => setRoiInputs({...roiInputs, investment: Number(e.target.value)})}
                      placeholder="100000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isArabic ? 'الإطار الزمني (أشهر)' : 'Timeframe (months)'}
                    </label>
                    <Slider
                      value={[roiInputs.timeframe]}
                      onValueChange={([value]) => setRoiInputs({...roiInputs, timeframe: value})}
                      max={36}
                      min={6}
                      step={3}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600 mt-1">{roiInputs.timeframe} {isArabic ? 'أشهر' : 'months'}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isArabic ? 'الفائدة المتوقعة ($)' : 'Expected Benefit ($)'}
                    </label>
                    <Input
                      type="number"
                      value={roiInputs.expected_benefit}
                      onChange={(e) => setRoiInputs({...roiInputs, expected_benefit: Number(e.target.value)})}
                      placeholder="200000"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-4">{isArabic ? 'نتائج الحساب' : 'Calculation Results'}</h4>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {calculateROI()}%
                      </div>
                      <div className="text-sm text-gray-600">{isArabic ? 'العائد على الاستثمار' : 'Return on Investment'}</div>
                    </div>
                    
                    <div className="space-y-2 border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span>{isArabic ? 'صافي الربح:' : 'Net Profit:'}</span>
                        <span className="font-medium">${(roiInputs.expected_benefit - roiInputs.investment).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{isArabic ? 'العائد الشهري:' : 'Monthly Return:'}</span>
                        <span className="font-medium">${Math.round((roiInputs.expected_benefit - roiInputs.investment) / roiInputs.timeframe).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{isArabic ? 'فترة الاسترداد:' : 'Payback Period:'}</span>
                        <span className="font-medium">{Math.round((roiInputs.investment / roiInputs.expected_benefit) * roiInputs.timeframe)} {isArabic ? 'أشهر' : 'months'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pre-calculated ROI Examples */}
              <div>
                <h4 className="font-medium mb-4">{isArabic ? 'أمثلة مبادرات الموارد البشرية' : 'HR Initiative Examples'}</h4>
                <div className="space-y-3">
                  {roiData.map((initiative, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{initiative.initiative}</div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? 'الاستثمار:' : 'Investment:'} ${initiative.investment.toLocaleString()} • 
                          {isArabic ? ' التوفير المتوقع:' : ' Expected Savings:'} ${initiative.projected_savings.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{initiative.roi}%</div>
                        <div className="text-xs text-gray-500">{initiative.timeframe}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitive Intelligence */}
        <TabsContent value="competitive-intelligence" className="space-y-6 mt-6">
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-600" />
                {isArabic ? 'لوحة الذكاء التنافسي' : 'Competitive Intelligence Dashboard'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Market Position Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{isArabic ? 'موقعنا في السوق' : 'Market Position'}</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">#2</div>
                  <div className="text-sm text-gray-600">{isArabic ? 'في قطاع التكنولوجيا' : 'in Technology Sector'}</div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-medium">{isArabic ? 'مؤشر المواهب' : 'Talent Index'}</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">8.4/10</div>
                  <div className="text-sm text-gray-600">{isArabic ? 'أعلى من المتوسط' : 'Above Average'}</div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">{isArabic ? 'نقاط القوة' : 'Strengths'}</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">5/5</div>
                  <div className="text-sm text-gray-600">{isArabic ? 'مجالات رائدة' : 'Leading Areas'}</div>
                </div>
              </div>

              {/* Competitive Metrics */}
              <div>
                <h4 className="font-medium mb-4">{isArabic ? 'المقارنة مع المنافسين' : 'Competitive Benchmarking'}</h4>
                <div className="space-y-4">
                  {competitiveData.map((metric, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">{metric.metric}</span>
                        <Badge className={getBenchmarkColor(metric.benchmark)}>
                          {metric.benchmark} benchmark
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">{isArabic ? 'نحن' : 'Us'}</div>
                          <div className="font-bold text-blue-600">{metric.us}{metric.metric.includes('Rate') || metric.metric.includes('Time') ? (metric.metric.includes('Time') ? ' days' : '%') : (metric.metric.includes('Investment') ? ' SAR' : '')}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">{isArabic ? 'المنافسون' : 'Competitors'}</div>
                          <div className="font-medium">{metric.competitor_avg}{metric.metric.includes('Rate') || metric.metric.includes('Time') ? (metric.metric.includes('Time') ? ' days' : '%') : (metric.metric.includes('Investment') ? ' SAR' : '')}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">{isArabic ? 'القطاع' : 'Industry'}</div>
                          <div className="font-medium">{metric.industry_avg}{metric.metric.includes('Rate') || metric.metric.includes('Time') ? (metric.metric.includes('Time') ? ' days' : '%') : (metric.metric.includes('Investment') ? ' SAR' : '')}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Alert>
                <Lightbulb className="w-4 h-4" />
                <AlertDescription>
                  <strong>{isArabic ? 'فرص التحسين:' : 'Improvement Opportunities:'}</strong>
                  {isArabic 
                    ? ' تركز البيانات على ضرورة زيادة الاستثمار في التدريب للحفاظ على التفوق التنافسي.'
                    : ' Data suggests increasing training investment to maintain competitive advantage.'
                  }
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Board Reporting */}
        <TabsContent value="board-reporting" className="space-y-6 mt-6">
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                {isArabic ? 'قوالب تقارير مجلس الإدارة' : 'Board Reporting Templates'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Executive Summary Metrics */}
              <div>
                <h4 className="font-medium mb-4">{isArabic ? 'مؤشرات الملخص التنفيذي' : 'Executive Summary Metrics'}</h4>
                <div className="space-y-4">
                  {boardMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{metric.category}</span>
                          {getTrendIcon(metric.trend)}
                        </div>
                        <div className="text-sm text-gray-600">{metric.details}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{metric.score}</div>
                        <div className="text-xs text-gray-500">{isArabic ? 'من 100' : 'out of 100'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Generation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">{isArabic ? 'أنواع التقارير المتاحة' : 'Available Report Types'}</h4>
                  <div className="space-y-2">
                    {[
                      { name: isArabic ? 'التقرير الشهري للمجلس' : 'Monthly Board Report', desc: isArabic ? 'ملخص شامل للأداء الشهري' : 'Comprehensive monthly performance summary' },
                      { name: isArabic ? 'تقرير المواهب الاستراتيجي' : 'Strategic Talent Report', desc: isArabic ? 'تحليل عميق لإستراتيجية المواهب' : 'Deep dive into talent strategy' },
                      { name: isArabic ? 'تقرير إدارة المخاطر' : 'Risk Management Report', desc: isArabic ? 'تقييم وإدارة مخاطر الموارد البشرية' : 'HR risk assessment and management' },
                      { name: isArabic ? 'تقرير الاستدامة والتنوع' : 'Sustainability & Diversity Report', desc: isArabic ? 'مبادرات الاستدامة والتنوع' : 'Sustainability and diversity initiatives' }
                    ].map((report, index) => (
                      <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="font-medium text-sm">{report.name}</div>
                        <div className="text-xs text-gray-600">{report.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-4">
                    {isArabic ? 'إنشاء تقرير مخصص' : 'Generate Custom Report'}
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isArabic ? 'فترة التقرير' : 'Report Period'}
                      </label>
                      <select className="w-full p-2 border rounded">
                        <option>{isArabic ? 'آخر شهر' : 'Last Month'}</option>
                        <option>{isArabic ? 'آخر ربع' : 'Last Quarter'}</option>
                        <option>{isArabic ? 'آخر سنة' : 'Last Year'}</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isArabic ? 'التركيز على' : 'Focus Areas'}
                      </label>
                      <div className="space-y-2">
                        {[
                          isArabic ? 'الأداء المالي' : 'Financial Performance',
                          isArabic ? 'إدارة المواهب' : 'Talent Management', 
                          isArabic ? 'إدارة المخاطر' : 'Risk Management',
                          isArabic ? 'الابتكار والنمو' : 'Innovation & Growth'
                        ].map((area, index) => (
                          <label key={index} className="flex items-center gap-2 text-sm">
                            <input type="checkbox" defaultChecked />
                            <span>{area}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={generateBoardReport}
                      disabled={isGeneratingReport}
                      className="w-full"
                    >
                      {isGeneratingReport ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          {isArabic ? 'إنشاء التقرير...' : 'Generating Report...'}
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          {isArabic ? 'إنشاء تقرير المجلس' : 'Generate Board Report'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};