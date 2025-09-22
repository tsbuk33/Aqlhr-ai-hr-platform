import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useNAJIZIntegration } from "@/hooks/useNAJIZIntegration";
import { Building2, FileText, Shield, Globe, CheckCircle, AlertCircle, Clock, ExternalLink } from "lucide-react";

/**
 * NAJIZ Business Gateway Integration Page
 * Portal 8/14 - Saudi Business Services Integration
 */
export default function NAJIZIntegration() {
  const {
    connectionStatus,
    businessServices,
    licenseData,
    complianceStatus,
    isLoading,
    error,
    testConnection,
    syncBusinessData,
    validateCompliance
  } = useNAJIZIntegration();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="ltr">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            نجيز - NAJIZ Business Gateway
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Portal 8/14 - Saudi Business Registration & Commercial Services Integration
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant="outline" 
            className={`${getStatusColor(connectionStatus)} text-white border-0`}
          >
            {getStatusIcon(connectionStatus)}
            <span className="mr-2">
              {connectionStatus === 'connected' ? 'Connected' : 
               connectionStatus === 'error' ? 'Error' : 'Connecting...'}
            </span>
          </Badge>
          <Button onClick={testConnection} variant="outline" size="sm">
            Test Connection
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Connection Error:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Business Services Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              Business Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {businessServices?.registrations || 0}
            </div>
            <p className="text-xs text-muted-foreground">Active registrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-green-600" />
              Commercial Licenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {businessServices?.licenses || 0}
            </div>
            <p className="text-xs text-muted-foreground">Active licenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              Investment Permits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {businessServices?.permits || 0}
            </div>
            <p className="text-xs text-muted-foreground">Active permits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-orange-600" />
              Industrial Licenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {businessServices?.industrial || 0}
            </div>
            <p className="text-xs text-muted-foreground">Industrial permits</p>
          </CardContent>
        </Card>
      </div>

      {/* Business License Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Commercial License Information
            </CardTitle>
            <CardDescription>
              Current business license status and details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {licenseData ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">License Number</span>
                  <span className="text-sm text-muted-foreground">{licenseData.number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Issue Date</span>
                  <span className="text-sm text-muted-foreground">{licenseData.issueDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Expiry Date</span>
                  <span className="text-sm text-muted-foreground">{licenseData.expiryDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={licenseData.status === 'active' ? 'default' : 'secondary'}>
                    {licenseData.status}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <span className="text-sm font-medium">Business Activities</span>
                  <div className="flex flex-wrap gap-2">
                    {licenseData.activities?.map((activity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No license data available</p>
                <Button onClick={syncBusinessData} variant="outline" size="sm" className="mt-2">
                  Sync License Data
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Compliance Status
            </CardTitle>
            <CardDescription>
              Saudi business compliance and regulatory status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceStatus ? (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Compliance</span>
                    <Badge 
                      variant={complianceStatus.overall === 'compliant' ? 'default' : 'destructive'}
                    >
                      {complianceStatus.overall}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Business Registration</span>
                      <span className="text-green-600">✓ Compliant</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Commercial License</span>
                      <span className="text-green-600">✓ Valid</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax Registration</span>
                      <span className="text-green-600">✓ Active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GOSI Registration</span>
                      <span className="text-green-600">✓ Verified</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Compliance Score</span>
                    <Progress value={complianceStatus.score || 0} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>{complianceStatus.score || 0}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No compliance data available</p>
                <Button onClick={validateCompliance} variant="outline" size="sm" className="mt-2">
                  Check Compliance
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>NAJIZ Business Gateway Actions</CardTitle>
          <CardDescription>
            Manage your business registrations and compliance through NAJIZ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={syncBusinessData} className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Sync Business Data
            </Button>
            <Button onClick={validateCompliance} variant="outline" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Validate Compliance
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Open NAJIZ Portal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Integration Info */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                NAJIZ Business Gateway Integration
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Portal 8/14 in the comprehensive Saudi government integration suite. 
                NAJIZ provides business registration, commercial licensing, and investment permit services 
                for Saudi businesses and investors.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Business Registration</Badge>
                <Badge variant="outline">Commercial Licenses</Badge>
                <Badge variant="outline">Investment Permits</Badge>
                <Badge variant="outline">Industrial Licenses</Badge>
                <Badge variant="outline">Compliance Monitoring</Badge>
                <Badge variant="outline">Multi-language Support</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}