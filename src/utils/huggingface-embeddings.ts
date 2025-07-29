import { pipeline } from '@huggingface/transformers';

// Multilingual embedding model optimized for Arabic/English
const MODEL_NAME = 'mixedbread-ai/mxbai-embed-xsmall-v1';

class HuggingFaceEmbeddingsService {
  private static instance: HuggingFaceEmbeddingsService;
  private extractor: any = null;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): HuggingFaceEmbeddingsService {
    if (!HuggingFaceEmbeddingsService.instance) {
      HuggingFaceEmbeddingsService.instance = new HuggingFaceEmbeddingsService();
    }
    return HuggingFaceEmbeddingsService.instance;
  }

  private async initialize(): Promise<void> {
    if (this.extractor) return;

    if (!this.initializationPromise) {
      this.initializationPromise = this.doInitialize();
    }
    
    return this.initializationPromise;
  }

  private async doInitialize(): Promise<void> {
    try {
      console.log('Initializing Hugging Face embeddings model...');
      
      // Try WebGPU first, fallback to CPU
      const device = await this.detectBestDevice();
      
      this.extractor = await pipeline(
        'feature-extraction',
        MODEL_NAME,
        { 
          device,
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              console.log(`Downloading model: ${Math.round(progress.progress || 0)}%`);
            }
          }
        }
      );
      
      console.log(`Hugging Face embeddings initialized with ${device}`);
    } catch (error) {
      console.error('Failed to initialize Hugging Face embeddings:', error);
      throw error;
    }
  }

  private async detectBestDevice(): Promise<'webgpu' | 'cpu'> {
    // Check for WebGPU support
    if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
      try {
        const adapter = await (navigator as any).gpu?.requestAdapter();
        if (adapter) {
          console.log('WebGPU detected, using GPU acceleration');
          return 'webgpu';
        }
      } catch (error) {
        console.log('WebGPU not available, falling back to CPU');
      }
    }
    return 'cpu';
  }

  public async generateEmbeddings(texts: string[]): Promise<number[][]> {
    await this.initialize();
    
    if (!this.extractor) {
      throw new Error('Embeddings model not initialized');
    }

    try {
      console.log(`Generating embeddings for ${texts.length} text(s)`);
      
      const embeddings = await this.extractor(texts, {
        pooling: 'mean',
        normalize: true
      });

      const result = embeddings.tolist();
      console.log('Embeddings generated successfully');
      
      return result;
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw error;
    }
  }

  public async generateSingleEmbedding(text: string): Promise<number[]> {
    const embeddings = await this.generateEmbeddings([text]);
    return embeddings[0];
  }

  // Calculate cosine similarity between two embeddings
  public calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same length');
    }

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      magnitude1 += embedding1[i] * embedding1[i];
      magnitude2 += embedding2[i] * embedding2[i];
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }

    return dotProduct / (magnitude1 * magnitude2);
  }

  // Find most similar documents based on embeddings
  public findSimilarDocuments(
    queryEmbedding: number[],
    documentEmbeddings: { id: string; embedding: number[]; metadata?: any }[],
    topK: number = 5,
    threshold: number = 0.5
  ): { id: string; similarity: number; metadata?: any }[] {
    const similarities = documentEmbeddings.map(doc => ({
      id: doc.id,
      similarity: this.calculateSimilarity(queryEmbedding, doc.embedding),
      metadata: doc.metadata
    }));

    return similarities
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  // Chunk text for better embeddings
  public chunkText(text: string, chunkSize: number = 512, overlap: number = 50): string[] {
    const words = text.split(' ');
    const chunks: string[] = [];
    
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      if (chunk.trim()) {
        chunks.push(chunk.trim());
      }
    }
    
    return chunks;
  }

  public isInitialized(): boolean {
    return this.extractor !== null;
  }
}

// Export singleton instance
export const huggingFaceEmbeddings = HuggingFaceEmbeddingsService.getInstance();

// Export utility functions
export const generateEmbeddings = (texts: string[]) => 
  huggingFaceEmbeddings.generateEmbeddings(texts);

export const generateSingleEmbedding = (text: string) => 
  huggingFaceEmbeddings.generateSingleEmbedding(text);

export const calculateSimilarity = (embedding1: number[], embedding2: number[]) =>
  huggingFaceEmbeddings.calculateSimilarity(embedding1, embedding2);

export const findSimilarDocuments = (
  queryEmbedding: number[],
  documentEmbeddings: { id: string; embedding: number[]; metadata?: any }[],
  topK?: number,
  threshold?: number
) => huggingFaceEmbeddings.findSimilarDocuments(queryEmbedding, documentEmbeddings, topK, threshold);

export const chunkText = (text: string, chunkSize?: number, overlap?: number) =>
  huggingFaceEmbeddings.chunkText(text, chunkSize, overlap);