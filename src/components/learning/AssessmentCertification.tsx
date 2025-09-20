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
      title: 'Data Analysis Proficiency',
      type: 'Technical',
      level: 'Advanced',
      duration: '45 minutes',
      questions: 25,
      passRate: 80,
      completions: 156,
      averageScore: 87,
      lastTaken: '2 days ago',
      status: 'available'
    },
    {
      title: 'Leadership Competency',
      type: 'Behavioral',
      level: 'Intermediate',
      duration: '30 minutes',
      questions: 20,
      passRate: 75,
      completions: 89,
      averageScore: 82,
      lastTaken: '1 week ago',
      status: 'in-progress'
    },
    {
      title: 'Arabic Communication Skills',
      type: 'Language',
      level: 'Professional',
      duration: '60 minutes',
      questions: 35,
      passRate: 85,
      completions: 234,
      averageScore: 91,
      lastTaken: '3 days ago',
      status: 'completed'
    },
    {
      title: 'Project Management',
      type: 'Professional',
      level: 'Intermediate',
      duration: '40 minutes',
      questions: 30,
      passRate: 78,
      completions: 127,
      averageScore: 84,
      lastTaken: 'Never',
      status: 'available'
    }
  ];

  const certificationWorkflows = [
    {
      certification: 'Data Analytics Professional',
      provider: 'Internal',
      requirements: ['Complete 3 courses', 'Pass assessment (80%)', '6 months experience'],
      progress: 67,
      validityPeriod: '2 years',
      renewalRequired: false,
      enrolled: 45,
      completed: 12,
      status: 'active'
    },
    {
      certification: 'Leadership Excellence',
      provider: 'Internal',
      requirements: ['360° feedback', 'Leadership project', 'Peer evaluation'],
      progress: 34,
      validityPeriod: '3 years',
      renewalRequired: false,
      enrolled: 23,
      completed: 8,
      status: 'active'
    },
    {
      certification: 'Arabic Business Communication',
      provider: 'Saudi Language Institute',
      requirements: ['Language assessment', 'Business presentation', 'Written test'],
      progress: 89,
      validityPeriod: 'Lifetime',
      renewalRequired: false,
      enrolled: 67,
      completed: 31,
      status: 'active'
    }
  ];

  const externalCertifications = [
    {
      name: 'PMP Certification',
      provider: 'Project Management Institute',
      employees: 12,
      expiration: '2024-12-15',
      cost: 4500,
      renewalDue: true,
      importance: 'high'
    },
    {
      name: 'AWS Cloud Practitioner',
      provider: 'Amazon Web Services',
      employees: 28,
      expiration: '2025-06-20',
      cost: 2800,
      renewalDue: false,
      importance: 'high'
    },
    {
      name: 'Google Analytics',
      provider: 'Google',
      employees: 15,
      expiration: '2024-03-10',
      cost: 0,
      renewalDue: true,
      importance: 'medium'
    },
    {
      name: 'Microsoft Excel Expert',
      provider: 'Microsoft',
      employees: 45,
      expiration: '2025-01-30',
      cost: 1200,
      renewalDue: false,
      importance: 'medium'
    }
  ];

  const complianceTraining = [
    {
      title: 'Data Privacy & GDPR',
      type: 'Mandatory',
      frequency: 'Annual',
      completionRate: 94,
      dueDate: '2024-12-31',
      enrolled: 567,
      completed: 533,
      overdue: 12,
      status: 'active'
    },
    {
      title: 'Workplace Safety',
      type: 'Mandatory',
      frequency: 'Bi-annual',
      completionRate: 87,
      dueDate: '2024-06-30',
      enrolled: 567,
      completed: 493,
      overdue: 28,
      status: 'urgent'
    },
    {
      title: 'Anti-Harassment Training',
      type: 'Mandatory',
      frequency: 'Annual',
      completionRate: 96,
      dueDate: '2024-09-15',
      enrolled: 567,
      completed: 544,
      overdue: 5,
      status: 'active'
    },
    {
      title: 'Cybersecurity Awareness',
      type: 'Mandatory',
      frequency: 'Quarterly',
      completionRate: 89,
      dueDate: '2024-03-31',
      enrolled: 567,
      completed: 505,
      overdue: 18,
      status: 'urgent'
    }
  ];

  const professionalCredits = [
    { category: 'Technical Skills', earned: 24, required: 30, period: '2024' },
    { category: 'Leadership', earned: 18, required: 20, period: '2024' },
    { category: 'Communication', earned: 15, required: 15, period: '2024' },
    { category: 'Compliance', earned: 12, required: 10, period: '2024' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">{t('leo.assessment_certification_title', 'Assessment & Certification')}</h2>
            <p className="text-muted-foreground">
              {t('leo.assessment_desc', 'Comprehensive assessment system with certification tracking')}
            </p>
          </div>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          {t('leo.manage_assessments', 'Manage Assessments')}
        </Button>
      </div>

      <Tabs defaultValue="competency-assessments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="competency-assessments">{t('leo.competency_assessments', 'Competency')}</TabsTrigger>
          <TabsTrigger value="certification-workflows">{t('leo.certification_workflows', 'Certifications')}</TabsTrigger>
          <TabsTrigger value="external-tracking">{t('leo.external_tracking', 'External')}</TabsTrigger>
          <TabsTrigger value="compliance-monitoring">{t('leo.compliance_monitoring', 'Compliance')}</TabsTrigger>
          <TabsTrigger value="professional-credits">{t('leo.professional_credits', 'Credits')}</TabsTrigger>
        </TabsList>

        {/* Competency-based Assessments */}
        <TabsContent value="competency-assessments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.competency_based_assessments', 'Competency-based Assessments')}</CardTitle>
              <CardDescription>
                {t('leo.competency_desc', 'Skills-based evaluations with adaptive difficulty and detailed analytics')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competencyAssessments.map((assessment, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          assessment.status === 'completed' ? 'bg-green-100 text-green-600' :
                          assessment.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {assessment.status === 'completed' ? <CheckCircle className="h-5 w-5" /> :
                           assessment.status === 'in-progress' ? <Clock className="h-5 w-5" /> :
                           <Target className="h-5 w-5" />}
                        </div>
                        <div>
                          <h4 className="font-semibold">{assessment.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {assessment.type} • {assessment.level} • Last taken: {assessment.lastTaken}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        assessment.status === 'completed' ? 'default' :
                        assessment.status === 'in-progress' ? 'secondary' : 'outline'
                      }>
                        {assessment.status === 'completed' ? 'Completed' :
                         assessment.status === 'in-progress' ? 'In Progress' : 'Available'}
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-5 mb-4">
                      <div className="text-center p-2 bg-muted rounded">
                        <Clock className="h-4 w-4 mx-auto mb-1" />
                        <p className="text-sm font-medium">{assessment.duration}</p>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <FileText className="h-4 w-4 mx-auto mb-1" />
                        <p className="text-sm font-medium">{assessment.questions}</p>
                        <p className="text-xs text-muted-foreground">Questions</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <Target className="h-4 w-4 mx-auto mb-1" />
                        <p className="text-sm font-medium">{assessment.passRate}%</p>
                        <p className="text-xs text-muted-foreground">Pass Rate</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <Users className="h-4 w-4 mx-auto mb-1" />
                        <p className="text-sm font-medium">{assessment.completions}</p>
                        <p className="text-xs text-muted-foreground">Completions</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <Star className="h-4 w-4 mx-auto mb-1" />
                        <p className="text-sm font-medium">{assessment.averageScore}%</p>
                        <p className="text-xs text-muted-foreground">Avg Score</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        {assessment.status === 'completed' ? (
                          <>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            {t('leo.view_results', 'View Results')}
                          </>
                        ) : assessment.status === 'in-progress' ? (
                          <>
                            <Clock className="h-4 w-4 mr-2" />
                            {t('leo.continue', 'Continue')}
                          </>
                        ) : (
                          <>
                            <Target className="h-4 w-4 mr-2" />
                            {t('leo.start_assessment', 'Start Assessment')}
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {t('leo.prep_materials', 'Prep Materials')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Certification Workflows */}
        <TabsContent value="certification-workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.skills_certification_workflows', 'Skills Certification Workflows')}</CardTitle>
              <CardDescription>
                {t('leo.workflows_desc', 'Structured certification paths with automated progress tracking')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {certificationWorkflows.map((cert, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Award className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-semibold">{cert.certification}</h4>
                          <p className="text-sm text-muted-foreground">
                            {cert.provider} • Valid for {cert.validityPeriod}
                          </p>
                        </div>
                      </div>
                      <Badge variant="default">{cert.status}</Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{cert.progress}%</span>
                      </div>
                      <Progress value={cert.progress} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 mb-4">
                      <div>
                        <h5 className="font-medium mb-2">{t('leo.requirements', 'Requirements')}</h5>
                        <ul className="text-sm space-y-1">
                          {cert.requirements.map((req, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">{t('leo.participation', 'Participation')}</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Enrolled</span>
                            <span>{cert.enrolled} employees</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Completed</span>
                            <span>{cert.completed} employees</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Success Rate</span>
                            <span>{Math.round((cert.completed / cert.enrolled) * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">
                        <Award className="h-4 w-4 mr-2" />
                        {t('leo.enroll', 'Enroll')}
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        {t('leo.view_details', 'View Details')}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        {t('leo.certificate', 'Certificate')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* External Certification Tracking */}
        <TabsContent value="external-tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.external_certification_tracking', 'External Certification Tracking')}</CardTitle>
              <CardDescription>
                {t('leo.external_desc', 'Monitor and manage third-party certifications and their renewal schedules')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {externalCertifications.map((cert, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <ExternalLink className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-semibold">{cert.name}</h4>
                          <p className="text-sm text-muted-foreground">{cert.provider}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {cert.renewalDue && (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Renewal Due
                          </Badge>
                        )}
                        <Badge variant={cert.importance === 'high' ? 'default' : 'secondary'}>
                          {cert.importance} priority
                        </Badge>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4 mb-3">
                      <div className="text-center p-2 bg-muted rounded">
                        <Users className="h-4 w-4 mx-auto mb-1" />
                        <p className="text-sm font-medium">{cert.employees}</p>
                        <p className="text-xs text-muted-foreground">Certified</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <Calendar className="h-4 w-4 mx-auto mb-1" />
                        <p className="text-sm font-medium">{new Date(cert.expiration).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">Expires</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <span className="text-sm">💰</span>
                        <p className="text-sm font-medium">${cert.cost}</p>
                        <p className="text-xs text-muted-foreground">Annual Cost</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <Zap className="h-4 w-4 mx-auto mb-1" />
                        <p className="text-sm font-medium">
                          {cert.renewalDue ? 'Urgent' : 'Active'}
                        </p>
                        <p className="text-xs text-muted-foreground">Status</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t('leo.manage_certification', 'Manage Certification')}
                      </Button>
                      {cert.renewalDue && (
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          {t('leo.schedule_renewal', 'Schedule Renewal')}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {t('leo.renewal_alerts', 'Renewal Alerts')}
                </h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• PMP Certification expires in 45 days (12 employees affected)</li>
                  <li>• Google Analytics certification expires in 15 days (15 employees affected)</li>
                  <li>• Total renewal cost: $4,500 for upcoming renewals</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Training Monitoring */}
        <TabsContent value="compliance-monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.compliance_training_monitoring', 'Compliance Training Monitoring')}</CardTitle>
              <CardDescription>
                {t('leo.compliance_desc', 'Mandatory training compliance tracking with automated reminders')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceTraining.map((training, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-semibold">{training.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {training.type} • {training.frequency} • Due: {training.dueDate}
                          </p>
                        </div>
                      </div>
                      <Badge variant={training.status === 'urgent' ? 'destructive' : 'default'}>
                        {training.status}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Completion Rate</span>
                        <span>{training.completionRate}%</span>
                      </div>
                      <Progress value={training.completionRate} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-4 mb-4">
                      <div className="text-center p-2 bg-muted rounded">
                        <Users className="h-4 w-4 mx-auto mb-1" />
                        <p className="text-sm font-medium">{training.enrolled}</p>
                        <p className="text-xs text-muted-foreground">Enrolled</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <CheckCircle className="h-4 w-4 mx-auto mb-1 text-green-500" />
                        <p className="text-sm font-medium">{training.completed}</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <AlertTriangle className="h-4 w-4 mx-auto mb-1 text-red-500" />
                        <p className="text-sm font-medium">{training.overdue}</p>
                        <p className="text-xs text-muted-foreground">Overdue</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <Clock className="h-4 w-4 mx-auto mb-1" />
                        <p className="text-sm font-medium">{training.enrolled - training.completed - training.overdue}</p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">
                        <Shield className="h-4 w-4 mr-2" />
                        {t('leo.view_compliance', 'View Compliance')}
                      </Button>
                      {training.overdue > 0 && (
                        <Button size="sm" variant="outline">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          {t('leo.send_reminders', 'Send Reminders')}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professional Development Credits */}
        <TabsContent value="professional-credits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.professional_development_credits', 'Professional Development Credits')}</CardTitle>
              <CardDescription>
                {t('leo.credits_desc', 'Track and manage professional development credit requirements')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {professionalCredits.map((credit, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{credit.category}</h4>
                      <Badge variant={credit.earned >= credit.required ? 'default' : 'secondary'}>
                        {credit.period}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Progress</span>
                      <span className="text-sm font-medium">
                        {credit.earned} / {credit.required} credits
                      </span>
                    </div>
                    <Progress value={(credit.earned / credit.required) * 100} />

                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {credit.earned >= credit.required ? 
                          'Requirements met ✓' : 
                          `${credit.required - credit.earned} credits remaining`
                        }
                      </span>
                      <Button size="sm" variant="outline">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {t('leo.find_courses', 'Find Courses')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">
                  {t('leo.credit_summary', '2024 Credit Summary')}
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">69</p>
                    <p className="text-sm text-green-800">Total Credits Earned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">75</p>
                    <p className="text-sm text-green-800">Total Credits Required</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">92%</p>
                    <p className="text-sm text-green-800">Overall Progress</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};