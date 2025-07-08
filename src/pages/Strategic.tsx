import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Strategic = () => {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('strategic.strategic_hr')}</h1>
        <p className="text-muted-foreground">{t('strategic.strategic_hr_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Headcount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">2,847</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planned Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">+15%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-warning">89</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Succession Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">57%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Strategic Workforce Planning</CardTitle>
            <CardDescription>Scenario modeling and planning</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">89 identified skills gaps</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leadership Development</CardTitle>
            <CardDescription>Pipeline and succession planning</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">156 key positions tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saudization Tracking</CardTitle>
            <CardDescription>Nitaqat compliance monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">67.2% current rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Strategic;