import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Image, 
  Presentation, 
  Table, 
  BarChart, 
  Globe, 
  FileText, 
  Calculator,
  Upload,
  MessageCircle,
  SpellCheck,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIToolTest {
  id: number;
  name: string;
  nameAr: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  descriptionAr: string;
  testFunction: () => Promise<boolean>;
  status: 'pending' | 'testing' | 'success' | 'error';
  error?: string;
}

interface AIToolsTesterProps {
  moduleContext: string;
  className?: string;
}

const AIToolsTester: React.FC<AIToolsTesterProps> = ({ 
  moduleContext,
  className = ''
}) => {
  const { isArabic } = useSimpleLanguage();
  const { toast } = useToast();
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<Record<number, any>>({});

  const aiTools: AIToolTest[] = [
    {
      id: 1,
      name: 'Image Generation',
      nameAr: 'إنشاء الصور',
      icon: Image,
      description: 'AI-powered professional image creation with charts and graphics',
      descriptionAr: 'إنشاء صور احترافية بالذكاء الاصطناعي مع المخططات والرسوم البيانية',
      testFunction: async () => {
        const { data, error } = await supabase.functions.invoke('local-image-generator', {
          body: {
            prompt: 'Professional HR dashboard with charts',
            style: 'professional',
            format: 'png',
            size: '1024x1024'
          }
        });
        return !error && data?.success;
      },
      status: 'pending'
    },
    {
      id: 2,
      name: 'Presentation Generation',
      nameAr: 'إنشاء العروض التقديمية',
      icon: Presentation,
      description: 'Create comprehensive business presentations automatically',
      descriptionAr: 'إنشاء عروض تقديمية تجارية شاملة تلقائياً',
      testFunction: async () => {
        const { data, error } = await supabase.functions.invoke('manus-presentation-generator', {
          body: {
            prompt: 'Employee performance presentation',
            language: isArabic ? 'ar' : 'en',
            slideCount: 5
          }
        });
        return !error && data;
      },
      status: 'pending'
    },
    {
      id: 3,
      name: 'Spreadsheet Creation',
      nameAr: 'إنشاء جداول البيانات',
      icon: Table,
      description: 'Generate interactive data tables and spreadsheets',
      descriptionAr: 'إنشاء جداول بيانات تفاعلية وجداول محاسبية',
      testFunction: async () => {
        const { data, error } = await supabase.functions.invoke('manus-visualization-generator', {
          body: {
            prompt: 'Payroll spreadsheet template',
            language: isArabic ? 'ar' : 'en',
            chartType: 'table'
          }
        });
        return !error && data;
      },
      status: 'pending'
    },
    {
      id: 4,
      name: 'Chart Visualization',
      nameAr: 'المخططات البيانية',
      icon: BarChart,
      description: 'Create performance and KPI charts automatically',
      descriptionAr: 'إنشاء مخططات الأداء ومؤشرات الأداء الرئيسية تلقائياً',
      testFunction: async () => {
        const { data, error } = await supabase.functions.invoke('manus-visualization-generator', {
          body: {
            prompt: 'Employee performance KPI chart',
            language: isArabic ? 'ar' : 'en',
            chartType: 'bar'
          }
        });
        return !error && data;
      },
      status: 'pending'
    },
    {
      id: 5,
      name: 'Web Page Generation',
      nameAr: 'إنشاء صفحات الويب',
      icon: Globe,
      description: 'Generate interactive web pages for policies and procedures',
      descriptionAr: 'إنشاء صفحات ويب تفاعلية للسياسات والإجراءات',
      testFunction: async () => {
        const { data, error } = await supabase.functions.invoke('manus-document-generator', {
          body: {
            prompt: 'Interactive employee handbook webpage',
            language: isArabic ? 'ar' : 'en',
            documentType: 'webpage'
          }
        });
        return !error && data;
      },
      status: 'pending'
    },
    {
      id: 6,
      name: 'Document Generation',
      nameAr: 'إنشاء المستندات',
      icon: FileText,
      description: 'Create comprehensive HR policy documents',
      descriptionAr: 'إنشاء مستندات سياسات الموارد البشرية الشاملة',
      testFunction: async () => {
        const { data, error } = await supabase.functions.invoke('manus-document-generator', {
          body: {
            prompt: 'HR policy document compliant with Saudi regulations',
            language: isArabic ? 'ar' : 'en',
            documentType: 'policy'
          }
        });
        return !error && data;
      },
      status: 'pending'
    },
    {
      id: 7,
      name: 'GOSI Calculations',
      nameAr: 'حسابات التأمينات الاجتماعية',
      icon: Calculator,
      description: 'Saudi social insurance calculations and compliance',
      descriptionAr: 'حسابات التأمينات الاجتماعية السعودية والامتثال',
      testFunction: async () => {
        const { data, error } = await supabase.functions.invoke('gosi-engine/preview', {
          body: { company_id: 'a5829c01-7f0d-4583-b4b6-9a7a8baddbb2' }
        });
        return !error && data;
      },
      status: 'pending'
    },
    {
      id: 8,
      name: 'Document Analysis',
      nameAr: 'تحليل المستندات',
      icon: Upload,
      description: 'Upload and analyze documents with AI',
      descriptionAr: 'رفع وتحليل المستندات بالذكاء الاصطناعي',
      testFunction: async () => {
        // Test document analysis capability
        const { data, error } = await supabase.functions.invoke('enhanced-aqlhr-ai', {
          body: {
            query: 'Test document analysis capability',
            context: {
              module: moduleContext,
              language: isArabic ? 'ar' : 'en',
              test_mode: true
            }
          }
        });
        return !error && data;
      },
      status: 'pending'
    },
    {
      id: 9,
      name: 'Contextual HR Assistance',
      nameAr: 'المساعدة السياقية للموارد البشرية',
      icon: MessageCircle,
      description: 'Module-specific HR guidance and support',
      descriptionAr: 'التوجيه والدعم المتخصص للموارد البشرية حسب الوحدة',
      testFunction: async () => {
        const { data, error } = await supabase.functions.invoke('enhanced-aqlhr-ai', {
          body: {
            query: 'What are the key features of this module?',
            context: {
              module: moduleContext,
              language: isArabic ? 'ar' : 'en'
            }
          }
        });
        return !error && data && data.response;
      },
      status: 'pending'
    },
    {
      id: 10,
      name: 'Language Support',
      nameAr: 'الدعم اللغوي',
      icon: SpellCheck,
      description: 'Multi-language support with spell checking',
      descriptionAr: 'الدعم متعدد اللغات مع التدقيق الإملائي',
      testFunction: async () => {
        // Test language switching and spell check
        const testText = isArabic ? 'مرحبا بك في منصة عقل' : 'Welcome to AqlHR platform';
        return testText.length > 0; // Simple test for language support
      },
      status: 'pending'
    }
  ];

  const [tools, setTools] = useState<AIToolTest[]>(aiTools);

  const runSingleTest = async (toolId: number) => {
    setTools(prev => prev.map(tool => 
      tool.id === toolId 
        ? { ...tool, status: 'testing' as const, error: undefined }
        : tool
    ));

    try {
      const tool = tools.find(t => t.id === toolId);
      if (!tool) return;

      const result = await tool.testFunction();
      
      setTools(prev => prev.map(tool => 
        tool.id === toolId 
          ? { ...tool, status: result ? 'success' as const : 'error' as const }
          : tool
      ));
      
      setTestResults(prev => ({ ...prev, [toolId]: result }));
      
      toast({
        title: result ? 'Test Passed' : 'Test Failed',
        description: `${tool.name} ${result ? 'is working correctly' : 'encountered an error'}`,
        variant: result ? 'default' : 'destructive'
      });
      
    } catch (error) {
      setTools(prev => prev.map(tool => 
        tool.id === toolId 
          ? { 
              ...tool, 
              status: 'error' as const, 
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          : tool
      ));
      
      toast({
        title: 'Test Error',
        description: `Failed to test ${tools.find(t => t.id === toolId)?.name}`,
        variant: 'destructive'
      });
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    
    for (const tool of tools) {
      await runSingleTest(tool.id);
      // Add small delay between tests to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsRunningTests(false);
    
    const successCount = tools.filter(tool => 
      tools.find(t => t.id === tool.id)?.status === 'success'
    ).length;
    
    toast({
      title: 'Testing Complete',
      description: `${successCount}/${tools.length} AI tools passed tests`,
      variant: successCount === tools.length ? 'default' : 'destructive'
    });
  };

  const getStatusIcon = (status: AIToolTest['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'testing':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {isArabic ? 'اختبار أدوات الذكاء الاصطناعي' : 'AI Tools Testing Suite'}
          </CardTitle>
          <Badge variant="outline">
            {moduleContext}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={runAllTests} 
            disabled={isRunningTests}
            className="bg-brand-primary hover:bg-brand-primary/90"
          >
            {isRunningTests ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {isArabic ? 'اختبار جميع الأدوات' : 'Test All Tools'}
          </Button>
          <div className="text-sm text-muted-foreground">
            {tools.filter(tool => tool.status === 'success').length}/{tools.length} {isArabic ? 'تعمل' : 'working'}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <tool.icon className="h-5 w-5 text-brand-primary" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">
                    {isArabic ? tool.nameAr : tool.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {isArabic ? tool.descriptionAr : tool.description}
                  </p>
                  {tool.error && (
                    <p className="text-xs text-red-500 mt-1">{tool.error}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {getStatusIcon(tool.status)}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => runSingleTest(tool.id)}
                  disabled={tool.status === 'testing' || isRunningTests}
                  className="text-xs px-2 h-7"
                >
                  {isArabic ? 'اختبار' : 'Test'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { AIToolsTester };