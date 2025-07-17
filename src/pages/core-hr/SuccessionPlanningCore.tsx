import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Upload, User, Star, TrendingUp, AlertCircle, Calendar, Camera } from "lucide-react";
import { AqlAIFileProcessor } from "@/components/aql/AqlAIFileProcessor";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";

const SuccessionPlanningCore = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const translations = {
    en: {
      succession_planning: "Succession Planning",
      succession_planning_desc: "Identify and develop talent for key leadership positions",
      key_positions: "Key Positions",
      ready_successors: "Ready Successors",
      succession_coverage: "Succession Coverage",
      risk_score: "Risk Score",
      successor_readiness: "Successor Readiness",
      nine_box_grid: "9-Box Grid",
      development_plans: "Development Plans",
      upload_photo: "Upload Photo",
      ready_now: "Ready Now",
      ready_1_2_years: "Ready in 1-2 Years",
      ready_3_5_years: "Ready in 3-5 Years",
      high_potential: "High Potential",
      solid_performer: "Solid Performer",
      development_needed: "Development Needed",
      performance: "Performance",
      potential: "Potential",
      readiness_level: "Readiness Level",
      skills_gap: "Skills Gap",
      development_priority: "Development Priority",
      succession_risk: "Succession Risk",
      add_successor: "Add Successor",
      critical_skills: "Critical Skills",
      leadership_skills: "Leadership Skills",
      technical_skills: "Technical Skills",
      update_photo: "Update Photo"
    },
    ar: {
      succession_planning: "تخطيط التعاقب الوظيفي",
      succession_planning_desc: "تحديد وتطوير المواهب للمناصب القيادية الرئيسية",
      key_positions: "المناصب الرئيسية",
      ready_successors: "الخلفاء المستعدون",
      succession_coverage: "تغطية التعاقب",
      risk_score: "درجة المخاطر",
      successor_readiness: "جاهزية الخلفاء",
      nine_box_grid: "شبكة التسعة مربعات",
      development_plans: "خطط التطوير",
      upload_photo: "تحميل الصورة",
      ready_now: "جاهز الآن",
      ready_1_2_years: "جاهز خلال 1-2 سنة",
      ready_3_5_years: "جاهز خلال 3-5 سنوات",
      high_potential: "إمكانات عالية",
      solid_performer: "أداء مستقر",
      development_needed: "يحتاج تطوير",
      performance: "الأداء",
      potential: "الإمكانات",
      readiness_level: "مستوى الجاهزية",
      skills_gap: "فجوة المهارات",
      development_priority: "أولوية التطوير",
      succession_risk: "مخاطر التعاقب",
      add_successor: "إضافة خليفة",
      critical_skills: "المهارات الحرجة",
      leadership_skills: "المهارات القيادية",
      technical_skills: "المهارات التقنية",
      update_photo: "تحديث الصورة"
    }
  };

  const t = (key: string) => translations[language][key] || key;

  const successors = [
    {
      id: 1,
      name: "Ahmed Al-Rashid",
      nameAr: "أحمد الراشد",
      position: "Senior Manager",
      positionAr: "مدير أول",
      department: "Operations",
      departmentAr: "العمليات",
      readiness: "ready_now",
      performance: 85,
      potential: 90,
      photo: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`,
      skills: {
        leadership: 85,
        technical: 78,
        strategic: 80
      },
      developmentNeeds: ["Strategic Planning", "Change Management"],
      riskLevel: "low"
    },
    {
      id: 2,
      name: "Fatima Al-Zahra",
      nameAr: "فاطمة الزهراني",
      position: "Team Lead",
      positionAr: "قائد فريق",
      department: "Finance",
      departmentAr: "المالية",
      readiness: "ready_1_2_years",
      performance: 78,
      potential: 85,
      photo: `https://images.unsplash.com/photo-1494790108755-2616b39ce457?w=150&h=150&fit=crop&crop=face`,
      skills: {
        leadership: 72,
        technical: 90,
        strategic: 68
      },
      developmentNeeds: ["Leadership Development", "Cross-functional Experience"],
      riskLevel: "medium"
    },
    {
      id: 3,
      name: "Omar Al-Mansouri",
      nameAr: "عمر المنصوري",
      position: "Project Manager",
      positionAr: "مدير مشروع",
      department: "IT",
      departmentAr: "تقنية المعلومات",
      readiness: "ready_3_5_years",
      performance: 82,
      potential: 88,
      photo: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
      skills: {
        leadership: 65,
        technical: 95,
        strategic: 60
      },
      developmentNeeds: ["Executive Presence", "Strategic Thinking", "Team Management"],
      riskLevel: "high"
    }
  ];

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case "ready_now": return "bg-success text-success-foreground";
      case "ready_1_2_years": return "bg-warning text-warning-foreground";
      case "ready_3_5_years": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-success";
      case "medium": return "text-warning";
      case "high": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const handlePhotoUpload = async (successorId: number, file: File) => {
    setUploadingPhoto(true);
    // Simulate photo upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUploadingPhoto(false);
    setSelectedFile(null);
  };

  const SuccessorCard = ({ successor }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={successor.photo} alt={successor.name} />
              <AvatarFallback>{successor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="outline"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              onClick={() => document.getElementById(`photo-${successor.id}`)?.click()}
            >
              <Camera className="h-3 w-3" />
            </Button>
            <input
              id={`photo-${successor.id}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handlePhotoUpload(successor.id, e.target.files[0]);
                }
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {language === 'ar' ? successor.nameAr : successor.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {language === 'ar' ? successor.positionAr : successor.position}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {language === 'ar' ? successor.departmentAr : successor.department}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t('readiness_level')}</span>
          <Badge className={getReadinessColor(successor.readiness)} variant="secondary">
            {t(successor.readiness)}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{t('performance')}</span>
            <span className="font-medium">{successor.performance}%</span>
          </div>
          <Progress value={successor.performance} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{t('potential')}</span>
            <span className="font-medium">{successor.potential}%</span>
          </div>
          <Progress value={successor.potential} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <span className="text-sm font-medium">{t('critical_skills')}</span>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>{t('leadership_skills')}</span>
              <span>{successor.skills.leadership}%</span>
            </div>
            <Progress value={successor.skills.leadership} className="h-1" />
            <div className="flex items-center justify-between text-xs">
              <span>{t('technical_skills')}</span>
              <span>{successor.skills.technical}%</span>
            </div>
            <Progress value={successor.skills.technical} className="h-1" />
            <div className="flex items-center justify-between text-xs">
              <span>Strategic</span>
              <span>{successor.skills.strategic}%</span>
            </div>
            <Progress value={successor.skills.strategic} className="h-1" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t('succession_risk')}</span>
          <div className="flex items-center space-x-1">
            <AlertCircle className={`h-4 w-4 ${getRiskColor(successor.riskLevel)}`} />
            <span className={`text-sm font-medium ${getRiskColor(successor.riskLevel)}`}>
              {successor.riskLevel.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <span className="text-sm font-medium">{t('development_priority')}</span>
          <div className="flex flex-wrap gap-1">
            {successor.developmentNeeds.map((need, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {need}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('succession_planning')}</h1>
        <p className="text-muted-foreground">{t('succession_planning_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('key_positions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('ready_successors')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('succession_coverage')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">57%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('risk_score')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">2.8/10</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="readiness" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="readiness">{t('successor_readiness')}</TabsTrigger>
          <TabsTrigger value="ninebox">{t('nine_box_grid')}</TabsTrigger>
          <TabsTrigger value="development">{t('development_plans')}</TabsTrigger>
          <TabsTrigger value="documents">{t('upload_documents') || 'Documents'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="readiness" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t('successor_readiness')}</h2>
            <Button>
              <User className="h-4 w-4 mr-2" />
              {t('add_successor')}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {successors.map((successor) => (
              <SuccessorCard key={successor.id} successor={successor} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="ninebox" className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">{t('nine_box_grid')}</h2>
            <p className="text-muted-foreground">
              Global 9-Box Grid methodology for succession planning assessment
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="h-32 flex items-center justify-center border-2 border-dashed">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    {i < 3 ? t('high_potential') : i < 6 ? t('solid_performer') : t('development_needed')}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {i % 3 === 0 ? 'Low' : i % 3 === 1 ? 'Medium' : 'High'} {t('performance')}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="development" className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">{t('development_plans')}</h2>
            <p className="text-muted-foreground">
              Individual development plans based on global HR best practices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {successors.map((successor) => (
              <Card key={successor.id}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={successor.photo} alt={successor.name} />
                      <AvatarFallback>{successor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {language === 'ar' ? successor.nameAr : successor.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? successor.positionAr : successor.position}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('development_priority')}</span>
                      <Badge className={getReadinessColor(successor.readiness)} variant="secondary">
                        {t(successor.readiness)}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {successor.developmentNeeds.map((need, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{need}</span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">6 months</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {t('upload_documents') || 'Upload Documents'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' ? 
                  'ارفع ملفات التعاقب الوظيفي والتطوير للمعالجة بالذكاء الاصطناعي' : 
                  'Upload succession planning and development files for AI processing'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AqlAIFileProcessor
                platform="succession-planning"
                moduleType="core-hr"
                onFileProcessed={(file) => {
                  toast({
                    title: language === 'ar' ? "تم معالجة الملف بنجاح" : "File processed successfully",
                    description: language === 'ar' ? 
                      `تم معالجة وتحليل ${file.name}.` : 
                      `${file.name} has been processed and analyzed.`,
                  });
                }}
                acceptedTypes={['.pdf', '.docx', '.xlsx', '.csv']}
                maxFileSize={10}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuccessionPlanningCore;