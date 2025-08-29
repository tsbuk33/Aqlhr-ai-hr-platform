import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { PartnerLogo } from '@/components/PartnerLogo';
import { useLocale } from '@/i18n/locale';
import { AqlHRAIAssistant } from '@/components/ai';
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import PageHeader from "@/components/common/PageHeader";

const About = () => {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="p-6 space-y-8 bg-background min-h-full">
      {/* Hero Section */}
      <div className="bg-gradient-hero rounded-2xl p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-4">{isArabic ? 'حول عقل HR' : 'About AqlHR'}</h1>
          <p className="text-white/90 text-lg">
            {isArabic ? 'تمكين تحويل القوى العاملة في السعودية من خلال حلول تقنية مبتكرة للموارد البشرية' : 'Empowering Saudi Arabia\'s workforce transformation through innovative HR technology solutions'}
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-semibold text-foreground mb-4">{isArabic ? 'مهمتنا' : 'Our Mission'}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {isArabic ? 'إحداث ثورة في إدارة الموارد البشرية في المملكة العربية السعودية من خلال تقديم حلول شاملة مدعومة بالذكاء الاصطناعي تعمل على تبسيط العمليات وضمان الامتثال ودفع التميز التنظيمي.' : 'To revolutionize human resource management in Saudi Arabia by providing comprehensive, AI-powered solutions that streamline operations, ensure compliance, and drive organizational excellence.'}
          </p>
        </div>
        
        <div className="bg-surface rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-semibold text-foreground mb-4">{isArabic ? 'رؤيتنا' : 'Our Vision'}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {isArabic ? 'أن نكون منصة تقنية الموارد البشرية الرائدة التي تمكن المنظمات السعودية من بناء قوى عاملة عالمية المستوى متوائمة مع أهداف تحول رؤية 2030.' : 'To be the leading HR technology platform that enables Saudi organizations to build world-class workforces aligned with Vision 2030\'s transformation goals.'}
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-surface rounded-xl p-8 border border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-6">{isArabic ? 'ما يميزنا' : 'What Makes Us Different'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-primary mb-2">105+</div>
            <div className="text-sm text-muted-foreground">{isArabic ? 'وحدة متكاملة' : 'Integrated Modules'}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-accent mb-2">22</div>
            <div className="text-sm text-muted-foreground">{isArabic ? 'تكامل حكومي' : 'Government Integrations'}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-status-success mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground">{isArabic ? 'ضمان وقت التشغيل' : 'Uptime Guarantee'}</div>
          </div>
        </div>
      </div>

      {/* Partners & Alignment Section */}
      <div className="bg-surface rounded-xl p-8 border border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-6">{isArabic ? 'الشراكات والتوافق' : 'Partners & Alignment'}</h2>
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            {isArabic ? 'يفخر عقل HR بالتوافق مع مبادرات التحول الوطني للمملكة العربية السعودية. تدعم منصتنا أهداف رؤية 2030 بشكل مباشر من خلال تمكين المنظمات من بناء قوى عاملة متنوعة وماهرة. نحن ملتزمون بدعم استعداد المملكة لمعرض الرياض 2030 وكأس العالم FIFA 2034، وضمان جاهزية القوى العاملة لهذه الأحداث المهمة.' : 'AqlHR is proud to align with Saudi Arabia\'s national transformation initiatives. Our platform directly supports Vision 2030 objectives by enabling organizations to build diverse, skilled workforces. We\'re committed to supporting the Kingdom\'s preparation for Expo 2030 Riyadh and the FIFA World Cup 2034, ensuring workforce readiness for these landmark events.'}
          </p>
          
          <p className="text-muted-foreground leading-relaxed">
            {isArabic ? 'من خلال حلولنا الشاملة للموارد البشرية، نساعد المنظمات على تحقيق امتثال نطاقات ودعم أهداف السعودة وتطبيق أفضل الممارسات في إدارة المواهب التي تتوافق مع الرؤية الاستراتيجية للمملكة للتنويع الاقتصادي وتنمية رأس المال البشري.' : 'Through our comprehensive HR solutions, we help organizations achieve Nitaqat compliance, support Saudization goals, and implement best practices in talent management that align with the Kingdom\'s strategic vision for economic diversification and human capital development.'}
          </p>
          
          {/* National Initiatives Logos */}
          <div className="pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {isArabic ? 'دعم المبادرات الوطنية' : 'Supporting National Initiatives'}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-12">
              <PartnerLogo 
                src="/partners/vision2030.svg" 
                alt="Saudi Vision 2030" 
                href="https://vision2030.gov.sa"
              />
              <PartnerLogo 
                src="/partners/expo2030-official.svg" 
                alt="Expo 2030 Riyadh" 
                href="https://www.expo2030riyadh.sa/"
              />
              <PartnerLogo 
                src="/partners/worldcup2034-official.svg" 
                alt="FIFA World Cup 2034 Saudi Arabia" 
                href="https://saudi2034.com.sa/"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-surface rounded-xl p-8 border border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-6">{isArabic ? 'تواصل معنا' : 'Get in Touch'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-foreground mb-2">{isArabic ? 'المقر الرئيسي' : 'Headquarters'}</h3>
            <p className="text-muted-foreground">{isArabic ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">{isArabic ? 'البريد الإلكتروني' : 'Email'}</h3>
            <p className="text-muted-foreground">info@aqlhr.com</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">{isArabic ? 'الهاتف' : 'Phone'}</h3>
            <p className="text-muted-foreground">+966 11 XXX XXXX</p>
          </div>
          </div>
        </div>
      </div>
    </div>
      
      {/* AI Integration for About Page */}
      <UniversalAIIntegrator 
        pageType="platform" 
        moduleName="about-page" 
        companyId="demo-company" 
        enabledFeatures={['contextual-help', 'company-insights', 'information-assistance']}
      />
    </div>
  );
};

export default About;