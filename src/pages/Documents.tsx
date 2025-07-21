import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, CheckCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";

const Documents = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'إدارة الوثائق' : 'Document Management'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'جمع وتنظيم الوثائق بشكل آلي' : 'Automated document collection and organization'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'الوثائق المعالجة' : 'Documents Processed'}</CardTitle>
            <CardDescription>
              {isArabic ? 'إجمالي الوثائق المعالجة' : 'Total documents processed'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-primary">15,678</p>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'وثيقة معالجة' : 'documents processed'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'دقة الذكاء الاصطناعي' : 'AI Accuracy'}</CardTitle>
            <CardDescription>
              {isArabic ? 'معدل دقة الذكاء الاصطناعي' : 'AI processing accuracy rate'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-success">98.7%</p>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'دقة عالية' : 'high accuracy'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'قيد المراجعة' : 'Pending Review'}</CardTitle>
            <CardDescription>
              {isArabic ? 'الوثائق التي تحتاج مراجعة' : 'Documents requiring review'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-warning">24</p>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'بحاجة للمراجعة' : 'need review'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'التخزين المستخدم' : 'Storage Used'}</CardTitle>
            <CardDescription>
              {isArabic ? 'مساحة التخزين المستخدمة' : 'Used storage space'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-accent">1.2TB</p>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'من أصل 5TB' : 'of 5TB total'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Document Processing Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-primary" />
              {isArabic ? 'التحقق من الهوية' : 'ID Verification'}
            </CardTitle>
            <CardDescription>
              {isArabic ? 'معالجة آلية للهويات والوثائق الرسمية' : 'Automatic processing of IDs and official documents'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-brand-primary">98.9%</p>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'معدل الدقة' : 'accuracy rate'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-success" />
              {isArabic ? 'إدارة العقود' : 'Contract Management'}
            </CardTitle>
            <CardDescription>
              {isArabic ? 'تخزين ومعالجة العقود رقمياً' : 'Digital contract storage and processing'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-brand-success">2,847</p>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'عقد نشط' : 'active contracts'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-brand-accent" />
              {isArabic ? 'تتبع الامتثال' : 'Compliance Tracking'}
            </CardTitle>
            <CardDescription>
              {isArabic ? 'مراقبة تواريخ انتهاء الوثائق' : 'Monitor document expiry dates'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-brand-accent">156</p>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'تنبيه آلي' : 'auto notifications'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Universal Document Manager */}
      <UniversalDocumentManager
        moduleName={isArabic ? "إدارة الوثائق" : "Document Management"}
        description={isArabic ? "رفع وإدارة جميع أنواع الوثائق والملفات الرسمية" : "Upload and manage all types of documents and official files"}
        platform="documents"
        moduleType="documents"
        acceptedTypes={['.pdf', '.doc', '.docx', '.xlsx', '.jpg', '.jpeg', '.png', '.txt']}
        maxFileSize={50 * 1024 * 1024}
        maxFiles={50}
      />
    </div>
  );
};

export default Documents;