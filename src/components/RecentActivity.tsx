import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, CheckCircle, FileText, User } from "lucide-react";
import { useSimpleLanguage } from "@/contexts/SimpleLanguageContext";

const getActivityBadgeVariant = (type: string) => {
  switch (type) {
    case "performance": return "default";
    case "onboarding": return "secondary";  
    case "payroll": return "outline";
    case "training": return "destructive";
    default: return "default";
  }
};

export function RecentActivity() {
  const { isArabic } = useSimpleLanguage();

  const activities = [
    {
      id: 1,
      type: "performance",
      titleEn: "Ahmed Al-Rashid completed performance review",
      titleAr: "أحمد الراشد أكمل مراجعة الأداء",
      descriptionEn: "Performance evaluation submitted for Q4 2024",
      descriptionAr: "تم تقديم تقييم الأداء للربع الرابع 2024",
      timeEn: "2 hours ago",
      timeAr: "منذ ساعتين",
      icon: CheckCircle,
      iconColor: "text-green-500",
      userEn: "Ahmed Al-Rashid",
      userAr: "أحمد الراشد",
      userAvatar: "AR"
    },
    {
      id: 2,
      type: "onboarding",
      titleEn: "Fatima Al-Zahra started onboarding process",
      titleAr: "فاطمة الزهراء بدأت عملية التوجيه",
      descriptionEn: "New employee orientation and documentation setup",
      descriptionAr: "توجيه الموظف الجديد وإعداد الوثائق",
      timeEn: "4 hours ago",
      timeAr: "منذ 4 ساعات",
      icon: User,
      iconColor: "text-blue-500",
      userEn: "Fatima Al-Zahra",
      userAr: "فاطمة الزهراء",
      userAvatar: "FZ"
    },
    {
      id: 3,
      type: "payroll",
      titleEn: "Monthly payroll processed successfully",
      titleAr: "تم معالجة الراتب الشهري بنجاح",
      descriptionEn: "December 2024 payroll completed for all employees",
      descriptionAr: "اكتمل راتب ديسمبر 2024 لجميع الموظفين",
      timeEn: "1 day ago",
      timeAr: "منذ يوم واحد",
      icon: FileText,
      iconColor: "text-purple-500",
      userEn: "System",
      userAr: "النظام",
      userAvatar: "SY"
    },
    {
      id: 4,
      type: "training",
      titleEn: "Skills development training completed",
      titleAr: "اكتمل تدريب تطوير المهارات",
      descriptionEn: "Advanced Excel and data analysis course finished",
      descriptionAr: "انتهى دورة Excel المتقدم وتحليل البيانات",
      timeEn: "2 days ago",
      timeAr: "منذ يومين",
      icon: CheckCircle,
      iconColor: "text-green-500",
      userEn: "Training Department",
      userAr: "قسم التدريب",
      userAvatar: "TD"
    }
  ];

  const getBadgeText = (type: string) => {
    const badges = {
      performance: { en: "Performance", ar: "الأداء" },
      onboarding: { en: "Onboarding", ar: "التوجيه" },
      payroll: { en: "Payroll", ar: "الرواتب" },
      training: { en: "Training", ar: "التدريب" }
    };
    return isArabic ? badges[type as keyof typeof badges]?.ar || type : badges[type as keyof typeof badges]?.en || type;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className={`text-lg font-semibold text-foreground flex items-center gap-2 ${isArabic ? 'flex-row-reverse text-right' : ''}`}>
          <Clock className="h-5 w-5 text-muted-foreground" />
          {isArabic ? "الأنشطة الأخيرة" : "Recent Activities"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className={`flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors ${isArabic ? 'flex-row-reverse' : ''}`}>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className={`flex items-start justify-between gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-1 ${isArabic ? 'text-right' : ''}`}>
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {isArabic ? activity.titleAr : activity.titleEn}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {isArabic ? activity.descriptionAr : activity.descriptionEn}
                  </p>
                </div>
                <Badge variant={getActivityBadgeVariant(activity.type)} className="text-xs">
                  {getBadgeText(activity.type)}
                </Badge>
              </div>
              
              <div className={`flex items-center justify-between mt-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={`/avatar-${activity.userAvatar.toLowerCase()}.jpg`} />
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {activity.userAvatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {isArabic ? activity.userAr : activity.userEn}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground number-display">
                  {isArabic ? activity.timeAr : activity.timeEn}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="text-center pt-2">
          <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
            {isArabic ? "عرض جميع الأنشطة" : "View All Activities"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}