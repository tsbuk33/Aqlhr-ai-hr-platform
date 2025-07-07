import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RecruitmentOnboarding = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Recruitment & Onboarding</h1>
        <p className="text-muted-foreground">End-to-end hiring process management</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Hires This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">45</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">87%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time to Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">21 days</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecruitmentOnboarding;