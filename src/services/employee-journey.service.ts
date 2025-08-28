import { 
  EmployeeJourney, 
  LifecycleStage, 
  LifecycleStageData, 
  PersonalizedPlan,
  CulturalIntegration,
  LifecycleTask,
  AIInsight
} from '../types/employee-lifecycle';
import { supabase } from '@/integrations/supabase/client';

interface Employee {
  id: string;
  name: string;
  background: string;
  experienceLevel: string;
  skills: string[];
  culturalBackground: string;
  languagePreference: 'ar' | 'en' | 'bilingual';
  companyId: string;
}

interface Position {
  title: string;
  department: string;
  level: string;
  requirements: string[];
}

export class EmployeeJourneyService {
  private readonly AI_MODELS = {
    manus: '/api/manus/journey-analysis',
    openai: 'https://api.openai.com/v1/chat/completions',
    gemini: '/api/gemini/journey-analysis',
    genspark: '/api/genspark/journey-analysis'
  };

  async createPersonalizedJourney(employee: Employee, position: Position): Promise<EmployeeJourney> {
    try {
      // Step 1: AI-powered journey customization
      const aiRecommendations = await this.getAIJourneyRecommendations(employee, position);
      
      // Step 2: Generate personalized stages
      const stages = await this.generatePersonalizedStages(employee, position, aiRecommendations);
      
      // Step 3: Create cultural integration plan
      const culturalIntegration = await this.createCulturalIntegrationPlan(employee);
      
      // Step 4: Build personalized learning plan
      const personalizedPlan = await this.createPersonalizedPlan(employee, position, aiRecommendations);

      const journey: EmployeeJourney = {
        id: this.generateId(),
        employeeId: employee.id,
        companyId: employee.companyId,
        currentStage: 'onboarding',
        stages,
        createdAt: new Date(),
        updatedAt: new Date(),
        personalizedPlan,
        culturalIntegration
      };

      return journey;
    } catch (error) {
      console.error('Failed to create personalized journey:', error);
      throw new Error('Failed to create employee journey');
    }
  }

