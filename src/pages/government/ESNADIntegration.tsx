import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, FileText, Shield, Stamp, User } from 'lucide-react';
import { useESNADIntegration } from '@/hooks/useESNADIntegration';

const ESNADIntegration = () => {
  const { 
    connectionStatus,
    notarizationQueue,
    authenticatedDocuments,
    digitalSignatures,
    connect,
    disconnect,
    notarizeDocument,
    authenticateDocument,
    loading 
  } = useESNADIntegration();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ESNAD Notarization</h1>
          <p className="text-muted-foreground">Digital notarization and document authentication platform</p>
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
            ESNAD Platform Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Status: <span className="font-medium">{connectionStatus}</span>
              </p>
              {connectionStatus === 'connected' && (
                <p className="text-sm text-green-600">
                  ✓ Connected to Ministry of Justice ESNAD services
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {connectionStatus === 'disconnected' ? (
                <Button onClick={connect} disabled={loading}>
                  Connect to ESNAD
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Stamp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{notarizationQueue}</p>
                <p className="text-sm text-muted-foreground">Pending Notarizations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{authenticatedDocuments}</p>
                <p className="text-sm text-muted-foreground">Authenticated Docs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{digitalSignatures}</p>
                <p className="text-sm text-muted-foreground">Digital Signatures</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-sm text-muted-foreground">Service Availability</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ESNAD Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stamp className="h-5 w-5" />
              Document Notarization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Available Services:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Contract notarization</li>
                <li>• Power of attorney authentication</li>
                <li>• Corporate document verification</li>
                <li>• Academic certificate attestation</li>
                <li>• Personal document notarization</li>
              </ul>
            </div>
            <Button 
              className="w-full" 
              onClick={notarizeDocument}
              disabled={connectionStatus !== 'connected' || loading}
            >
              Submit for Notarization
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Digital Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Authentication Features:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Digital signature verification</li>
                <li>• Document integrity validation</li>
                <li>• Timestamp authentication</li>
                <li>• Chain of custody tracking</li>
                <li>• Legal compliance verification</li>
              </ul>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={authenticateDocument}
              disabled={connectionStatus !== 'connected' || loading}
            >
              Authenticate Document
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Notarization Process Flow */}
      <Card>
        <CardHeader>
          <CardTitle>ESNAD Notarization Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <span>Document Upload</span>
            </div>
            <div className="flex-1 h-px bg-border mx-4"></div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <span>Identity Verification</span>
            </div>
            <div className="flex-1 h-px bg-border mx-4"></div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <span>Legal Review</span>
            </div>
            <div className="flex-1 h-px bg-border mx-4"></div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
              <span>Digital Notarization</span>
            </div>
            <div className="flex-1 h-px bg-border mx-4"></div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">5</div>
              <span>Certified Delivery</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Status */}
      {connectionStatus === 'connected' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">✓ ESNAD Integration Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Successfully connected to Ministry of Justice ESNAD platform. 
              Your organization can now submit documents for digital notarization 
              and authentication services through the integrated workflow.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ESNADIntegration;