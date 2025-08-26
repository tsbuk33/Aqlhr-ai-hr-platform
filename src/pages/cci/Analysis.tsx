import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HofstedeContextCard from '@/components/cci/HofstedeContextCard';
import { useHofstedeContext } from '@/hooks/useHofstedeContext';
import { useTranslation } from '@/hooks/useTranslation';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Globe, 
  Layers,
  Brain,
  RefreshCw,
  Download
} from 'lucide-react';

const Analysis: React.FC = () => {
  const { t, isRTL } = useTranslation();
  
  // Mock tenant ID - in production, get from context or auth
  const tenantId = 'mock-tenant-id';
  const { data: hofstedeContext, loading: hofstedeLoading } = useHofstedeContext(tenantId);

  const cvfData = [
    { dimension: t('clan'), current: 35, desired: 30, color: 'blue' },
    { dimension: t('adhocracy'), current: 20, desired: 25, color: 'green' },
    { dimension: t('market'), current: 30, desired: 25, color: 'orange' },
    { dimension: t('hierarchy'), current: 40, desired: 20, color: 'purple' }
  ];

  const culturalWebElements = [
    { element: t('stories'), score: 72, risk: 'low' },
    { element: t('symbols'), score: 68, risk: 'medium' },
    { element: t('power_structures'), score: 45, risk: 'high' },
    { element: t('organisational_structures'), score: 58, risk: 'medium' },
    { element: t('control_systems'), score: 62, risk: 'medium' },
    { element: t('rituals_routines'), score: 71, risk: 'low' }
  ];

  const barrettValues = [
    { level: t('survival'), current: 25, optimal: 15, status: 'high' },
    { level: t('relationship'), current: 30, optimal: 25, status: 'good' },
    { level: t('self_esteem'), current: 20, optimal: 25, status: 'low' },
    { level: t('transformation'), current: 15, optimal: 20, status: 'low' },
    { level: t('internal_cohesion'), current: 8, optimal: 10, status: 'low' },
    { level: t('making_difference'), current: 2, optimal: 5, status: 'critical' }
  ];

  const hofstedeData = [
    { dimension: t('power_distance'), score: 80, benchmark: 68 },
    { dimension: t('individualism'), score: 25, benchmark: 38 },
    { dimension: t('masculinity'), score: 60, benchmark: 53 },
    { dimension: t('uncertainty_avoidance'), score: 85, benchmark: 68 },
    { dimension: t('long_term_orientation'), score: 36, benchmark: 45 }
  ];

  return (
    <div className={`min-h-screen bg-background p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('cultural_diagnostics')}
            </h1>
            <p className="text-muted-foreground">
              {t('multi_framework_analysis')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('refresh_analysis')}
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              {t('export_report')}
            </Button>
          </div>
        </div>

        {/* Hofstede National Context */}
        {!hofstedeLoading && hofstedeContext && (
          <HofstedeContextCard data={hofstedeContext} />
        )}

        {/* Analysis Frameworks Tabs */}
        <Tabs defaultValue="cvf" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="cvf">CVF</TabsTrigger>
            <TabsTrigger value="cultural-web">{t('cultural_web')}</TabsTrigger>
            <TabsTrigger value="barrett">{t('barrett')}</TabsTrigger>
            <TabsTrigger value="schein">{t('schein')}</TabsTrigger>
            <TabsTrigger value="hofstede">{t('hofstede')}</TabsTrigger>
          </TabsList>

          {/* Competing Values Framework */}
          <TabsContent value="cvf" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {t('cvf_framework')}
                </CardTitle>
                <CardDescription>
                  {t('current_vs_desired_analysis')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">{t('current_vs_desired_distribution')}</h4>
                    {cvfData.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{item.dimension}</span>
                          <span className="text-sm text-muted-foreground">
                            {t('current')}: {item.current}% | {t('desired')}: {item.desired}%
                          </span>
                        </div>
                        <div className="space-y-1">
                          <Progress value={item.current} className="h-2" />
                          <Progress value={item.desired} className="h-1 opacity-50" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">{t('gap_analysis')}</h4>
                    <div className="space-y-3">
                      {cvfData.map((item, index) => {
                        const gap = item.current - item.desired;
                        return (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="font-medium">{item.dimension}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant={Math.abs(gap) > 10 ? 'destructive' : gap === 0 ? 'default' : 'secondary'}>
                                {gap > 0 ? '+' : ''}{gap}%
                              </Badge>
                              {Math.abs(gap) > 10 && <TrendingUp className="h-4 w-4 text-orange-500" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cultural Web */}
          <TabsContent value="cultural-web" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  {t('cultural_web_analysis')}
                </CardTitle>
                <CardDescription>
                  {t('six_elements_assessment')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {culturalWebElements.map((element, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">{element.element}</h5>
                            <Badge variant={
                              element.risk === 'high' ? 'destructive' : 
                              element.risk === 'medium' ? 'secondary' : 'default'
                            }>
                              {element.risk === 'high' ? t('high') :
                               element.risk === 'medium' ? t('medium') :
                               t('low')}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{t('maturity_level')}</span>
                              <span>{element.score}%</span>
                            </div>
                            <Progress value={element.score} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Barrett Values */}
          <TabsContent value="barrett" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t('barrett_seven_levels')}
                </CardTitle>
                <CardDescription>
                  {t('current_vs_optimal')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {barrettValues.map((level, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">{level.level}</h5>
                        <Badge variant={
                          level.status === 'critical' ? 'destructive' :
                          level.status === 'low' ? 'secondary' :
                          level.status === 'high' ? 'secondary' : 'default'
                        }>
                          {level.status === 'critical' ? t('critical') :
                           level.status === 'low' ? t('low') :
                           level.status === 'high' ? t('high') :
                           t('good')}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">{t('current')}</div>
                          <Progress value={level.current * 2} className="h-2" />
                          <div className="text-xs text-muted-foreground mt-1">{level.current}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">{t('optimal')}</div>
                          <Progress value={level.optimal * 2} className="h-2 opacity-50" />
                          <div className="text-xs text-muted-foreground mt-1">{level.optimal}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schein's Model */}
          <TabsContent value="schein" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  {t('scheins_model')}
                </CardTitle>
                <CardDescription>
                  {t('three_levels_analysis')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h5 className="font-medium mb-2">{t('artifacts')}</h5>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            {t('maturity_level')}
                          </div>
                          <Progress value={78} className="h-2" />
                          <div className="text-xs">78%</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h5 className="font-medium mb-2">{t('espoused_values')}</h5>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            {t('maturity_level')}
                          </div>
                          <Progress value={65} className="h-2" />
                          <div className="text-xs">65%</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h5 className="font-medium mb-2">{t('basic_assumptions')}</h5>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            {t('maturity_level')}
                          </div>
                          <Progress value={42} className="h-2" />
                          <div className="text-xs">42%</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hofstede */}
          <TabsContent value="hofstede" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {t('hofstede_cultural_dimensions')}
                </CardTitle>
                <CardDescription>
                  {t('org_vs_regional')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hofstedeData.map((dimension, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">{dimension.dimension}</h5>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {t('org')}: {dimension.score}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {t('benchmark')}: {dimension.benchmark}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Progress value={dimension.score} className="h-2" />
                        <Progress value={dimension.benchmark} className="h-1 opacity-50" />
                        <div className="text-xs text-muted-foreground">
                          {t('difference')}: {dimension.score - dimension.benchmark > 0 ? '+' : ''}{dimension.score - dimension.benchmark}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* AI Integration for CCI Analysis */}
      <UniversalAIIntegrator 
        pageType="analytics" 
        moduleName="cci-analysis" 
        companyId="demo-company" 
        enabledFeatures={['culture-analytics', 'data-visualization', 'trend-analysis', 'intelligent-insights']}
      />
    </div>
  );
};

export default Analysis;