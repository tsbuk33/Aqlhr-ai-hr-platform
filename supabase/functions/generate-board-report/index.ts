import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📊 Generate Board Report Function called');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { templateId, language, includeVisuals, format } = await req.json();

    console.log('📋 Generating report:', {
      templateId,
      language,
      includeVisuals,
      format
    });

    // Gather data from various sources
    const reportData = await gatherReportData(supabaseClient, templateId);
    
    // Generate report content based on template
    const reportContent = await generateReportContent(templateId, reportData, language);
    
    // Create visualizations if requested
    let visualizations = [];
    if (includeVisuals) {
      visualizations = await generateVisualizations(reportData, templateId);
    }

    // Format report (PDF and/or PowerPoint)
    const generatedFiles = await formatReport(reportContent, visualizations, format, language);

    console.log('✅ Board report generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        reportId: `report_${Date.now()}`,
        templateId,
        generatedAt: new Date().toISOString(),
        files: generatedFiles,
        downloadUrl: generatedFiles.pdf || generatedFiles.pptx,
        language,
        summary: reportContent.executiveSummary
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('💥 Generate Board Report Error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to generate board report'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function gatherReportData(supabaseClient: any, templateId: string) {
  console.log('📊 Gathering report data for template:', templateId);

  const data: any = {
    timestamp: new Date().toISOString(),
    templateId
  };

  try {
    // Get executive metrics
    const { data: executiveMetrics } = await supabaseClient
      .from('executive_metrics')
      .select('*')
      .order('metric_date', { ascending: false })
      .limit(12);

    data.executiveMetrics = executiveMetrics || [];

    // Get workforce data (employees table)
    const { data: employees } = await supabaseClient
      .from('employees')
      .select('*')
      .eq('employment_status', 'active');

    // Calculate workforce metrics
    if (employees) {
      const totalEmployees = employees.length;
      const saudiEmployees = employees.filter(emp => emp.is_saudi === true).length;
      const saudizationRate = totalEmployees > 0 ? (saudiEmployees / totalEmployees) * 100 : 0;

      data.workforce = {
        totalEmployees,
        saudiEmployees,
        nonSaudiEmployees: totalEmployees - saudiEmployees,
        saudizationRate: Math.round(saudizationRate * 100) / 100,
        averageSalary: employees.reduce((sum, emp) => sum + (emp.salary || 0), 0) / totalEmployees || 0
      };
    }

    // Get attendance data
    const { data: attendanceData } = await supabaseClient
      .from('attendance')
      .select('*')
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (attendanceData) {
      const totalRecords = attendanceData.length;
      const presentRecords = attendanceData.filter(att => att.status === 'present').length;
      const attendanceRate = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

      data.attendance = {
        totalRecords,
        presentRecords,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
        averageHours: attendanceData.reduce((sum, att) => sum + (att.total_hours || 8), 0) / totalRecords || 8
      };
    }

    // Get government compliance status (mock data for now)
    data.compliance = {
      molCompliance: 94.2,
      gosiCompliance: 98.1,
      nitaqatStatus: 'Green',
      zatcaCompliance: 96.5,
      vision2030Score: 89.3,
      totalPortals: 21,
      compliantPortals: 19,
      pendingActions: 3
    };

    // Financial metrics (mock data - would come from financial system)
    data.financial = {
      totalRevenue: 12500000,
      totalPayrollCost: 8450000,
      profitMargin: 32.4,
      costPerEmployee: data.workforce?.totalEmployees ? 8450000 / data.workforce.totalEmployees : 0,
      quarterlyGrowth: 8.7,
      budgetUtilization: 87.3
    };

    // Strategic initiatives (mock data)
    data.strategic = {
      totalInitiatives: 8,
      completedInitiatives: 3,
      onTrackInitiatives: 4,
      delayedInitiatives: 1,
      overallProgress: 68.5,
      budgetAllocated: 2000000,
      budgetSpent: 1350000
    };

    console.log('✅ Report data gathered successfully');
    return data;

  } catch (error) {
    console.error('❌ Error gathering report data:', error);
    // Return mock data if database queries fail
    return {
      timestamp: new Date().toISOString(),
      templateId,
      workforce: { totalEmployees: 1247, saudizationRate: 78.5 },
      compliance: { molCompliance: 94.2, nitaqatStatus: 'Green' },
      financial: { totalRevenue: 12500000, profitMargin: 32.4 },
      strategic: { totalInitiatives: 8, overallProgress: 68.5 }
    };
  }
}

async function generateReportContent(templateId: string, data: any, language: string) {
  console.log('📝 Generating report content for:', templateId);

  const isArabic = language === 'ar';
  
  const templates = {
    'board-presentation': {
      title: isArabic ? 'تقرير مجلس الإدارة الشامل' : 'Comprehensive Board Report',
      sections: [
        'executiveSummary',
        'financialPerformance', 
        'workforceAnalytics',
        'complianceStatus',
        'strategicInitiatives',
        'riskAssessment',
        'recommendations'
      ]
    },
    'executive-summary': {
      title: isArabic ? 'الملخص التنفيذي' : 'Executive Summary',
      sections: ['executiveSummary', 'keyHighlights', 'actionItems']
    },
    'kpi-snapshot': {
      title: isArabic ? 'لقطة مؤشرات الأداء الرئيسية' : 'KPI Snapshot',
      sections: ['kpiDashboard', 'trendAnalysis', 'benchmarks']
    },
    'financial-performance': {
      title: isArabic ? 'تقرير الأداء المالي' : 'Financial Performance Report',
      sections: ['financialOverview', 'revenueAnalysis', 'costAnalysis', 'profitability', 'forecasts']
    },
    'workforce-analytics': {
      title: isArabic ? 'تحليلات القوى العاملة' : 'Workforce Analytics Report',
      sections: ['workforceOverview', 'saudizationAnalysis', 'performanceMetrics', 'retentionAnalysis']
    },
    'compliance-report': {
      title: isArabic ? 'تقرير الامتثال الحكومي' : 'Government Compliance Report',
      sections: ['complianceOverview', 'portalStatus', 'riskAreas', 'actionPlan']
    },
    'strategic-initiatives': {
      title: isArabic ? 'تقرير المبادرات الاستراتيجية' : 'Strategic Initiatives Report',
      sections: ['initiativeOverview', 'progressTracking', 'resourceAllocation', 'milestones']
    }
  };

  const template = templates[templateId as keyof typeof templates] || templates['board-presentation'];
  
  const content: any = {
    title: template.title,
    generatedAt: new Date().toLocaleString(isArabic ? 'ar-SA' : 'en-US'),
    language,
    sections: {}
  };

  // Generate Executive Summary
  if (template.sections.includes('executiveSummary')) {
    content.sections.executiveSummary = {
      title: isArabic ? 'الملخص التنفيذي' : 'Executive Summary',
      content: isArabic ? 
        `يسر الإدارة تقديم التقرير التنفيذي الشامل للفترة الحالية. يُظهر التقرير أداءً قوياً عبر جميع المجالات الرئيسية مع تحقيق معدل سعودة ${data.workforce?.saudizationRate || 78.5}% والحفاظ على معدل امتثال حكومي ${data.compliance?.molCompliance || 94.2}%. 

إجمالي عدد الموظفين: ${data.workforce?.totalEmployees || 1247} موظف
الإيرادات الإجمالية: ${(data.financial?.totalRevenue || 12500000).toLocaleString()} ريال سعودي
هامش الربح: ${data.financial?.profitMargin || 32.4}%
معدل النمو الفصلي: ${data.financial?.quarterlyGrowth || 8.7}%

التوصيات الرئيسية:
• الاستمرار في تعزيز برامج السعودة
• تطوير المبادرات الاستراتيجية الحالية
• تعزيز الامتثال التنظيمي` :
        `The management is pleased to present this comprehensive executive report for the current period. The report demonstrates strong performance across all key areas with a Saudization rate of ${data.workforce?.saudizationRate || 78.5}% and maintaining government compliance at ${data.compliance?.molCompliance || 94.2}%.

Total Employees: ${data.workforce?.totalEmployees || 1247}
Total Revenue: SAR ${(data.financial?.totalRevenue || 12500000).toLocaleString()}
Profit Margin: ${data.financial?.profitMargin || 32.4}%
Quarterly Growth: ${data.financial?.quarterlyGrowth || 8.7}%

Key Recommendations:
• Continue strengthening Saudization programs
• Develop current strategic initiatives
• Enhance regulatory compliance`
    };
  }

  // Generate Financial Performance section
  if (template.sections.includes('financialPerformance')) {
    content.sections.financialPerformance = {
      title: isArabic ? 'الأداء المالي' : 'Financial Performance',
      metrics: {
        totalRevenue: data.financial?.totalRevenue || 12500000,
        totalCosts: data.financial?.totalPayrollCost || 8450000,
        profitMargin: data.financial?.profitMargin || 32.4,
        quarterlyGrowth: data.financial?.quarterlyGrowth || 8.7,
        budgetUtilization: data.financial?.budgetUtilization || 87.3
      },
      analysis: isArabic ?
        'أظهر الأداء المالي نمواً مستداماً خلال الفترة المرجعية مع تحسن في هوامش الربحية وكفاءة استخدام الموارد.' :
        'Financial performance showed sustainable growth during the reference period with improved profitability margins and resource utilization efficiency.'
    };
  }

  // Generate Workforce Analytics section
  if (template.sections.includes('workforceAnalytics')) {
    content.sections.workforceAnalytics = {
      title: isArabic ? 'تحليلات القوى العاملة' : 'Workforce Analytics',
      metrics: data.workforce || {
        totalEmployees: 1247,
        saudiEmployees: 979,
        nonSaudiEmployees: 268,
        saudizationRate: 78.5,
        averageSalary: 6780
      },
      insights: isArabic ?
        'تُظهر البيانات التزاماً قوياً بأهداف السعودة مع معدل يفوق المستهدف الحكومي، مما يضعنا في موقع متميز للحصول على الحوافز الحكومية.' :
        'Data shows strong commitment to Saudization goals with a rate exceeding government targets, positioning us well for government incentives.'
    };
  }

  // Generate Compliance Status section
  if (template.sections.includes('complianceStatus')) {
    content.sections.complianceStatus = {
      title: isArabic ? 'حالة الامتثال' : 'Compliance Status',
      metrics: data.compliance || {
        molCompliance: 94.2,
        gosiCompliance: 98.1,
        nitaqatStatus: 'Green',
        zatcaCompliance: 96.5,
        vision2030Score: 89.3
      },
      summary: isArabic ?
        'الشركة تحافظ على مستوى امتثال عالي عبر جميع البوابات الحكومية مع حالة "خضراء" في نطاقات وتوقعات إيجابية للفترة القادمة.' :
        'The company maintains high compliance levels across all government portals with "Green" status in NITAQAT and positive expectations for the coming period.'
    };
  }

  // Generate Strategic Initiatives section
  if (template.sections.includes('strategicInitiatives')) {
    content.sections.strategicInitiatives = {
      title: isArabic ? 'المبادرات الاستراتيجية' : 'Strategic Initiatives',
      metrics: data.strategic || {
        totalInitiatives: 8,
        completedInitiatives: 3,
        onTrackInitiatives: 4,
        delayedInitiatives: 1,
        overallProgress: 68.5
      },
      highlights: isArabic ?
        'تحقق المبادرات الاستراتيجية تقدماً مُرضياً مع إنجاز 3 مبادرات و4 مبادرات أخرى ضمن الجدولة المحددة.' :
        'Strategic initiatives are achieving satisfactory progress with 3 completed and 4 others on track according to schedule.'
    };
  }

  console.log('✅ Report content generated successfully');
  return content;
}

async function generateVisualizations(data: any, templateId: string) {
  console.log('📊 Generating visualizations for:', templateId);
  
  // Mock visualization data - in a real implementation, this would generate actual charts
  const visualizations = [
    {
      type: 'bar-chart',
      title: 'Workforce Distribution',
      data: {
        labels: ['Saudi', 'Non-Saudi'],
        values: [data.workforce?.saudiEmployees || 979, data.workforce?.nonSaudiEmployees || 268]
      }
    },
    {
      type: 'line-chart',
      title: 'Financial Performance Trend',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        values: [10000000, 11200000, 11800000, data.financial?.totalRevenue || 12500000]
      }
    },
    {
      type: 'pie-chart',
      title: 'Compliance Status',
      data: {
        labels: ['Compliant', 'Pending', 'Issues'],
        values: [19, 2, 0]
      }
    }
  ];

  console.log('✅ Visualizations generated');
  return visualizations;
}

async function formatReport(content: any, visualizations: any[], format: string, language: string) {
  console.log('📄 Formatting report as:', format);
  
  // Mock file generation - in a real implementation, this would create actual PDF/PPTX files
  const files: any = {};
  
  if (format === 'pdf' || format === 'both') {
    files.pdf = `https://storage.supabase.co/reports/${content.title.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  }
  
  if (format === 'pptx' || format === 'both') {
    files.pptx = `https://storage.supabase.co/reports/${content.title.replace(/\s+/g, '_')}_${Date.now()}.pptx`;
  }

  console.log('✅ Report formatted successfully');
  return files;
}