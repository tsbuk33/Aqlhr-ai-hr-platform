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

  // Load all uploaded documents for the current company (simplified for now)
  const loadDocuments = useCallback(async () => {
    try {
      // For now, return empty array until migration is approved
      // TODO: Implement after uploaded_documents table is created
      setDocuments([]);
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

      // Use existing AI function
      const { data, error } = await supabase.functions.invoke('ai-core-engine', {
        body: {
          query,
          context: {
            module: moduleKey,
            language: options.language || 'en',
            documents: relevantDocs,
            currentModule: moduleKey,
            availableDocuments: relevantDocs.length,
            queryIntent: 'document_analysis'
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

  // Register a new document (simplified)
  const registerDocument = useCallback(async (document: {
    fileName: string;
    fileUrl: string;
    moduleKey: string;
    metadata?: Record<string, any>;
  }) => {
    try {
      // For now, just add to local state
      // TODO: Implement database storage after migration
      const newDoc: DocumentContext = {
        id: Date.now().toString(),
        fileName: document.fileName,
        fileUrl: document.fileUrl,
        moduleKey: document.moduleKey,
        uploadedAt: new Date(),
        metadata: document.metadata
      };
      
      setDocuments(prev => [...prev, newDoc]);
      return newDoc.id;
    } catch (err) {
      console.error('Error registering document:', err);
      throw err;
    }
  }, []);

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