import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.6.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, context, language, capabilities } = await req.json()
    
    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    if (!hfToken) {
      throw new Error('Hugging Face token not configured')
    }

    const hf = new HfInference(hfToken)
    console.log('Processing NLP task:', { prompt: prompt.substring(0, 100), language, capabilities })

    let result: any = {}
    let confidence = 0.8

    // Route to appropriate NLP model based on capabilities
    if (capabilities.includes('arabic-nlp') && language === 'ar') {
      // Arabic text processing
      try {
        const response = await hf.textGeneration({
          model: 'aubmindlab/bert-base-arabertv2',
          inputs: prompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            return_full_text: false
          }
        })
        result.response = response.generated_text
        confidence = 0.85
      } catch (error) {
        console.log('Arabic model fallback to general model')
        const response = await hf.textGeneration({
          model: 'microsoft/DialoGPT-medium',
          inputs: prompt,
          parameters: { max_new_tokens: 200 }
        })
        result.response = response.generated_text
        confidence = 0.75
      }
    }
    
    else if (capabilities.includes('sentiment-analysis')) {
      // Sentiment analysis
      const response = await hf.textClassification({
        model: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
        inputs: prompt
      })
      result.sentiment = response
      result.response = `Sentiment: ${response[0].label} (confidence: ${response[0].score.toFixed(2)})`
      confidence = response[0].score
    }
    
    else if (capabilities.includes('entity-recognition')) {
      // Named entity recognition
      const response = await hf.tokenClassification({
        model: 'dbmdz/bert-large-cased-finetuned-conll03-english',
        inputs: prompt
      })
      result.entities = response
      const entities = response.filter(entity => entity.entity !== 'O')
      result.response = `Found ${entities.length} entities: ${entities.map(e => `${e.word} (${e.entity})`).join(', ')}`
      confidence = 0.9
    }
    
    else if (capabilities.includes('text-classification')) {
      // General text classification for HR contexts
      const response = await hf.zeroShotClassification({
        model: 'facebook/bart-large-mnli',
        inputs: prompt,
        parameters: {
          candidate_labels: ['employee inquiry', 'policy question', 'technical support', 'complaint', 'suggestion', 'urgent matter']
        }
      })
      result.classification = response
      result.response = `Classified as: ${response.labels[0]} (confidence: ${response.scores[0].toFixed(2)})`
      confidence = response.scores[0]
    }
    
    else {
      // General text generation
      const response = await hf.textGeneration({
        model: 'microsoft/DialoGPT-large',
        inputs: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        }
      })
      result.response = response.generated_text
      confidence = 0.8
    }

    // Add context-aware enhancements
    if (context.module) {
      result.response += ` \n\n[Context: Processed for ${context.module} module]`
    }

    return new Response(JSON.stringify({
      result: result.response,
      confidence,
      metadata: {
        provider: 'huggingface-transformers',
        model_used: 'multiple',
        language,
        capabilities_used: capabilities,
        processing_time: Date.now(),
        full_result: result
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Hugging Face NLP error:', error)
    return new Response(JSON.stringify({
      error: 'NLP processing failed',
      details: error.message,
      result: 'I apologize, but I encountered an error processing your request. Please try again.',
      confidence: 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})