import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AqlHRAIAssistant } from "@/components/ai/AqlHRAIAssistant";

const CustomReporting = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Custom Reporting</h1>
        <p className="text-muted-foreground">Flexible report builder and custom analytics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Custom Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">34</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Automated Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">67</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">9.3/10</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Advanced AI Assistant */}
      <AqlHRAIAssistant 
        moduleContext="analytics" 
        companyId="default"
        position="fixed"
      />
    </div>
  );
};

export default CustomReporting;