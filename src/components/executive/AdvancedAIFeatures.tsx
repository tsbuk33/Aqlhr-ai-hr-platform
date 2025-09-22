import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  MessageSquare, 
  Settings,
  Play,
  Download,
  RefreshCw,
  Lightbulb,
  Target,
  DollarSign,
  Users,
  BarChart3,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const turnoverPrediction = [
  { month: 'Jan', predicted: 5.2, actual: 4.8, confidence: 87 },
  { month: 'Feb', predicted: 4.9, actual: 5.1, confidence: 89 },
  { month: 'Mar', predicted: 6.1, actual: 6.3, confidence: 85 },
  { month: 'Apr', predicted: 5.7, actual: 5.4, confidence: 91 },
  { month: 'May', predicted: 4.8, actual: null, confidence: 88 },
  { month: 'Jun', predicted: 5.3, actual: null, confidence: 86 }
];

const performanceProjections = [
  { employee: 'Ahmed Al-Rashid', current: 8.2, projected_3m: 8.7, projected_6m: 9.1, trend: 'improving' },
  { employee: 'Sarah Johnson', current: 7.8, projected_3m: 7.5, projected_6m: 7.2, trend: 'declining' },
  { employee: 'Mohammed Ali', current: 8.9, projected_3m: 9.2, projected_6m: 9.4, trend: 'improving' },
  { employee: 'Lisa Chen', current: 7.4, projected_3m: 7.8, projected_6m: 8.1, trend: 'improving' }
];

const skillDemandForecast = [
  { skill: 'AI/Machine Learning', current_demand: 78, predicted_12m: 95, growth: 22 },
  { skill: 'Data Science', current_demand: 65, predicted_12m: 82, growth: 26 },
  { skill: 'Cloud Architecture', current_demand: 71, predicted_12m: 88, growth: 24 },
  { skill: 'Cybersecurity', current_demand: 59, predicted_12m: 76, growth: 29 },
  { skill: 'DevOps', current_demand: 67, predicted_12m: 81, growth: 21 }
];

const compensationBenchmarks = [
  { position: 'Software Engineer', market_50th: 185000, market_75th: 220000, our_avg: 195000, competitiveness: 'above_market' },
  { position: 'Data Scientist', market_50th: 198000, market_75th: 235000, our_avg: 180000, competitiveness: 'below_market' },
  { position: 'Product Manager', market_50th: 175000, market_75th: 210000, our_avg: 205000, competitiveness: 'above_market' },
  { position: 'DevOps Engineer', market_50th: 165000, market_75th: 195000, our_avg: 170000, competitiveness: 'at_market' }
];

const insightExamples = [
  {
    type: 'trend',
    title: 'Workforce Trend Analysis',
    content: 'Employee satisfaction has increased by 12% over the last quarter, primarily driven by improved work-life balance initiatives and manager training programs. The highest improvements are seen in the Engineering (15%) and Sales (14%) departments.',
    confidence: 94
  },
  {
    type: 'prediction',
    title: 'Turnover Risk Assessment',
    content: 'Based on current patterns, we predict a 23% increase in voluntary turnover in Q3, particularly among mid-level engineers. Key risk factors include salary compression and limited advancement opportunities.',
    confidence: 87
  },
  {
    type: 'recommendation',
    title: 'Strategic Hiring Recommendation',
    content: 'Market analysis suggests focusing recruitment efforts on AI/ML specialists in the next 6 months. Demand is projected to increase by 34%, while supply remains limited. Early action could provide competitive advantage.',
    confidence: 91
  }
];

