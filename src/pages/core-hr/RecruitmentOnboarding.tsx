/**
 * AQLHR Platform - Enhanced Recruitment & Onboarding Module with Expert RTL Support
 * Professional Arabic/English Recruitment Management System
 * @author AQLHR Development Team
 * @version 3.0.0
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRTLLanguage } from '@/contexts/RTLLanguageContext';
import RTLMainLayout from '@/components/layout/RTLMainLayout';
import { cn } from '@/lib/utils';
import { 
  Users, 
  UserPlus, 
  FileText, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Globe,
  MessageSquare,
  Shield,
  BarChart3,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Star,
  Award,
  Target,
  Zap,
  Activity,
  Eye,
  Download,
  Upload,
  Filter,
  Search,
  RefreshCw,
  Settings,
  Bell,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Send,
  Archive,
  BookOpen,
  Briefcase,
  GraduationCap,
  Building,
  DollarSign,
  User,
  UserCheck,
  UserX,
  Building2,
  Globe2,
  Smartphone,
  Laptop,
  Code,
  Database,
  Server,
  Cloud,
  Lock,
  Key,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  MoreHorizontal
} from 'lucide-react';

const RecruitmentOnboardingRTL = () => {
  const { direction, isArabic, t } = useRTLLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // Enhanced Local Saudi Recruitment Platforms Data
  const localPlatforms = [
    {
      id: 'qiwa',
      name: 'Qiwa',
      nameAr: 'قوى',
      url: 'https://qiwa.sa',
      status: 'active',
      category: 'Government',
      categoryAr: 'حكومي',
      activeJobs: 2450,
      lastSync: new Date('2024-01-15T14:30:00'),
      candidates: 15420,
      description: 'Ministry of Labor platform',
      descriptionAr: 'منصة وزارة العمل',
      compliance: 98.5,
      apiStatus: 'connected'
    },
    {
      id: 'gosi',
      name: 'GOSI',
      nameAr: 'التأمينات الاجتماعية',
      url: 'https://gosi.gov.sa',
      status: 'active',
      category: 'Government',
      categoryAr: 'حكومي',
      activeJobs: 890,
      lastSync: new Date('2024-01-15T13:45:00'),
      candidates: 8750,
      description: 'Social Insurance platform',
      descriptionAr: 'منصة التأمينات الاجتماعية',
      compliance: 96.2,
      apiStatus: 'connected'
    },
    {
      id: 'mol',
      name: 'MOL',
      nameAr: 'وزارة العمل',
      url: 'https://mol.gov.sa',
      status: 'active',
      category: 'Government',
      categoryAr: 'حكومي',
      activeJobs: 1250,
      lastSync: new Date('2024-01-15T12:20:00'),
      candidates: 12300,
      description: 'Ministry of Labor',
      descriptionAr: 'وزارة العمل والتنمية الاجتماعية',
      compliance: 94.8,
      apiStatus: 'connected'
    },
    {
      id: 'hrsd',
      name: 'HRSD',
      nameAr: 'وزارة الموارد البشرية',
      url: 'https://hrsd.gov.sa',
      status: 'active',
      category: 'Government',
      categoryAr: 'حكومي',
      activeJobs: 780,
      lastSync: new Date('2024-01-15T11:15:00'),
      candidates: 9850,
      description: 'Human Resources Development',
      descriptionAr: 'وزارة الموارد البشرية والتنمية الاجتماعية',
      compliance: 92.1,
      apiStatus: 'connected'
    },
    {
      id: 'absher',
      name: 'Absher',
      nameAr: 'أبشر',
      url: 'https://absher.sa',
      status: 'active',
      category: 'Government',
      categoryAr: 'حكومي',
      activeJobs: 450,
      lastSync: new Date('2024-01-15T10:30:00'),
      candidates: 6200,
      description: 'Digital Government Platform',
      descriptionAr: 'منصة الحكومة الرقمية',
      compliance: 97.3,
      apiStatus: 'connected'
    },
    {
      id: 'bayt',
      name: 'Bayt.com Saudi',
      nameAr: 'بيت.كوم السعودية',
      url: 'https://www.bayt.com/en/saudi-arabia/',
      status: 'active',
      category: 'Commercial',
      categoryAr: 'تجاري',
      activeJobs: 3200,
      lastSync: new Date('2024-01-15T15:45:00'),
      candidates: 28500,
      description: 'Leading job portal in MENA',
      descriptionAr: 'البوابة الرائدة للوظائف في المنطقة',
      compliance: 89.7,
      apiStatus: 'connected'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Saudi',
      nameAr: 'لينكد إن السعودية',
      url: 'https://www.linkedin.com/jobs/saudi-arabia-jobs/',
      status: 'active',
      category: 'International',
      categoryAr: 'دولي',
      activeJobs: 4100,
      lastSync: new Date('2024-01-15T16:20:00'),
      candidates: 45200,
      description: 'Professional networking platform',
      descriptionAr: 'منصة الشبكات المهنية',
      compliance: 91.4,
      apiStatus: 'connected'
    },
    {
      id: 'gulftalent',
      name: 'GulfTalent',
      nameAr: 'جلف تالنت',
      url: 'https://www.gulftalent.com/saudi-arabia',
      status: 'active',
      category: 'Regional',
      categoryAr: 'إقليمي',
      activeJobs: 1850,
      lastSync: new Date('2024-01-15T14:10:00'),
      candidates: 18700,
      description: 'Gulf region job portal',
      descriptionAr: 'بوابة الوظائف في منطقة الخليج',
      compliance: 87.9,
      apiStatus: 'connected'
    },
    {
      id: 'naukrigulf',
      name: 'Naukrigulf',
      nameAr: 'نوكري جلف',
      url: 'https://www.naukrigulf.com/saudi-arabia-jobs',
      status: 'active',
      category: 'Regional',
      categoryAr: 'إقليمي',
      activeJobs: 2100,
      lastSync: new Date('2024-01-15T13:25:00'),
      candidates: 22400,
      description: 'Gulf job search platform',
      descriptionAr: 'منصة البحث عن الوظائف في الخليج',
      compliance: 86.3,
      apiStatus: 'connected'
    },
    {
      id: 'indeed',
      name: 'Indeed Saudi',
      nameAr: 'إنديد السعودية',
      url: 'https://sa.indeed.com/',
      status: 'active',
      category: 'International',
      categoryAr: 'دولي',
      activeJobs: 3800,
      lastSync: new Date('2024-01-15T15:30:00'),
      candidates: 35600,
      description: 'Global job search engine',
      descriptionAr: 'محرك البحث العالمي للوظائف',
      compliance: 88.1,
      apiStatus: 'connected'
    },
    {
      id: 'monster',
      name: 'Monster Saudi',
      nameAr: 'مونستر السعودية',
      url: 'https://www.monster.com.sa/',
      status: 'active',
      category: 'International',
      categoryAr: 'دولي',
      activeJobs: 2650,
      lastSync: new Date('2024-01-15T12:45:00'),
      candidates: 24800,
      description: 'Global career platform',
      descriptionAr: 'منصة المهن العالمية',
      compliance: 85.7,
      apiStatus: 'connected'
    },
    {
      id: 'tanqeeb',
      name: 'Tanqeeb',
      nameAr: 'تنقيب',
      url: 'https://www.tanqeeb.com/saudi-arabia',
      status: 'maintenance',
      category: 'Regional',
      categoryAr: 'إقليمي',
      activeJobs: 1200,
      lastSync: new Date('2024-01-14T18:20:00'),
      candidates: 14500,
      description: 'MENA job search platform',
      descriptionAr: 'منصة البحث عن الوظائف في المنطقة',
      compliance: 82.4,
      apiStatus: 'maintenance'
    },
    {
      id: 'akhtaboot',
      name: 'Akhtaboot',
      nameAr: 'أختابوت',
      url: 'https://www.akhtaboot.com/saudi-arabia',
      status: 'inactive',
      category: 'Regional',
      categoryAr: 'إقليمي',
      activeJobs: 850,
      lastSync: new Date('2024-01-13T16:30:00'),
      candidates: 11200,
      description: 'Regional job portal',
      descriptionAr: 'بوابة الوظائف الإقليمية',
      compliance: 79.6,
      apiStatus: 'error'
    },
    {
      id: 'mihnati',
      name: 'Mihnati',
      nameAr: 'مهنتي',
      url: 'https://mihnati.com/',
      status: 'active',
      category: 'Local',
      categoryAr: 'محلي',
      activeJobs: 950,
      lastSync: new Date('2024-01-15T11:50:00'),
      candidates: 8900,
      description: 'Saudi local job platform',
      descriptionAr: 'منصة الوظائف المحلية السعودية',
      compliance: 90.2,
      apiStatus: 'connected'
    }
  ];

  // International Recruitment Clusters
  const internationalClusters = [
    {
      id: 'gcc',
      name: 'GCC Cluster',
      nameAr: 'مجموعة دول الخليج',
      region: 'Gulf Cooperation Council',
      regionAr: 'مجلس التعاون الخليجي',
      agents: 25,
      candidates: 450,
      specializations: ['Engineering', 'Healthcare', 'Finance', 'IT', 'Management'],
      specializationsAr: ['الهندسة', 'الرعاية الصحية', 'المالية', 'تقنية المعلومات', 'الإدارة'],
      platforms: [
        { name: 'Bayt.com UAE', url: 'https://www.bayt.com/en/uae/', status: 'active' },
        { name: 'GulfTalent', url: 'https://www.gulftalent.com/', status: 'active' },
        { name: 'Naukrigulf', url: 'https://www.naukrigulf.com/', status: 'active' },
        { name: 'LinkedIn UAE', url: 'https://www.linkedin.com/jobs/uae-jobs/', status: 'active' },
        { name: 'Indeed UAE', url: 'https://ae.indeed.com/', status: 'active' }
      ],
      averageResponseTime: '2.3 hours',
      successRate: 78.5,
      costPerHire: '$2,850'
    },
    {
      id: 'south_asian',
      name: 'South Asian Network',
      nameAr: 'الشبكة الآسيوية الجنوبية',
      region: 'India, Pakistan, Bangladesh, Sri Lanka',
      regionAr: 'الهند، باكستان، بنغلاديش، سريلانكا',
      agents: 40,
      candidates: 1200,
      specializations: ['IT', 'Engineering', 'Healthcare', 'Education', 'Manufacturing'],
      specializationsAr: ['تقنية المعلومات', 'الهندسة', 'الرعاية الصحية', 'التعليم', 'التصنيع'],
      platforms: [
        { name: 'Naukri.com', url: 'https://www.naukri.com/', status: 'active' },
        { name: 'Monster India', url: 'https://www.monsterindia.com/', status: 'active' },
        { name: 'Rozee.pk', url: 'https://www.rozee.pk/', status: 'active' },
        { name: 'BDJobs.com', url: 'https://www.bdjobs.com/', status: 'active' },
        { name: 'TopJobs.lk', url: 'https://www.topjobs.lk/', status: 'active' }
      ],
      averageResponseTime: '4.1 hours',
      successRate: 82.3,
      costPerHire: '$1,950'
    },
    {
      id: 'western',
      name: 'Western Talent',
      nameAr: 'المواهب الغربية',
      region: 'USA, Canada, UK, Australia, Europe',
      regionAr: 'الولايات المتحدة، كندا، المملكة المتحدة، أستراليا، أوروبا',
      agents: 15,
      candidates: 180,
      specializations: ['Executive', 'Consulting', 'Technology', 'Research', 'Innovation'],
      specializationsAr: ['تنفيذي', 'استشارات', 'التكنولوجيا', 'البحث', 'الابتكار'],
      platforms: [
        { name: 'LinkedIn USA', url: 'https://www.linkedin.com/jobs/united-states-jobs/', status: 'active' },
        { name: 'Indeed USA', url: 'https://www.indeed.com/', status: 'active' },
        { name: 'Monster USA', url: 'https://www.monster.com/', status: 'active' },
        { name: 'Reed.co.uk', url: 'https://www.reed.co.uk/', status: 'active' },
        { name: 'Seek.com.au', url: 'https://www.seek.com.au/', status: 'active' }
      ],
      averageResponseTime: '6.8 hours',
      successRate: 71.2,
      costPerHire: '$4,200'
    },
    {
      id: 'african',
      name: 'African Alliance',
      nameAr: 'التحالف الأفريقي',
      region: 'Egypt, Morocco, Tunisia, Nigeria, South Africa',
      regionAr: 'مصر، المغرب، تونس، نيجيريا، جنوب أفريقيا',
      agents: 30,
      candidates: 680,
      specializations: ['Healthcare', 'Education', 'Agriculture', 'Mining', 'Tourism'],
      specializationsAr: ['الرعاية الصحية', 'التعليم', 'الزراعة', 'التعدين', 'السياحة'],
      platforms: [
        { name: 'Wuzzuf Egypt', url: 'https://wuzzuf.net/', status: 'active' },
        { name: 'Rekrute.com', url: 'https://www.rekrute.com/', status: 'active' },
        { name: 'Jobberman', url: 'https://www.jobberman.com/', status: 'active' },
        { name: 'Tanitjobs', url: 'https://www.tanitjobs.com/', status: 'active' },
        { name: 'Bayt Egypt', url: 'https://www.bayt.com/en/egypt/', status: 'active' }
      ],
      averageResponseTime: '3.7 hours',
      successRate: 75.8,
      costPerHire: '$2,100'
    }
  ];

  // Saudi Compliance Services
  const complianceServices = [
    {
      id: 'gosi_compliance',
      name: 'GOSI Compliance',
      nameAr: 'امتثال التأمينات الاجتماعية',
      score: 94.2,
      status: 'excellent',
      lastCheck: new Date('2024-01-15T16:00:00'),
      issues: 2,
      description: 'Social Insurance compliance monitoring',
      descriptionAr: 'مراقبة امتثال التأمينات الاجتماعية'
    },
    {
      id: 'qiwa_compliance',
      name: 'Qiwa Compliance',
      nameAr: 'امتثال قوى',
      score: 96.8,
      status: 'excellent',
      lastCheck: new Date('2024-01-15T15:30:00'),
      issues: 1,
      description: 'Labor platform compliance',
      descriptionAr: 'امتثال منصة العمل'
    },
    {
      id: 'mol_compliance',
      name: 'MOL Compliance',
      nameAr: 'امتثال وزارة العمل',
      score: 91.5,
      status: 'good',
      lastCheck: new Date('2024-01-15T14:45:00'),
      issues: 3,
      description: 'Ministry of Labor compliance',
      descriptionAr: 'امتثال وزارة العمل'
    },
    {
      id: 'hrsd_compliance',
      name: 'HRSD Compliance',
      nameAr: 'امتثال الموارد البشرية',
      score: 88.7,
      status: 'good',
      lastCheck: new Date('2024-01-15T13:20:00'),
      issues: 4,
      description: 'Human Resources compliance',
      descriptionAr: 'امتثال الموارد البشرية'
    },
    {
      id: 'absher_compliance',
      name: 'Absher Compliance',
      nameAr: 'امتثال أبشر',
      score: 93.1,
      status: 'excellent',
      lastCheck: new Date('2024-01-15T12:10:00'),
      issues: 2,
      description: 'Digital government compliance',
      descriptionAr: 'امتثال الحكومة الرقمية'
    },
    {
      id: 'wps_compliance',
      name: 'WPS Compliance',
      nameAr: 'امتثال نظام حماية الأجور',
      score: 89.9,
      status: 'good',
      lastCheck: new Date('2024-01-15T11:30:00'),
      issues: 3,
      description: 'Wage Protection System compliance',
      descriptionAr: 'امتثال نظام حماية الأجور'
    },
    {
      id: 'nitaqat_compliance',
      name: 'Nitaqat Compliance',
      nameAr: 'امتثال نطاقات',
      score: 85.4,
      status: 'warning',
      lastCheck: new Date('2024-01-15T10:15:00'),
      issues: 6,
      description: 'Saudization program compliance',
      descriptionAr: 'امتثال برنامج السعودة'
    }
  ];

  // Dashboard metrics
  const dashboardMetrics = {
    activeCandidates: 139770,
    openPositions: 18450,
    hiresThisMonth: 342,
    averageTimeToHire: 18,
    platformsActive: 12,
    platformsTotal: 14,
    internationalAgents: 110,
    totalCandidatesInternational: 2510,
    complianceScore: 89.3,
    activeConversations: 24,
    responseRate: 94.2
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active': return 'bg-green-100 text-green-800 border-green-200';
        case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
        case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'error': return 'bg-red-100 text-red-800 border-red-200';
        case 'connected': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
        case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    const getStatusText = (status: string) => {
      const statusMap = {
        active: { ar: 'نشط', en: 'Active' },
        inactive: { ar: 'غير نشط', en: 'Inactive' },
        maintenance: { ar: 'صيانة', en: 'Maintenance' },
        error: { ar: 'خطأ', en: 'Error' },
        connected: { ar: 'متصل', en: 'Connected' },
        excellent: { ar: 'ممتاز', en: 'Excellent' },
        good: { ar: 'جيد', en: 'Good' },
        warning: { ar: 'تحذير', en: 'Warning' }
      };
      return statusMap[status]?.[isArabic ? 'ar' : 'en'] || status;
    };

    return (
      <Badge className={cn('border', getStatusColor(status))}>
        {getStatusText(status)}
      </Badge>
    );
  };

  // Dashboard Tab Component
  const DashboardTab = () => (
    <div dir={direction} className={cn('space-y-6', isArabic ? 'text-right' : 'text-left')}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={cn('border-l-4 border-l-blue-500', isArabic ? 'border-r-4 border-r-blue-500 border-l-0' : '')}>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">
                  {t('metrics.activeCandidates', 'المرشحون النشطون')}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardMetrics.activeCandidates.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% {t('common.thisMonth', 'هذا الشهر')}
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={cn('border-l-4 border-l-green-500', isArabic ? 'border-r-4 border-r-green-500 border-l-0' : '')}>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">
                  {t('metrics.openPositions', 'الوظائف المفتوحة')}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardMetrics.openPositions.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <Target className="w-4 h-4 mr-1" />
                  +8% {t('common.thisWeek', 'هذا الأسبوع')}
                </p>
              </div>
              <Briefcase className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={cn('border-l-4 border-l-purple-500', isArabic ? 'border-r-4 border-r-purple-500 border-l-0' : '')}>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">
                  {t('metrics.hiresThisMonth', 'عمليات التوظيف هذا الشهر')}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardMetrics.hiresThisMonth}
                </p>
                <p className="text-sm text-purple-600 flex items-center mt-1">
                  <UserCheck className="w-4 h-4 mr-1" />
                  +15% {t('common.vsLastMonth', 'مقارنة بالشهر الماضي')}
                </p>
              </div>
              <UserPlus className="w-12 h-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={cn('border-l-4 border-l-orange-500', isArabic ? 'border-r-4 border-r-orange-500 border-l-0' : '')}>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">
                  {t('metrics.averageTimeToHire', 'متوسط وقت التوظيف')}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardMetrics.averageTimeToHire} {t('metrics.days', 'يوم')}
                </p>
                <p className="text-sm text-orange-600 flex items-center mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  -3 {t('common.days', 'أيام')} {t('common.improved', 'تحسن')}
                </p>
              </div>
              <Clock className="w-12 h-12 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
            <Zap className="w-5 h-5 mr-2" />
            {t('actions.title', 'الإجراءات السريعة')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className={cn('h-auto p-4 justify-start', isArabic ? 'justify-end' : '')}
            >
              <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                <Plus className="w-5 h-5 mr-3" />
                <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                  <p className="font-medium">{t('actions.addPosition', 'إضافة وظيفة جديدة')}</p>
                  <p className="text-sm text-gray-500">{t('actions.addPositionDesc', 'إنشاء وظيفة جديدة مع التكامل مع قوى')}</p>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className={cn('h-auto p-4 justify-start', isArabic ? 'justify-end' : '')}
            >
              <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                <Eye className="w-5 h-5 mr-3" />
                <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                  <p className="font-medium">{t('actions.reviewCVs', 'مراجعة السير الذاتية')}</p>
                  <p className="text-sm text-gray-500">{t('actions.reviewCVsDesc', 'مراجعة السير الذاتية المقدمة')}</p>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className={cn('h-auto p-4 justify-start', isArabic ? 'justify-end' : '')}
            >
              <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                <UserPlus className="w-5 h-5 mr-3" />
                <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                  <p className="font-medium">{t('actions.onboardEmployee', 'إعداد موظف جديد')}</p>
                  <p className="text-sm text-gray-500">{t('actions.onboardEmployeeDesc', 'بدء عملية إعداد موظف جديد')}</p>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className={cn('h-auto p-4 justify-start', isArabic ? 'justify-end' : '')}
            >
              <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                <FileText className="w-5 h-5 mr-3" />
                <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                  <p className="font-medium">{t('actions.createJobOffer', 'إنشاء عرض عمل')}</p>
                  <p className="text-sm text-gray-500">{t('actions.createJobOfferDesc', 'إنشاء عرض عمل شامل مع سير عمل الموافقة')}</p>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className={cn('h-auto p-4 justify-start', isArabic ? 'justify-end' : '')}
            >
              <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                <BarChart3 className="w-5 h-5 mr-3" />
                <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                  <p className="font-medium">{t('actions.recruitmentReports', 'تقارير التوظيف')}</p>
                  <p className="text-sm text-gray-500">{t('actions.recruitmentReportsDesc', 'عرض تقارير وتحليلات التوظيف')}</p>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className={cn('h-auto p-4 justify-start', isArabic ? 'justify-end' : '')}
            >
              <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                <MessageSquare className="w-5 h-5 mr-3" />
                <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                  <p className="font-medium">{t('actions.communicationHub', 'مركز الاتصالات')}</p>
                  <p className="text-sm text-gray-500">{t('actions.communicationHubDesc', 'إدارة الاتصالات مع المرشحين والوكلاء')}</p>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                <Globe className="w-5 h-5 mr-2" />
                {t('dashboard.platformStatus', 'حالة المنصات')}
              </div>
              <Badge variant="outline">
                {dashboardMetrics.platformsActive}/{dashboardMetrics.platformsTotal} {t('common.active', 'نشط')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {localPlatforms.slice(0, 5).map((platform) => (
                <div key={platform.id} className={cn('flex items-center justify-between p-3 bg-gray-50 rounded-lg', isArabic ? 'flex-row-reverse' : '')}>
                  <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                    <div className={cn('w-3 h-3 rounded-full mr-3', 
                      platform.status === 'active' ? 'bg-green-500' : 
                      platform.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                    )} />
                    <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                      <p className="font-medium">{isArabic ? platform.nameAr : platform.name}</p>
                      <p className="text-sm text-gray-500">{platform.activeJobs.toLocaleString()} {t('common.jobs', 'وظيفة')}</p>
                    </div>
                  </div>
                  <StatusBadge status={platform.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                <Globe2 className="w-5 h-5 mr-2" />
                {t('dashboard.internationalAgents', 'الوكلاء الدوليون')}
              </div>
              <Badge variant="outline">
                {dashboardMetrics.internationalAgents} {t('common.agents', 'وكيل')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {internationalClusters.map((cluster) => (
                <div key={cluster.id} className={cn('flex items-center justify-between p-3 bg-gray-50 rounded-lg', isArabic ? 'flex-row-reverse' : '')}>
                  <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-3" />
                    <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                      <p className="font-medium">{isArabic ? cluster.nameAr : cluster.name}</p>
                      <p className="text-sm text-gray-500">{cluster.agents} {t('common.agents', 'وكيل')} • {cluster.candidates} {t('common.candidates', 'مرشح')}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {cluster.successRate}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Local Platforms Tab Component
  const LocalPlatformsTab = () => (
    <div dir={direction} className={cn('space-y-6', isArabic ? 'text-right' : 'text-left')}>
      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">{t('platforms.totalPlatforms', 'إجمالي المنصات')}</p>
                <p className="text-3xl font-bold text-gray-900">{localPlatforms.length}</p>
              </div>
              <Building className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">{t('platforms.activePlatforms', 'المنصات النشطة')}</p>
                <p className="text-3xl font-bold text-green-600">
                  {localPlatforms.filter(p => p.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">{t('platforms.uptime', 'وقت التشغيل')}</p>
                <p className="text-3xl font-bold text-blue-600">
                  {((localPlatforms.filter(p => p.status === 'active').length / localPlatforms.length) * 100).toFixed(1)}%
                </p>
              </div>
              <Activity className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform List */}
      <Card>
        <CardHeader>
          <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
            <CardTitle className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
              <Globe className="w-5 h-5 mr-2" />
              {t('platforms.saudiPlatforms', 'المنصات السعودية')}
            </CardTitle>
            <div className={cn('flex items-center space-x-2', isArabic ? 'space-x-reverse' : '')}>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('common.refresh', 'تحديث')}
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                {t('common.filter', 'تصفية')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {localPlatforms.map((platform) => (
              <div key={platform.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
                  <div className={cn('flex items-center space-x-4', isArabic ? 'space-x-reverse' : '')}>
                    <div className={cn('w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg')}>
                      {(isArabic ? platform.nameAr : platform.name).charAt(0)}
                    </div>
                    <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                      <h3 className="font-semibold text-lg">{isArabic ? platform.nameAr : platform.name}</h3>
                      <p className="text-gray-600">{isArabic ? platform.descriptionAr : platform.description}</p>
                      <div className={cn('flex items-center space-x-4 mt-2', isArabic ? 'space-x-reverse' : '')}>
                        <span className="text-sm text-gray-500">
                          {platform.activeJobs.toLocaleString()} {t('common.jobs', 'وظيفة')}
                        </span>
                        <span className="text-sm text-gray-500">
                          {platform.candidates.toLocaleString()} {t('common.candidates', 'مرشح')}
                        </span>
                        <span className="text-sm text-gray-500">
                          {isArabic ? platform.categoryAr : platform.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={cn('flex items-center space-x-3', isArabic ? 'space-x-reverse' : '')}>
                    <div className={cn('text-right', isArabic ? 'text-left' : '')}>
                      <StatusBadge status={platform.status} />
                      <p className="text-xs text-gray-500 mt-1">
                        {t('platforms.lastSync', 'آخر مزامنة')}: {platform.lastSync.toLocaleTimeString()}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className={cn('w-2 h-2 rounded-full mr-1', 
                          platform.apiStatus === 'connected' ? 'bg-green-500' : 
                          platform.apiStatus === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                        )} />
                        <span className="text-xs text-gray-500">API {platform.apiStatus}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={platform.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                
                {/* Compliance Score */}
                <div className="mt-4 pt-4 border-t">
                  <div className={cn('flex items-center justify-between mb-2', isArabic ? 'flex-row-reverse' : '')}>
                    <span className="text-sm font-medium">{t('platforms.complianceScore', 'نتيجة الامتثال')}</span>
                    <span className="text-sm font-bold">{platform.compliance}%</span>
                  </div>
                  <Progress value={platform.compliance} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // International Agents Tab Component
  const InternationalAgentsTab = () => (
    <div dir={direction} className={cn('space-y-6', isArabic ? 'text-right' : 'text-left')}>
      {/* International Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">{t('international.totalClusters', 'إجمالي المجموعات')}</p>
                <p className="text-3xl font-bold text-gray-900">{internationalClusters.length}</p>
              </div>
              <Globe2 className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">{t('international.totalAgents', 'إجمالي الوكلاء')}</p>
                <p className="text-3xl font-bold text-blue-600">
                  {internationalClusters.reduce((sum, cluster) => sum + cluster.agents, 0)}
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">{t('international.totalCandidates', 'إجمالي المرشحين')}</p>
                <p className="text-3xl font-bold text-green-600">
                  {internationalClusters.reduce((sum, cluster) => sum + cluster.candidates, 0).toLocaleString()}
                </p>
              </div>
              <UserCheck className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">{t('international.avgSuccessRate', 'متوسط معدل النجاح')}</p>
                <p className="text-3xl font-bold text-purple-600">
                  {(internationalClusters.reduce((sum, cluster) => sum + cluster.successRate, 0) / internationalClusters.length).toFixed(1)}%
                </p>
              </div>
              <Award className="w-12 h-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* International Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {internationalClusters.map((cluster) => (
          <Card key={cluster.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
                <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                  <Globe2 className="w-5 h-5 mr-2" />
                  {isArabic ? cluster.nameAr : cluster.name}
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {cluster.successRate}% {t('common.success', 'نجاح')}
                </Badge>
              </CardTitle>
              <CardDescription className={cn(isArabic ? 'text-right' : 'text-left')}>
                {isArabic ? cluster.regionAr : cluster.region}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Cluster Statistics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className={cn('text-center', isArabic ? 'text-right' : 'text-left')}>
                    <p className="text-2xl font-bold text-blue-600">{cluster.agents}</p>
                    <p className="text-sm text-gray-600">{t('international.agents', 'وكيل')}</p>
                  </div>
                  <div className={cn('text-center', isArabic ? 'text-right' : 'text-left')}>
                    <p className="text-2xl font-bold text-green-600">{cluster.candidates}</p>
                    <p className="text-sm text-gray-600">{t('international.candidates', 'مرشح')}</p>
                  </div>
                  <div className={cn('text-center', isArabic ? 'text-right' : 'text-left')}>
                    <p className="text-2xl font-bold text-purple-600">{cluster.costPerHire}</p>
                    <p className="text-sm text-gray-600">{t('international.costPerHire', 'تكلفة التوظيف')}</p>
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <h4 className="font-medium mb-2">{t('international.specializations', 'التخصصات')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {(isArabic ? cluster.specializationsAr : cluster.specializations).map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Platform Links */}
                <div>
                  <h4 className="font-medium mb-2">{t('international.platforms', 'المنصات')}</h4>
                  <div className="space-y-2">
                    {cluster.platforms.map((platform, index) => (
                      <div key={index} className={cn('flex items-center justify-between p-2 bg-gray-50 rounded', isArabic ? 'flex-row-reverse' : '')}>
                        <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                          <div className={cn('w-2 h-2 rounded-full mr-2', 
                            platform.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                          )} />
                          <span className="text-sm font-medium">{platform.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={platform.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="pt-4 border-t">
                  <div className={cn('flex items-center justify-between text-sm', isArabic ? 'flex-row-reverse' : '')}>
                    <span className="text-gray-600">{t('international.avgResponseTime', 'متوسط وقت الاستجابة')}</span>
                    <span className="font-medium">{cluster.averageResponseTime}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Communication Hub Tab Component
  const CommunicationHubTab = () => (
    <div dir={direction} className={cn('space-y-6', isArabic ? 'text-right' : 'text-left')}>
      {/* Communication Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">{t('communication.activeChats', 'المحادثات النشطة')}</p>
                <p className="text-3xl font-bold text-blue-600">{dashboardMetrics.activeConversations}</p>
              </div>
              <MessageSquare className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">{t('communication.responseRate', 'معدل الاستجابة')}</p>
                <p className="text-3xl font-bold text-green-600">{dashboardMetrics.responseRate}%</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">{t('communication.avgResponse', 'متوسط الاستجابة')}</p>
                <p className="text-3xl font-bold text-orange-600">2.3h</p>
              </div>
              <Clock className="w-12 h-12 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communication Hub Interface */}
      <Card>
        <CardHeader>
          <CardTitle className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
            <MessageSquare className="w-5 h-5 mr-2" />
            {t('communication.title', 'مركز الاتصالات المركزي')}
          </CardTitle>
          <CardDescription>
            {t('communication.subtitle', 'رسائل فورية مع مراقبة الامتثال')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Conversations */}
            <div className="lg:col-span-2">
              <h3 className="font-medium mb-4">{t('communication.recentConversations', 'المحادثات الأخيرة')}</h3>
              <div className="space-y-3">
                {[
                  { name: 'أحمد محمد', platform: 'LinkedIn', time: '5 دقائق', status: 'online', message: 'مهتم بوظيفة مطور البرمجيات' },
                  { name: 'Sarah Johnson', platform: 'Bayt.com', time: '12 دقيقة', status: 'away', message: 'Can you provide more details about the position?' },
                  { name: 'محمد العلي', platform: 'Qiwa', time: '25 دقيقة', status: 'offline', message: 'أرغب في التقديم على الوظيفة' },
                  { name: 'Priya Sharma', platform: 'Naukrigulf', time: '1 ساعة', status: 'online', message: 'Thank you for considering my application' },
                  { name: 'عبدالله الراشد', platform: 'GulfTalent', time: '2 ساعة', status: 'away', message: 'متى يمكنني إجراء المقابلة؟' }
                ].map((conversation, index) => (
                  <div key={index} className={cn('flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer', isArabic ? 'flex-row-reverse' : '')}>
                    <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {conversation.name.charAt(0)}
                        </div>
                        <div className={cn('absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white',
                          conversation.status === 'online' ? 'bg-green-500' :
                          conversation.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                        )} />
                      </div>
                      <div className={cn('ml-3', isArabic ? 'mr-3 ml-0 text-right' : 'text-left')}>
                        <p className="font-medium">{conversation.name}</p>
                        <p className="text-sm text-gray-600 truncate max-w-xs">{conversation.message}</p>
                        <p className="text-xs text-gray-500">{conversation.platform} • {conversation.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Alerts */}
            <div>
              <h3 className="font-medium mb-4">{t('communication.complianceAlerts', 'تنبيهات الامتثال')}</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">
                      {t('compliance.allClear', 'جميع المحادثات متوافقة')}
                    </span>
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-yellow-800">
                      {t('compliance.reviewRequired', 'مراجعة مطلوبة')}
                    </span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">
                    {t('compliance.reviewMessage', '3 محادثات تحتاج مراجعة يدوية')}
                  </p>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                    <Info className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-800">
                      {t('compliance.autoArchived', 'أرشفة تلقائية')}
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    {t('compliance.archivedMessage', '15 محادثة تم أرشفتها تلقائياً')}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 space-y-2">
                <Button className="w-full" variant="outline">
                  <Send className="w-4 h-4 mr-2" />
                  {t('communication.newMessage', 'رسالة جديدة')}
                </Button>
                <Button className="w-full" variant="outline">
                  <Archive className="w-4 h-4 mr-2" />
                  {t('communication.viewArchive', 'عرض الأرشيف')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Compliance Tab Component
  const ComplianceTab = () => (
    <div dir={direction} className={cn('space-y-6', isArabic ? 'text-right' : 'text-left')}>
      {/* Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
            <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
              <Shield className="w-5 h-5 mr-2" />
              {t('compliance.overview', 'نظرة عامة على الامتثال')}
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {t('compliance.overallScore', 'النتيجة الإجمالية')}: {dashboardMetrics.complianceScore}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceServices.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className={cn('flex items-center justify-between mb-3', isArabic ? 'flex-row-reverse' : '')}>
                    <h3 className="font-medium">{isArabic ? service.nameAr : service.name}</h3>
                    <StatusBadge status={service.status} />
                  </div>
                  
                  <div className="space-y-3">
                    {/* Score */}
                    <div>
                      <div className={cn('flex items-center justify-between mb-1', isArabic ? 'flex-row-reverse' : '')}>
                        <span className="text-sm text-gray-600">{t('compliance.score', 'النتيجة')}</span>
                        <span className="text-sm font-bold">{service.score}%</span>
                      </div>
                      <Progress value={service.score} className="h-2" />
                    </div>

                    {/* Issues */}
                    <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
                      <span className="text-sm text-gray-600">{t('compliance.issues', 'المشاكل')}</span>
                      <Badge variant={service.issues === 0 ? 'default' : service.issues <= 2 ? 'secondary' : 'destructive'}>
                        {service.issues}
                      </Badge>
                    </div>

                    {/* Last Check */}
                    <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
                      <span className="text-sm text-gray-600">{t('compliance.lastCheck', 'آخر فحص')}</span>
                      <span className="text-xs text-gray-500">{service.lastCheck.toLocaleTimeString()}</span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-500">
                      {isArabic ? service.descriptionAr : service.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Actions */}
      <Card>
        <CardHeader>
          <CardTitle className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
            <Settings className="w-5 h-5 mr-2" />
            {t('compliance.actions', 'إجراءات الامتثال')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className={cn('h-auto p-4 justify-start', isArabic ? 'justify-end' : '')}>
              <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                <RefreshCw className="w-5 h-5 mr-3" />
                <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                  <p className="font-medium">{t('compliance.runFullAudit', 'تشغيل تدقيق شامل')}</p>
                  <p className="text-sm text-gray-500">{t('compliance.runFullAuditDesc', 'فحص شامل لجميع الخدمات')}</p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className={cn('h-auto p-4 justify-start', isArabic ? 'justify-end' : '')}>
              <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                <Download className="w-5 h-5 mr-3" />
                <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                  <p className="font-medium">{t('compliance.downloadReport', 'تحميل التقرير')}</p>
                  <p className="text-sm text-gray-500">{t('compliance.downloadReportDesc', 'تقرير الامتثال الشامل')}</p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className={cn('h-auto p-4 justify-start', isArabic ? 'justify-end' : '')}>
              <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                <Bell className="w-5 h-5 mr-3" />
                <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                  <p className="font-medium">{t('compliance.configureAlerts', 'تكوين التنبيهات')}</p>
                  <p className="text-sm text-gray-500">{t('compliance.configureAlertsDesc', 'إعداد تنبيهات الامتثال')}</p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className={cn('h-auto p-4 justify-start', isArabic ? 'justify-end' : '')}>
              <div className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
                <FileText className="w-5 h-5 mr-3" />
                <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                  <p className="font-medium">{t('compliance.viewHistory', 'عرض السجل')}</p>
                  <p className="text-sm text-gray-500">{t('compliance.viewHistoryDesc', 'سجل تدقيق الامتثال')}</p>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Analytics Tab Component
  const AnalyticsTab = () => (
    <div dir={direction} className={cn('space-y-6', isArabic ? 'text-right' : 'text-left')}>
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">{t('analytics.totalApplications', 'إجمالي الطلبات')}</p>
                <p className="text-3xl font-bold text-blue-600">15,847</p>
                <p className="text-sm text-green-600">+23% {t('common.thisMonth', 'هذا الشهر')}</p>
              </div>
              <FileText className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">{t('analytics.interviewsScheduled', 'المقابلات المجدولة')}</p>
                <p className="text-3xl font-bold text-green-600">1,234</p>
                <p className="text-sm text-green-600">+18% {t('common.thisWeek', 'هذا الأسبوع')}</p>
              </div>
              <Calendar className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">{t('analytics.offersSent', 'العروض المرسلة')}</p>
                <p className="text-3xl font-bold text-purple-600">456</p>
                <p className="text-sm text-purple-600">+31% {t('common.thisMonth', 'هذا الشهر')}</p>
              </div>
              <Send className="w-12 h-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
              <div className={cn(isArabic ? 'text-right' : 'text-left')}>
                <p className="text-sm font-medium text-gray-600">{t('analytics.acceptanceRate', 'معدل القبول')}</p>
                <p className="text-3xl font-bold text-orange-600">78.5%</p>
                <p className="text-sm text-orange-600">+5.2% {t('common.improvement', 'تحسن')}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance by Platform */}
      <Card>
        <CardHeader>
          <CardTitle className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
            <BarChart3 className="w-5 h-5 mr-2" />
            {t('analytics.performanceByPlatform', 'الأداء حسب المنصة')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {localPlatforms.slice(0, 8).map((platform) => (
              <div key={platform.id} className="space-y-2">
                <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
                  <span className="font-medium">{isArabic ? platform.nameAr : platform.name}</span>
                  <div className={cn('flex items-center space-x-4', isArabic ? 'space-x-reverse' : '')}>
                    <span className="text-sm text-gray-600">{platform.candidates.toLocaleString()} {t('common.candidates', 'مرشح')}</span>
                    <span className="text-sm font-bold">{platform.compliance}%</span>
                  </div>
                </div>
                <Progress value={platform.compliance} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* International Performance */}
      <Card>
        <CardHeader>
          <CardTitle className={cn('flex items-center', isArabic ? 'flex-row-reverse' : '')}>
            <Globe2 className="w-5 h-5 mr-2" />
            {t('analytics.internationalPerformance', 'الأداء الدولي')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {internationalClusters.map((cluster) => (
              <div key={cluster.id} className="p-4 border rounded-lg">
                <div className={cn('flex items-center justify-between mb-3', isArabic ? 'flex-row-reverse' : '')}>
                  <h3 className="font-medium">{isArabic ? cluster.nameAr : cluster.name}</h3>
                  <Badge variant="outline">{cluster.successRate}%</Badge>
                </div>
                <div className="space-y-2">
                  <div className={cn('flex justify-between text-sm', isArabic ? 'flex-row-reverse' : '')}>
                    <span className="text-gray-600">{t('analytics.agents', 'الوكلاء')}</span>
                    <span className="font-medium">{cluster.agents}</span>
                  </div>
                  <div className={cn('flex justify-between text-sm', isArabic ? 'flex-row-reverse' : '')}>
                    <span className="text-gray-600">{t('analytics.candidates', 'المرشحين')}</span>
                    <span className="font-medium">{cluster.candidates}</span>
                  </div>
                  <div className={cn('flex justify-between text-sm', isArabic ? 'flex-row-reverse' : '')}>
                    <span className="text-gray-600">{t('analytics.costPerHire', 'تكلفة التوظيف')}</span>
                    <span className="font-medium">{cluster.costPerHire}</span>
                  </div>
                  <div className={cn('flex justify-between text-sm', isArabic ? 'flex-row-reverse' : '')}>
                    <span className="text-gray-600">{t('analytics.responseTime', 'وقت الاستجابة')}</span>
                    <span className="font-medium">{cluster.averageResponseTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <RTLMainLayout currentPage="recruitment">
      <div dir={direction} className={cn('space-y-6', isArabic ? 'text-right' : 'text-left')}>
        {/* Page Header */}
        <div className={cn('flex items-center justify-between', isArabic ? 'flex-row-reverse' : '')}>
          <div className={cn(isArabic ? 'text-right' : 'text-left')}>
            <h1 className={cn('text-3xl font-bold text-gray-900', isArabic ? 'font-cairo' : 'font-sans')}>
              {t('recruitment.title', 'التوظيف والإعداد')}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('recruitment.subtitle', 'إدارة شاملة لعمليات التوظيف والإعداد مع التكامل مع المراجع السعودية')}
            </p>
          </div>
          <div className={cn('flex items-center space-x-3', isArabic ? 'space-x-reverse' : '')}>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              {t('common.export', 'تصدير')}
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('recruitment.newPosition', 'وظيفة جديدة')}
            </Button>
          </div>
        </div>

        {/* Enhanced Tabs with RTL Support */}
        <Tabs value={activeTab} onValueChange={setActiveTab} dir={direction}>
          <TabsList className={cn('grid w-full grid-cols-6', isArabic ? 'text-right' : 'text-left')}>
            <TabsTrigger value="dashboard" className={cn(isArabic ? 'font-cairo' : 'font-sans')}>
              {t('recruitment.dashboard', 'لوحة التحكم')}
            </TabsTrigger>
            <TabsTrigger value="localPlatforms" className={cn(isArabic ? 'font-cairo' : 'font-sans')}>
              {t('recruitment.localPlatforms', 'المنصات المحلية')}
            </TabsTrigger>
            <TabsTrigger value="internationalAgents" className={cn(isArabic ? 'font-cairo' : 'font-sans')}>
              {t('recruitment.internationalAgents', 'الوكلاء الدوليون')}
            </TabsTrigger>
            <TabsTrigger value="communicationHub" className={cn(isArabic ? 'font-cairo' : 'font-sans')}>
              {t('recruitment.communicationHub', 'مركز الاتصالات')}
            </TabsTrigger>
            <TabsTrigger value="compliance" className={cn(isArabic ? 'font-cairo' : 'font-sans')}>
              {t('recruitment.compliance', 'الامتثال')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className={cn(isArabic ? 'font-cairo' : 'font-sans')}>
              {t('recruitment.analytics', 'التحليلات')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab />
          </TabsContent>

          <TabsContent value="localPlatforms">
            <LocalPlatformsTab />
          </TabsContent>

          <TabsContent value="internationalAgents">
            <InternationalAgentsTab />
          </TabsContent>

          <TabsContent value="communicationHub">
            <CommunicationHubTab />
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </RTLMainLayout>
  );
};

export default RecruitmentOnboardingRTL;

