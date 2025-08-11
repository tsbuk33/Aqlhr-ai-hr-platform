import { pipeline } from '@huggingface/transformers';

class LocalAIEngine {
  private textGenerator: any = null;
  private classifier: any = null;
  private embedder: any = null;
  private summarizer: any = null;
  private conversationalAI: any = null;
  private codeGenerator: any = null;
  private questionAnswering: any = null;
  private modelPool: Map<string, any> = new Map();

  async initializeModels() {
    try {
      console.log('🚀 Loading Enhanced Open-Source AI Models...');
      
      // Enhanced text generation with better model
      this.textGenerator = await pipeline(
        'text-generation', 
        'microsoft/DialoGPT-medium', // Upgraded from small
        { device: 'webgpu' }
      );
      this.modelPool.set('text-generation', this.textGenerator);

      // Advanced conversational AI
      this.conversationalAI = await pipeline(
        'text-generation',
        'microsoft/DialoGPT-large', // Large model for complex conversations
        { device: 'webgpu' }
      );
      this.modelPool.set('conversational', this.conversationalAI);

      // Question answering system
      this.questionAnswering = await pipeline(
        'question-answering',
        'deepset/roberta-base-squad2', // Better Q&A model
        { device: 'webgpu' }
      );
      this.modelPool.set('qa', this.questionAnswering);

      // Enhanced text classification
      this.classifier = await pipeline(
        'text-classification',
        'cardiffnlp/twitter-roberta-base-sentiment-latest',
        { device: 'webgpu' }
      );
      this.modelPool.set('classification', this.classifier);

      // Better embeddings model
      this.embedder = await pipeline(
        'feature-extraction',
        'sentence-transformers/all-MiniLM-L6-v2', // Better embeddings
        { device: 'webgpu' }
      );
      this.modelPool.set('embeddings', this.embedder);

      // Enhanced summarization
      this.summarizer = await pipeline(
        'summarization',
        'facebook/bart-large-cnn',
        { device: 'webgpu' }
      );
      this.modelPool.set('summarization', this.summarizer);

      // Code generation capability
      this.codeGenerator = await pipeline(
        'text-generation',
        'microsoft/CodeGPT-small-py', // Code generation
        { device: 'webgpu' }
      );
      this.modelPool.set('code-generation', this.codeGenerator);

      console.log('✅ Enhanced Open-Source AI Models loaded successfully');
      console.log(`📊 Model Pool: ${this.modelPool.size} models ready`);
      return true;
    } catch (error) {
      console.error('❌ Error loading AI models:', error);
      console.log('🔄 Falling back to lighter models...');
      return await this.initializeLightweightModels();
    }
  }

  async initializeLightweightModels() {
    try {
      // Fallback to smaller, faster models
      this.textGenerator = await pipeline(
        'text-generation', 
        'microsoft/DialoGPT-small',
        { device: 'webgpu' }
      );
      
      this.classifier = await pipeline(
        'text-classification',
        'cardiffnlp/twitter-roberta-base-sentiment-latest',
        { device: 'webgpu' }
      );

      this.embedder = await pipeline(
        'feature-extraction',
        'mixedbread-ai/mxbai-embed-xsmall-v1',
        { device: 'webgpu' }
      );

      console.log('✅ Lightweight models loaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to load even lightweight models:', error);
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

  async answerQuestion(question: string, context: string) {
    if (!this.questionAnswering) {
      await this.initializeModels();
    }

    try {
      const answer = await this.questionAnswering({
        question: question,
        context: context
      });

      return {
        success: true,
        answer: answer.answer,
        confidence: answer.score,
        model: 'deepset/roberta-base-squad2 (open-source)',
        context_used: context.length > 100 ? context.substring(0, 100) + '...' : context
      };
    } catch (error) {
      console.error('Question answering error:', error);
      return { success: false, error: error.message };
    }
  }

  async generateConversation(prompt: string, conversationHistory: string[] = []) {
    const model = this.conversationalAI || this.textGenerator;
    if (!model) {
      await this.initializeModels();
    }

    try {
      const context = conversationHistory.length > 0 
        ? conversationHistory.join('\n') + '\n' + prompt
        : prompt;

      const result = await (this.conversationalAI || this.textGenerator)(context, {
        max_new_tokens: 300,
        temperature: 0.8,
        do_sample: true,
        top_p: 0.9,
        pad_token_id: 50256
      });

      return {
        success: true,
        response: result[0].generated_text.split(prompt)[1]?.trim() || result[0].generated_text,
        model: this.conversationalAI ? 'microsoft/DialoGPT-large (open-source)' : 'microsoft/DialoGPT-medium (open-source)',
        conversation_length: conversationHistory.length
      };
    } catch (error) {
      console.error('Conversation generation error:', error);
      return { success: false, error: error.message };
    }
  }

  async generateCode(description: string, language: string = 'python') {
    if (!this.codeGenerator) {
      await this.initializeModels();
    }

    try {
      const prompt = `# ${language} code for: ${description}\n`;
      const result = await this.codeGenerator(prompt, {
        max_new_tokens: 200,
        temperature: 0.3,
        do_sample: true,
        top_p: 0.9
      });

      return {
        success: true,
        code: result[0].generated_text.split(prompt)[1]?.trim() || result[0].generated_text,
        language: language,
        model: 'microsoft/CodeGPT-small-py (open-source)',
        description: description
      };
    } catch (error) {
      console.error('Code generation error:', error);
      return { success: false, error: error.message };
    }
  }

  async getModelStatus() {
    return {
      loaded_models: this.modelPool.size,
      available_models: Array.from(this.modelPool.keys()),
      capabilities: {
        text_generation: !!this.textGenerator,
        conversation: !!this.conversationalAI,
        question_answering: !!this.questionAnswering,
        classification: !!this.classifier,
        embeddings: !!this.embedder,
        summarization: !!this.summarizer,
        code_generation: !!this.codeGenerator
      },
      performance: {
        device: 'webgpu',
        ready: this.modelPool.size > 0
      }
    };
  }

  // Future: GPT-OSS 120B Integration placeholder
  async loadGPTOSS120B() {
    console.log('🚀 Preparing for GPT-OSS-120B integration...');
    
    try {
      // This will be implemented when the model is available
      // const gptOSS = await pipeline(
      //   'text-generation',
      //   'openai/gpt-oss-120b',
      //   { device: 'webgpu', dtype: 'fp16' }
      // );
      
      console.log('📋 GPT-OSS-120B integration coming soon!');
      return {
        success: false,
        message: 'GPT-OSS-120B not yet available in browser environment',
        alternative: 'Using enhanced DialoGPT-large for now'
      };
    } catch (error) {
      console.error('GPT-OSS-120B loading error:', error);
      return { success: false, error: error.message };
    }
  }

  // Manus.im integration placeholder
  async integrateManus() {
    console.log('🚀 Preparing for Manus.im integration...');
    
    return {
      success: false,
      message: 'Manus.im integration requires API setup',
      suggestion: 'Consider creating an edge function for Manus.im API calls'
    };
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