export const AdvancedAIFeatures: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [selectedScenario, setSelectedScenario] = useState('');
  const [scenarioResults, setScenarioResults] = useState<any>(null);
  const [isRunningScenario, setIsRunningScenario] = useState(false);

  const runScenario = async () => {
    setIsRunningScenario(true);
    // Simulate AI processing
    setTimeout(() => {
      setScenarioResults({
        headcount_change: '+15%',
        budget_impact: '+$2.3M',
        productivity_gain: '+8%',
        risk_factors: ['Skill shortage in AI/ML', 'Increased competition for talent'],
        recommendations: ['Accelerate internal training programs', 'Partner with universities', 'Implement retention bonuses']
      });
      setIsRunningScenario(false);
    }, 2000);
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600 bg-green-50';
      case 'declining': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCompetitivenessColor = (comp: string) => {
    switch (comp) {
      case 'above_market': return 'text-green-600 bg-green-50';
      case 'below_market': return 'text-red-600 bg-red-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <Tabs defaultValue="predictive-models" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictive-models">
            {isArabic ? 'النماذج التنبؤية' : 'Predictive Models'}
          </TabsTrigger>
          <TabsTrigger value="natural-language">
            {isArabic ? 'الرؤى اللغوية' : 'Natural Language Insights'}
          </TabsTrigger>
          <TabsTrigger value="scenario-modeling">
            {isArabic ? 'نمذجة السيناريوهات' : 'Scenario Modeling'}
          </TabsTrigger>
        </TabsList>

        {/* Predictive Models */}
        <TabsContent value="predictive-models" className="space-y-6 mt-6">
          {/* Turnover Prediction */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                {isArabic ? 'خوارزميات التنبؤ بالدوران' : 'Turnover Prediction Algorithms'}
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  {isArabic ? 'دقة 89%' : '89% Accuracy'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={turnoverPrediction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} name="Predicted %" />
                    <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual %" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
              
              <Alert>
                <Brain className="w-4 h-4" />
                <AlertDescription>
                  <strong>{isArabic ? 'توقع رئيسي:' : 'Key Prediction:'}</strong>
                  {isArabic 
                    ? ' متوقع زيادة معدل الدوران إلى 5.3% في يونيو بسبب موسم التوظيف الصيفي وضغوط الرواتب.'
                    : ' Turnover rate expected to increase to 5.3% in June due to summer hiring season and salary pressures.'
                  }
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Performance Trajectory Forecasting */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                {isArabic ? 'توقع مسار الأداء' : 'Performance Trajectory Forecasting'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceProjections.map((emp, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{emp.employee}</span>
                        <Badge className={getTrendColor(emp.trend)}>
                          {emp.trend}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span>{isArabic ? 'حالي:' : 'Current:'} <strong>{emp.current}</strong></span>
                        <span>{isArabic ? '3 أشهر:' : '3 months:'} <strong>{emp.projected_3m}</strong></span>
                        <span>{isArabic ? '6 أشهر:' : '6 months:'} <strong>{emp.projected_6m}</strong></span>
                      </div>
                    </div>
                    <div className="w-32">
                      <Progress value={emp.projected_6m * 10} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skill Demand Predictions */}
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                {isArabic ? 'توقعات الطلب على المهارات' : 'Skill Demand Predictions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillDemandForecast.map((skill, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{skill.skill}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        +{skill.growth}% {isArabic ? 'نمو' : 'growth'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">{isArabic ? 'الطلب الحالي' : 'Current Demand'}</div>
                        <div className="flex items-center gap-2">
                          <Progress value={skill.current_demand} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{skill.current_demand}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">{isArabic ? 'متوقع 12 شهر' : 'Predicted 12m'}</div>
                        <div className="flex items-center gap-2">
                          <Progress value={skill.predicted_12m} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{skill.predicted_12m}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compensation Benchmarking AI */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CurrencyIcon className="w-5 h-5 text-orange-600" />
                {isArabic ? 'ذكاء معايير التعويضات' : 'Compensation Benchmarking AI'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {compensationBenchmarks.map((pos, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{pos.position}</span>
                      <Badge className={getCompetitivenessColor(pos.competitiveness)}>
                        {pos.competitiveness.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">{isArabic ? 'السوق 50%' : 'Market 50th'}</div>
                        <div className="font-medium">${pos.market_50th.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">{isArabic ? 'السوق 75%' : 'Market 75th'}</div>
                        <div className="font-medium">${pos.market_75th.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">{isArabic ? 'متوسطنا' : 'Our Average'}</div>
                        <div className="font-medium">${pos.our_avg.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Natural Language Insights */}
        <TabsContent value="natural-language" className="space-y-6 mt-6">
          <Card className="border-2 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                {isArabic ? 'الرؤى باللغة الطبيعية' : 'Natural Language Insights'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {insightExamples.map((insight, index) => (
                <div key={index} className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-indigo-900">{insight.title}</h4>
                    <Badge variant="outline" className="bg-indigo-100 text-indigo-700">
                      {insight.confidence}% {isArabic ? 'ثقة' : 'confidence'}
                    </Badge>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{insight.content}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      {isArabic ? 'تصدير' : 'Export'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      {isArabic ? 'تحديث' : 'Refresh'}
                    </Button>
                  </div>
                </div>
              ))}

              <Alert>
                <Brain className="w-4 h-4" />
                <AlertDescription>
                  <strong>{isArabic ? 'محرك التوصيات:' : 'Recommendation Engine:'}</strong>
                  {isArabic 
                    ? ' يتم تحديث الرؤى تلقائياً كل 4 ساعات باستخدام أحدث البيانات والخوارزميات المتقدمة.'
                    : ' Insights are automatically updated every 4 hours using the latest data and advanced algorithms.'
                  }
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenario Modeling */}
        <TabsContent value="scenario-modeling" className="space-y-6 mt-6">
          <Card className="border-2 border-cyan-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-600" />
                {isArabic ? 'نمذجة سيناريو ماذا لو' : 'What-if Scenario Modeling'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isArabic ? 'اختر السيناريو' : 'Select Scenario'}
                    </label>
                    <select 
                      className="w-full p-2 border rounded-lg"
                      value={selectedScenario}
                      onChange={(e) => setSelectedScenario(e.target.value)}
                    >
                      <option value="">{isArabic ? 'اختر سيناريو...' : 'Select scenario...'}</option>
                      <option value="expansion">{isArabic ? 'توسع الشركة 25%' : 'Company expansion 25%'}</option>
                      <option value="recession">{isArabic ? 'تخفيض الميزانية 15%' : 'Budget reduction 15%'}</option>
                      <option value="automation">{isArabic ? 'تطبيق الأتمتة' : 'Automation implementation'}</option>
                      <option value="remote">{isArabic ? 'العمل عن بعد 100%' : '100% remote work'}</option>
                    </select>
                  </div>
                  
                  <Button 
                    onClick={runScenario}
                    disabled={!selectedScenario || isRunningScenario}
                    className="w-full"
                  >
                    {isRunningScenario ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {isArabic ? 'تشغيل النموذج...' : 'Running Model...'}
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        {isArabic ? 'تشغيل السيناريو' : 'Run Scenario'}
                      </>
                    )}
                  </Button>
                </div>

                {scenarioResults && (
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg border border-cyan-200">
                    <h4 className="font-semibold text-cyan-900 mb-4">
                      {isArabic ? 'نتائج السيناريو' : 'Scenario Results'}
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{isArabic ? 'تغيير عدد الموظفين:' : 'Headcount Change:'}</span>
                        <span className="font-bold text-green-600">{scenarioResults.headcount_change}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{isArabic ? 'تأثير الميزانية:' : 'Budget Impact:'}</span>
                        <span className="font-bold text-red-600">{scenarioResults.budget_impact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{isArabic ? 'مكاسب الإنتاجية:' : 'Productivity Gain:'}</span>
                        <span className="font-bold text-blue-600">{scenarioResults.productivity_gain}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="font-medium text-sm mb-2">{isArabic ? 'عوامل المخاطر:' : 'Risk Factors:'}</h5>
                      <ul className="text-xs space-y-1">
                        {scenarioResults.risk_factors.map((factor: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4">
                      <h5 className="font-medium text-sm mb-2">{isArabic ? 'التوصيات:' : 'Recommendations:'}</h5>
                      <ul className="text-xs space-y-1">
                        {scenarioResults.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};