import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAdvancedPayroll } from '@/hooks/useAdvancedPayroll';
import { Loader2, FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const WPSManager: React.FC = () => {
  const { generateWPS, isGeneratingWPS } = useAdvancedPayroll();
  const { toast } = useToast();
  const [selectedBank, setSelectedBank] = useState('');
  const [wpsStatus, setWpsStatus] = useState<any>(null);

  const handleGenerateWPS = async () => {
    if (!selectedBank) {
      toast({
        title: "Validation Error",
        description: "Please select a bank for WPS generation",
        variant: "destructive"
      });
      return;
    }

    try {
      generateWPS(selectedBank);
      
      toast({
        title: "WPS Generation Started",
        description: "WPS file generation has been initiated"
      });
    } catch (error) {
      toast({
        title: "Generation Error",
        description: "Failed to generate WPS file",
        variant: "destructive"
      });
    }
  };

  const saudiBanks = [
    { code: 'alrajhi', name: 'Al Rajhi Bank', logo: '🏦' },
    { code: 'alinma', name: 'Alinma Bank', logo: '🏛️' },
    { code: 'samba', name: 'Samba Financial Group', logo: '🏪' },
    { code: 'ncb', name: 'National Commercial Bank', logo: '🏢' },
    { code: 'riyad', name: 'Riyad Bank', logo: '🏬' },
    { code: 'arab', name: 'Arab National Bank', logo: '🏭' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          WPS Management System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Bank</label>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger>
                <SelectValue placeholder="Choose bank for WPS generation" />
              </SelectTrigger>
              <SelectContent>
                {saudiBanks.map((bank) => (
                  <SelectItem key={bank.code} value={bank.code}>
                    <div className="flex items-center gap-2">
                      <span>{bank.logo}</span>
                      {bank.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={handleGenerateWPS} disabled={isGeneratingWPS} className="w-full">
              {isGeneratingWPS ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Generate WPS File
            </Button>
          </div>
        </div>

        {wpsStatus && (
          <div className="mt-6 space-y-4">
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                WPS Generation Status
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm text-muted-foreground">Bank</span>
                  <p className="font-medium">{wpsStatus.bank_name}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Employees</span>
                  <p className="font-medium">{wpsStatus.employee_count}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Total Amount</span>
                  <p className="font-medium">{wpsStatus.total_amount?.toLocaleString()} SAR</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(wpsStatus.status)}>
                    {wpsStatus.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing Progress</span>
                  <span>{wpsStatus.progress || 100}%</span>
                </div>
                <Progress value={wpsStatus.progress || 100} className="h-2" />
              </div>

              {wpsStatus.file_path && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">File Generated</p>
                  <p className="font-medium text-primary">{wpsStatus.file_path}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">WPS Compliance Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">MOL Format Compliance</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Bank-specific Formatting</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Automated Validation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Error Detection</span>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-200">WPS Submission Notice</p>
              <p className="text-blue-700 dark:text-blue-300">
                Ensure all employee bank details are verified before generating WPS files. 
                Files must be submitted to the bank before the 10th of each month.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};