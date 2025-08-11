import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Download, Database } from 'lucide-react';

export const CompanyIntelligenceImporter = () => {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleImportData = async () => {
    setIsImporting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('import-company-data');
      
      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: data.message || "Company intelligence data imported successfully",
      });
      
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed", 
        description: error.message || "Failed to import company data",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Company Intelligence
        </CardTitle>
        <CardDescription>
          Import Almalaz company intelligence data for testing and development
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleImportData}
          disabled={isImporting}
          className="w-full"
        >
          {isImporting ? (
            <>
              <Download className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Import Sample Data
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Includes Almalaz Real Estate, Construction, Facilities, Hospitality, and Retail divisions
        </p>
      </CardContent>
    </Card>
  );
};