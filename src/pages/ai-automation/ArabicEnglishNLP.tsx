import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Languages, MessageSquare, Brain, Target, BarChart3, Globe, Zap, CheckCircle, ArrowRightLeft, Eye, Sparkles } from "lucide-react";
import { useState } from "react";

const ArabicEnglishNLP = () => {
  const { language } = useLanguage();
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  // Embedded translations
  const translations = {
    en: {
      title: "Arabic-English NLP Engine",
      description: "Advanced bilingual natural language processing with AI-powered translation, sentiment analysis, and text understanding",
      text_processed: "Text Processed",
      translation_accuracy: "Translation Accuracy",
      sentiment_analysis: "Sentiment Analysis",
      entity_recognition: "Entity Recognition",
      machine_translation: "Machine Translation",
      text_analysis: "Text Analysis",
      language_detection: "Language Detection",
      named_entity: "Named Entity Recognition",
      try_translator: "Try AI Translator",
      enter_text: "Enter text in Arabic or English...",
      translate: "Translate",
      translating: "Translating...",
      translation_features: "Translation Features",
      analysis_features: "Analysis Features",
      supported_languages: "Supported Languages",
      recent_translations: "Recent Translations",
      neural_models: "Neural Models",
      processing_speed: "Processing Speed",
      language_pairs: "Language Pairs",
      model_accuracy: "Model Accuracy",
      bidirectional: "Bidirectional Translation",
      contextual: "Contextual Understanding",
      real_time: "Real-time Processing",
      domain_specific: "Domain-specific Models"
    },
    ar: {
      title: "محرك معالجة اللغة العربية-الإنجليزية",
      description: "معالجة متقدمة للغة الطبيعية ثنائية اللغة مع ترجمة مدعومة بالذكاء الاصطناعي وتحليل المشاعر وفهم النصوص",
      text_processed: "النص المعالج",
      translation_accuracy: "دقة الترجمة",
      sentiment_analysis: "تحليل المشاعر",
      entity_recognition: "التعرف على الكيانات",
      machine_translation: "الترجمة الآلية",
      text_analysis: "تحليل النص",
      language_detection: "اكتشاف اللغة",
      named_entity: "التعرف على الكيانات المسماة",
      try_translator: "جرب المترجم الذكي",
      enter_text: "أدخل النص باللغة العربية أو الإنجليزية...",
      translate: "ترجم",
      translating: "جاري الترجمة...",
      translation_features: "ميزات الترجمة",
      analysis_features: "ميزات التحليل",
      supported_languages: "اللغات المدعومة",
      recent_translations: "الترجمات الحديثة",
      neural_models: "النماذج العصبية",
      processing_speed: "سرعة المعالجة",
      language_pairs: "أزواج اللغات",
      model_accuracy: "دقة النموذج",
      bidirectional: "الترجمة ثنائية الاتجاه",
      contextual: "الفهم السياقي",
      real_time: "المعالجة في الوقت الفعلي",
      domain_specific: "نماذج متخصصة بالمجال"
    }
  };

  const t = (key: string) => translations[language as keyof typeof translations][key as keyof typeof translations.en] || key;

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    // Simulate translation API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple mock translation
    const isArabic = /[\u0600-\u06FF]/.test(inputText);
    if (isArabic) {
      setTranslatedText("This is a translated version of the Arabic text you entered.");
    } else {
      setTranslatedText("هذه نسخة مترجمة من النص الإنجليزي الذي أدخلته.");
    }
    setIsTranslating(false);
  };
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('description')}
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('text_processed')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">2.3M</div>
            <p className="text-xs text-muted-foreground">
              +45K this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-success/20 bg-gradient-to-br from-success/5 to-success/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('translation_accuracy')}</CardTitle>
            <Target className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">94.7%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% improvement
            </p>
          </CardContent>
        </Card>

        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('sentiment_analysis')}</CardTitle>
            <Eye className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">89.2%</div>
            <p className="text-xs text-muted-foreground">
              Emotion detection rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('entity_recognition')}</CardTitle>
            <Brain className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">92.8%</div>
            <p className="text-xs text-muted-foreground">
              Named entity accuracy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Translator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            {t('try_translator')}
          </CardTitle>
          <CardDescription>
            Test our AI-powered Arabic-English translation engine
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Input Text</label>
              <Textarea
                placeholder={t('enter_text')}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[120px] resize-none"
                dir="auto"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Translation</label>
              <Textarea
                value={translatedText}
                readOnly
                className="min-h-[120px] resize-none bg-muted"
                placeholder="Translation will appear here..."
                dir="auto"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={handleTranslate} 
              disabled={isTranslating || !inputText.trim()}
              className="min-w-[120px]"
            >
              {isTranslating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  {t('translating')}
                </>
              ) : (
                <>
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  {t('translate')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              {t('machine_translation')}
            </CardTitle>
            <CardDescription>
              Neural machine translation with context awareness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Arabic → English</span>
                <Badge variant="secondary">95.2%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">English → Arabic</span>
                <Badge variant="secondary">94.1%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Real-time</span>
                <Badge variant="outline">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-success" />
              {t('text_analysis')}
            </CardTitle>
            <CardDescription>
              Comprehensive text understanding and analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Sentiment Score</span>
                <span className="text-sm font-medium">89.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Topic Classification</span>
                <span className="text-sm font-medium">91.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Intent Detection</span>
                <span className="text-sm font-medium">87.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              {t('language_detection')}
            </CardTitle>
            <CardDescription>
              Automatic language identification and script detection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Arabic Detection</span>
                <Badge variant="secondary">99.1%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">English Detection</span>
                <Badge variant="secondary">98.9%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Mixed Text</span>
                <Badge variant="outline">Supported</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-warning" />
              {t('named_entity')}
            </CardTitle>
            <CardDescription>
              Extract and classify entities in both languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Person Names</span>
                <span className="text-sm font-medium">94.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Organizations</span>
                <span className="text-sm font-medium">91.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Locations</span>
                <span className="text-sm font-medium">93.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Features Tabs */}
      <Tabs defaultValue="translation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="translation">{t('translation_features')}</TabsTrigger>
          <TabsTrigger value="analysis">{t('analysis_features')}</TabsTrigger>
          <TabsTrigger value="models">{t('neural_models')}</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="translation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Translation Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">{t('bidirectional')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">{t('contextual')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">{t('real_time')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">{t('domain_specific')}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Language Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Modern Standard Arabic</span>
                  <Badge variant="secondary">Full Support</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Gulf Arabic</span>
                  <Badge variant="secondary">Partial</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">English (US/UK)</span>
                  <Badge variant="secondary">Full Support</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Technical Terms</span>
                  <Badge variant="outline">Specialized</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Positive</span>
                  <span className="text-sm font-medium">34%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Neutral</span>
                  <span className="text-sm font-medium">52%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Negative</span>
                  <span className="text-sm font-medium">14%</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Topic Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="outline">Business</Badge>
                <Badge variant="outline">Technology</Badge>
                <Badge variant="outline">Healthcare</Badge>
                <Badge variant="outline">Education</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Text Complexity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Simple</span>
                  <span className="text-sm font-medium">28%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Intermediate</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Complex</span>
                  <span className="text-sm font-medium">27%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Models</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Translation Model v2.1</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sentiment Analysis v1.8</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">NER Model v1.5</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">BLEU Score</span>
                  <span className="text-sm font-medium">42.8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">F1 Score</span>
                  <span className="text-sm font-medium">0.891</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Latency</span>
                  <span className="text-sm font-medium">89ms</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{t('processing_speed')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">89ms</div>
                <div className="text-xs text-muted-foreground">Average response time</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{t('model_accuracy')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">94.7%</div>
                <div className="text-xs text-muted-foreground">Overall accuracy</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Throughput</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">1.2K</div>
                <div className="text-xs text-muted-foreground">Requests per minute</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">99.9%</div>
                <div className="text-xs text-muted-foreground">Service availability</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArabicEnglishNLP;