import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';

const SecurityFramework = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AES-256 Encrypted Security Framework</h1>
        <p className="text-muted-foreground">Enterprise-grade security and encryption</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">9.8/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Encryption Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">AES-256</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Failed Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">99.99%</div>
          </CardContent>
        </Card>
      </div>
      
      <ModuleDocumentUploader moduleKey="platformFeatures.securityFramework" />
      <AqlHRAIAssistant moduleContext="platformFeatures.securityFramework" />
    </div>
  );
};

export default SecurityFramework;