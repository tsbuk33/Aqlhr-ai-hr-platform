import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, CheckCircle, FileText, User } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "performance",
    title: "Ahmed Al-Rashid completed performance review",
    description: "Performance evaluation submitted for Q4 2024",
    time: "2 hours ago",
    icon: CheckCircle,
    iconColor: "text-status-success",
    user: "Ahmed Al-Rashid",
    userAvatar: "AR"
  },
  {
    id: 2,
    type: "onboarding",
    title: "New employee Fatima Al-Zahra onboarded",
    description: "Employee profile created and documents verified",
    time: "4 hours ago",
    icon: User,
    iconColor: "text-status-info",
    user: "Fatima Al-Zahra",
    userAvatar: "FZ"
  },
  {
    id: 3,
    type: "payroll",
    title: "Payroll processed for 2,847 employees",
    description: "December 2024 payroll successfully completed",
    time: "1 day ago",
    icon: FileText,
    iconColor: "text-brand-primary",
    user: "System",
    userAvatar: "SY"
  },
  {
    id: 4,
    type: "training",
    title: "Training program completion",
    description: "Leadership Development Course - 25 participants",
    time: "2 days ago",
    icon: CheckCircle,
    iconColor: "text-status-success",
    user: "Training Dept",
    userAvatar: "TD"
  }
];

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
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-secondary/50 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center">
                <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {activity.description}
                  </p>
                </div>
                <Badge variant={getActivityBadgeVariant(activity.type)} className="text-xs">
                  {activity.type}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={`/avatar-${activity.userAvatar.toLowerCase()}.jpg`} />
                    <AvatarFallback className="text-xs bg-gradient-primary text-white">
                      {activity.userAvatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{activity.user}</span>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="text-center pt-2">
          <button className="text-sm text-brand-primary hover:text-brand-primary-light font-medium transition-colors">
            View all activities →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}