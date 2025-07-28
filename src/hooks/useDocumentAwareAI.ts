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
        .from('uploaded_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const documentContexts: DocumentContext[] = (data || []).map(doc => ({
        id: doc.id,
        fileName: doc.file_name,
        fileUrl: doc.file_url,
        moduleKey: doc.module_key,
        uploadedAt: new Date(doc.created_at),
        processedContent: doc.processed_content,
        metadata: doc.metadata
      }));

      setDocuments(documentContexts);
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

      const { data, error } = await supabase.functions.invoke('ai-document-aware-query', {
        body: {
          query,
          moduleKey,
          documents: relevantDocs,
          language: options.language || 'en',
          context: {
            currentModule: moduleKey,
            availableDocuments: relevantDocs.length,
            queryIntent: 'document_analysis'
          }
        }
      });

      if (error) throw error;

      return {
        response: data.response,
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

  // Register a new document
  const registerDocument = useCallback(async (document: {
    fileName: string;
    fileUrl: string;
    moduleKey: string;
    metadata?: Record<string, any>;
  }) => {
    try {
      const { data, error } = await supabase
        .from('uploaded_documents')
        .insert({
          file_name: document.fileName,
          file_url: document.fileUrl,
          module_key: document.moduleKey,
          metadata: document.metadata,
          status: 'processing'
        })
        .select()
        .single();

      if (error) throw error;

      // Process document content
      await processDocument(data.id, document.fileUrl);
      
      // Reload documents
      await loadDocuments();

      return data.id;
    } catch (err) {
      console.error('Error registering document:', err);
      throw err;
    }
  }, [loadDocuments]);

  // Process document content with AI
  const processDocument = useCallback(async (documentId: string, fileUrl: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-document-processor', {
        body: {
          documentId,
          fileUrl,
          moduleKey,
          extractionType: 'comprehensive'
        }
      });

      if (error) throw error;

      // Update document with processed content
      await supabase
        .from('uploaded_documents')
        .update({
          processed_content: data.extractedText,
          metadata: {
            ...data.metadata,
            processedAt: new Date().toISOString()
          },
          status: 'processed'
        })
        .eq('id', documentId);

    } catch (err) {
      console.error('Error processing document:', err);
      
      // Mark as failed
      await supabase
        .from('uploaded_documents')
        .update({ status: 'failed' })
        .eq('id', documentId);
    }
  }, [moduleKey]);

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
    registerDocument,
    loadDocuments,
    getDocumentsByModule,
    moduleDocuments: getDocumentsByModule()
  };
};