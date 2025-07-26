import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";

const ExecutiveCompensation = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('consulting.executive_compensation')}</h1>
          <p className="text-muted-foreground">{t('consulting.executive_compensation_desc')}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Upload className="h-4 w-4 mr-2" />Upload Market Data</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export Analysis</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Percentile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">75th</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Executive Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pay Equity Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">96.8%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Retention Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">+18%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExecutiveCompensation;