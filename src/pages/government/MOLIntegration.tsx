import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMOLIntegration } from '@/hooks/useMOLIntegration';
import { 
  Building2, 
  Users, 
  FileText, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Settings,
  Database,
  Activity
} from 'lucide-react';

const MOLIntegration = () => {
  const {
    connectionStatus,
    complianceData,
    lastSync,
    isLoading,
    testConnection,
    syncData,
    submitCompliance,
    generateReport,
    error
  } = useMOLIntegration();

  const complianceScore = complianceData?.overall_score || 0;
  const statusColor = connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">MOL Integration</h1>
          <p className="text-muted-foreground">Ministry of Labor Platform - Labor Law Compliance & Employee Rights</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${statusColor}`} />
          <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
            {connectionStatus}
          </Badge>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Labor Compliance</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceScore}%</div>
            <Progress value={complianceScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employee Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceData?.contracts_submitted || 0}</div>
            <p className="text-xs text-muted-foreground">Submitted to MOL</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Labor Violations</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceData?.violations || 0}</div>
            <p className="text-xs text-muted-foreground">Active violations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {lastSync ? new Date(lastSync).toLocaleDateString() : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground">Data synchronization</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contracts">Employee Contracts</TabsTrigger>
          <TabsTrigger value="violations">Labor Violations</TabsTrigger>
          <TabsTrigger value="reports">MOL Reports</TabsTrigger>
          <TabsTrigger value="settings">Integration Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Registration Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>MOL Registration</span>
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Labor Office</span>
                  <span className="text-sm text-muted-foreground">Riyadh - Branch 001</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Economic Activity</span>
                  <span className="text-sm text-muted-foreground">Information Technology</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Employee Status Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Employees</span>
                  <span className="font-medium">{complianceData?.total_employees || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Saudi Employees</span>
                  <span className="font-medium">{complianceData?.saudi_employees || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Saudization Rate</span>
                  <span className="font-medium">{complianceData?.saudization_rate || 0}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Contract Management</CardTitle>
              <CardDescription>
                Manage and submit employee contracts to MOL for approval
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {complianceData?.contracts_approved || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Approved Contracts</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {complianceData?.contracts_pending || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Review</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {complianceData?.contracts_rejected || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Rejected Contracts</div>
                </div>
              </div>
              <Button onClick={() => submitCompliance('contracts')} disabled={isLoading}>
                Submit New Contracts
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="violations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Labor Law Violations</CardTitle>
              <CardDescription>
                Monitor and address labor law compliance issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              {complianceData?.violation_details?.length > 0 ? (
                <div className="space-y-3">
                  {complianceData.violation_details.map((violation: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{violation.type}</h4>
                          <p className="text-sm text-muted-foreground">{violation.description}</p>
                        </div>
                        <Badge variant="destructive">{violation.severity}</Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Due: {new Date(violation.due_date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Violations Found</h3>
                  <p className="text-muted-foreground">Your company is compliant with MOL regulations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>MOL Reporting System</CardTitle>
              <CardDescription>
                Generate and submit required reports to Ministry of Labor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={() => generateReport('monthly')} disabled={isLoading}>
                  Generate Monthly Report
                </Button>
                <Button onClick={() => generateReport('quarterly')} disabled={isLoading}>
                  Generate Quarterly Report
                </Button>
                <Button onClick={() => generateReport('annual')} disabled={isLoading}>
                  Generate Annual Report
                </Button>
                <Button onClick={() => generateReport('saudization')} disabled={isLoading}>
                  Generate Saudization Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Integration Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Button onClick={testConnection} disabled={isLoading}>
                  <Activity className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
                <Button onClick={syncData} disabled={isLoading}>
                  <Database className="h-4 w-4 mr-2" />
                  Sync Data
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">API Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Endpoint:</span>
                    <span className="text-muted-foreground">mol.gov.sa/api/v1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Authentication:</span>
                    <span className="text-muted-foreground">OAuth 2.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate Limit:</span>
                    <span className="text-muted-foreground">1000 req/hour</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MOLIntegration;