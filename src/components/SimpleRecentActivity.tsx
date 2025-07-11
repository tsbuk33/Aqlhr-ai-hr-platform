import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, CheckCircle, FileText, User } from "lucide-react";
import { useSimpleLanguage } from "@/contexts/SimpleLanguageContext";

export function SimpleRecentActivity() {
  const { isArabic } = useSimpleLanguage();

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className={`text-lg font-semibold text-foreground flex items-center gap-2 ${isArabic ? 'flex-row-reverse text-right' : ''}`}>
          <Clock className="h-5 w-5 text-muted-foreground" />
          {isArabic ? 'الأنشطة الأخيرة' : 'Recent Activities'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Activity 1 */}
        <div className={`flex items-start gap-4 p-3 rounded-lg hover:bg-surface-secondary/50 transition-colors ${isArabic ? 'flex-row-reverse' : ''}`}>
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-status-success" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className={`flex items-start justify-between gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-1 ${isArabic ? 'text-right' : ''}`}>
                {isArabic ? (
                  <>
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      أحمد الراشد أكمل تقييم الأداء
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      تم تقديم تقييم الأداء للربع الرابع 2024
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      Ahmed Al-Rashid completed performance review
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      Performance evaluation submitted for Q4 2024
                    </p>
                  </>
                )}
              </div>
              <Badge variant="default" className="text-xs">
                {isArabic ? 'الأداء' : 'Performance'}
              </Badge>
            </div>
            
            <div className={`flex items-center justify-between mt-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs bg-gradient-primary text-white">
                    AR
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">Ahmed Al-Rashid</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {isArabic ? 'منذ ساعتين' : '2 hours ago'}
              </span>
            </div>
          </div>
        </div>

        {/* Activity 2 */}
        <div className={`flex items-start gap-4 p-3 rounded-lg hover:bg-surface-secondary/50 transition-colors ${isArabic ? 'flex-row-reverse' : ''}`}>
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center">
              <User className="h-4 w-4 text-status-info" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className={`flex items-start justify-between gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-1 ${isArabic ? 'text-right' : ''}`}>
                {isArabic ? (
                  <>
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      موظفة جديدة فاطمة الزهراء تم إدخالها
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      تم إنشاء ملف الموظفة والتحقق من الوثائق
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      New employee Fatima Al-Zahra onboarded
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      Employee profile created and documents verified
                    </p>
                  </>
                )}
              </div>
              <Badge variant="secondary" className="text-xs">
                {isArabic ? 'الإدخال' : 'Onboarding'}
              </Badge>
            </div>
            
            <div className={`flex items-center justify-between mt-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs bg-gradient-primary text-white">
                    FZ
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">Fatima Al-Zahra</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {isArabic ? 'منذ 4 ساعات' : '4 hours ago'}
              </span>
            </div>
          </div>
        </div>

        {/* Activity 3 */}
        <div className={`flex items-start gap-4 p-3 rounded-lg hover:bg-surface-secondary/50 transition-colors ${isArabic ? 'flex-row-reverse' : ''}`}>
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center">
              <FileText className="h-4 w-4 text-brand-primary" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className={`flex items-start justify-between gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-1 ${isArabic ? 'text-right' : ''}`}>
                {isArabic ? (
                  <>
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      تمت معالجة الرواتب لـ <span className="number-display">2,847</span> موظف
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      تم إكمال رواتب ديسمبر 2024 بنجاح
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      Payroll processed for 2,847 employees
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      December 2024 payroll successfully completed
                    </p>
                  </>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {isArabic ? 'الرواتب' : 'Payroll'}
              </Badge>
            </div>
            
            <div className={`flex items-center justify-between mt-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs bg-gradient-primary text-white">
                    SY
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {isArabic ? 'النظام' : 'System'}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {isArabic ? 'منذ يوم واحد' : '1 day ago'}
              </span>
            </div>
          </div>
        </div>

        {/* Activity 4 */}
        <div className={`flex items-start gap-4 p-3 rounded-lg hover:bg-surface-secondary/50 transition-colors ${isArabic ? 'flex-row-reverse' : ''}`}>
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-status-success" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className={`flex items-start justify-between gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-1 ${isArabic ? 'text-right' : ''}`}>
                {isArabic ? (
                  <>
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      إتمام برنامج التدريب
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      دورة تطوير القيادة - <span className="number-display">25</span> مشارك
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      Training program completion
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      Leadership Development Course - 25 participants
                    </p>
                  </>
                )}
              </div>
              <Badge variant="destructive" className="text-xs">
                {isArabic ? 'التدريب' : 'Training'}
              </Badge>
            </div>
            
            <div className={`flex items-center justify-between mt-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs bg-gradient-primary text-white">
                    TD
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {isArabic ? 'قسم التدريب' : 'Training Dept'}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {isArabic ? 'منذ يومين' : '2 days ago'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-center pt-2">
          <button className="text-sm text-brand-primary hover:text-brand-primary-light font-medium transition-colors">
            {isArabic ? 'عرض جميع الأنشطة ←' : 'View all activities →'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}