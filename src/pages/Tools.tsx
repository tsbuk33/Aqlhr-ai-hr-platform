import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { 
  MessageSquare, 
  FileText, 
  Calendar, 
  BarChart3, 
  GraduationCap, 
  Zap,
  Settings,
  Users,
  Cloud,
  Share2
} from 'lucide-react';
import ToolIntegrationManager from '@/components/tools/ToolIntegrationManager';

const Tools = () => {
  const { t, isRTL } = useLanguage();

  const toolCategories = [
    {
      title: 'Communication & Collaboration',
      description: 'Microsoft Teams, Slack, WhatsApp Business, Email Integration',
      icon: MessageSquare,
      count: 5,
      color: 'bg-blue-500',
      items: [
        'Microsoft Teams',
        'Slack', 
        'WhatsApp Business',
        'Outlook Integration',
        'Email Integration'
      ]
    },
    {
      title: 'Document Management',
      description: 'SharePoint, Google Drive, OneDrive, Dropbox, Digital Signatures',
      icon: FileText,
      count: 6,
      color: 'bg-green-500',
      items: [
        'SharePoint',
        'Google Drive',
        'OneDrive',
        'Dropbox',
        'DocuSign',
        'Adobe Sign'
      ]
    },
    {
      title: 'Calendar & Scheduling',
      description: 'Google Calendar, Outlook Calendar, Calendly, Room Booking',
      icon: Calendar,
      count: 4,
      color: 'bg-purple-500',
      items: [
        'Google Calendar',
        'Outlook Calendar',
        'Calendly',
        'Room Booking'
      ]
    },
    {
      title: 'Analytics & BI',
      description: 'Power BI, Tableau, Google Analytics, Custom Connectors',
      icon: BarChart3,
      count: 4,
      color: 'bg-orange-500',
      items: [
        'Power BI',
        'Tableau',
        'Google Analytics',
        'Custom Connectors'
      ]
    },
    {
      title: 'Learning & Development',
      description: 'LinkedIn Learning, Coursera Business, Udemy Business, Local Platforms',
      icon: GraduationCap,
      count: 4,
      color: 'bg-indigo-500',
      items: [
        'LinkedIn Learning',
        'Coursera Business',
        'Udemy Business',
        'Local Training Platforms'
      ]
    },
    {
      title: 'Automation Platforms',
      description: 'Zapier, Power Automate, Custom Workflows',
      icon: Zap,
      count: 3,
      color: 'bg-yellow-500',
      items: [
        'Zapier',
        'Power Automate',
        'Custom Workflows'
      ]
    }
  ];

  const totalTools = toolCategories.reduce((sum, category) => sum + category.count, 0);

  return (
    <div className={`container mx-auto p-6 space-y-8 max-w-6xl ${isRTL ? 'rtl' : 'ltr'}`}>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            {isRTL ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="management">
            {isRTL ? 'إدارة التكاملات' : 'Integration Management'}
          </TabsTrigger>
          <TabsTrigger value="documents">
            {isRTL ? 'إدارة الوثائق' : 'Document Management'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Tools</h1>
                <p className="text-muted-foreground">
                  {isRTL 
                    ? `${totalTools} أداة وتكامل متاح عبر 6 فئات` 
                    : `${totalTools} tools and integrations across 6 categories`}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Share2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalTools}</p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'إجمالي الأدوات' : 'Total Tools'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">6</p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'فئات التكامل' : 'Integration Categories'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Cloud className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">95%</p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'وقت التشغيل' : 'Uptime'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Settings className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">22</p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'التكاملات النشطة' : 'Active Integrations'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tools Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {category.count} {isRTL ? 'أدوات' : 'tools'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {category.description}
                    </CardDescription>
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Integration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {isRTL ? 'حالة التكامل' : 'Integration Status'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'نظرة عامة على حالة جميع عمليات التكامل والأدوات المتصلة'
                  : 'Overview of all connected integrations and tools status'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">18</div>
                  <div className="text-sm text-muted-foreground">
                    {isRTL ? 'متصل' : 'Connected'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">4</div>
                  <div className="text-sm text-muted-foreground">
                    {isRTL ? 'قيد الإعداد' : 'Configuring'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2</div>
                  <div className="text-sm text-muted-foreground">
                    {isRTL ? 'متاح' : 'Available'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground">0</div>
                  <div className="text-sm text-muted-foreground">
                    {isRTL ? 'غير متصل' : 'Disconnected'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="management">
          <ToolIntegrationManager companyId="default-company-id" />
        </TabsContent>

        <TabsContent value="documents">
          <UniversalDocumentManager
            moduleName={isRTL ? "أدوات التكامل" : "Integration Tools"}
            description={isRTL ? "إدارة وثائق التكاملات والأدوات" : "Manage integration and tool documentation"}
            platform="tools"
            moduleType="documents"
            acceptedTypes={['.pdf', '.doc', '.docx', '.txt', '.json', '.xml']}
            maxFileSize={15}
            maxFiles={50}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tools;