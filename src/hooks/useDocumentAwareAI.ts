import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DocumentContext {
  id: string;
  fileName: string;
  fileUrl: string;
  moduleKey: string;
  uploadedAt: Date;
  processedContent?: string;
  metadata?: Record<string, any>;
}

export interface AIResponse {
  response: string;
  confidence: number;
  sources?: DocumentContext[];
  moduleSpecific: boolean;
}

export const useDocumentAwareAI = (moduleKey: string) => {
  const [documents, setDocuments] = useState<DocumentContext[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all uploaded documents for the current company
  const loadDocuments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .storage
        .from('hr-documents')
        .list('', { limit: 1000 });

      if (error) throw error;

      // Process documents and extract metadata
      const processedDocs: DocumentContext[] = await Promise.all(
        (data || []).map(async (file) => {
          const { data: urlData } = supabase.storage
            .from('hr-documents')
            .getPublicUrl(file.name);

          return {
            id: file.id || Date.now().toString(),
            fileName: file.name,
            fileUrl: urlData.publicUrl,
            moduleKey: 'global', // Default to global, can be enhanced
            uploadedAt: new Date(file.created_at || Date.now()),
            metadata: {
              size: file.metadata?.size,
              mimetype: file.metadata?.mimetype,
              lastModified: file.updated_at
            }
          };
        })
      );

      setDocuments(processedDocs);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    }
  }, []);

  // Query AI with document context
  const queryWithDocuments = useCallback(async (
    query: string,
    options: {
      includeAllDocs?: boolean;
      language?: 'en' | 'ar';
      specificDocumentIds?: string[];
    } = {}
  ): Promise<AIResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Get relevant documents
      let relevantDocs = documents;
      
      if (options.specificDocumentIds) {
        relevantDocs = documents.filter(doc => 
          options.specificDocumentIds!.includes(doc.id)
        );
      } else if (!options.includeAllDocs) {
        // Filter documents by current module or global documents
        relevantDocs = documents.filter(doc => 
          doc.moduleKey === moduleKey || doc.moduleKey === 'global'
        );
      }

      // Use enhanced AI function with document processing
      const { data, error } = await supabase.functions.invoke('ai-document-processor', {
        body: {
          query,
          context: {
            module: moduleKey,
            language: options.language || 'en',
            documents: relevantDocs,
            currentModule: moduleKey,
            availableDocuments: relevantDocs.length,
            queryIntent: 'comprehensive_analysis',
            educationalMode: true,
            visualizationRequest: query.toLowerCase().includes('chart') || 
                                query.toLowerCase().includes('graph') ||
                                query.toLowerCase().includes('visualize') ||
                                query.toLowerCase().includes('show data')
          }
        }
      });

      if (error) throw error;

      return {
        response: data.response || 'I can help you with this module. Please ask me anything!',
        confidence: data.confidence || 0.8,
        sources: data.sources || [],
        moduleSpecific: data.moduleSpecific || true
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI query failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [documents, moduleKey]);

  // Upload and process document
  const uploadDocument = useCallback(async (
    file: File, 
    moduleKey: string = 'global'
  ): Promise<string> => {
    try {
      setLoading(true);
      
      // Upload to Supabase storage
      const fileName = `${moduleKey}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('hr-documents')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('hr-documents')
        .getPublicUrl(fileName);

      // Process document with AI
      const { data: aiData, error: aiError } = await supabase.functions.invoke('ai-document-processor', {
        body: {
          action: 'process_document',
          fileUrl: urlData.publicUrl,
          fileName: file.name,
          moduleKey,
          fileType: file.type
        }
      });

      if (aiError) {
        console.warn('AI processing failed, but file uploaded:', aiError);
      }

      // Create document context
      const newDoc: DocumentContext = {
        id: data.path,
        fileName: file.name,
        fileUrl: urlData.publicUrl,
        moduleKey,
        uploadedAt: new Date(),
        processedContent: aiData?.extractedContent,
        metadata: {
          size: file.size,
          type: file.type,
          aiProcessed: !!aiData?.success
        }
      };

      setDocuments(prev => [...prev, newDoc]);
      await loadDocuments(); // Refresh document list
      
      return newDoc.id;
    } catch (err) {
      console.error('Error uploading document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadDocuments]);

  // Get documents by module
  const getDocumentsByModule = useCallback((targetModuleKey?: string) => {
    const targetKey = targetModuleKey || moduleKey;
    return documents.filter(doc => 
      doc.moduleKey === targetKey || doc.moduleKey === 'global'
    );
  }, [documents, moduleKey]);

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return {
    documents,
    loading,
    error,
    queryWithDocuments,
    uploadDocument,
    loadDocuments,
    getDocumentsByModule,
    moduleDocuments: getDocumentsByModule()
  };
};