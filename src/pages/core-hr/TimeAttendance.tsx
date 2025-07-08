import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const TimeAttendance = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('core_hr.time_attendance')}</h1>
        <p className="text-muted-foreground">{t('core_hr.time_attendance_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.todays_attendance')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">98.2%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.absher_integration')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">{t('core_hr.active')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.mobile_checkins')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">2,456</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.overtime_hours')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">234</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimeAttendance;