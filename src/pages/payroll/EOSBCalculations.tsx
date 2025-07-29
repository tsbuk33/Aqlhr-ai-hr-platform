import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';

const EOSBCalculations = () => {
  return (
    <>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">EOSB Calculations</h1>
          <p className="text-muted-foreground">End of Service Benefits management and liability tracking</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total EOSB Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-primary">SAR 2.34M</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average EOSB</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-success">SAR 23,400</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Paid This Year</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-accent">SAR 345K</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Eligible Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-warning">2,456</div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ModuleDocumentUploader moduleKey="payroll.eosbCalculations" />
      <AqlHRAIAssistant moduleContext="payroll.eosbCalculations" />
    </>
  );
};

export default EOSBCalculations;