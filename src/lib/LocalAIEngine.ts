import { pipeline } from '@huggingface/transformers';

class LocalAIEngine {
  private textGenerator: any = null;
  private classifier: any = null;
  private embedder: any = null;
  private summarizer: any = null;

  async initializeModels() {
    try {
      // Initialize text generation pipeline
      this.textGenerator = await pipeline(
        'text-generation', 
        'microsoft/DialoGPT-small',
        { device: 'webgpu' }
      );

      // Initialize text classification
      this.classifier = await pipeline(
        'text-classification',
        'cardiffnlp/twitter-roberta-base-sentiment-latest',
        { device: 'webgpu' }
      );

      // Initialize embeddings
      this.embedder = await pipeline(
        'feature-extraction',
        'mixedbread-ai/mxbai-embed-xsmall-v1',
        { device: 'webgpu' }
      );

      // Initialize summarization
      this.summarizer = await pipeline(
        'summarization',
        'facebook/bart-large-cnn',
        { device: 'webgpu' }
      );

      console.log('✅ All open-source AI models loaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Error loading AI models:', error);
      return false;
    }
  }

  async generateContent(prompt: string, type: 'presentation' | 'document' | 'analysis' = 'analysis') {
    if (!this.textGenerator) {
      await this.initializeModels();
    }

    try {
      const context = this.getContextPrompt(type);
      const fullPrompt = `${context}\n\nUser Request: ${prompt}\n\nResponse:`;
      
      const result = await this.textGenerator(fullPrompt, {
        max_new_tokens: 500,
        temperature: 0.7,
        do_sample: true,
        top_p: 0.9
      });

      return {
        success: true,
        content: result[0].generated_text.split('Response:')[1]?.trim() || result[0].generated_text,
        model: 'microsoft/DialoGPT-small (open-source)',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Text generation error:', error);
      return this.getFallbackContent(prompt, type);
    }
  }

  async analyzeText(text: string) {
    if (!this.classifier) {
      await this.initializeModels();
    }

    try {
      const sentiment = await this.classifier(text);
      const embeddings = await this.embedder(text, { pooling: 'mean', normalize: true });
      
      return {
        success: true,
        sentiment: sentiment[0],
        embeddings: embeddings.tolist()[0],
        analysis: this.generateTextAnalysis(text, sentiment[0]),
        model: 'cardiffnlp/twitter-roberta-base-sentiment-latest (open-source)'
      };
    } catch (error) {
      console.error('Text analysis error:', error);
      return {
        success: false,
        error: error.message,
        fallback: true
      };
    }
  }

  async generateEmbeddings(texts: string[]) {
    if (!this.embedder) {
      await this.initializeModels();
    }

    try {
      const embeddings = await this.embedder(texts, { pooling: 'mean', normalize: true });
      
      return {
        success: true,
        embeddings: embeddings.tolist(),
        model: 'mixedbread-ai/mxbai-embed-xsmall-v1 (open-source)',
        count: texts.length
      };
    } catch (error) {
      console.error('Embeddings error:', error);
      return { success: false, error: error.message };
    }
  }

  async summarizeContent(content: string) {
    if (!this.summarizer) {
      await this.initializeModels();
    }

    try {
      const summary = await this.summarizer(content, {
        max_length: 200,
        min_length: 50,
        do_sample: false
      });

      return {
        success: true,
        summary: summary[0].summary_text,
        model: 'facebook/bart-large-cnn (open-source)',
        original_length: content.length,
        summary_length: summary[0].summary_text.length
      };
    } catch (error) {
      console.error('Summarization error:', error);
      return { success: false, error: error.message };
    }
  }

  private getContextPrompt(type: string): string {
    const prompts = {
      presentation: 'You are an expert HR presentation creator. Generate professional content for business presentations with clear structure and actionable insights.',
      document: 'You are an expert HR policy writer. Create comprehensive, compliant documentation for Saudi Arabian HR practices and procedures.',
      analysis: 'You are an expert HR data analyst. Provide insightful analysis of workforce data, trends, and recommendations for improvement.'
    };
    
    return prompts[type as keyof typeof prompts] || prompts.analysis;
  }

  private generateTextAnalysis(text: string, sentiment: any) {
    const wordCount = text.split(' ').length;
    const sentences = text.split(/[.!?]+/).length - 1;
    
    return {
      word_count: wordCount,
      sentence_count: sentences,
      avg_words_per_sentence: Math.round(wordCount / sentences),
      sentiment_score: sentiment.score,
      sentiment_label: sentiment.label,
      reading_level: this.calculateReadingLevel(wordCount, sentences),
      key_metrics: {
        professional_tone: sentiment.label === 'POSITIVE' ? 'High' : 'Medium',
        clarity: sentences > 0 && wordCount / sentences < 20 ? 'High' : 'Medium',
        engagement: wordCount > 100 ? 'High' : 'Medium'
      }
    };
  }

  private calculateReadingLevel(words: number, sentences: number): string {
    if (sentences === 0) return 'Unknown';
    const avgWordsPerSentence = words / sentences;
    
    if (avgWordsPerSentence < 15) return 'Easy';
    if (avgWordsPerSentence < 20) return 'Medium';
    return 'Complex';
  }

  private getFallbackContent(prompt: string, type: string) {
    const fallbacks = {
      presentation: {
        title: `Professional Presentation: ${prompt}`,
        content: `This presentation covers key aspects of ${prompt} with focus on strategic implementation and measurable outcomes.`,
        sections: ['Executive Summary', 'Current State Analysis', 'Recommendations', 'Implementation Plan', 'Success Metrics']
      },
      document: {
        title: `HR Policy Document: ${prompt}`,
        content: `This document outlines policies and procedures related to ${prompt}, ensuring compliance with Saudi labor regulations.`,
        sections: ['Purpose', 'Scope', 'Policy Statement', 'Procedures', 'Compliance Requirements']
      },
      analysis: {
        title: `HR Analytics Report: ${prompt}`,
        content: `Comprehensive analysis of ${prompt} with data-driven insights and actionable recommendations.`,
        sections: ['Data Overview', 'Key Findings', 'Trend Analysis', 'Risk Assessment', 'Recommendations']
      }
    };

    return {
      success: true,
      content: fallbacks[type as keyof typeof fallbacks] || fallbacks.analysis,
      fallback: true,
      model: 'local-fallback',
      note: 'Generated using local fallback due to model loading issues'
    };
  }
}

export const localAI = new LocalAIEngine();