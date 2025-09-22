import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGOSIIntegration } from '@/hooks/useGOSIIntegration';
import { CheckCircle, XCircle, AlertCircle, Loader2, Users, Calculator, FileText, Settings } from 'lucide-react';
import { toast } from 'sonner';

const GOSIIntegration = () => {
  const { 
    isConnected, 
    lastSync, 
    isLoading, 
    error, 
    syncData, 
    testConnection, 
    calculateContributions,
    getEmployeeStatus,
    generateReport 
  } = useGOSIIntegration();

  const handleSync = async () => {
    try {
      await syncData();
      toast.success('GOSI data synchronized successfully');
    } catch (error) {
      toast.error('Failed to sync GOSI data');
    }
  };

  const handleTest = async () => {
    try {
      await testConnection();
      toast.success('GOSI connection test successful');
    } catch (error) {
      toast.error('GOSI connection test failed');
    }
  };

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (error) return <XCircle className="h-4 w-4 text-destructive" />;
    if (isConnected) return <CheckCircle className="h-4 w-4 text-success" />;
    return <AlertCircle className="h-4 w-4 text-warning" />;
  };

  const getStatusBadge = () => {
    if (isLoading) return <Badge variant="secondary">Connecting...</Badge>;
    if (error) return <Badge variant="destructive">Error</Badge>;
    if (isConnected) return <Badge variant="default">Connected</Badge>;
    return <Badge variant="outline">Disconnected</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">GOSI Integration</h1>
          <p className="text-muted-foreground">
            General Organization for Social Insurance - Employee Registration & Contributions
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Connection Status
          </CardTitle>
          <CardDescription>
            Current status of GOSI API connection and last synchronization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-2xl font-bold text-foreground">
                {isConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Last Sync</p>
              <p className="text-2xl font-bold text-foreground">
                {lastSync ? new Date(lastSync).toLocaleDateString() : 'Never'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">API Version</p>
              <p className="text-2xl font-bold text-foreground">v2024.1</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Contributions</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">158,750 SAR</div>
            <p className="text-xs text-muted-foreground">Current month total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.7%</div>
            <p className="text-xs text-muted-foreground">Compliance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Services */}
      <Card>
        <CardHeader>
          <CardTitle>Available GOSI Services</CardTitle>
          <CardDescription>
            Core GOSI integration services and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Employee Registration</h4>
                <p className="text-sm text-muted-foreground">Register new employees with GOSI</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Contribution Calculations</h4>
                <p className="text-sm text-muted-foreground">Calculate monthly GOSI contributions</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Status Inquiries</h4>
                <p className="text-sm text-muted-foreground">Check employee GOSI status</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Compliance Reports</h4>
                <p className="text-sm text-muted-foreground">Generate compliance documentation</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used GOSI operations and management tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={handleSync}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Sync Data
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => calculateContributions()}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Calculator className="h-4 w-4" />
              Calculate Contributions
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => getEmployeeStatus()}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Check Status
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleTest}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Integration Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GOSIIntegration;