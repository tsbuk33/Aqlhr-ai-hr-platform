import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Users, 
  TrendingUp, 
  Shield, 
  FileText, 
  BarChart3,
  Zap,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { AISpecialistRegistry, AISpecialist } from '@/lib/ai-specialists/AISpecialistRegistry';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

const moduleIcons = {
  'core-hr': Users,
  'payroll': FileText,
  'recruitment': TrendingUp,
  'performance': BarChart3,
  'compliance': Shield,
  'analytics': Brain
};

export const AISpecialistDashboard: React.FC = () => {
  const { isRTL } = useUnifiedLocale();
  const [specialists, setSpecialists] = useState<AISpecialist[]>([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState<AISpecialist | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysisRunning, setAnalysisRunning] = useState<string | null>(null);

  const registry = new AISpecialistRegistry();

  useEffect(() => {
    loadSpecialists();
  }, []);

  const loadSpecialists = async () => {
    try {
      const allSpecialists = await registry.getAllSpecialists();
      setSpecialists(allSpecialists);
      if (allSpecialists.length > 0) {
        setSelectedSpecialist(allSpecialists[0]);
      }
    } catch (error) {
      console.error('Failed to load specialists:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async (specialist: AISpecialist, capability: string) => {
    setAnalysisRunning(capability);
    try {
      // Mock analysis - in real implementation, this would use actual data
      const mockData = {
        employees: 150,
        saudization_rate: 67.5,
        performance_scores: [85, 92, 78, 95, 88],
        compliance_status: 'compliant'
      };

      await registry.analyzeWithSpecialist(specialist.id, capability, mockData);
      
      // Show success feedback
      setTimeout(() => {
        setAnalysisRunning(null);
      }, 2000);
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisRunning(null);
    }
  };

  const updateSpecialistKnowledge = async (specialistId: string) => {
    try {
      await registry.updateSpecialistKnowledge(specialistId);
      await loadSpecialists(); // Refresh the list
    } catch (error) {
      console.error('Failed to update specialist knowledge:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'learning': return 'text-yellow-500';
      case 'offline': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{isRTL ? 'جاري تحميل المتخصصين...' : 'Loading specialists...'}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          {isRTL ? 'فريق المتخصصين في الذكاء الاصطناعي' : 'AI Specialists Team'}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {isRTL 
            ? 'فريق من المتخصصين في الذكاء الاصطناعي لتحليل وتحسين جميع جوانب إدارة الموارد البشرية'
            : 'A team of AI specialists analyzing and optimizing all aspects of human resources management'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Specialists List */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-xl font-semibold">
            {isRTL ? 'المتخصصون المتاحون' : 'Available Specialists'}
          </h2>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {specialists.map((specialist) => {
                const IconComponent = moduleIcons[specialist.module as keyof typeof moduleIcons] || Users;
                return (
                  <Card 
                    key={specialist.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedSpecialist?.id === specialist.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedSpecialist(specialist)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={specialist.avatar} />
                          <AvatarFallback>
                            <IconComponent className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{specialist.name}</h3>
                            <div className={`flex items-center gap-1 ${getStatusColor(specialist.status)}`}>
                              <div className="w-2 h-2 rounded-full bg-current"></div>
                              <span className="text-xs capitalize">{specialist.status}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {specialist.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {specialist.module}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {specialist.capabilities.length} {isRTL ? 'قدرات' : 'capabilities'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Specialist Details */}
        <div className="lg:col-span-8">
          {selectedSpecialist ? (
            <Tabs defaultValue="capabilities" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="capabilities">
                    {isRTL ? 'القدرات' : 'Capabilities'}
                  </TabsTrigger>
                  <TabsTrigger value="tools">
                    {isRTL ? 'الأدوات' : 'AI Tools'}
                  </TabsTrigger>
                  <TabsTrigger value="expertise">
                    {isRTL ? 'الخبرة' : 'Expertise'}
                  </TabsTrigger>
                </TabsList>
                <Button
                  onClick={() => updateSpecialistKnowledge(selectedSpecialist.id)}
                  size="sm"
                  variant="outline"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {isRTL ? 'تحديث المعرفة' : 'Update Knowledge'}
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedSpecialist.avatar} />
                      <AvatarFallback>
                        {selectedSpecialist.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {selectedSpecialist.name}
                        <Badge className={getStatusColor(selectedSpecialist.status)}>
                          {selectedSpecialist.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{selectedSpecialist.description}</CardDescription>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {isRTL ? 'آخر تحديث:' : 'Last updated:'} {new Date(selectedSpecialist.lastUpdated).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <TabsContent value="capabilities" className="space-y-4">
                    {selectedSpecialist.capabilities.map((capability) => (
                      <Card key={capability.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{capability.name}</CardTitle>
                              <CardDescription>{capability.description}</CardDescription>
                            </div>
                            <Button
                              onClick={() => runAnalysis(selectedSpecialist, capability.id)}
                              disabled={analysisRunning === capability.id}
                              size="sm"
                            >
                              {analysisRunning === capability.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  {isRTL ? 'جاري التحليل...' : 'Analyzing...'}
                                </>
                              ) : (
                                <>
                                  <Zap className="h-4 w-4 mr-2" />
                                  {isRTL ? 'تشغيل التحليل' : 'Run Analysis'}
                                </>
                              )}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <h4 className="font-medium mb-2">
                              {isRTL ? 'نماذج الذكاء الاصطناعي:' : 'AI Models:'}
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {capability.aiModels.map((model) => (
                                <Badge key={model} variant="secondary">
                                  {model}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">
                              {isRTL ? 'أنواع التحليل:' : 'Analysis Types:'}
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {capability.analysisTypes.map((type) => (
                                <Badge key={type} variant="outline">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">
                              {isRTL ? 'مصادر البيانات الحية:' : 'Live Data Sources:'}
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {capability.webSources.map((source) => (
                                <Badge key={source} variant="default" className="text-xs">
                                  <Globe className="h-3 w-3 mr-1" />
                                  {source}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="tools" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedSpecialist.aiTools.map((tool) => (
                        <Card key={tool}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Zap className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{tool}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {isRTL ? 'أداة ذكاء اصطناعي متقدمة' : 'Advanced AI tool'}
                                </p>
                              </div>
                              <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="expertise" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedSpecialist.expertise.map((expertise) => (
                        <div key={expertise} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="font-medium">{expertise}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center space-y-4">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    {isRTL ? 'يرجى اختيار متخصص لعرض التفاصيل' : 'Please select a specialist to view details'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};