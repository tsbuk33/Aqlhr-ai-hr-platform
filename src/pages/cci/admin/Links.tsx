import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { 
  Link, 
  Copy, 
  Download, 
  QrCode, 
  Users, 
  Shield,
  Clock,
  FileText,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import QRCode from 'qrcode';

interface Survey {
  id: string;
  name: string;
  status: string;
}

interface Wave {
  id: string;
  wave_no: number;
  period_start: string;
  period_end: string;
}

interface TokenStats {
  total_issued: number;
  total_redeemed: number;
  active_tokens: number;
}

const CCIAdminLinks: React.FC = () => {
  const { toast } = useToast();
  const { userRole, hasAnyRole } = useUserRole();
  
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [waves, setWaves] = useState<Wave[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<string>('');
  const [selectedWave, setSelectedWave] = useState<string>('');
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null);
  const [generatingTokens, setGeneratingTokens] = useState(false);
  const [generatingQR, setGeneratingQR] = useState(false);

  // Role-based access control
  const hasAdminAccess = hasAnyRole(['super_admin', 'admin', 'hr_manager']);

  useEffect(() => {
    if (hasAdminAccess) {
      fetchSurveys();
    }
  }, [hasAdminAccess]);

  useEffect(() => {
    if (selectedSurvey) {
      fetchWaves(selectedSurvey);
      fetchTokenStats(selectedSurvey, selectedWave);
    }
  }, [selectedSurvey, selectedWave]);

  const fetchSurveys = async () => {
    try {
      const { data, error } = await supabase
        .from('cci_surveys')
        .select('id, name, status')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSurveys(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch surveys",
        variant: "destructive",
      });
    }
  };

  const fetchWaves = async (surveyId: string) => {
    try {
      const { data, error } = await supabase
        .from('cci_waves')
        .select('id, wave_no, period_start, period_end')
        .eq('survey_id', surveyId)
        .order('wave_no', { ascending: true });

      if (error) throw error;
      setWaves(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch waves",
        variant: "destructive",
      });
    }
  };

  const fetchTokenStats = async (surveyId: string, waveId?: string) => {
    if (!surveyId) return;
    
    try {
      let query = supabase
        .from('cci_invite_tokens')
        .select('*')
        .eq('survey_id', surveyId);

      if (waveId) {
        query = query.eq('wave_id', waveId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const tokens = data || [];
      const totalIssued = tokens.length;
      const totalRedeemed = tokens.filter(t => t.redeemed_at).length;
      const activeTokens = tokens.filter(t => !t.redeemed_at && new Date(t.expires_at) > new Date()).length;

      setTokenStats({
        total_issued: totalIssued,
        total_redeemed: totalRedeemed,
        active_tokens: activeTokens
      });
    } catch (error: any) {
      console.error('Error fetching token stats:', error);
    }
  };

  const copyOpenLink = () => {
    if (!selectedSurvey) {
      toast({
        title: "Error",
        description: "Please select a survey first",
        variant: "destructive",
      });
      return;
    }

    const baseUrl = window.location.origin;
    const waveParam = selectedWave ? `&wave=${selectedWave}` : '';
    const link = `${baseUrl}/cci/respond?survey=${selectedSurvey}${waveParam}`;
    
    navigator.clipboard.writeText(link);
    toast({
      title: "Success",
      description: "Open link copied to clipboard",
    });
  };

  const generateTokens = async () => {
    if (!selectedSurvey) {
      toast({
        title: "Error",
        description: "Please select a survey first",
        variant: "destructive",
      });
      return;
    }

    setGeneratingTokens(true);
    try {
      const tokens = [];
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

      // Generate 500 tokens
      for (let i = 0; i < 500; i++) {
        const tokenPlaintext = crypto.randomUUID().replace(/-/g, '').substring(0, 16);
        const tokenHash = await hashToken(tokenPlaintext);
        
        tokens.push({
          survey_id: selectedSurvey,
          wave_id: selectedWave || null,
          token_hash: tokenHash,
          expires_at: expiresAt.toISOString(),
          plaintext: tokenPlaintext // Store temporarily for CSV
        });
      }

      // Insert tokens into database (without plaintext)
      const { error } = await supabase
        .from('cci_invite_tokens')
        .insert(tokens.map(({ plaintext, ...token }) => token));

      if (error) throw error;

      // Generate CSV with plaintext tokens
      const csvContent = generateTokenCSV(tokens);
      downloadCSV(csvContent, 'cci-invite-tokens.csv');

      // Refresh stats
      fetchTokenStats(selectedSurvey, selectedWave);

      toast({
        title: "Success",
        description: "500 tokens generated and CSV downloaded",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to generate tokens",
        variant: "destructive",
      });
    } finally {
      setGeneratingTokens(false);
    }
  };

  const hashToken = async (token: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateTokenCSV = (tokens: any[]): string => {
    const headers = ['token', 'token_hash', 'expires_at'];
    const rows = tokens.map(t => [t.plaintext, t.token_hash, t.expires_at]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const generateQRSheet = async () => {
    if (!selectedSurvey) {
      toast({
        title: "Error",
        description: "Please select a survey first",
        variant: "destructive",
      });
      return;
    }

    setGeneratingQR(true);
    try {
      const baseUrl = window.location.origin;
      const waveParam = selectedWave ? `&wave=${selectedWave}` : '';
      const link = `${baseUrl}/cci/respond?survey=${selectedSurvey}${waveParam}`;
      
      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(link, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Create printable QR sheet
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>CCI Survey QR Codes</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .qr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; page-break-inside: avoid; }
                .qr-item { text-align: center; border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
                .qr-item img { width: 150px; height: 150px; }
                .qr-label { font-size: 12px; margin-top: 10px; font-weight: bold; }
                @media print { body { margin: 0; } .qr-item { break-inside: avoid; } }
              </style>
            </head>
            <body>
              <h1>CCI Survey QR Codes</h1>
              <p>Survey: ${surveys.find(s => s.id === selectedSurvey)?.name || 'Unknown'}</p>
              ${selectedWave ? `<p>Wave: ${waves.find(w => w.id === selectedWave)?.wave_no || 'Unknown'}</p>` : ''}
              <div class="qr-grid">
                ${Array(12).fill(0).map((_, i) => `
                  <div class="qr-item">
                    <img src="${qrDataUrl}" alt="QR Code ${i + 1}" />
                    <div class="qr-label">Scan to Participate</div>
                  </div>
                `).join('')}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
      }

      toast({
        title: "Success",
        description: "QR code sheet opened in new window",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to generate QR codes",
        variant: "destructive",
      });
    } finally {
      setGeneratingQR(false);
    }
  };

  if (!hasAdminAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You don't have permission to access this page. Admin privileges required.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CCI Survey Links & Tokens</h1>
          <p className="text-muted-foreground">
            Generate survey links, invite tokens, and QR codes for CCI assessments
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {userRole}
        </Badge>
      </div>

      {/* Survey & Wave Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Survey Selection
          </CardTitle>
          <CardDescription>
            Choose the survey and wave for link generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Survey</label>
              <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a survey" />
                </SelectTrigger>
                <SelectContent>
                  {surveys.map((survey) => (
                    <SelectItem key={survey.id} value={survey.id}>
                      {survey.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Wave (Optional)</label>
              <Select value={selectedWave} onValueChange={setSelectedWave}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a wave" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific wave</SelectItem>
                  {waves.map((wave) => (
                    <SelectItem key={wave.id} value={wave.id}>
                      Wave {wave.wave_no} ({new Date(wave.period_start).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Open Link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link className="h-5 w-5" />
              Open Link
            </CardTitle>
            <CardDescription>
              Copy direct link for anonymous responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={copyOpenLink} 
              disabled={!selectedSurvey}
              className="w-full"
              variant="outline"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Open Link
            </Button>
          </CardContent>
        </Card>

        {/* Generate Tokens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="h-5 w-5" />
              Invite Tokens
            </CardTitle>
            <CardDescription>
              Generate 500 one-time tokens (30-day expiry)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={generateTokens} 
              disabled={!selectedSurvey || generatingTokens}
              className="w-full"
            >
              {generatingTokens ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Generate Tokens
            </Button>
          </CardContent>
        </Card>

        {/* QR Codes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <QrCode className="h-5 w-5" />
              QR Sheet
            </CardTitle>
            <CardDescription>
              Print sheet with 12 QR codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={generateQRSheet} 
              disabled={!selectedSurvey || generatingQR}
              className="w-full"
              variant="outline"
            >
              {generatingQR ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <QrCode className="h-4 w-4 mr-2" />
              )}
              Print QR Sheet
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Token Statistics */}
      {tokenStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Token Statistics
            </CardTitle>
            <CardDescription>
              Current token usage for selected survey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {tokenStats.total_issued}
                </div>
                <div className="text-sm text-muted-foreground">Total Issued</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {tokenStats.total_redeemed}
                </div>
                <div className="text-sm text-muted-foreground">Redeemed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {tokenStats.active_tokens}
                </div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800">Security Notice</h4>
              <p className="text-sm text-amber-700 mt-1">
                Token plaintext values are only shown during generation and CSV download. 
                Once you leave this page, only hashed tokens are stored in the database for security.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CCIAdminLinks;