import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { 
  Crown,
  Brain,
  Network,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Users,
  BarChart3,
  Settings,
  AlertTriangle,
  Database,
  FileText,
  Cpu,
  Lightbulb,
  Smartphone
} from 'lucide-react';
import MasterIntelligenceDashboard from '@/components/executive/MasterIntelligenceDashboard';
import CrossModuleIntelligence from '@/components/executive/CrossModuleIntelligence';
import StrategicDecisionSupport from '@/components/executive/StrategicDecisionSupport';
import { EnhancedFileUpload } from '@/components/enhanced/EnhancedFileUpload';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { AICommandCenter } from '@/components/ai-ecosystem/AICommandCenter';
import { AqlMindCore } from '@/components/ai-ecosystem/AqlMindCore';
import { AIDecisionEngine } from '@/components/ai-ecosystem/AIDecisionEngine';
import { LearningEngine } from '@/components/ai-ecosystem/LearningEngine';
import { IntelligenceGatherer } from '@/components/ai-ecosystem/IntelligenceGatherer';
import { AdvancedPredictiveAnalytics } from '@/components/executive/AdvancedPredictiveAnalytics';

const ExecutiveCenter: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [activeModule, setActiveModule] = useState('intelligence');
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Executive Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 p-8">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center">
                <Crown className="h-10 w-10 mr-4 text-primary" />
                {isArabic ? 'مركز أقل للذكاء التنفيذي' : 'AqlHR Executive Intelligence Center'}
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                {isArabic ? 'نظام الموارد البشرية النهائي - إدارة أكثر من 105 وحدة بامتياز الذكاء الاصطناعي' : 'The Ultimate HR Operating System - Orchestrating 105+ Modules with AI Excellence'}
              </p>
            </div>
            <div className="text-right space-y-3">
              {/* Enhanced Mobile Access Button - Super Prominent */}
              <div className="flex gap-2 justify-end mb-4">
                <Button 
                  variant="default" 
                  size="lg"
                  onClick={() => navigate('/executive/mobile')}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold shadow-xl border-0 px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Smartphone className="h-6 w-6 mr-3" />
                  📱 {isArabic ? 'الوصول التنفيذي المحمول' : 'MOBILE EXECUTIVE ACCESS'}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200 text-sm px-4 py-2 font-semibold shadow-sm">
                  <Globe className="h-4 w-4 mr-2" />
                  {isArabic ? 'جاهز للمؤسسات العالمية' : 'Global Enterprise Ready'}
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 text-sm px-4 py-2 font-semibold shadow-sm">
                  <Brain className="h-4 w-4 mr-2" />
                  {isArabic ? '26 قدرة ذكاء اصطناعي نشطة' : '26 AI Capabilities Active'}
                </Badge>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 text-sm px-4 py-2 font-semibold shadow-sm">
                  <Shield className="h-4 w-4 mr-2" />
                  {isArabic ? '22 تكامل حكومي مباشر' : '22 Gov Integrations Live'}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Strategic Capabilities Overview */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8">
            <div className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">105+</div>
              <div className="text-sm text-gray-700 dark:text-gray-200 font-medium">{isArabic ? 'الوحدات المتكاملة' : 'Integrated Modules'}</div>
            </div>
            <div className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg">
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">99.9%</div>
              <div className="text-sm text-gray-700 dark:text-gray-200 font-medium">{isArabic ? 'وقت تشغيل النظام' : 'System Uptime'}</div>
            </div>
            <div className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg">
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{isArabic ? 'فوري' : 'Real-Time'}</div>
              <div className="text-sm text-gray-700 dark:text-gray-200 font-medium">{isArabic ? 'معالجة البيانات' : 'Data Processing'}</div>
            </div>
            <div className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{isArabic ? 'مؤسسي' : 'Enterprise'}</div>
              <div className="text-sm text-gray-700 dark:text-gray-200 font-medium">{isArabic ? 'جاهز للتوسع' : 'Scale Ready'}</div>
            </div>
            <div className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg">
              <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{isArabic ? 'سعودي' : 'Saudi'}</div>
              <div className="text-sm text-gray-700 dark:text-gray-200 font-medium">{isArabic ? 'رائد السوق' : 'Market Leader'}</div>
            </div>
            {/* SUPER PROMINENT Mobile Access Card */}
            <div className="text-center p-6 bg-gradient-to-br from-emerald-200 to-emerald-100 dark:from-emerald-800 dark:to-emerald-700 backdrop-blur-sm rounded-xl border-2 border-emerald-300 dark:border-emerald-500 hover:border-emerald-400 dark:hover:border-emerald-400 transition-all cursor-pointer shadow-xl hover:shadow-2xl transform hover:scale-105"
                 onClick={() => navigate('/executive/mobile')}>
              <div className="text-3xl font-bold text-emerald-800 dark:text-emerald-100 flex items-center justify-center mb-2">
                📱 <Smartphone className="h-8 w-8 ml-2" />
              </div>
              <div className="text-sm text-emerald-900 dark:text-emerald-200 font-bold">
                {isArabic ? 'الوصول المحمول' : 'MOBILE ACCESS'}
              </div>
              <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium mt-1">
                {isArabic ? 'تطبيق تنفيذي' : 'Executive App'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary rounded-full transform -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent rounded-full transform translate-x-20 translate-y-20"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-warning rounded-full transform -translate-x-12 -translate-y-12"></div>
        </div>
      </div>

      {/* Executive Navigation */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Button
              variant={activeModule === 'intelligence' ? 'default' : 'outline'}
              onClick={() => setActiveModule('intelligence')}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Brain className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Master Intelligence</div>
                <div className="text-xs text-muted-foreground">Strategic Overview</div>
              </div>
            </Button>

            <Button
              variant={activeModule === 'ai-ecosystem' ? 'default' : 'outline'}
              onClick={() => setActiveModule('ai-ecosystem')}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Cpu className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">AI Ecosystem</div>
                <div className="text-xs text-muted-foreground">AqlMind Brain</div>
              </div>
            </Button>

            <Button
              variant={activeModule === 'correlation' ? 'default' : 'outline'}
              onClick={() => setActiveModule('correlation')}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Network className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Cross-Module Intelligence</div>
                <div className="text-xs text-muted-foreground">AI Correlations</div>
              </div>
            </Button>

            <Button
              variant={activeModule === 'decisions' ? 'default' : 'outline'}
              onClick={() => setActiveModule('decisions')}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Target className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Strategic Decisions</div>
                <div className="text-xs text-muted-foreground">Scenario Planning</div>
              </div>
            </Button>

            <Button
              variant={activeModule === 'insights' ? 'default' : 'outline'}
              onClick={() => setActiveModule('insights')}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <TrendingUp className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Predictive Insights</div>
                <div className="text-xs text-muted-foreground">AI Forecasting</div>
              </div>
            </Button>

            <Button
              variant={activeModule === 'documents' ? 'default' : 'outline'}
              onClick={() => setActiveModule('documents')}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Database className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Executive Documents</div>
                <div className="text-xs text-muted-foreground">Data Repository</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Alert Banner */}
      <Card className="border-warning/20 bg-gradient-to-r from-warning/10 to-warning/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <div className="font-medium text-warning">Strategic Opportunity Detected</div>
                <div className="text-sm text-muted-foreground">
                  AI analysis suggests implementing advanced workforce planning could increase ROI by 340%
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-warning/20 text-warning hover:bg-warning/10">
              View Recommendation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Executive Interface */}
      <div className="space-y-6">
        {activeModule === 'intelligence' && <MasterIntelligenceDashboard />}
        
        {activeModule === 'ai-ecosystem' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="h-5 w-5 mr-2" />
                  AqlHR AI Ecosystem Command Center
                </CardTitle>
                <CardDescription>
                  Central intelligence system that thinks, learns, and makes autonomous decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AICommandCenter />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    AqlMind Core Intelligence
                  </CardTitle>
                  <CardDescription>
                    Central AI brain processing and understanding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AqlMindCore />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    AI Decision Engine
                  </CardTitle>
                  <CardDescription>
                    Autonomous decision-making with 98%+ accuracy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AIDecisionEngine />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Learning Engine
                  </CardTitle>
                  <CardDescription>
                    Continuous learning and pattern recognition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LearningEngine />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Network className="h-5 w-5 mr-2" />
                    Intelligence Gatherer
                  </CardTitle>
                  <CardDescription>
                    Multi-source data intelligence synthesis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <IntelligenceGatherer />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {activeModule === 'correlation' && <CrossModuleIntelligence />}
        {activeModule === 'decisions' && <StrategicDecisionSupport />}
        {activeModule === 'insights' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Advanced Predictive Insights
              </CardTitle>
              <CardDescription>
                AI-powered strategic forecasting across all operational dimensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedPredictiveAnalytics />
            </CardContent>
          </Card>
        )}

        {activeModule === 'documents' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Executive Document Management Center
              </CardTitle>
              <CardDescription>
                Strategic document repository for executive intelligence and data-driven decisions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <EnhancedFileUpload
                title="Executive Intelligence Documents"
                description="Upload strategic reports, board presentations, compliance documents, and intelligence data"
                moduleType="hr"
                platform="executive-center"
                acceptedTypes={['.pdf', '.pptx', '.docx', '.xlsx', '.csv', '.json']}
                maxFileSize={100 * 1024 * 1024}
                maxFiles={50}
                compressionEnabled={true}
                multipleUploads={true}
                showPresets={true}
                showUploadMethods={true}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Strategic Reports</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Executive summaries, quarterly reports, and strategic analysis documents
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Data Analytics</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Performance metrics, KPI dashboards, and intelligence data files
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Compliance & Governance</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Regulatory documents, audit reports, and governance frameworks
                  </p>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Performance Summary Footer */}
      <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              AqlHR: The World's Most Advanced HR Operating System
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-primary">105+</div>
                <div className="text-muted-foreground">Modules</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-success">26</div>
                <div className="text-muted-foreground">AI Capabilities</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-warning">22</div>
                <div className="text-muted-foreground">Gov Integrations</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-accent">15+</div>
                <div className="text-muted-foreground">Real-Time Features</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-primary">45+</div>
                <div className="text-muted-foreground">Database Tables</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-success">Enterprise</div>
                <div className="text-muted-foreground">Scale</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Transforming Saudi Arabia's workforce with AI-powered intelligence that surpasses global leaders. 
              Ready to impress Oracle, SAP, and establish market dominance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveCenter;