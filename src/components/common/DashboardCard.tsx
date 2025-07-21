import { useLanguage } from "@/hooks/useLanguageCompat";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  subtitle: string;
  value: string | number;
  icon: ReactNode;
}

// Dashboard Cards - CENTERED
const DashboardCard = ({ title, subtitle, value, icon }: DashboardCardProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <Card className={`dashboard-card ${isArabic ? 'rtl' : 'ltr'}`}>
      <CardContent className="text-center p-6">
        <div className="card-icon text-center mb-4">
          {icon}
        </div>
        <h3 className="card-title text-center font-semibold mb-2">
          {title}
        </h3>
        <p className="card-subtitle text-center text-sm text-muted-foreground mb-3">
          {subtitle}
        </p>
        <div className="card-value text-center text-2xl font-bold">
          {value}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;