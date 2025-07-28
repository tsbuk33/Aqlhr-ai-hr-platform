#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

class IPOReadinessCreator {
  private moduleName = 'IPO Readiness Diagnostic';
  private moduleKey = 'tools.iporeadiness';
  private filePath = 'src/pages/tools/IPOReadinessDiagnostic.tsx';

  async createModule(): Promise<void> {
    console.log(chalk.blue('🚀 Creating IPO Readiness Diagnostic module...\n'));

    // Create the directory if it doesn't exist
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(chalk.green(`✅ Created directory: ${dir}`));
    }

    // Create the main component
    await this.createMainComponent();
    
    // Update translation files
    await this.updateTranslations();
    
    // Create supporting components
    await this.createSupportingComponents();

    console.log(chalk.green('\n🎉 IPO Readiness Diagnostic module created successfully!'));
    console.log(chalk.yellow('📄 Files created:'));
    console.log(`  - ${this.filePath}`);
    console.log(`  - Updated translation files`);
  }

  private async createMainComponent(): Promise<void> {
    const componentContent = `import React, { useState } from 'react';
import { ModuleTooltip, HowToUsePanel, ModuleDocumentUploader, ModuleAIChat, ModuleDiagnosticPanel } from '@/components/universal';
import CenteredLayout from '@/components/layout/CenteredLayout';
import { useAPITranslations } from '@/hooks/useAPITranslations';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Building, FileText, Shield, Users } from 'lucide-react';

interface IPOReadinessMetric {
  category: string;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'needs-improvement' | 'critical';
  description: string;
  requirements: string[];
}

const IPOReadinessDiagnostic: React.FC = () => {
  const { t } = useAPITranslations();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [activeTab, setActiveTab] = useState('overview');
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [readinessScore, setReadinessScore] = useState<number | null>(null);

  const readinessMetrics: IPOReadinessMetric[] = [
    {
      category: 'Financial Readiness',
      score: 85,
      maxScore: 100,
      status: 'good',
      description: 'Financial statements, audit requirements, and revenue consistency',
      requirements: ['Audited financial statements (3 years)', 'Revenue growth tracking', 'Profitability analysis', 'Working capital management']
    },
    {
      category: 'Corporate Governance',
      score: 78,
      maxScore: 100,
      status: 'good',
      description: 'Board structure, compliance, and internal controls',
      requirements: ['Independent board members', 'Audit committee', 'Risk management framework', 'Compliance policies']
    },
    {
      category: 'Operational Excellence',
      score: 92,
      maxScore: 100,
      status: 'excellent',
      description: 'Business processes, technology infrastructure, and scalability',
      requirements: ['Scalable business model', 'Technology infrastructure', 'Quality management', 'Operational efficiency']
    },
    {
      category: 'Legal & Regulatory',
      score: 65,
      maxScore: 100,
      status: 'needs-improvement',
      description: 'Legal compliance, intellectual property, and regulatory adherence',
      requirements: ['IP protection', 'Regulatory compliance', 'Legal documentation', 'Contract management']
    },
    {
      category: 'Market Position',
      score: 88,
      maxScore: 100,
      status: 'excellent',
      description: 'Market share, competitive advantage, and growth potential',
      requirements: ['Market analysis', 'Competitive positioning', 'Growth strategy', 'Customer base diversity']
    },
    {
      category: 'Management Team',
      score: 72,
      maxScore: 100,
      status: 'needs-improvement',
      description: 'Leadership experience, key personnel, and succession planning',
      requirements: ['Experienced leadership', 'Key person retention', 'Succession planning', 'Management depth']
    }
  ];

  const calculateOverallScore = () => {
    const totalScore = readinessMetrics.reduce((sum, metric) => sum + metric.score, 0);
    const maxTotalScore = readinessMetrics.reduce((sum, metric) => sum + metric.maxScore, 0);
    return Math.round((totalScore / maxTotalScore) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4" />;
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'needs-improvement': return <Clock className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const runDiagnostic = async () => {
    setDiagnosticRunning(true);
    // Simulate diagnostic process
    setTimeout(() => {
      setReadinessScore(calculateOverallScore());
      setDiagnosticRunning(false);
    }, 3000);
  };

  return (
    <CenteredLayout
      title={t('tools.iporeadiness.title')}
      description={t('tools.iporeadiness.description')}
      dir={isArabic ? "rtl" : "ltr"}
      className="space-y-6"
    >
      {/* Universal Features */}
      <ModuleTooltip moduleKey="tools.iporeadiness" showIcon>
        <HowToUsePanel moduleKey="tools.iporeadiness" />
      </ModuleTooltip>
      
      <ModuleDocumentUploader moduleKey="tools.iporeadiness" />
      <ModuleAIChat moduleKey="tools.iporeadiness" />
      <ModuleDiagnosticPanel moduleKey="tools.iporeadiness" />

      {/* IPO Readiness Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            IPO Readiness Overview
          </CardTitle>
          <CardDescription>
            Comprehensive assessment of your organization's readiness for Initial Public Offering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Overall Readiness Score</h3>
                <p className="text-muted-foreground">Based on 6 key criteria</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  {readinessScore || calculateOverallScore()}%
                </div>
                <Badge variant={calculateOverallScore() >= 80 ? 'default' : 'secondary'}>
                  {calculateOverallScore() >= 80 ? 'IPO Ready' : 'Needs Work'}
                </Badge>
              </div>
            </div>
            
            <Progress value={readinessScore || calculateOverallScore()} className="w-full" />
            
            <Button 
              onClick={runDiagnostic} 
              disabled={diagnosticRunning}
              className="w-full"
            >
              {diagnosticRunning ? 'Running Diagnostic...' : 'Run Full Diagnostic'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Assessment */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {readinessMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">{metric.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{metric.score}</span>
                    <Badge className={\`\${getStatusColor(metric.status)} border-0\`}>
                      {getStatusIcon(metric.status)}
                      {metric.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <Progress value={(metric.score / metric.maxScore) * 100} />
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {readinessMetrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {metric.category}
                  <Badge className={\`\${getStatusColor(metric.status)} border-0\`}>
                    {getStatusIcon(metric.status)}
                    {metric.score}/{metric.maxScore}
                  </Badge>
                </CardTitle>
                <CardDescription>{metric.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress value={(metric.score / metric.maxScore) * 100} />
                  <div>
                    <h4 className="font-medium mb-2">Key Requirements:</h4>
                    <ul className="space-y-1">
                      {metric.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                IPO Readiness Roadmap
              </CardTitle>
              <CardDescription>
                Recommended steps to improve your IPO readiness score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">Critical Priority</h4>
                    <p className="text-red-800 text-sm">Strengthen legal and regulatory compliance framework</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50">
                  <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">High Priority</h4>
                    <p className="text-yellow-800 text-sm">Enhance management team depth and succession planning</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50">
                  <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Medium Priority</h4>
                    <p className="text-blue-800 text-sm">Continue improving financial reporting and governance structures</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Maintain Excellence</h4>
                    <p className="text-green-800 text-sm">Continue strengthening operational excellence and market position</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </CenteredLayout>
  );
};

export default IPOReadinessDiagnostic;
`;

    fs.writeFileSync(this.filePath, componentContent);
    console.log(chalk.green(`✅ Created: ${this.filePath}`));
  }

  private async createSupportingComponents(): Promise<void> {
    // Create index file for tools if it doesn't exist
    const toolsIndexPath = 'src/pages/tools/index.ts';
    if (!fs.existsSync(toolsIndexPath)) {
      const indexContent = `export { default as IPOReadinessDiagnostic } from './IPOReadinessDiagnostic';
`;
      fs.writeFileSync(toolsIndexPath, indexContent);
      console.log(chalk.green(`✅ Created: ${toolsIndexPath}`));
    } else {
      // Add export to existing index
      const indexContent = fs.readFileSync(toolsIndexPath, 'utf8');
      if (!indexContent.includes('IPOReadinessDiagnostic')) {
        const newContent = indexContent + `export { default as IPOReadinessDiagnostic } from './IPOReadinessDiagnostic';\n`;
        fs.writeFileSync(toolsIndexPath, newContent);
        console.log(chalk.green(`✅ Updated: ${toolsIndexPath}`));
      }
    }
  }

  private async updateTranslations(): Promise<void> {
    const translations = {
      en: {
        tools: {
          iporeadiness: {
            title: "IPO Readiness Diagnostic",
            description: "Comprehensive assessment of your organization's readiness for Initial Public Offering",
            tooltip: "Evaluate your company's readiness for going public with detailed metrics and recommendations",
            howToUse: {
              title: "How to Use IPO Readiness Diagnostic",
              steps: [
                "Step 1: Review the overall readiness score and key metrics",
                "Step 2: Upload relevant financial and legal documents",
                "Step 3: Run comprehensive diagnostic analysis",
                "Step 4: Follow the roadmap recommendations to improve readiness",
                "Step 5: Use AI chat for specific IPO preparation questions"
              ]
            },
            documentUpload: {
              title: "IPO Documentation",
              description: "Upload financial statements, legal documents, and governance policies",
              dropHere: "Drop IPO-related documents here",
              selectFiles: "Select Documents",
              uploadedFiles: "Uploaded Documents"
            },
            aiChat: {
              title: "IPO Readiness Assistant",
              placeholder: "Ask about IPO requirements, timelines, or preparation steps...",
              welcomeMessage: "Hello! I'm here to help with your IPO readiness assessment. What would you like to know?",
              sampleResponse: "I can help you understand IPO requirements, create preparation timelines, and provide guidance on regulatory compliance."
            },
            diagnostic: {
              title: "IPO Readiness Analysis",
              run: "Run IPO Diagnostic",
              running: "Analyzing IPO Readiness...",
              notRun: "Click to analyze IPO readiness",
              lastRun: "Last analysis",
              metrics: {
                title: "IPO Readiness Metrics",
                financial: "Financial Readiness",
                governance: "Corporate Governance",
                operational: "Operational Excellence",
                legal: "Legal & Regulatory",
                market: "Market Position",
                management: "Management Team"
              }
            }
          }
        }
      },
      ar: {
        tools: {
          iporeadiness: {
            title: "تشخيص الاستعداد للطرح العام الأولي",
            description: "تقييم شامل لاستعداد مؤسستك للطرح العام الأولي",
            tooltip: "قيم استعداد شركتك للطرح العام مع مقاييس وتوصيات مفصلة",
            howToUse: {
              title: "كيفية استخدام تشخيص الاستعداد للطرح العام",
              steps: [
                "الخطوة 1: مراجعة نقاط الاستعداد الإجمالية والمقاييس الرئيسية",
                "الخطوة 2: تحميل الوثائق المالية والقانونية ذات الصلة",
                "الخطوة 3: تشغيل التحليل التشخيصي الشامل",
                "الخطوة 4: اتباع توصيات خارطة الطريق لتحسين الاستعداد",
                "الخطوة 5: استخدام الدردشة الذكية لأسئلة محددة حول إعداد الطرح العام"
              ]
            },
            documentUpload: {
              title: "وثائق الطرح العام",
              description: "تحميل البيانات المالية والوثائق القانونية وسياسات الحوكمة",
              dropHere: "اسقط الوثائق المتعلقة بالطرح العام هنا",
              selectFiles: "اختر الوثائق",
              uploadedFiles: "الوثائق المحملة"
            },
            aiChat: {
              title: "مساعد الاستعداد للطرح العام",
              placeholder: "اسأل عن متطلبات الطرح العام أو الجداول الزمنية أو خطوات التحضير...",
              welcomeMessage: "مرحباً! أنا هنا لمساعدتك في تقييم الاستعداد للطرح العام. ماذا تريد أن تعرف؟",
              sampleResponse: "يمكنني مساعدتك في فهم متطلبات الطرح العام وإنشاء جداول زمنية للتحضير وتقديم إرشادات حول الامتثال التنظيمي."
            },
            diagnostic: {
              title: "تحليل الاستعداد للطرح العام",
              run: "تشغيل تشخيص الطرح العام",
              running: "جاري تحليل الاستعداد للطرح العام...",
              notRun: "انقر لتحليل الاستعداد للطرح العام",
              lastRun: "آخر تحليل",
              metrics: {
                title: "مقاييس الاستعداد للطرح العام",
                financial: "الاستعداد المالي",
                governance: "حوكمة الشركات",
                operational: "التميز التشغيلي",
                legal: "القانونية والتنظيمية",
                market: "موقع السوق",
                management: "فريق الإدارة"
              }
            }
          }
        }
      }
    };

    // Update English translations
    const enPath = 'public/api/translations/en.json';
    let enTranslations = {};
    try {
      enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    } catch (error) {
      console.log(chalk.yellow('Creating new English translation file...'));
    }

    // Merge new translations
    if (!enTranslations.tools) enTranslations.tools = {};
    enTranslations.tools.iporeadiness = translations.en.tools.iporeadiness;

    fs.writeFileSync(enPath, JSON.stringify(enTranslations, null, 2));
    console.log(chalk.green(`✅ Updated: ${enPath}`));

    // Update Arabic translations
    const arPath = 'public/api/translations/ar.json';
    let arTranslations = {};
    try {
      arTranslations = JSON.parse(fs.readFileSync(arPath, 'utf8'));
    } catch (error) {
      console.log(chalk.yellow('Creating new Arabic translation file...'));
    }

    // Merge new translations
    if (!arTranslations.tools) arTranslations.tools = {};
    arTranslations.tools.iporeadiness = translations.ar.tools.iporeadiness;

    fs.writeFileSync(arPath, JSON.stringify(arTranslations, null, 2));
    console.log(chalk.green(`✅ Updated: ${arPath}`));
  }
}

// CLI execution
async function main() {
  const creator = new IPOReadinessCreator();
  
  try {
    await creator.createModule();
    console.log(chalk.green('\n✅ IPO Readiness Diagnostic module creation complete!'));
  } catch (error) {
    console.error(chalk.red('❌ Failed to create IPO Readiness module:'), error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { IPOReadinessCreator };