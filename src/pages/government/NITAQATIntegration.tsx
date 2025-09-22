import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNITAQATIntegration } from '@/hooks/useNITAQATIntegration';
import { CheckCircle, XCircle, AlertCircle, Loader2, Users, BarChart3, FileText, Shield } from 'lucide-react';
import { toast } from 'sonner';

const NITAQATIntegration = () => {
  const { 
    isConnected, 
    lastSync, 
    isLoading, 
    error, 
    syncData, 
    testConnection, 
    calculateCompliance,
    checkSaudizationStatus,
    generateReport 
  } = useNITAQATIntegration();

  const handleSync = async () => {
    try {
      await syncData();
      toast.success('NITAQAT data synchronized successfully');
    } catch (error) {
      toast.error('Failed to sync NITAQAT data');
    }
  };

  const handleTest = async () => {
    try {
      await testConnection();
      toast.success('NITAQAT connection test successful');
    } catch (error) {
      toast.error('NITAQAT connection test failed');
    }
  };

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (error) return <XCircle className="h-4 w-4 text-destructive" />;
    if (isConnected) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <AlertCircle className="h-4 w-4 text-yellow-600" />;
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
          <h1 className="text-3xl font-bold text-foreground">NITAQAT Integration</h1>
          <p className="text-muted-foreground">
            Saudization Compliance Platform - Monitor and manage workforce nationalization requirements
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
            Current status of NITAQAT API connection and compliance monitoring
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
              <p className="text-sm font-medium">Compliance Level</p>
              <p className="text-2xl font-bold text-green-600">Green</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saudization Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">Active workforce</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saudi Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">187</div>
            <p className="text-xs text-muted-foreground">75.7% Saudi nationals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saudization Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">75.7%</div>
            <p className="text-xs text-muted-foreground">Above minimum requirement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">95.2</div>
            <p className="text-xs text-muted-foreground">Excellent compliance</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Services */}
      <Card>
        <CardHeader>
          <CardTitle>Available NITAQAT Services</CardTitle>
          <CardDescription>
            Core NITAQAT integration services and compliance monitoring tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Workforce Analysis</h4>
                <p className="text-sm text-muted-foreground">Real-time saudization rate monitoring</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Compliance Tracking</h4>
                <p className="text-sm text-muted-foreground">Automated compliance score calculation</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Hiring Recommendations</h4>
                <p className="text-sm text-muted-foreground">AI-powered hiring strategy guidance</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Penalty Alerts</h4>
                <p className="text-sm text-muted-foreground">Proactive non-compliance warnings</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Dashboard</CardTitle>
          <CardDescription>
            Current NITAQAT compliance status and sector requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <h4 className="font-medium text-green-800">Green Zone Status</h4>
                <p className="text-sm text-green-600">Company meets all saudization requirements</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium">Current Rate</p>
                <p className="text-2xl font-bold text-green-600">75.7%</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium">Minimum Required</p>
                <p className="text-2xl font-bold">65.0%</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium">Buffer</p>
                <p className="text-2xl font-bold text-green-600">+10.7%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used NITAQAT operations and compliance tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={handleSync}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Sync Data
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => calculateCompliance()}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Check Compliance
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => checkSaudizationStatus()}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Workforce Analysis
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleTest}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Generate Report
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

export default NITAQATIntegration;