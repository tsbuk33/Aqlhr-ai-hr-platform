import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Consulting = () => {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('consulting.premium_consulting')}</h1>
        <p className="text-muted-foreground">{t('consulting.executive_hr_consulting')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Percentile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">75th</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pay Equity Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">94.2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Annual Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">SAR 2.3M</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Culture Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">8.4/10</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Executive Compensation</CardTitle>
            <CardDescription>Design and benchmarking</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">75th market percentile</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organizational Restructuring</CardTitle>
            <CardDescription>Efficiency and cost optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">23% efficiency gain</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Culture Transformation</CardTitle>
            <CardDescription>Culture assessment and change</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">340% transformation ROI</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Consulting;