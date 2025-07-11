import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, CheckCircle, FileText, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t, isRTL } = useLanguage();

  const activities = [
    {
      id: 1,
      type: "performance",
      titleKey: "activities.ahmed_performance_title",
      descriptionKey: "activities.ahmed_performance_desc",
      timeKey: "activities.2_hours_ago",
      icon: CheckCircle,
      iconColor: "text-status-success",
      user: "Ahmed Al-Rashid",
      userAvatar: "AR"
    },
    {
      id: 2,
      type: "onboarding",
      titleKey: "activities.fatima_onboarding_title",
      descriptionKey: "activities.fatima_onboarding_desc",
      timeKey: "activities.4_hours_ago",
      icon: User,
      iconColor: "text-status-info",
      user: "Fatima Al-Zahra",
      userAvatar: "FZ"
    },
    {
      id: 3,
      type: "payroll",
      titleKey: "activities.payroll_processed_title",
      descriptionKey: "activities.payroll_processed_desc",
      timeKey: "activities.1_day_ago",
      icon: FileText,
      iconColor: "text-brand-primary",
      userKey: "activities.system",
      userAvatar: "SY"
    },
    {
      id: 4,
      type: "training",
      titleKey: "activities.training_completion_title",
      descriptionKey: "activities.training_completion_desc",
      timeKey: "activities.2_days_ago",
      icon: CheckCircle,
      iconColor: "text-status-success",
      userKey: "activities.training_dept",
      userAvatar: "TD"
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className={`text-lg font-semibold text-foreground flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
          <Clock className="h-5 w-5 text-muted-foreground" />
          {t('activities.recent_activities')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className={`flex items-start gap-4 p-3 rounded-lg hover:bg-surface-secondary/50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center">
                <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className={`flex items-start justify-between gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {t(activity.titleKey)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {t(activity.descriptionKey)}
                  </p>
                </div>
                <Badge variant={getActivityBadgeVariant(activity.type)} className="text-xs">
                  {t(`activities.${activity.type}`)}
                </Badge>
              </div>
              
              <div className={`flex items-center justify-between mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={`/avatar-${activity.userAvatar.toLowerCase()}.jpg`} />
                    <AvatarFallback className="text-xs bg-gradient-primary text-white">
                      {activity.userAvatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {activity.userKey ? t(activity.userKey) : activity.user}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{t(activity.timeKey)}</span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="text-center pt-2">
          <button className="text-sm text-brand-primary hover:text-brand-primary-light font-medium transition-colors">
            {t('activities.view_all_activities')}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}