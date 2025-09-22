import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useMUQEEMIntegration } from '@/hooks/useMUQEEMIntegration';
import { 
  FileText, 
  Users, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Wifi, 
  RefreshCw,
  Building,
  CreditCard,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

const MUQEEMIntegration = () => {
  const {
    visaApplications,
    residencePermits,
    reports,
    isLoading,
    connectionStatus,
    testConnection,
    syncVisaApplications,
    syncResidencePermits,
    submitReport,
    validateData,
    getComplianceStatus
  } = useMUQEEMIntegration();

  const [activeTab, setActiveTab] = useState('overview');
  const [complianceData, setComplianceData] = useState<any>(null);

  useEffect(() => {
    // Initialize compliance status on component mount
    getComplianceStatus().then(setComplianceData);
  }, [getComplianceStatus]);

  const handleTestConnection = async () => {
    try {
      await testConnection();
      toast.success('MUQEEM Platform connection established successfully');
    } catch (error) {
      toast.error('Failed to connect to MUQEEM Platform');
    }
  };

  const handleSyncData = async () => {
    try {
      await Promise.all([
        syncVisaApplications(),
        syncResidencePermits()
      ]);
      toast.success('MUQEEM data synchronized successfully');
    } catch (error) {
      toast.error('Failed to sync MUQEEM data');
    }
  };

  const handleSubmitReport = async (reportType: string) => {
    try {
      const reportData = {
        timestamp: new Date().toISOString(),
        totalApplications: visaApplications.length,
        totalPermits: residencePermits.length,
        complianceStatus: complianceData?.status || 'pending'
      };
      
      await submitReport(reportType, reportData);
      toast.success(`${reportType} report submitted to MUQEEM Platform`);
    } catch (error) {
      toast.error(`Failed to submit ${reportType} report`);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">MUQEEM Integration</h1>
          <p className="text-muted-foreground">Residence & Visa Services Platform - Portal 7/14</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
            <Wifi className="w-3 h-3 mr-1" />
            {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </Badge>
          
          <Button onClick={handleTestConnection} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Test Connection
          </Button>
        </div>
      </div>

      {/* System Status Alert */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>MUQEEM Platform Status</AlertTitle>
        <AlertDescription>
          Ministry of Interior Residence Services - Enhanced security protocols active for visa and residency processing.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visas">Visa Applications</TabsTrigger>
          <TabsTrigger value="permits">Residence Permits</TabsTrigger>
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visa Applications</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{visaApplications.length}</div>
                <p className="text-xs text-muted-foreground">Active applications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Residence Permits</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{residencePermits.length}</div>
                <p className="text-xs text-muted-foreground">Valid permits</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {complianceData?.score || 0}%
                </div>
                <p className="text-xs text-muted-foreground">Compliance score</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>MUQEEM Integration Progress</CardTitle>
              <CardDescription>Real-time synchronization with Ministry of Interior systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Data Synchronization</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleSyncData} disabled={isLoading}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync All Data
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleSubmitReport('residency')}
                  disabled={isLoading}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Submit Residency Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visa Applications Management</CardTitle>
              <CardDescription>Process and track visa applications through MUQEEM Platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visaApplications.length > 0 ? (
                  visaApplications.map((application, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{application.applicantName}</p>
                        <p className="text-sm text-muted-foreground">
                          Type: {application.visaType} | Status: {application.status}
                        </p>
                      </div>
                      <Badge variant={application.status === 'approved' ? 'default' : 'secondary'}>
                        {application.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No visa applications found. Click "Sync All Data" to load from MUQEEM Platform.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Residence Permits Management</CardTitle>
              <CardDescription>Monitor and manage residence permits via MUQEEM services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {residencePermits.length > 0 ? (
                  residencePermits.map((permit, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{permit.holderName}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {permit.permitId} | Expires: {permit.expiryDate}
                        </p>
                      </div>
                      <Badge variant={permit.status === 'valid' ? 'default' : 'destructive'}>
                        {permit.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No residence permits found. Click "Sync All Data" to load from MUQEEM Platform.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>Generate and submit compliance reports to MUQEEM Platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((report, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{report.type}</h4>
                      {report.status === 'submitted' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted: {new Date(report.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button onClick={() => handleSubmitReport('visa')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Submit Visa Report
                </Button>
                <Button variant="outline" onClick={() => handleSubmitReport('residence')}>
                  <Building className="w-4 h-4 mr-2" />
                  Submit Residence Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MUQEEMIntegration;