import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';

export interface DocumentProcessingResult {
  id: string;
  summary: string;
  keywords: string[];
  saudi_compliance_score: number;
  legal_entities: string[];
  processing_layers: ProcessingLayer[];
}

export interface ProcessingLayer {
  id: string;
  layer_type: string;
  layer_name: string;
  content: any;
  confidence_score: number;
}

export const useSaudiDocumentProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processDocument = useCallback(async (
    file: File, 
    documentType: string = 'general'
  ): Promise<DocumentProcessingResult | null> => {
    if (!file) {
      toast({
        title: 'خطأ في الملف',
        description: 'يرجى اختيار ملف صالح',
        variant: 'destructive'
      });
      return null;
    }

    setIsProcessing(true);
    
    try {
      const tenantId = await getTenantIdOrDemo();
      
      // Convert file to base64 for processing
      const fileContent = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      // Call the edge function for document processing
      const { data, error } = await supabase.functions.invoke('saudi-document-processor', {
        body: {
          document_content: fileContent,
          document_type: documentType,
          filename: file.name,
          tenant_id: tenantId
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'تمت معالجة المستند بنجاح',
        description: `تم تحليل ${file.name} بنجاح`,
      });

      return data;

    } catch (error) {
      console.error('Document processing error:', error);
      toast({
        title: 'خطأ في معالجة المستند',
        description: 'حدث خطأ أثناء معالجة المستند. يرجى المحاولة مرة أخرى.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const getProcessingHistory = useCallback(async (): Promise<any[]> => {
    try {
      // Mock data for now - will connect to actual DB once types are regenerated
      const mockHistory = [
        {
          id: 'doc-001',
          summary: 'عقد عمل موظف جديد - تم تحليل الشروط والأحكام',
          keywords: ['عقد عمل', 'توظيف', 'راتب', 'مزايا'],
          saudi_compliance_score: 85,
          legal_entities: ['وزارة الموارد البشرية', 'التأمينات الاجتماعية'],
          created_at: new Date().toISOString()
        },
        {
          id: 'doc-002', 
          summary: 'سياسة الإجازات المرضية - مراجعة القانون السعودي',
          keywords: ['إجازة مرضية', 'قانون العمل', 'تأمين صحي'],
          saudi_compliance_score: 92,
          legal_entities: ['نظام العمل السعودي'],
          created_at: new Date().toISOString()
        }
      ];
      
      return mockHistory;
    } catch (error) {
      console.error('Error fetching processing history:', error);
      return [];
    }
  }, []);

  return {
    processDocument,
    getProcessingHistory,
    isProcessing
  };
};