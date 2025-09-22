import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Users, 
  Target,
  Building2,
  MapPin,
  GraduationCap,
  Award,
  BarChart3,
  AlertCircle
} from "lucide-react";
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';
import { useLocale } from '../LocaleDriver';
import { SalaryBenchmark, BenchmarkCriteria } from '../../types/salary-benchmarking';
import { SalaryBenchmarkingService } from '../../services/salary-benchmarking.service';

export const BenchmarkingDashboard: React.FC = () => {
  const { t, isRTL } = useLocale();
  const [benchmarkData, setBenchmarkData] = useState<SalaryBenchmark | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('criteria');
  const [criteria, setCriteria] = useState<BenchmarkCriteria>({
    positionTitle: '',
    hrsdPositionCode: '',
    companySize: 'medium',
    region: 'riyadh',
    experienceLevel: 'mid',
    educationLevel: 'bachelor',
    nationality: 'saudi',
    university: '',
    certifications: [],
    skills: [],
    industryFocus: ''
  });

  const handleBenchmarkGeneration = async () => {
    if (!criteria.positionTitle || !criteria.hrsdPositionCode) {
      alert(t('salary.benchmarking.selectPosition'));
      return;
    }

    setLoading(true);
    try {
      const service = new SalaryBenchmarkingService();
      const benchmark = await service.generateSalaryBenchmark(criteria);
      setBenchmarkData(benchmark);
      setActiveTab('results');
    } catch (error) {
      console.error('Benchmarking failed:', error);
      alert(t('salary.benchmarking.error'));
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 75) return 'text-green-600';
    if (percentile >= 50) return 'text-blue-600';
    if (percentile >= 25) return 'text-status-warning';
    return 'text-red-600';
  };

  return (
    <div className={`benchmarking-dashboard space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t('salary.benchmarking.title')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('salary.benchmarking.description')}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('salary.benchmarking.metrics.positions')}
                </p>
                <p className="text-2xl font-bold">250+</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('salary.benchmarking.metrics.companies')}
                </p>
                <p className="text-2xl font-bold">1,500+</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('salary.benchmarking.metrics.dataPoints')}
                </p>
                <p className="text-2xl font-bold">50K+</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('salary.benchmarking.metrics.accuracy')}
                </p>
                <p className="text-2xl font-bold text-green-600">94.8%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="criteria">{t('salary.benchmarking.tabs.criteria')}</TabsTrigger>
          <TabsTrigger value="results">{t('salary.benchmarking.tabs.results')}</TabsTrigger>
          <TabsTrigger value="comparison">{t('salary.benchmarking.tabs.comparison')}</TabsTrigger>
          <TabsTrigger value="insights">{t('salary.benchmarking.tabs.insights')}</TabsTrigger>
        </TabsList>

        <TabsContent value="criteria" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Position Details */}
            <Card>
              <CardHeader>
                <CardTitle>{t('salary.benchmarking.position.details')}</CardTitle>
                <CardDescription>
                  {t('salary.benchmarking.position.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="positionTitle">{t('salary.benchmarking.position.title')}</Label>
                  <Input
                    id="positionTitle"
                    value={criteria.positionTitle}
                    onChange={(e) => setCriteria({...criteria, positionTitle: e.target.value})}
                    placeholder={t('salary.benchmarking.position.titlePlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hrsdCode">{t('salary.benchmarking.position.hrsdCode')}</Label>
                  <Select 
                    value={criteria.hrsdPositionCode} 
                    onValueChange={(value) => setCriteria({...criteria, hrsdPositionCode: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('salary.benchmarking.position.selectCode')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT001">{t('positions.softwareEngineer')}</SelectItem>
                      <SelectItem value="IT002">{t('positions.dataScientist')}</SelectItem>
                      <SelectItem value="IT003">{t('positions.systemAnalyst')}</SelectItem>
                      <SelectItem value="HR001">{t('positions.hrManager')}</SelectItem>
                      <SelectItem value="FN001">{t('positions.financialAnalyst')}</SelectItem>
                      <SelectItem value="MK001">{t('positions.marketingSpecialist')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">{t('salary.benchmarking.position.industry')}</Label>
                  <Select 
                    value={criteria.industryFocus} 
                    onValueChange={(value) => setCriteria({...criteria, industryFocus: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('salary.benchmarking.position.selectIndustry')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">{t('industries.technology')}</SelectItem>
                      <SelectItem value="finance">{t('industries.finance')}</SelectItem>
                      <SelectItem value="healthcare">{t('industries.healthcare')}</SelectItem>
                      <SelectItem value="retail">{t('industries.retail')}</SelectItem>
                      <SelectItem value="manufacturing">{t('industries.manufacturing')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Company & Location */}
            <Card>
              <CardHeader>
                <CardTitle>{t('salary.benchmarking.company.details')}</CardTitle>
                <CardDescription>
                  {t('salary.benchmarking.company.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('salary.benchmarking.company.size')}</Label>
                  <Select 
                    value={criteria.companySize} 
                    onValueChange={(value: any) => setCriteria({...criteria, companySize: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="micro">{t('company.size.micro')} (1-10)</SelectItem>
                      <SelectItem value="small">{t('company.size.small')} (11-50)</SelectItem>
                      <SelectItem value="medium">{t('company.size.medium')} (51-250)</SelectItem>
                      <SelectItem value="large">{t('company.size.large')} (251-1000)</SelectItem>
                      <SelectItem value="enterprise">{t('company.size.enterprise')} (1000+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('salary.benchmarking.location.region')}</Label>
                  <Select 
                    value={criteria.region} 
                    onValueChange={(value: any) => setCriteria({...criteria, region: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="riyadh">{t('regions.riyadh')}</SelectItem>
                      <SelectItem value="makkah">{t('regions.makkah')}</SelectItem>
                      <SelectItem value="eastern">{t('regions.eastern')}</SelectItem>
                      <SelectItem value="asir">{t('regions.asir')}</SelectItem>
                      <SelectItem value="madinah">{t('regions.madinah')}</SelectItem>
                      <SelectItem value="qassim">{t('regions.qassim')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Candidate Profile */}
            <Card>
              <CardHeader>
                <CardTitle>{t('salary.benchmarking.candidate.profile')}</CardTitle>
                <CardDescription>
                  {t('salary.benchmarking.candidate.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('salary.benchmarking.candidate.experience')}</Label>
                  <Select 
                    value={criteria.experienceLevel} 
                    onValueChange={(value: any) => setCriteria({...criteria, experienceLevel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">{t('experience.entry')} (0-1 {t('experience.years')})</SelectItem>
                      <SelectItem value="junior">{t('experience.junior')} (1-3 {t('experience.years')})</SelectItem>
                      <SelectItem value="mid">{t('experience.mid')} (3-5 {t('experience.years')})</SelectItem>
                      <SelectItem value="senior">{t('experience.senior')} (5-8 {t('experience.years')})</SelectItem>
                      <SelectItem value="expert">{t('experience.expert')} (8+ {t('experience.years')})</SelectItem>
                      <SelectItem value="executive">{t('experience.executive')} (10+ {t('experience.years')})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('salary.benchmarking.candidate.education')}</Label>
                  <Select 
                    value={criteria.educationLevel} 
                    onValueChange={(value: any) => setCriteria({...criteria, educationLevel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_school">{t('education.highSchool')}</SelectItem>
                      <SelectItem value="diploma">{t('education.diploma')}</SelectItem>
                      <SelectItem value="bachelor">{t('education.bachelor')}</SelectItem>
                      <SelectItem value="master">{t('education.master')}</SelectItem>
                      <SelectItem value="phd">{t('education.phd')}</SelectItem>
                      <SelectItem value="professional">{t('education.professional')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('salary.benchmarking.candidate.nationality')}</Label>
                  <Select 
                    value={criteria.nationality} 
                    onValueChange={(value: any) => setCriteria({...criteria, nationality: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saudi">{t('nationality.saudi')}</SelectItem>
                      <SelectItem value="gcc">{t('nationality.gcc')}</SelectItem>
                      <SelectItem value="arab">{t('nationality.arab')}</SelectItem>
                      <SelectItem value="asian">{t('nationality.asian')}</SelectItem>
                      <SelectItem value="western">{t('nationality.western')}</SelectItem>
                      <SelectItem value="other">{t('nationality.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                      <span className="text-primary-foreground text-sm font-bold">AI</span>
                    </div>
                    <span className="font-medium">{t('salary.benchmarking.aiPowered')}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {t('salary.benchmarking.aiDescription')}
                  </p>

                  <Button
                    onClick={handleBenchmarkGeneration}
                    disabled={loading || !criteria.positionTitle || !criteria.hrsdPositionCode}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>{t('salary.benchmarking.generating')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CurrencyIcon className="h-4 w-4" />
                        <span>{t('salary.benchmarking.generate')}</span>
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {benchmarkData ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Salary Overview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CurrencyIcon className="h-5 w-5" />
                    <span>{t('salary.benchmarking.results.salaryOverview')}</span>
                  </CardTitle>
                  <CardDescription>
                    {benchmarkData.positionTitle} - {t(`regions.${benchmarkData.region}`)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Market Position */}
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getPercentileColor(benchmarkData.marketPercentile)}`}>
                        {benchmarkData.marketPercentile}th {t('salary.benchmarking.percentile')}
                      </div>
                      <p className="text-muted-foreground mt-1">
                        {t('salary.benchmarking.marketPosition')}
                      </p>
                    </div>

                    {/* Salary Ranges */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-accent/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(benchmarkData.baseSalary.median)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t('salary.benchmarking.baseSalary')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatCurrency(benchmarkData.baseSalary.min)} - {formatCurrency(benchmarkData.baseSalary.max)}
                        </p>
                      </div>

                      <div className="text-center p-4 bg-accent/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(benchmarkData.totalCompensation.median)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t('salary.benchmarking.totalCompensation')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatCurrency(benchmarkData.totalCompensation.min)} - {formatCurrency(benchmarkData.totalCompensation.max)}
                        </p>
                      </div>
                    </div>

                    {/* Confidence Score */}
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">{t('salary.benchmarking.confidence')}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{benchmarkData.confidence}%</Badge>
                        <Target className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('salary.benchmarking.benefits.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('salary.benchmarking.benefits.housing')}</span>
                      <span className="font-medium">{formatCurrency(benchmarkData.benefits.housing)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('salary.benchmarking.benefits.transportation')}</span>
                      <span className="font-medium">{formatCurrency(benchmarkData.benefits.transportation)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('salary.benchmarking.benefits.medical')}</span>
                      <span className="font-medium">{formatCurrency(benchmarkData.benefits.medical)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('salary.benchmarking.benefits.education')}</span>
                      <span className="font-medium">{formatCurrency(benchmarkData.benefits.education)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('salary.benchmarking.benefits.annual')}</span>
                      <span className="font-medium">{formatCurrency(benchmarkData.benefits.annual_bonus)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-3">
                      <span className="text-sm font-medium">{t('salary.benchmarking.benefits.total')}</span>
                      <span className="font-bold text-primary">
                        {formatCurrency(
                          Object.values(benchmarkData.benefits).reduce((sum, value) => sum + value, 0)
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {t('salary.benchmarking.noResults')}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('salary.benchmarking.comparison.title')}</CardTitle>
              <CardDescription>
                {t('salary.benchmarking.comparison.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                {t('salary.benchmarking.comparison.comingSoon')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                  <span className="text-primary-foreground text-sm font-bold">AI</span>
                </div>
                <span>{t('salary.benchmarking.insights.title')}</span>
              </CardTitle>
              <CardDescription>
                {t('salary.benchmarking.insights.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                {t('salary.benchmarking.insights.comingSoon')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};