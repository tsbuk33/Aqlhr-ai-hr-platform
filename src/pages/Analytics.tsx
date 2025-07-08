import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Analytics = () => {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('analytics.advanced_analytics')}</h1>
        <p className="text-muted-foreground">{t('analytics.data_driven_insights')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">247</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Dashboards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">18</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">99.2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROI Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">340%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workforce Analytics</CardTitle>
            <CardDescription>Comprehensive HR metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">247 custom reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Predictive Modeling</CardTitle>
            <CardDescription>Turnover and performance forecasting</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">94.7% accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-time Dashboards</CardTitle>
            <CardDescription>Live KPI monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">18 active dashboards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Analytics</CardTitle>
            <CardDescription>Cost per hire and efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">SAR 12,500 cost per hire</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Reporting</CardTitle>
            <CardDescription>Regulatory compliance tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">96.8% compliance score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
            <CardDescription>Individual and team metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">2,456 evaluations</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;