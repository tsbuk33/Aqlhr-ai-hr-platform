import React, { useState } from 'react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import PageHeader from '@/components/common/PageHeader';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { ExecutiveAnalyticsEngine } from '@/components/executive/ExecutiveAnalyticsEngine';
import { AdvancedAIFeatures } from '@/components/executive/AdvancedAIFeatures';
import { DecisionSupportTools } from '@/components/executive/DecisionSupportTools';
import { ExecutiveInsightsSidebar } from '@/components/executive/ExecutiveInsightsSidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Target,
  BarChart3,
  Settings,
  Crown,
  Zap,
  Lightbulb
} from 'lucide-react';

const ExecutiveIntelligencePage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [activeView, setActiveView] = useState('analytics');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        {/* Premium Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Brain className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    {isArabic ? 'مركز الذكاء التنفيذي' : 'Executive Intelligence Center'}
                  </h1>
                  <p className="text-white/80 text-lg">
                    {isArabic 
                      ? 'تحليلات متقدمة وذكاء اصطناعي للقادة التنفيذيين' 
                      : 'Advanced Analytics & AI for Executive Leadership'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  <Crown className="w-4 h-4 mr-1" />
                  {isArabic ? 'مميز' : 'PREMIUM'}
                </Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  <Zap className="w-4 h-4 mr-1" />
                  {isArabic ? 'مدعوم بالذكاء الاصطناعي' : 'AI-POWERED'}
                </Badge>
              </div>
            </div>

            {/* Key Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5" />
                  <span className="font-medium">
                    {isArabic ? 'دقة التنبؤ' : 'Forecast Accuracy'}
                  </span>
                </div>
                <div className="text-2xl font-bold">94.2%</div>
                <div className="text-sm text-white/70">
                  {isArabic ? 'تخطيط القوى العاملة' : 'Workforce Planning'}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">
                    {isArabic ? 'قوة المواهب' : 'Pipeline Strength'}
                  </span>
                </div>
                <div className="text-2xl font-bold">76</div>
                <div className="text-sm text-white/70">
                  {isArabic ? 'مرشح عالي الإمكانات' : 'High-potential candidates'}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">
                    {isArabic ? 'نقاط التجربة' : 'Experience Score'}
                  </span>
                </div>
                <div className="text-2xl font-bold">8.7/10</div>
                <div className="text-sm text-white/70">
                  {isArabic ? 'رضا الموظفين' : 'Employee Satisfaction'}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">
                    {isArabic ? 'مؤشر المخاطر' : 'Risk Index'}
                  </span>
                </div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-white/70">
                  {isArabic ? 'موظف عالي المخاطر' : 'High-risk employees'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {isArabic ? 'محرك التحليلات' : 'Analytics Engine'}
            </TabsTrigger>
            <TabsTrigger value="ai-features" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              {isArabic ? 'ميزات الذكاء الاصطناعي' : 'AI Features'}
            </TabsTrigger>
            <TabsTrigger value="decision-support" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              {isArabic ? 'دعم القرارات' : 'Decision Support'}
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1">
              <TabsContent value="analytics" className="mt-0">
                <ExecutiveAnalyticsEngine />
              </TabsContent>

              <TabsContent value="ai-features" className="mt-0">
                <AdvancedAIFeatures />
              </TabsContent>

              <TabsContent value="decision-support" className="mt-0">
                <DecisionSupportTools />
              </TabsContent>
            </div>

            {/* AI Insights Sidebar */}
            <div className="w-80">
              <ExecutiveInsightsSidebar />
            </div>
          </div>
        </Tabs>

        {/* AI Integration for Executive Intelligence */}
        <UniversalAIIntegrator 
          pageType="executive" 
          moduleName="executive-intelligence" 
          companyId="demo-company" 
          enabledFeatures={[
            'predictive-analytics', 
            'strategic-insights', 
            'executive-reporting', 
            'decision-support',
            'risk-management',
            'talent-intelligence'
          ]}
        />
      </div>
    </div>
  );
};

export default ExecutiveIntelligencePage;