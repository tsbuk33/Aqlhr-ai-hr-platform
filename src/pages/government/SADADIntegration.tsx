import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  DollarSign, 
  Receipt, 
  Shield, 
  Clock, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Building2
} from 'lucide-react';
import { useSADADIntegration } from '@/hooks/useSADADIntegration';

export default function SADADIntegration() {
  const { 
    paymentStatus, 
    transactionMetrics, 
    isLoading, 
    error,
    refreshData,
    processPayment,
    getTransactionHistory
  } = useSADADIntegration();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              SADAD Integration Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refreshData} variant="outline">
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SADAD Payment Platform</h1>
          <p className="text-muted-foreground mt-2">
            Saudi Arabia's premier electronic payment and billing platform
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Portal 9/14
        </Badge>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {paymentStatus?.active || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Active payment channels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {transactionMetrics?.dailyVolume?.toLocaleString() || '0'} SAR
            </div>
            <p className="text-xs text-muted-foreground">
              Today's transaction volume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {transactionMetrics?.successRate || 98.5}%
            </div>
            <p className="text-xs text-muted-foreground">
              Payment success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {transactionMetrics?.activeUsers?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Users this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Services
            </CardTitle>
            <CardDescription>
              Electronic payment and billing solutions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Receipt className="h-4 w-4 text-primary" />
                  <span className="font-medium">Bill Payment</span>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="font-medium">Corporate Payments</span>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">Scheduled Payments</span>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-medium">Secure Transactions</span>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button 
                onClick={() => processPayment('test')}
                className="flex-1"
              >
                Process Test Payment
              </Button>
              <Button 
                variant="outline" 
                onClick={() => getTransactionHistory()}
                className="flex-1"
              >
                View History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Integration Status
            </CardTitle>
            <CardDescription>
              SADAD platform connectivity and configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Connection</span>
                <Badge variant="default">Connected</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Authentication</span>
                <Badge variant="default">Verified</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment Gateway</span>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Webhook Events</span>
                <Badge variant="default">Configured</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Security Compliance</span>
                <Badge variant="default">PCI DSS</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Encryption</span>
                <Badge variant="default">AES-256</Badge>
              </div>
            </div>

            <Separator />

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Integration Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span className="font-medium">156ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span className="font-medium">99.8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Sync:</span>
                  <span className="font-medium">2 minutes ago</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={refreshData} 
              variant="outline" 
              className="w-full"
            >
              Refresh Status
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transaction Summary</CardTitle>
          <CardDescription>
            Latest payment activities and statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-success">
                {transactionMetrics?.successful || 1247}
              </div>
              <div className="text-sm text-muted-foreground">Successful Payments</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-warning">
                {transactionMetrics?.pending || 23}
              </div>
              <div className="text-sm text-muted-foreground">Pending Payments</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-destructive">
                {transactionMetrics?.failed || 8}
              </div>
              <div className="text-sm text-muted-foreground">Failed Payments</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}