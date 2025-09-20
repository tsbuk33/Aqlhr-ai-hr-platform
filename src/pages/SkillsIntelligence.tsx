import React, { useState } from 'react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import PageHeader from '@/components/common/PageHeader';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { SkillsMappingEngine } from '@/components/skills/SkillsMappingEngine';
import { AISkillsFeatures } from '@/components/skills/AISkillsFeatures';
import { SkillsMarketplace } from '@/components/skills/SkillsMarketplace';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Brain, 
  Users, 
  Target, 
  TrendingUp,
  Award,
  Lightbulb,
  Network,
  BarChart3,
  Zap,
  Sparkles,
  BookOpen
} from 'lucide-react';

const SkillsIntelligencePage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [activeView, setActiveView] = useState('mapping');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-amber-900/20" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        {/* Skills Intelligence Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl p-8 text-white">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Star className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    {isArabic ? 'ذكاء المهارات' : 'Skills Intelligence'}
                  </h1>
                  <p className="text-white/80 text-lg">
                    {isArabic 
                      ? 'نظام ذكي لتخطيط وتطوير المهارات مدعوم بالذكاء الاصطناعي' 
                      : 'AI-Powered Skills Mapping & Development System'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  <Sparkles className="w-4 h-4 mr-1" />
                  {isArabic ? 'جديد' : 'NEW'}
                </Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  <Brain className="w-4 h-4 mr-1" />
                  {isArabic ? 'ذكي' : 'SMART'}
                </Badge>
              </div>
            </div>

            {/* Skills Intelligence KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">
                    {isArabic ? 'الملفات الشخصية للمهارات' : 'Skills Profiles'}
                  </span>
                </div>
                <div className="text-2xl font-bold">847</div>
                <div className="text-sm text-white/70">
                  {isArabic ? 'موظف مع تقييم مهارات' : 'Employees with skills assessment'}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5" />
                  <span className="font-medium">
                    {isArabic ? 'الفجوات المهارية' : 'Skills Gaps'}
                  </span>
                </div>
                <div className="text-2xl font-bold">23</div>
                <div className="text-sm text-white/70">
                  {isArabic ? 'مهارات حرجة تحتاج تطوير' : 'Critical skills need development'}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">
                    {isArabic ? 'نمو المهارات' : 'Skills Growth'}
                  </span>
                </div>
                <div className="text-2xl font-bold">+18%</div>
                <div className="text-sm text-white/70">
                  {isArabic ? 'تحسن في المهارات الشهر الماضي' : 'Skills improvement last month'}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">
                    {isArabic ? 'الشهادات النشطة' : 'Active Certifications'}
                  </span>
                </div>
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm text-white/70">
                  {isArabic ? 'شهادة مهنية صالحة' : 'Valid professional certifications'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="mapping" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              {isArabic ? 'محرك تخطيط المهارات' : 'Skills Mapping Engine'}
            </TabsTrigger>
            <TabsTrigger value="ai-features" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              {isArabic ? 'الميزات الذكية' : 'AI Features'}
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              {isArabic ? 'سوق المهارات' : 'Skills Marketplace'}
            </TabsTrigger>
          </TabsList>

          {/* Skills Mapping Engine Tab */}
          <TabsContent value="mapping" className="mt-0">
            <SkillsMappingEngine />
          </TabsContent>

          {/* AI Features Tab */}
          <TabsContent value="ai-features" className="mt-0">
            <AISkillsFeatures />
          </TabsContent>

          {/* Skills Marketplace Tab */}
          <TabsContent value="marketplace" className="mt-0">
            <SkillsMarketplace />
          </TabsContent>
        </Tabs>

        {/* Skills Intelligence Insights */}
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              {isArabic ? 'رؤى ذكية للمهارات' : 'Intelligent Skills Insights'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-amber-600">92%</div>
                <div className="text-sm text-muted-foreground">
                  {isArabic ? 'دقة تنبؤات المهارات' : 'Skills prediction accuracy'}
                </div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-orange-600">4.2x</div>
                <div className="text-sm text-muted-foreground">
                  {isArabic ? 'تسريع تطوير المهارات' : 'Faster skills development'}
                </div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-red-600">76%</div>
                <div className="text-sm text-muted-foreground">
                  {isArabic ? 'تحسن في التوافق الوظيفي' : 'Better job-skills alignment'}
                </div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-purple-600">34</div>
                <div className="text-sm text-muted-foreground">
                  {isArabic ? 'مسارات تطوير نشطة' : 'Active learning pathways'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Integration for Skills Intelligence */}
        <UniversalAIIntegrator 
          pageType="general" 
          moduleName="skills-intelligence" 
          companyId="demo-company" 
          enabledFeatures={[
            'skills-mapping', 
            'gap-analysis', 
            'career-pathways', 
            'learning-recommendations',
            'skills-forecasting',
            'peer-endorsements'
          ]}
        />
      </div>
    </div>
  );
};

export default SkillsIntelligencePage;