import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from './useUserRole';

export interface CCIEvidence {
  id: string;
  tenant_id: string;
  survey_id?: string;
  type?: string;
  title?: string;
  description?: string;
  storage_path?: string;
  tags?: string[];
  ai_tags?: string[];
  processing_status?: string;
  extracted_text?: string;
  ai_confidence?: number;
  file_metadata?: any;
  uploaded_by?: string;
  uploaded_at: string;
  processed_at?: string;
}

export const useCCIEvidence = (surveyId?: string) => {
  const [evidence, setEvidence] = useState<CCIEvidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { companyId } = useUserRole();

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('cci_evidence')
        .select('*')
        .eq('tenant_id', companyId || '00000000-0000-0000-0000-000000000001')
        .order('uploaded_at', { ascending: false });

      if (surveyId) {
        query = query.eq('survey_id', surveyId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setEvidence(data || []);
    } catch (error: any) {
      console.error('Error fetching evidence:', error);
      toast({
        title: "Error",
        description: "Failed to fetch evidence",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadEvidence = async (
    file: File, 
    title: string, 
    description: string, 
    type: string,
    tags: string[] = []
  ) => {
    try {
      setUploading(true);
      
      const tenantId = companyId || '00000000-0000-0000-0000-000000000001';
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${tenantId}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('cci-evidence')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create evidence record
      const { data: evidenceData, error: evidenceError } = await supabase
        .from('cci_evidence')
        .insert({
          tenant_id: tenantId,
          survey_id: surveyId || null,
          type: type,
          title: title,
          description: description,
          storage_path: filePath,
          tags: tags,
          processing_status: 'pending'
        })
        .select()
        .single();

      if (evidenceError) throw evidenceError;

      toast({
        title: "Success",
        description: "Evidence uploaded successfully. AI processing started...",
      });

      // Trigger AI processing
      processEvidenceWithAI(evidenceData.id);

      // Refresh evidence list
      fetchEvidence();

      return evidenceData;
    } catch (error: any) {
      console.error('Error uploading evidence:', error);
      toast({
        title: "Error",
        description: "Failed to upload evidence",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const processEvidenceWithAI = async (evidenceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('cci-evidence-ingest-v1', {
        body: { evidence_id: evidenceId }
      });

      if (error) throw error;

      toast({
        title: "AI Processing Complete",
        description: `Evidence processed with ${data.ai_tags.length} AI-generated tags`,
      });

      // Refresh evidence to show updated AI tags
      fetchEvidence();

    } catch (error: any) {
      console.error('Error processing evidence with AI:', error);
      toast({
        title: "AI Processing Failed",
        description: "Evidence uploaded but AI processing encountered an error",
        variant: "destructive",
      });
    }
  };

  const updateEvidenceTags = async (evidenceId: string, tags: string[]) => {
    try {
      const { error } = await supabase
        .from('cci_evidence')
        .update({ tags })
        .eq('id', evidenceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tags updated successfully",
      });

      fetchEvidence();
    } catch (error: any) {
      console.error('Error updating tags:', error);
      toast({
        title: "Error",
        description: "Failed to update tags",
        variant: "destructive",
      });
    }
  };

  const deleteEvidence = async (evidenceId: string, storagePath?: string) => {
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('cci_evidence')
        .delete()
        .eq('id', evidenceId);

      if (dbError) throw dbError;

      // Delete from storage if path exists
      if (storagePath) {
        await supabase.storage
          .from('cci-evidence')
          .remove([storagePath]);
      }

      toast({
        title: "Success",
        description: "Evidence deleted successfully",
      });

      fetchEvidence();
    } catch (error: any) {
      console.error('Error deleting evidence:', error);
      toast({
        title: "Error",
        description: "Failed to delete evidence",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchEvidence();
    }
  }, [companyId, surveyId]);

  return {
    evidence,
    loading,
    uploading,
    uploadEvidence,
    updateEvidenceTags,
    deleteEvidence,
    refreshEvidence: fetchEvidence,
    processEvidenceWithAI
  };
};