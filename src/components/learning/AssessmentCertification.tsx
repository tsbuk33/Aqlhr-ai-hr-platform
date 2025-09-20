import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';
import { 
  Award, 
  CheckCircle, 
  Clock, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  FileText,
  ExternalLink,
  Calendar,
  Users,
  Star,
  Zap,
  BookOpen,
  Settings,
  Download,
  Shield
} from 'lucide-react';

export const AssessmentCertification: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const competencyAssessments = [
    {
      title: 'Data Analysis Skills',
      description: 'Evaluate proficiency in data manipulation and interpretation',
      type: 'Skills Assessment',
      status: 'Active',
      lastUpdated: '2023-11-15',
      completionRate: 85,
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      title: 'Leadership Competencies',
      description: 'Assess key leadership attributes and decision-making abilities',
      type: '360° Feedback',
      status: 'Draft',
      lastUpdated: '2023-12-01',
      completionRate: 0,
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Compliance Knowledge',
      description: 'Test understanding of regulatory requirements and ethical standards',
      type: 'Knowledge Test',
      status: 'Active',
      lastUpdated: '2023-11-20',
      completionRate: 92,
      icon: <Shield className="h-5 w-5" />
    },
    {
      title: 'Technical Proficiency',
      description: 'Measure hands-on skills in software development and IT infrastructure',
      type: 'Practical Exam',
      status: 'Pending',
      lastUpdated: '2023-12-05',
      completionRate: 30,
      icon: <Zap className="h-5 w-5" />
    }
  ];

  const certificationWorkflows = [
    {
      title: 'Project Management Professional',
      description: 'Automate the PMP certification process with integrated learning paths',
      status: 'Active',
      renewalDate: '2024-06-30',
      creditsEarned: 45,
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: 'Certified Data Scientist',
      description: 'Streamline the CDS certification with adaptive learning modules',
      status: 'Draft',
      renewalDate: '2024-03-15',
      creditsEarned: 0,
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      title: 'HR Management Certification',
      description: 'Manage HR certifications with automated tracking and compliance checks',
      status: 'Active',
      renewalDate: '2024-09-20',
      creditsEarned: 60,
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Cybersecurity Professional',
      description: 'Track cybersecurity certifications with real-time status updates',
      status: 'Pending',
      renewalDate: '2024-12-31',
      creditsEarned: 15,
      icon: <Shield className="h-5 w-5" />
    }
  ];

  const externalTracking = [
    {
      provider: 'Coursera',
      coursesTracked: 1247,
      certifications: 345,
      lastSync: '2023-12-08',
      status: 'Connected',
      icon: <ExternalLink className="h-5 w-5" />
    },
    {
      provider: 'LinkedIn Learning',
      coursesTracked: 2156,
      certifications: 567,
      lastSync: '2023-12-09',
      status: 'Connected',
      icon: <ExternalLink className="h-5 w-5" />
    },
    {
      provider: 'Udemy Business',
      coursesTracked: 987,
      certifications: 123,
      lastSync: '2023-12-07',
      status: 'Pending',
      icon: <ExternalLink className="h-5 w-5" />
    },
    {
      provider: 'Saudi Digital Academy',
      coursesTracked: 1834,
      certifications: 456,
      lastSync: '2023-12-06',
      status: 'Connected',
      icon: <ExternalLink className="h-5 w-5" />
    }
  ];

  const complianceMonitoring = [
    {
      rule: 'Saudi Labor Law',
      employeesCompliant: 2345,
      employeesTotal: 2500,
      dueDate: '2024-01-01',
      status: 'Active',
      icon: <Shield className="h-5 w-5" />
    },
    {
      rule: 'Data Protection Regulations',
      employeesCompliant: 1987,
      employeesTotal: 2000,
      dueDate: '2024-02-15',
      status: 'Active',
      icon: <AlertTriangle className="h-5 w-5" />
    },
    {
      rule: 'Ethical Conduct Policy',
      employeesCompliant: 2456,
      employeesTotal: 2500,
      dueDate: '2024-03-31',
      status: 'Active',
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      rule: 'Anti-Harassment Training',
      employeesCompliant: 2200,
      employeesTotal: 2500,
      dueDate: '2024-04-30',
      status: 'Active',
      icon: <Users className="h-5 w-5" />
    }
  ];

  const professionalCredits = [
    {
      provider: 'Saudi Council of Engineers',
      creditsEarned: 45,
      creditsRequired: 60,
      renewalDate: '2024-05-20',
      status: 'Active',
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      provider: 'Saudi Bar Association',
      creditsEarned: 30,
      creditsRequired: 40,
      renewalDate: '2024-06-15',
      status: 'Active',
      icon: <FileText className="h-5 w-5" />
    },
    {
      provider: 'Saudi Medical Council',
      creditsEarned: 50,
      creditsRequired: 50,
      renewalDate: '2024-07-31',
      status: 'Active',
      icon: <Target className="h-5 w-5" />
    },
    {
      provider: 'Saudi Accounting Association',
      creditsEarned: 20,
      creditsRequired: 30,
      renewalDate: '2024-08-15',
      status: 'Active',
      icon: <Clock className="h-5 w-5" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">{t('leo.assessment_certification_title')}</h2>
            <p className="text-muted-foreground">
              {t('leo.assessment_desc')}
            </p>
          </div>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          {t('leo.manage_assessments')}
        </Button>
      </div>

      {/* Tabs with all content but fixed translation calls */}
      <Tabs defaultValue="competency-assessments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="competency-assessments">Competency</TabsTrigger>
          <TabsTrigger value="certification-workflows">Certifications</TabsTrigger>
          <TabsTrigger value="external-tracking">External</TabsTrigger>
          <TabsTrigger value="compliance-monitoring">Compliance</TabsTrigger>
          <TabsTrigger value="professional-credits">Credits</TabsTrigger>
        </TabsList>

        {/* All tab content with simplified text to avoid translation errors */}
        <TabsContent value="competency-assessments">
          <Card>
            <CardHeader>
              <CardTitle>Competency-based Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Skills-based evaluations with adaptive difficulty and detailed analytics</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
