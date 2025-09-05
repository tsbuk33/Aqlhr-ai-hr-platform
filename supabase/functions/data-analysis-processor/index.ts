import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DataPoint {
  [key: string]: any
}

interface AnalysisResult {
  summary: string
  insights: string[]
  visualizations: any[]
  recommendations: string[]
  statistics: any
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, data, analysisType = 'comprehensive' } = await req.json()
    
    console.log('Processing data analysis:', { query: query.substring(0, 100), analysisType, dataPoints: data?.length || 0 })

    if (!data || !Array.isArray(data)) {
      throw new Error('Data array is required for analysis')
    }

    // Perform data analysis based on query and type
    const analysisResult = await performDataAnalysis(query, data, analysisType)
    
    return new Response(JSON.stringify({
      result: formatAnalysisResponse(analysisResult),
      confidence: analysisResult.confidence,
      metadata: {
        provider: 'pandasai-analyzer',
        analysis_type: analysisType,
        data_points: data.length,
        processing_time: Date.now(),
        insights_count: analysisResult.insights.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Data analysis error:', error)
    return new Response(JSON.stringify({
      error: 'Data analysis failed',
      details: error.message,
      result: 'I apologize, but I encountered an error analyzing your data. Please ensure your data is in the correct format.',
      confidence: 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})

async function performDataAnalysis(query: string, data: DataPoint[], analysisType: string): Promise<AnalysisResult & { confidence: number }> {
  const startTime = Date.now()
  
  // Basic statistics
  const statistics = calculateBasicStatistics(data)
  
  // Generate insights based on query
  const insights = generateInsights(query, data, statistics)
  
  // Create visualizations metadata
  const visualizations = generateVisualizationSuggestions(data, query)
  
  // Generate recommendations
  const recommendations = generateRecommendations(query, data, insights)
  
  // Create summary
  const summary = generateSummary(query, data, insights, statistics)
  
  const processingTime = Date.now() - startTime
  
  return {
    summary,
    insights,
    visualizations,
    recommendations,
    statistics,
    confidence: calculateConfidence(data, insights, processingTime)
  }
}

function calculateBasicStatistics(data: DataPoint[]): any {
  const stats: any = {
    total_records: data.length,
    fields: {},
    summary: {}
  }
  
  if (data.length === 0) return stats
  
  // Analyze each field
  const fields = Object.keys(data[0])
  
  fields.forEach(field => {
    const values = data.map(row => row[field]).filter(val => val !== null && val !== undefined)
    const fieldType = detectFieldType(values)
    
    stats.fields[field] = { type: fieldType, non_null_count: values.length }
    
    if (fieldType === 'numeric') {
      const numericValues = values.map(v => parseFloat(v)).filter(v => !isNaN(v))
      stats.fields[field] = {
        ...stats.fields[field],
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        avg: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
        sum: numericValues.reduce((a, b) => a + b, 0)
      }
    } else if (fieldType === 'categorical') {
      const uniqueValues = [...new Set(values)]
      stats.fields[field] = {
        ...stats.fields[field],
        unique_count: uniqueValues.length,
        top_values: getTopValues(values)
      }
    }
  })
  
  return stats
}

function detectFieldType(values: any[]): 'numeric' | 'categorical' | 'date' | 'text' {
  if (values.length === 0) return 'text'
  
  const sample = values.slice(0, Math.min(100, values.length))
  
  // Check if numeric
  const numericCount = sample.filter(val => 
    !isNaN(parseFloat(val)) && isFinite(val)
  ).length
  
  if (numericCount > sample.length * 0.8) return 'numeric'
  
  // Check if date
  const dateCount = sample.filter(val => {
    const date = new Date(val)
    return !isNaN(date.getTime())
  }).length
  
  if (dateCount > sample.length * 0.6) return 'date'
  
  // Check if categorical (limited unique values)
  const uniqueValues = new Set(sample)
  if (uniqueValues.size < sample.length * 0.5) return 'categorical'
  
  return 'text'
}

function getTopValues(values: any[], limit = 5): Array<{ value: any, count: number }> {
  const counts: { [key: string]: number } = {}
  
  values.forEach(val => {
    const key = String(val)
    counts[key] = (counts[key] || 0) + 1
  })
  
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }))
}

function generateInsights(query: string, data: DataPoint[], stats: any): string[] {
  const insights: string[] = []
  const lowerQuery = query.toLowerCase()
  
  // General insights
  insights.push(`Dataset contains ${stats.total_records} records with ${Object.keys(stats.fields).length} fields`)
  
  // Field-specific insights
  Object.entries(stats.fields).forEach(([field, fieldStats]: [string, any]) => {
    if (fieldStats.type === 'numeric') {
      insights.push(`${field}: Average is ${fieldStats.avg.toFixed(2)}, ranging from ${fieldStats.min} to ${fieldStats.max}`)
    } else if (fieldStats.type === 'categorical') {
      const topValue = fieldStats.top_values[0]
      insights.push(`${field}: Most common value is "${topValue.value}" (${topValue.count} occurrences)`)
    }
  })
  
  // Query-specific insights
  if (lowerQuery.includes('salary') || lowerQuery.includes('pay')) {
    const salaryFields = Object.keys(stats.fields).filter(field => 
      field.toLowerCase().includes('salary') || 
      field.toLowerCase().includes('pay') ||
      field.toLowerCase().includes('compensation')
    )
    
    salaryFields.forEach(field => {
      if (stats.fields[field].type === 'numeric') {
        insights.push(`💰 ${field} analysis: Average ${stats.fields[field].avg.toFixed(0)} SAR, highest ${stats.fields[field].max} SAR`)
      }
    })
  }
  
  if (lowerQuery.includes('department') || lowerQuery.includes('team')) {
    const deptFields = Object.keys(stats.fields).filter(field =>
      field.toLowerCase().includes('department') ||
      field.toLowerCase().includes('team') ||
      field.toLowerCase().includes('division')
    )
    
    deptFields.forEach(field => {
      if (stats.fields[field].type === 'categorical') {
        insights.push(`🏢 ${field}: ${stats.fields[field].unique_count} different departments/teams identified`)
      }
    })
  }
  
  if (lowerQuery.includes('performance') || lowerQuery.includes('rating')) {
    const perfFields = Object.keys(stats.fields).filter(field =>
      field.toLowerCase().includes('performance') ||
      field.toLowerCase().includes('rating') ||
      field.toLowerCase().includes('score')
    )
    
    perfFields.forEach(field => {
      if (stats.fields[field].type === 'numeric') {
        insights.push(`📊 ${field}: Average performance score is ${stats.fields[field].avg.toFixed(1)}`)
      }
    })
  }
  
  return insights
}

function generateVisualizationSuggestions(data: DataPoint[], query: string): any[] {
  const visualizations: any[] = []
  const lowerQuery = query.toLowerCase()
  
  if (data.length === 0) return visualizations
  
  const fields = Object.keys(data[0])
  const numericFields = fields.filter(field => {
    const values = data.map(row => row[field])
    return values.some(val => !isNaN(parseFloat(val)))
  })
  
  const categoricalFields = fields.filter(field => {
    const uniqueValues = new Set(data.map(row => row[field]))
    return uniqueValues.size < data.length * 0.5
  })
  
  // Suggest appropriate chart types
  if (numericFields.length > 0) {
    visualizations.push({
      type: 'histogram',
      title: `Distribution of ${numericFields[0]}`,
      field: numericFields[0],
      description: `Shows the frequency distribution of ${numericFields[0]} values`
    })
  }
  
  if (categoricalFields.length > 0) {
    visualizations.push({
      type: 'pie_chart',
      title: `${categoricalFields[0]} Distribution`,
      field: categoricalFields[0],
      description: `Shows the proportion of different ${categoricalFields[0]} categories`
    })
  }
  
  if (numericFields.length > 1) {
    visualizations.push({
      type: 'scatter_plot',
      title: `${numericFields[0]} vs ${numericFields[1]}`,
      x_field: numericFields[0],
      y_field: numericFields[1],
      description: `Explores the relationship between ${numericFields[0]} and ${numericFields[1]}`
    })
  }
  
  if (categoricalFields.length > 0 && numericFields.length > 0) {
    visualizations.push({
      type: 'bar_chart',
      title: `Average ${numericFields[0]} by ${categoricalFields[0]}`,
      category_field: categoricalFields[0],
      value_field: numericFields[0],
      description: `Compares average ${numericFields[0]} across different ${categoricalFields[0]} categories`
    })
  }
  
  return visualizations
}

function generateRecommendations(query: string, data: DataPoint[], insights: string[]): string[] {
  const recommendations: string[] = []
  const lowerQuery = query.toLowerCase()
  
  // Data quality recommendations
  if (data.length < 100) {
    recommendations.push('Consider collecting more data points for more robust analysis')
  }
  
  // Query-specific recommendations
  if (lowerQuery.includes('salary') || lowerQuery.includes('compensation')) {
    recommendations.push('Review salary equity across departments and experience levels')
    recommendations.push('Consider conducting salary benchmarking against market rates')
  }
  
  if (lowerQuery.includes('performance')) {
    recommendations.push('Implement regular performance review cycles')
    recommendations.push('Identify high performers for recognition and development opportunities')
  }
  
  if (lowerQuery.includes('turnover') || lowerQuery.includes('retention')) {
    recommendations.push('Analyze exit interview data to identify improvement areas')
    recommendations.push('Develop retention strategies for high-risk employee segments')
  }
  
  if (lowerQuery.includes('diversity') || lowerQuery.includes('gender')) {
    recommendations.push('Monitor diversity metrics regularly to ensure inclusive hiring')
    recommendations.push('Implement bias training and inclusive leadership programs')
  }
  
  // General HR recommendations
  recommendations.push('Set up automated reporting for key HR metrics')
  recommendations.push('Establish benchmarks and targets for continuous improvement')
  
  return recommendations
}

function generateSummary(query: string, data: DataPoint[], insights: string[], stats: any): string {
  let summary = `**Data Analysis Summary**\n\n`
  summary += `Analyzed ${stats.total_records} records in response to: "${query}"\n\n`
  
  summary += `**Key Findings:**\n`
  insights.slice(0, 3).forEach(insight => {
    summary += `• ${insight}\n`
  })
  
  summary += `\n**Data Overview:**\n`
  summary += `• Total records: ${stats.total_records}\n`
  summary += `• Fields analyzed: ${Object.keys(stats.fields).length}\n`
  
  const numericFields = Object.entries(stats.fields).filter(([, field]: [string, any]) => field.type === 'numeric').length
  const categoricalFields = Object.entries(stats.fields).filter(([, field]: [string, any]) => field.type === 'categorical').length
  
  summary += `• Numeric fields: ${numericFields}\n`
  summary += `• Categorical fields: ${categoricalFields}\n`
  
  return summary
}

function calculateConfidence(data: DataPoint[], insights: string[], processingTime: number): number {
  let confidence = 0.7 // Base confidence
  
  // Data size factor
  if (data.length > 1000) confidence += 0.1
  else if (data.length > 100) confidence += 0.05
  else if (data.length < 10) confidence -= 0.2
  
  // Insights quality factor
  if (insights.length > 5) confidence += 0.1
  else if (insights.length < 2) confidence -= 0.1
  
  // Processing time factor (faster = more confident)
  if (processingTime < 1000) confidence += 0.05
  else if (processingTime > 5000) confidence -= 0.05
  
  return Math.max(0.1, Math.min(0.95, confidence))
}

function formatAnalysisResponse(result: AnalysisResult): string {
  let response = result.summary + '\n\n'
  
  if (result.insights.length > 0) {
    response += '**📊 Key Insights:**\n'
    result.insights.forEach(insight => {
      response += `• ${insight}\n`
    })
    response += '\n'
  }
  
  if (result.visualizations.length > 0) {
    response += '**📈 Recommended Visualizations:**\n'
    result.visualizations.forEach(viz => {
      response += `• ${viz.title} (${viz.type}): ${viz.description}\n`
    })
    response += '\n'
  }
  
  if (result.recommendations.length > 0) {
    response += '**💡 Recommendations:**\n'
    result.recommendations.forEach(rec => {
      response += `• ${rec}\n`
    })
  }
  
  return response
}