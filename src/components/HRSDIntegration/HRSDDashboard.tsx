/**
 * HRSD Integration Dashboard
 * Ministry of Human Resources and Social Development integration interface
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Building2, Users, Trophy, AlertTriangle, CheckCircle2, Clock, Target, Award } from 'lucide-react';
import { hrsdIntegrationService } from '@/services/hrsd-integration.service';
import { SaudizationMetrics, NitaqatComplianceReport, WorkforceAnalytics } from '@/types/hrsd-integration';

export default function HRSDDashboard() {
  const [saudizationMetrics, setSaudizationMetrics] = useState<SaudizationMetrics | null>(null);
  const [complianceReport, setComplianceReport] = useState<NitaqatComplianceReport | null>(null);
  const [workforceAnalytics, setWorkforceAnalytics] = useState<WorkforceAnalytics | null>(null);
  const [eligiblePrograms, setEligiblePrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const companyId = 'demo-company-001';
      
      const [metrics, report, analytics, programs] = await Promise.all([
        hrsdIntegrationService.getSaudizationMetrics(companyId),
        hrsdIntegrationService.getNitaqatComplianceReport(companyId),
        hrsdIntegrationService.getWorkforceAnalytics(companyId),
        hrsdIntegrationService.getHRSDProgramsEligibility(companyId)
      ]);

      setSaudizationMetrics(metrics);
      setComplianceReport(report);
      setWorkforceAnalytics(analytics);
      setEligiblePrograms(programs);
    } catch (error) {
      console.error('Error loading HRSD data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBandColor = (band: string) => {
    switch (band) {
      case 'platinum': return 'bg-purple-500';
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-status-warning text-primary-foreground';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getBandTextColor = (band: string) => {
    switch (band) {
      case 'platinum': return 'text-purple-700';
      case 'green': return 'text-green-700';
      case 'yellow': return 'text-status-warning';
      case 'red': return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-status-warning" />;
      case 'non_compliant': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            HRSD Integration
          </h1>
          <p className="text-muted-foreground mt-1">
            Ministry of Human Resources and Social Development compliance dashboard
          </p>
        </div>
        <Button onClick={loadDashboardData}>Sync with HRSD</Button>
      </div>

      {/* Compliance Alert */}
      {saudizationMetrics && saudizationMetrics.complianceStatus !== 'compliant' && (
        <Alert className="border-status-warning bg-status-warning/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Compliance Warning</AlertTitle>
          <AlertDescription>
            Your Saudization rate is {saudizationMetrics.saudizationPercentage}%, which is below the required {saudizationMetrics.requiredSaudiPercentage}%. 
            You need {saudizationMetrics.improvementRequired} more Saudi employees to achieve compliance.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      {saudizationMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{saudizationMetrics.saudizationPercentage}%</p>
                  <p className="text-xs text-muted-foreground">Saudization Rate</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-2">
                <Progress value={saudizationMetrics.saudizationPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getBandColor(saudizationMetrics.nitaqatBand)}`}></div>
                    <p className={`text-2xl font-bold capitalize ${getBandTextColor(saudizationMetrics.nitaqatBand)}`}>
                      {saudizationMetrics.nitaqatBand}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">Nitaqat Band</p>
                </div>
                <Trophy className="h-8 w-8 text-brand-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{saudizationMetrics.saudiEmployees}</p>
                  <p className="text-xs text-muted-foreground">Saudi Employees</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getComplianceIcon(saudizationMetrics.complianceStatus)}
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {saudizationMetrics.complianceStatus.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground">Status</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="programs">HRSD Programs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {complianceReport && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Recommendations</CardTitle>
                  <CardDescription>
                    HRSD-approved actions to improve your Nitaqat status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceReport.recommendations.map((rec) => (
                      <div key={rec.id} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                                {rec.priority}
                              </Badge>
                              <Badge variant="outline">{rec.type}</Badge>
                            </div>
                            <h4 className="font-medium">{rec.description}</h4>
                            <p className="text-sm text-muted-foreground">{rec.descriptionArabic}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Impact: +{rec.expectedImpact}%</span>
                              <span>Timeline: {rec.implementationTimeframe}</span>
                              <span>Cost: {rec.estimatedCost.toLocaleString()} SAR</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                  <CardDescription>
                    Potential penalties and mitigation strategies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceReport.penaltiesRisk.map((risk, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{risk.type.replace('_', ' ').toUpperCase()}</h4>
                          <Badge variant={risk.severity === 'high' ? 'destructive' : 'secondary'}>
                            {risk.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{risk.description}</p>
                        <div>
                          <h5 className="text-sm font-medium mb-1">Mitigation Steps:</h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {risk.mitigationSteps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-current rounded-full flex-shrink-0"></span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {complianceReport && (
            <Card>
              <CardHeader>
                <CardTitle>Nitaqat Compliance Report</CardTitle>
                <CardDescription>
                  Detailed compliance analysis with improvement roadmap
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Current Status</h4>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${getBandColor(complianceReport.currentBand)}`}></div>
                        <span className="capitalize font-medium">{complianceReport.currentBand} Band</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Target Status</h4>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${getBandColor(complianceReport.targetBand)}`}></div>
                        <span className="capitalize font-medium">{complianceReport.targetBand} Band</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Compliance Score</h4>
                      <div className="flex items-center gap-3">
                        <Progress value={complianceReport.complianceScore} className="flex-1" />
                        <span className="font-medium">{complianceReport.complianceScore}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Workforce Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Employees</span>
                          <span className="font-medium">{complianceReport.metrics.totalEmployees}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Saudi Employees</span>
                          <span className="font-medium text-green-600">{complianceReport.metrics.saudiEmployees}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Non-Saudi Employees</span>
                          <span className="font-medium">{complianceReport.metrics.nonSaudiEmployees}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Required Improvement</span>
                          <span className="font-medium text-orange-600">+{complianceReport.metrics.improvementRequired}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {workforceAnalytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Demographic Analysis</CardTitle>
                  <CardDescription>
                    Workforce composition and diversity metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Age Distribution</h4>
                      <div className="space-y-2">
                        {Object.entries(workforceAnalytics.demographicBreakdown.ageGroups).map(([age, count]) => (
                          <div key={age} className="flex items-center gap-3">
                            <span className="text-sm w-16">{age}</span>
                            <Progress value={(count / 250) * 100} className="flex-1" />
                            <span className="text-sm font-medium w-8">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Education Levels</h4>
                      <div className="space-y-2">
                        {Object.entries(workforceAnalytics.demographicBreakdown.educationLevels).map(([level, count]) => (
                          <div key={level} className="flex items-center gap-3">
                            <span className="text-sm w-20">{level}</span>
                            <Progress value={(count / 250) * 100} className="flex-1" />
                            <span className="text-sm font-medium w-8">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Skills Gap Analysis</CardTitle>
                  <CardDescription>
                    Critical skill gaps and training recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workforceAnalytics.skillsAnalysis.map((skill, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{skill.category}</h4>
                          <Badge variant={skill.priority === 'high' ? 'destructive' : 'secondary'}>
                            {skill.priority}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Current Capability</span>
                            <span className="font-medium">{skill.currentCapability}%</span>
                          </div>
                          <Progress value={skill.currentCapability} className="h-2" />
                          <div className="flex justify-between text-sm">
                            <span>Gap</span>
                            <span className="font-medium text-orange-600">{skill.gapPercentage}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {skill.trainingRecommendation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Eligible HRSD Programs</CardTitle>
              <CardDescription>
                Government programs and incentives available to your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {eligiblePrograms.map((program) => (
                  <Card key={program.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Award className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">{program.name}</h3>
                          <span className="text-sm text-muted-foreground">({program.nameArabic})</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {program.description}
                        </p>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Eligibility Requirements:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {program.eligibility.map((req: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-current rounded-full flex-shrink-0"></span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Benefits:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {program.benefits.map((benefit: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-current rounded-full flex-shrink-0"></span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant={program.eligible ? 'default' : 'secondary'}>
                          {program.eligible ? 'Eligible' : 'Not Eligible'}
                        </Badge>
                        {program.eligible && (
                          <Button size="sm">Apply Now</Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}