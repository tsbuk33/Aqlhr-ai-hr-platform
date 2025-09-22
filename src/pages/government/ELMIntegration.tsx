import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Award, Users, TrendingUp, FileText } from "lucide-react";
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { useELMIntegration } from '@/hooks/useELMIntegration';
import { AqlHRAIAssistant } from '@/components/ai';

const ELMIntegration = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const { data, isLoading, error } = useELMIntegration();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {isArabic ? 'جاري تحميل بيانات إدارة التعليم والتدريب...' : 'Loading ELM integration data...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="text-center py-12">
          <p className="text-destructive">
            {isArabic ? 'خطأ في تحميل بيانات إدارة التعليم والتدريب' : 'Error loading ELM integration data'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'إدارة التعليم والتدريب' : 'Education & Learning Management'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'التكامل مع أنظمة إدارة التعليم والتدريب المؤسسي' : 'Integration with institutional education and learning management systems'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'البرامج التدريبية النشطة' : 'Active Training Programs'}
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.activePrograms || 24}</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'برنامج تدريبي' : 'training programs'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'المتدربون المسجلون' : 'Enrolled Learners'}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.enrolledLearners || 1247}</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'متدرب نشط' : 'active learners'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'الشهادات الممنوحة' : 'Certificates Issued'}
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.certificatesIssued || 892}</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'شهادة معتمدة' : 'certified credentials'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'معدل إتمام البرامج' : 'Program Completion Rate'}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{data?.completionRate || '87.3'}%</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'معدل الإنجاز' : 'average completion'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'المحتوى التعليمي' : 'Learning Content'}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.learningModules || 156}</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'وحدة تعليمية' : 'learning modules'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'التقييمات المكتملة' : 'Assessments Completed'}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.assessmentsCompleted || 2341}</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'تقييم مكتمل' : 'completed assessments'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'البرامج التدريبية' : 'Training Programs'}</CardTitle>
            <CardDescription>
              {isArabic ? 'البرامج النشطة حسب المجال' : 'Active programs by domain'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">{isArabic ? 'التطوير المهني' : 'Professional Development'}</span>
              <Badge variant="secondary">8</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{isArabic ? 'المهارات التقنية' : 'Technical Skills'}</span>
              <Badge variant="secondary">6</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{isArabic ? 'القيادة والإدارة' : 'Leadership & Management'}</span>
              <Badge variant="secondary">5</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{isArabic ? 'السلامة والامتثال' : 'Safety & Compliance'}</span>
              <Badge variant="secondary">3</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{isArabic ? 'أخرى' : 'Others'}</span>
              <Badge variant="secondary">2</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'حالة التكامل' : 'Integration Status'}</CardTitle>
            <CardDescription>
              {isArabic ? 'حالة الاتصال مع الأنظمة الخارجية' : 'External systems connectivity status'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">{isArabic ? 'نظام إدارة التعلم' : 'Learning Management System'}</span>
              <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                {isArabic ? 'متصل' : 'Connected'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{isArabic ? 'نظام الشهادات' : 'Certification System'}</span>
              <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                {isArabic ? 'متصل' : 'Connected'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{isArabic ? 'نظام التقييم' : 'Assessment Platform'}</span>
              <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                {isArabic ? 'متصل' : 'Connected'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{isArabic ? 'مكتبة المحتوى' : 'Content Library'}</span>
              <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                {isArabic ? 'تحديث' : 'Syncing'}
              </Badge>
            </div>
            <Button className="w-full mt-4">
              {isArabic ? 'تحديث الاتصال' : 'Refresh Connection'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <AqlHRAIAssistant 
        moduleContext="elm.integration" 
        companyId="demo-company"
      />
    </div>
  );
};

export default ELMIntegration;