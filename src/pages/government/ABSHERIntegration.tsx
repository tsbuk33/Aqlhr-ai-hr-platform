import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Shield, Users, FileText, CreditCard, Building, AlertTriangle } from 'lucide-react';
import { useABSHERIntegration } from '@/hooks/useABSHERIntegration';

const ABSHERIntegration = () => {
  const { 
    connectionStatus,
    activeServices,
    completedTransactions,
    pendingRequests,
    complianceScore,
    recentActivities,
    connect,
    disconnect,
    verifyIdentity,
    processVisaApplication,
    updateIqamaStatus,
    generateCertificate,
    loading 
  } = useABSHERIntegration();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ABSHER Integration</h1>
          <p className="text-muted-foreground">Saudi Government Services Platform - Ministry of Interior</p>
        </div>
        <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'}>
          {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            ABSHER Platform Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Status: <span className="font-medium">{connectionStatus}</span>
              </p>
              {connectionStatus === 'connected' && (
                <div className="space-y-1">
                  <p className="text-sm text-green-600">
                    ✓ Connected to Ministry of Interior ABSHER services
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Secure connection established with government identity services
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {connectionStatus === 'disconnected' ? (
                <Button onClick={connect} disabled={loading}>
                  Connect to ABSHER
                </Button>
              ) : (
                <Button variant="outline" onClick={disconnect} disabled={loading}>
                  Disconnect
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{activeServices}</p>
                <p className="text-sm text-muted-foreground">Active Services</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{completedTransactions}</p>
                <p className="text-sm text-muted-foreground">Completed Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{pendingRequests}</p>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{complianceScore}%</p>
                <p className="text-sm text-muted-foreground">Security Compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ABSHER Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Identity & Visa Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Available Services:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Identity verification (Saudi ID & Iqama)</li>
                <li>• Visa application processing</li>
                <li>• Family visit visa issuance</li>
                <li>• Exit re-entry permit processing</li>
                <li>• Dependent registration services</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={verifyIdentity}
                disabled={connectionStatus !== 'connected' || loading}
                size="sm"
              >
                Verify Identity
              </Button>
              <Button 
                variant="outline"
                onClick={processVisaApplication}
                disabled={connectionStatus !== 'connected' || loading}
                size="sm"
              >
                Process Visa
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Iqama & Residency Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Residency Management:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Iqama renewal processing</li>
                <li>• Residence status updates</li>
                <li>• Address change notifications</li>
                <li>• Employment status verification</li>
                <li>• Residency certificate generation</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={updateIqamaStatus}
                disabled={connectionStatus !== 'connected' || loading}
                size="sm"
              >
                Update Iqama
              </Button>
              <Button 
                variant="outline"
                onClick={generateCertificate}
                disabled={connectionStatus !== 'connected' || loading}
                size="sm"
              >
                Generate Certificate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent ABSHER Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0">
                  {activity.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {activity.type === 'warning' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                  {activity.type === 'processing' && <Clock className="h-4 w-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.timestamp}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ABSHER Integration Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>ABSHER Integration Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <span>Authentication</span>
            </div>
            <div className="flex-1 h-px bg-border mx-4"></div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <span>Identity Verification</span>
            </div>
            <div className="flex-1 h-px bg-border mx-4"></div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <span>Service Request</span>
            </div>
            <div className="flex-1 h-px bg-border mx-4"></div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
              <span>Processing</span>
            </div>
            <div className="flex-1 h-px bg-border mx-4"></div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">5</div>
              <span>Completion</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Compliance Notice */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Shield className="h-5 w-5" />
            Security & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-blue-700 space-y-2">
            <p>
              ✓ All transactions are secured with Saudi government encryption standards
            </p>
            <p>
              ✓ Identity verification follows Ministry of Interior protocols
            </p>
            <p>
              ✓ Data privacy compliance with Saudi Personal Data Protection Law (PDPL)
            </p>
            <p>
              ✓ Integration certified by National Cybersecurity Authority (NCA)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Integration Status */}
      {connectionStatus === 'connected' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">✓ ABSHER Integration Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Successfully connected to Ministry of Interior ABSHER platform. 
              Your organization can now access secure government identity services, 
              process visa applications, manage Iqama renewals, and maintain compliance 
              with Saudi residency regulations through automated workflows.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ABSHERIntegration;