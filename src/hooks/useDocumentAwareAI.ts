import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateSingleEmbedding, findSimilarDocuments } from '@/utils/huggingface-embeddings';

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

  // Load all processed documents from our new embedding system
  const loadDocuments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('ai_document_embeddings')
        .select(`
          id,
          file_name,
          file_url,
          module_key,
          created_at,
          processed_content,
          metadata,
          processing_status
        `)
        .eq('processing_status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert to DocumentContext format
      const processedDocs: DocumentContext[] = (data || []).map((doc) => ({
        id: doc.id,
        fileName: doc.file_name,
        fileUrl: doc.file_url,
        moduleKey: doc.module_key || 'global',
        uploadedAt: new Date(doc.created_at),
        processedContent: doc.processed_content,
        metadata: (doc.metadata as Record<string, any>) || {}
      }));

      setDocuments(processedDocs);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    }
  }, []);

  // Query AI with document context using Hugging Face embeddings
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
      console.log('Generating query embedding...');
      
      // Generate embedding for the query using Hugging Face
      const queryEmbedding = await generateSingleEmbedding(query);
      
      // Find similar document chunks from our database
      const { data: similarChunks, error: dbError } = await supabase
        .rpc('find_similar_chunks' as any, {
          query_embedding: queryEmbedding,
          similarity_threshold: 0.3,
          max_results: 5,
          target_module_key: options.includeAllDocs ? null : moduleKey
        });

      if (dbError) {
        console.warn('Database similarity search failed:', dbError);
      }

      console.log('Found similar chunks:', Array.isArray(similarChunks) ? similarChunks.length : 0);

      // Get relevant documents based on similarity or filters
      let relevantDocs = documents;
      
      if (options.specificDocumentIds) {
        relevantDocs = documents.filter(doc => 
          options.specificDocumentIds!.includes(doc.id)
        );
      } else if (!options.includeAllDocs && Array.isArray(similarChunks) && similarChunks.length) {
        // Use documents from similar chunks
        const similarDocIds = [...new Set(similarChunks.map(chunk => chunk.document_id))];
        relevantDocs = documents.filter(doc => similarDocIds.includes(doc.id));
      } else if (!options.includeAllDocs) {
        // Fallback to module-based filtering
        relevantDocs = documents.filter(doc => 
          doc.moduleKey === moduleKey || doc.moduleKey === 'global'
        );
      }

      // Prepare context with similar chunks for better AI responses
      const contextualContent = Array.isArray(similarChunks) 
        ? similarChunks.map(chunk => 
            `From "${chunk.file_name}": ${chunk.content}`
          ).join('\n\n')
        : '';

      // Use our existing AI function but with enhanced context
      const { data, error } = await supabase.functions.invoke('ai-document-processor', {
        body: {
          query,
          context: {
            module: moduleKey,
            language: options.language || 'en',
            documents: relevantDocs,
            similarContent: contextualContent,
            currentModule: moduleKey,
            availableDocuments: relevantDocs.length,
            queryIntent: 'comprehensive_analysis',
            educationalMode: true,
            embeddingModel: 'huggingface_mixedbread',
            visualizationRequest: query.toLowerCase().includes('chart') || 
                                query.toLowerCase().includes('graph') ||
                                query.toLowerCase().includes('visualize') ||
                                query.toLowerCase().includes('show data')
          }
        }
      });

      if (error) {
        console.warn('AI processing failed, providing fallback response:', error);
        
        // Provide a meaningful fallback response based on available documents
        const fallbackResponse = contextualContent 
          ? `Based on the available documents, I found some relevant information about your query. ${contextualContent.substring(0, 500)}...`
          : `I can help you with ${moduleKey} related queries. You have ${relevantDocs.length} documents available for analysis.`;
          
        return {
          response: fallbackResponse,
          confidence: 0.6,
          sources: relevantDocs.slice(0, 3),
          moduleSpecific: true
        };
      }

      // Map similar chunks back to document sources
      const sources = Array.isArray(similarChunks) && similarChunks.length 
        ? relevantDocs.filter(doc => 
            similarChunks.some(chunk => chunk.document_id === doc.id)
          ).slice(0, 3)
        : relevantDocs.slice(0, 3);

      return {
        response: data.response || 'I can help you with this module. Please ask me anything!',
        confidence: data.confidence || 0.8,
        sources: sources,
        moduleSpecific: data.moduleSpecific || true
      };
    } catch (err) {
      console.error('Query with documents failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'AI query failed';
      setError(errorMessage);
      
      // Provide basic fallback
      return {
        response: `I encountered an issue processing your query, but I'm still here to help with ${moduleKey} related questions.`,
        confidence: 0.3,
        sources: documents.slice(0, 2),
        moduleSpecific: true
      };
    } finally {
      setLoading(false);
    }
  }, [documents, moduleKey]);

  // Upload and process document with Hugging Face embeddings
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

      console.log('Uploaded file, processing with Hugging Face embeddings...');

      // Process document with our new Hugging Face system
      const { data: aiData, error: aiError } = await supabase.functions.invoke('hf-document-processor', {
        body: {
          fileUrl: urlData.publicUrl,
          fileName: file.name,
          moduleKey,
          companyId: 'default', // You might want to get this from context
          userId: 'current-user' // You might want to get this from auth
        }
      });

      if (aiError) {
        console.error('Document processing failed:', aiError);
        throw new Error('Failed to process document with AI embeddings');
      }

      console.log('Document processed successfully:', aiData);

      // The document is now stored in our ai_document_embeddings table
      // Refresh the documents list to include the new document
      await loadDocuments();
      
      return aiData.documentId || fileName;
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