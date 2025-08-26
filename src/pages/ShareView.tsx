import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Clock, Users, CheckCircle, Shield, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

interface ShareData {
  dashboard_data: any;
  kpi_summary: {
    total_employees: number;
    saudization_rate: number;
    compliance_score: number;
    hse_safety_score: number;
    employee_experience_10: number;
  };
  generated_at: string;
  expires_at: string;
  company_name?: string;
}

export default function ShareView() {
  const { token } = useParams<{ token: string }>();
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const fetchShareData = async () => {
      if (!token) {
        setError('Invalid share link');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('share_view_dashboard_v1', {
          body: { token }
        });

        if (error) throw error;

        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          setIsExpired(true);
        }

        setShareData(data);
      } catch (err) {
        console.error('Error fetching share data:', err);
        setError('Failed to load dashboard snapshot');
      } finally {
        setLoading(false);
      }
    };

    fetchShareData();
  }, [token]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            This dashboard snapshot has expired. Please request a new share link.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!shareData) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No data available for this share link.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const kpi = shareData.kpi_summary;
  const expiresAt = shareData.expires_at ? new Date(shareData.expires_at) : null;
  const timeUntilExpiry = expiresAt ? Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60)) : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with expiry notice */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">HR Dashboard Snapshot</h1>
            {shareData.company_name && (
              <p className="text-lg text-muted-foreground">{shareData.company_name}</p>
            )}
          </div>
          <Badge variant="outline">
            Read-Only View
          </Badge>
        </div>
        
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            This snapshot expires in {timeUntilExpiry}h. Generated on {new Date(shareData.generated_at).toLocaleString()}.
            <br />
            <strong>Privacy Notice:</strong> No personally identifiable information (PII) is included in this snapshot.
          </AlertDescription>
        </Alert>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold">{kpi.total_employees?.toLocaleString() || 0}</h3>
              <p className="text-sm text-muted-foreground">Total Employees</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold">{kpi.saudization_rate?.toFixed(1) || 0}%</h3>
              <p className="text-sm text-muted-foreground">Saudization Rate</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Shield className="h-6 w-6 text-warning" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold">{kpi.hse_safety_score?.toFixed(1) || 0}/10</h3>
              <p className="text-sm text-muted-foreground">HSE Safety Score</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-info/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-info" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold">{kpi.employee_experience_10?.toFixed(1) || 0}/10</h3>
              <p className="text-sm text-muted-foreground">Employee Experience</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Score Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Compliance Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-success">
            {kpi.compliance_score?.toFixed(1) || 0}%
          </div>
          <p className="text-muted-foreground">
            Aggregate compliance across all regulatory frameworks
          </p>
        </CardContent>
      </Card>

      {/* Privacy Footer */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Privacy & Compliance:</strong> This dashboard snapshot contains only aggregated, 
          anonymized data in compliance with Saudi Personal Data Protection Law (PDPL). 
          No individual employee information or personally identifiable data is included. 
          CCI survey responses maintain anonymity with n≥7 respondent threshold.
        </AlertDescription>
      </Alert>
      
      {/* AI Integration for Share View */}
      <UniversalAIIntegrator 
        pageType="analytics" 
        moduleName="shared-dashboard" 
        companyId="demo-company" 
        enabledFeatures={['data-visualization', 'contextual-insights']}
      />
    </div>
  );
}