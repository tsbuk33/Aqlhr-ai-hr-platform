import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Shield,
  Target,
  BarChart3
} from "lucide-react";
import { useLocale } from '../LocaleDriver';
import { PolicyDocument, ComplianceAnalysis } from '../../types/policy-review';
import { PolicyUpload } from './PolicyUpload';

export const PolicyDashboard: React.FC = () => {
  const { t, isRTL } = useLocale();
  const [policies, setPolicies] = useState<PolicyDocument[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyDocument | null>(null);
  const [analysis, setAnalysis] = useState<ComplianceAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('upload');

  // Mock data for demonstration
  useEffect(() => {
    const mockPolicies: PolicyDocument[] = [
      {
        id: '1',
        title: 'Employee Handbook 2024',
        titleAr: 'دليل الموظفين 2024',
        content: 'Comprehensive employee handbook...',
        fileUrl: '/mock-policy.pdf',
        fileType: 'pdf',
        uploadedAt: new Date('2024-01-15'),
        uploadedBy: 'hr-manager',
        companyId: 'company-1',
        status: 'completed',
        complianceScore: 85,
        riskLevel: 'medium',
        lastAnalyzed: new Date('2024-01-15')
      },
      {
        id: '2',
        title: 'Code of Conduct',
        titleAr: 'مدونة السلوك',
        content: 'Company code of conduct...',
        fileUrl: '/mock-conduct.pdf',
        fileType: 'pdf',
        uploadedAt: new Date('2024-01-10'),
        uploadedBy: 'compliance-officer',
        companyId: 'company-1',
        status: 'completed',
        complianceScore: 92,
        riskLevel: 'low',
        lastAnalyzed: new Date('2024-01-10')
      }
    ];
    setPolicies(mockPolicies);
  }, []);

  const handlePolicyUpload = (newPolicy: PolicyDocument) => {
    setPolicies(prev => [newPolicy, ...prev]);
    setActiveTab('overview');
  };

  const getStatusBadge = (status: PolicyDocument['status']) => {
    const statusConfig = {
      pending: { color: 'secondary', icon: Clock, label: t('policy.status.pending') },
      analyzing: { color: 'default', icon: BarChart3, label: t('policy.status.analyzing') },
      completed: { color: 'default', icon: CheckCircle, label: t('policy.status.completed') },
      failed: { color: 'destructive', icon: AlertTriangle, label: t('policy.status.failed') }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.color as any} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const getRiskBadge = (riskLevel: PolicyDocument['riskLevel']) => {
    const riskConfig = {
      low: { color: 'default', label: t('policy.risk.low') },
      medium: { color: 'secondary', label: t('policy.risk.medium') },
      high: { color: 'destructive', label: t('policy.risk.high') },
      critical: { color: 'destructive', label: t('policy.risk.critical') }
    };

    const config = riskConfig[riskLevel];
    return (
      <Badge variant={config.color as any}>
        {config.label}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-status-warning';
    return 'text-red-600';
  };

  const overallMetrics = {
    totalPolicies: policies.length,
    avgCompliance: policies.reduce((sum, p) => sum + p.complianceScore, 0) / policies.length || 0,
    highRiskPolicies: policies.filter(p => ['high', 'critical'].includes(p.riskLevel)).length,
    pendingReviews: policies.filter(p => p.status === 'pending').length
  };

  return (
    <div className={`policy-dashboard space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t('policy.dashboard.title')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('policy.dashboard.description')}
        </p>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('policy.metrics.totalPolicies')}
                </p>
                <p className="text-2xl font-bold">{overallMetrics.totalPolicies}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('policy.metrics.avgCompliance')}
                </p>
                <p className={`text-2xl font-bold ${getScoreColor(overallMetrics.avgCompliance)}`}>
                  {Math.round(overallMetrics.avgCompliance)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('policy.metrics.highRisk')}
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {overallMetrics.highRiskPolicies}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('policy.metrics.pending')}
                </p>
                <p className="text-2xl font-bold text-status-warning">
                  {overallMetrics.pendingReviews}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">{t('policy.tabs.upload')}</TabsTrigger>
          <TabsTrigger value="overview">{t('policy.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="compliance">{t('policy.tabs.compliance')}</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <PolicyUpload onUploadSuccess={handlePolicyUpload} />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('policy.overview.title')}</CardTitle>
              <CardDescription>
                {t('policy.overview.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policies.map((policy) => (
                  <div 
                    key={policy.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedPolicy(policy)}
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="h-10 w-10 text-primary" />
                      <div>
                        <h3 className="font-medium">{policy.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t('policy.uploadedOn')} {policy.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`font-medium ${getScoreColor(policy.complianceScore)}`}>
                          {policy.complianceScore}% {t('policy.compliance')}
                        </p>
                        <div className="flex space-x-2 mt-1">
                          {getStatusBadge(policy.status)}
                          {getRiskBadge(policy.riskLevel)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {policies.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {t('policy.noPolicies')}
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab('upload')}
                    >
                      {t('policy.uploadFirst')}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>{t('policy.compliance.saudiLaborLaw')}</span>
              </CardTitle>
              <CardDescription>
                {t('policy.compliance.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Compliance Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'workingHours', score: 85, status: 'compliant' },
                    { key: 'wages', score: 90, status: 'compliant' },
                    { key: 'leaves', score: 75, status: 'partial' },
                    { key: 'termination', score: 80, status: 'compliant' },
                    { key: 'discrimination', score: 95, status: 'compliant' },
                    { key: 'safety', score: 70, status: 'partial' },
                    { key: 'saudization', score: 88, status: 'compliant' }
                  ].map((category) => (
                    <div key={category.key} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">
                          {t(`policy.compliance.${category.key}`)}
                        </h4>
                        <span className={`text-sm font-medium ${getScoreColor(category.score)}`}>
                          {category.score}%
                        </span>
                      </div>
                      <Progress value={category.score} className="h-2" />
                      <Badge 
                        variant={category.status === 'compliant' ? 'default' : 'secondary'}
                        className="mt-2 text-xs"
                      >
                        {t(`policy.status.${category.status}`)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};