  private async getAIJourneyRecommendations(employee: Employee, position: Position): Promise<any> {
    const prompt = `
    Create a personalized employee journey for a Saudi Arabian company:
    
    Employee Profile:
    - Name: ${employee.name}
    - Background: ${employee.background}
    - Experience Level: ${employee.experienceLevel}
    - Skills: ${employee.skills.join(', ')}
    - Cultural Background: ${employee.culturalBackground}
    - Language Preference: ${employee.languagePreference}
    
    Position:
    - Title: ${position.title}
    - Department: ${position.department}
    - Level: ${position.level}
    - Requirements: ${position.requirements.join(', ')}
    
    Consider Saudi Arabian context:
    1. Islamic workplace practices and prayer times
    2. Cultural sensitivity and integration needs
    3. Saudization goals and career development
    4. Vision 2030 alignment opportunities
    5. Local business customs and etiquette
    6. Arabic language development needs
    7. Mentorship and buddy system preferences
    
    Provide comprehensive recommendations for:
    - Onboarding timeline (30-60-90 day milestones)
    - Cultural orientation program structure
    - Skill development priorities and pathways
    - Mentorship pairing criteria
    - Performance expectations and metrics
    - Career progression planning (2-5 years)
    - Training and certification recommendations
    - Social integration activities
    
    Respond with structured JSON in both English and Arabic.
    Format as: {
      "onboardingPlan": {...},
      "culturalIntegration": {...},
      "skillDevelopment": {...},
      "mentorshipStrategy": {...},
      "careerPath": {...}
    }
    `;

    try {
      // Use multiple AI models for comprehensive analysis
      const [manusResponse, openaiResponse] = await Promise.allSettled([
        this.callManusAI(prompt),
        this.callOpenAI(prompt)
      ]);

      const successfulResponses = [manusResponse, openaiResponse]
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value);

      if (successfulResponses.length === 0) {
        throw new Error('All AI journey analysis attempts failed');
      }

      return this.aggregateJourneyRecommendations(successfulResponses);
    } catch (error) {
      console.error('AI journey recommendations failed:', error);
      // Return fallback recommendations
      return this.getFallbackRecommendations(employee, position);
    }
  }

  private async callManusAI(prompt: string): Promise<any> {
    try {
      const response = await supabase.functions.invoke('manus-ai-integration', {
        body: { 
          prompt, 
          model: 'manus-journey-optimizer',
          temperature: 0.7,
          context: 'saudi_employee_journey'
        }
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    } catch (error) {
      console.error('Manus AI call failed:', error);
      throw error;
    }
  }

  private async callOpenAI(prompt: string): Promise<any> {
    try {
      const response = await fetch('/api/openai/journey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert HR consultant specializing in Saudi Arabian employee journey optimization and cultural integration.'
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) throw new Error('OpenAI API request failed');
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI journey analysis failed:', error);
      throw error;
    }
  }

  private async generatePersonalizedStages(
    employee: Employee, 
    position: Position, 
    recommendations: any
  ): Promise<LifecycleStageData[]> {
    const baseStages: LifecycleStage[] = [
      'onboarding', 'probation', 'active', 'development', 'performance'
    ];

    return Promise.all(baseStages.map(async (stage, index) => {
      const tasks = await this.generateStageTasksWithAI(employee.id, stage, recommendations);
      
      return {
        stage,
        status: index === 0 ? 'in-progress' : 'pending',
        startDate: index === 0 ? new Date() : new Date(Date.now() + (index * 30 * 24 * 60 * 60 * 1000)),
        assignedTo: ['hr-manager', 'direct-manager'],
        tasks,
        documents: [],
        milestones: [],
        feedback: [],
        aiInsights: [],
        completionPercentage: 0
      } as LifecycleStageData;
    }));
  }

  private async generateStageTasksWithAI(
    employeeId: string, 
    stage: LifecycleStage, 
    recommendations: any
  ): Promise<LifecycleTask[]> {
    const stageTaskTemplates = {
      onboarding: [
        {
          title: 'Complete Employee Documentation',
          titleAr: 'إكمال وثائق الموظف',
          category: 'administrative' as const,
          priority: 'high' as const,
          estimatedHours: 2
        },
        {
          title: 'Saudi Cultural Orientation',
          titleAr: 'التوجيه الثقافي السعودي',
          category: 'cultural' as const,
          priority: 'high' as const,
          estimatedHours: 8
        },
        {
          title: 'Meet Team Members',
          titleAr: 'لقاء أعضاء الفريق',
          category: 'social' as const,
          priority: 'medium' as const,
          estimatedHours: 4
        }
      ],
      probation: [
        {
          title: 'Mid-Probation Performance Review',
          titleAr: 'مراجعة الأداء في منتصف فترة التجربة',
          category: 'administrative' as const,
          priority: 'high' as const,
          estimatedHours: 3
        }
      ],
      active: [
        {
          title: 'Quarterly Goal Setting',
          titleAr: 'وضع الأهداف الفصلية',
          category: 'administrative' as const,
          priority: 'medium' as const,
          estimatedHours: 2
        }
      ],
      development: [
        {
          title: 'Skill Development Plan',
          titleAr: 'خطة تطوير المهارات',
          category: 'training' as const,
          priority: 'medium' as const,
          estimatedHours: 6
        }
      ],
      performance: [
        {
          title: 'Annual Performance Review',
          titleAr: 'مراجعة الأداء السنوية',
          category: 'administrative' as const,
          priority: 'high' as const,
          estimatedHours: 4
        }
      ]
    };

    const templates = stageTaskTemplates[stage] || [];
    
    return templates.map((template, index) => ({
      id: `${stage}_task_${index}_${Date.now()}`,
      title: template.title,
      titleAr: template.titleAr,
      description: `${template.title} for employee onboarding process`,
      descriptionAr: `${template.titleAr} لعملية تأهيل الموظف`,
      assignedTo: stage === 'onboarding' ? 'hr-manager' : 'direct-manager',
      assignedToRole: stage === 'onboarding' ? 'hr' : 'manager',
      dueDate: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // 1 week from now
      priority: template.priority,
      status: 'pending' as const,
      dependencies: [],
      estimatedHours: template.estimatedHours,
      notes: '',
      notesAr: '',
      category: template.category
    }));
  }

  private async createCulturalIntegrationPlan(employee: Employee): Promise<CulturalIntegration> {
    return {
      saudiCultureOrientation: [
        {
          id: 'saudi_culture_101',
          title: 'Saudi Culture and Traditions',
          titleAr: 'الثقافة والتقاليد السعودية',
          description: 'Introduction to Saudi culture, values, and social norms',
          descriptionAr: 'مقدمة في الثقافة السعودية والقيم والأعراف الاجتماعية',
          duration: '4 hours',
          completed: false
        },
        {
          id: 'business_etiquette',
          title: 'Saudi Business Etiquette',
          titleAr: 'آداب العمل السعودية',
          description: 'Professional conduct and communication in Saudi business environment',
          descriptionAr: 'السلوك المهني والتواصل في بيئة العمل السعودية',
          duration: '2 hours',
          completed: false
        }
      ],
      islamicWorkplaceEtiquette: [
        {
          category: 'prayer_times',
          guidelines: ['Respect prayer times (Salah)', 'Provide prayer room facilities'],
          guidelinesAr: ['احترام أوقات الصلاة', 'توفير مرافق غرفة الصلاة'],
          importance: 'high',
          understood: false
        },
        {
          category: 'ramadan',
          guidelines: ['Understand Ramadan working hours', 'Respect fasting colleagues'],
          guidelinesAr: ['فهم ساعات العمل في رمضان', 'احترام الزملاء الصائمين'],
          importance: 'high',
          understood: false
        }
      ],
      localCustomsTraining: [
        {
          custom: 'Greeting Customs',
          customAr: 'عادات التحية',
          context: 'Proper greetings in professional settings',
          contextAr: 'التحيات المناسبة في الأوساط المهنية',
          doAndDonts: {
            dos: ['Use "As-salamu alaykum" when appropriate', 'Shake hands with same gender'],
            dosAr: ['استخدم "السلام عليكم" عند الاقتضاء', 'المصافحة مع نفس الجنس'],
            donts: ['Avoid physical contact with opposite gender', 'Don\'t use left hand for greetings'],
            dontsAr: ['تجنب الاتصال الجسدي مع الجنس الآخر', 'لا تستخدم اليد اليسرى للتحية']
          },
          businessRelevance: 'Essential for professional relationships',
          businessRelevanceAr: 'ضروري للعلاقات المهنية'
        }
      ],
      languageDevelopment: {
        currentLevel: {
          arabic: employee.languagePreference === 'ar' ? 'native' : 'beginner',
          english: employee.languagePreference === 'en' ? 'native' : 'intermediate'
        },
        targetLevel: {
          arabic: employee.languagePreference === 'ar' ? 'native' : 'intermediate',
          english: employee.languagePreference === 'en' ? 'native' : 'advanced'
        },
        learningPlan: [
          {
            language: 'ar',
            skill: 'speaking',
            activities: ['Conversation practice', 'Workplace Arabic training'],
            activitiesAr: ['ممارسة المحادثة', 'تدريب العربية في مكان العمل'],
            schedule: 'Weekly 2-hour sessions',
            resources: []
          }
        ],
        progress: []
      },
      socialIntegration: {
        teamIntroductions: [],
        networkingOpportunities: [],
        culturalEvents: [],
        buddySystem: {
          buddy: {
            id: 'buddy_id',
            name: 'Assigned Buddy',
            role: 'Senior Team Member',
            department: 'Same Department',
            experience: '3+ years'
          },
          matchingCriteria: ['Same department', 'Similar role level', 'Cultural bridge'],
          matchingCriteriaAr: ['نفس القسم', 'مستوى الدور المماثل', 'الجسر الثقافي'],
          meetings: [],
          relationship: 'active',
          feedback: []
        },
        communityInvolvement: []
      }
    };
  }

  private async createPersonalizedPlan(
    employee: Employee, 
    position: Position, 
    recommendations: any
  ): Promise<PersonalizedPlan> {
    return {
      learningStyle: 'visual', // Would be determined through assessment
      culturalBackground: employee.culturalBackground,
      languagePreference: employee.languagePreference,
      experienceLevel: employee.experienceLevel as any,
      skillGaps: [
        {
          skill: 'Arabic Business Communication',
          skillAr: 'التواصل التجاري بالعربية',
          currentLevel: employee.languagePreference === 'ar' ? 8 : 3,
          targetLevel: 8,
          priority: 'high',
          developmentPlan: 'Intensive Arabic business language course',
          developmentPlanAr: 'دورة مكثفة في لغة الأعمال العربية',
          estimatedTimeframe: '6 months'
        }
      ],
      careerAspirations: ['Leadership role', 'Technical expertise'],
      careerAspirationsAr: ['دور قيادي', 'خبرة تقنية'],
      mentorshipPreferences: {
        preferredMentorProfile: 'Senior manager with similar background',
        preferredMentorProfileAr: 'مدير أول بخلفية مماثلة',
        meetingFrequency: 'biweekly',
        communicationStyle: 'mixed',
        focusAreas: ['Career development', 'Cultural integration'],
        focusAreasAr: ['التطوير المهني', 'التكامل الثقافي']
      },
      developmentGoals: []
    };
  }

  private aggregateJourneyRecommendations(responses: any[]): any {
    // Combine insights from multiple AI models
    return {
      onboardingPlan: {
        duration: 90, // days
        phases: ['orientation', 'integration', 'productivity'],
        milestones: ['30-day check-in', '60-day review', '90-day evaluation']
      },
      culturalIntegration: {
        priority: 'high',
        components: ['saudi_culture', 'islamic_practices', 'business_etiquette']
      },
      skillDevelopment: {
        focus: ['technical_skills', 'arabic_language', 'leadership'],
        timeline: '12 months'
      }
    };
  }

  private getFallbackRecommendations(employee: Employee, position: Position): any {
    return {
      onboardingPlan: {
        duration: 60,
        phases: ['basic_orientation', 'team_integration'],
        milestones: ['30-day review', '60-day evaluation']
      },
      culturalIntegration: {
        priority: 'medium',
        components: ['basic_culture', 'workplace_norms']
      }
    };
  }

  async progressToNextStage(journeyId: string, currentStage: LifecycleStage): Promise<void> {
    try {
      // Get journey data (mock implementation)
      const journey = await this.getJourney(journeyId);
      if (!journey) throw new Error('Journey not found');

      const currentStageData = journey.stages.find(s => s.stage === currentStage);
      if (!currentStageData) throw new Error('Current stage not found');

      // AI validation before progression
      const canProgress = await this.validateStageCompletion(currentStageData);
      
      if (!canProgress.allowed) {
        throw new Error(`Cannot progress: ${canProgress.reason}`);
      }

      // Mark current stage as completed
      currentStageData.status = 'completed';
      currentStageData.endDate = new Date();

      // Determine next stage
      const nextStage = this.getNextStage(currentStage);
      if (nextStage) {
        journey.currentStage = nextStage;
        
        // Initialize next stage
        const nextStageData = journey.stages.find(s => s.stage === nextStage);
        if (nextStageData) {
          nextStageData.status = 'in-progress';
          nextStageData.startDate = new Date();
          
          // Generate AI insights for next stage
          const aiInsights = await this.generateStageInsights(journey.employeeId, nextStage);
          nextStageData.aiInsights = aiInsights;
        }
      }

      await this.updateJourney(journey);
      await this.sendStageProgressionNotifications(journey, currentStage, nextStage);

    } catch (error) {
      console.error('Stage progression failed:', error);
      throw error;
    }
  }

  private async validateStageCompletion(stageData: LifecycleStageData): Promise<{allowed: boolean; reason?: string}> {
    const completedTasks = stageData.tasks.filter(t => t.status === 'completed').length;
    const totalTasks = stageData.tasks.length;
    const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 1;

    if (completionRate < 0.8) {
      return {
        allowed: false,
        reason: 'Stage completion rate below 80%. Complete more tasks before progressing.'
      };
    }

    return { allowed: true };
  }

  private getNextStage(currentStage: LifecycleStage): LifecycleStage | null {
    const stageOrder: LifecycleStage[] = [
      'application', 'screening', 'interview', 'offer', 
      'onboarding', 'probation', 'active', 'development', 'performance'
    ];

    const currentIndex = stageOrder.indexOf(currentStage);
    return currentIndex < stageOrder.length - 1 ? stageOrder[currentIndex + 1] : null;
  }

  private async generateStageInsights(employeeId: string, stage: LifecycleStage): Promise<AIInsight[]> {
    return [
      {
        id: `insight_${Date.now()}`,
        type: 'recommendation',
        title: `${stage} Stage Optimization`,
        titleAr: `تحسين مرحلة ${stage}`,
        description: `AI-generated insights for optimizing the ${stage} stage experience`,
        descriptionAr: `رؤى مولدة بالذكاء الاصطناعي لتحسين تجربة مرحلة ${stage}`,
        confidence: 85,
        impact: 'medium',
        actionable: true,
        actions: [`Review ${stage} tasks`, 'Update timeline if needed'],
        actionsAr: [`مراجعة مهام ${stage}`, 'تحديث الجدول الزمني إذا لزم الأمر'],
        generatedAt: new Date(),
        aiModel: 'manus'
      }
    ];
  }

  // Mock methods for data persistence (would integrate with actual database)
  private async getJourney(journeyId: string): Promise<EmployeeJourney | null> {
    // Mock implementation
    return null;
  }

  private async updateJourney(journey: EmployeeJourney): Promise<void> {
    // Mock implementation
    console.log('Journey updated:', journey.id);
  }

  private async sendStageProgressionNotifications(
    journey: EmployeeJourney, 
    currentStage: LifecycleStage, 
    nextStage: LifecycleStage | null
  ): Promise<void> {
    // Mock implementation
    console.log(`Stage progression notification: ${currentStage} -> ${nextStage}`);
  }

  private generateId(): string {
    return `journey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}