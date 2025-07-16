import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Users, Activity, Calendar, Upload, FileText } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useEnhancedFileUpload } from "@/hooks/useEnhancedFileUpload";
import { useCallback } from "react";

export const HSEDashboard = () => {
  const { language } = useLanguage();
  const { uploadFile, isUploading, uploadProgress } = useEnhancedFileUpload({
    platform: 'web',
    onFileProcessed: (file) => {
      console.log('HSE file processed:', file);
    }
  });

  const hseStats = [
    {
      title: "Days Without Incident",
      value: "247",
      icon: Shield,
      variant: "default" as const,
      trend: "+12% from last month"
    },
    {
      title: "Training Compliance",
      value: "95%",
      icon: Users,
      variant: "success" as const,
      trend: "+5% from last month"
    },
    {
      title: "Risk Level",
      value: "Low",
      icon: AlertTriangle,
      variant: "success" as const,
      trend: "Stable"
    },
    {
      title: "Active PPE",
      value: "1,234",
      icon: Activity,
      variant: "default" as const,
      trend: "+3% from last month"
    }
  ];

  const recentIncidents = [
    {
      id: "INC-001",
      type: "Near Miss",
      date: "2024-01-15",
      severity: "Low",
      status: "Closed"
    },
    {
      id: "INC-002", 
      type: "Minor Injury",
      date: "2024-01-10",
      severity: "Medium",
      status: "Under Investigation"
    }
  ];

  const upcomingTraining = [
    {
      course: "Fire Safety Training",
      date: "2024-01-20",
      participants: 25,
      mandatory: true
    },
    {
      course: "PPE Usage Workshop",
      date: "2024-01-25", 
      participants: 15,
      mandatory: false
    }
  ];

  return (
    <div className="space-y-6 p-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Health, Safety & Environment
        </h1>
        <p className="text-muted-foreground">
          Comprehensive workplace safety management and regulatory compliance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {hseStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Incidents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentIncidents.map((incident) => (
                    <div key={incident.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{incident.id}</div>
                        <div className="text-sm text-muted-foreground">{incident.type}</div>
                        <div className="text-xs text-muted-foreground">{incident.date}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={incident.severity === 'Low' ? 'default' : 'destructive'}>
                          {incident.severity}
                        </Badge>
                        <Badge variant="outline">
                          {incident.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Training
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTraining.map((training, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{training.course}</div>
                        <div className="text-sm text-muted-foreground">{training.date}</div>
                        <div className="text-xs text-muted-foreground">
                          {training.participants} participants
                        </div>
                      </div>
                      <div>
                        {training.mandatory && (
                          <Badge variant="destructive">
                            Mandatory
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Incident management system with full HRSD compliance and automated reporting.
            </AlertDescription>
          </Alert>
          <Card>
            <CardHeader>
              <CardTitle>Incident Management</CardTitle>
              <CardDescription>
                Report, investigate, and track workplace incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Incident management module will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Safety Training Management</CardTitle>
              <CardDescription>
                Manage safety training programs and certifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Training management module will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Compliance</CardTitle>
              <CardDescription>
                HRSD and Saudi Labor Law compliance tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Document Upload Section */}
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                <div className="text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      {language === 'ar' ? 'رفع وثائق السلامة والصحة المهنية' : 'Upload HSE Documents'}
                    </h4>
                    <p className="text-muted-foreground text-sm mb-4">
                      {language === 'ar' 
                        ? 'ارفع تقارير الحوادث، شهادات التدريب، وثائق تقييم المخاطر، وملفات الامتثال'
                        : 'Upload incident reports, training certificates, risk assessments, and compliance documents'
                      }
                    </p>
                  </div>
                  
                  <input
                    type="file"
                    id="hse-file-upload"
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        Array.from(files).forEach(file => {
                          uploadFile(file);
                        });
                      }
                    }}
                  />
                  
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('hse-file-upload')?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    {isUploading 
                      ? `${language === 'ar' ? 'جاري الرفع' : 'Uploading'} ${uploadProgress}%`
                      : (language === 'ar' ? 'اختر الملفات' : 'Choose Files')
                    }
                  </Button>
                  
                  <div className="text-xs text-muted-foreground">
                    {language === 'ar' 
                      ? 'تنسيقات مدعومة: PDF, Word, Excel, الصور (حتى 10MB لكل ملف)'
                      : 'Supported formats: PDF, Word, Excel, Images (up to 10MB per file)'
                    }
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm">
                {language === 'ar' 
                  ? 'وحدة إدارة الامتثال الكاملة ستكون متاحة هنا قريباً.'
                  : 'Full compliance management module will be available here soon.'
                }
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};