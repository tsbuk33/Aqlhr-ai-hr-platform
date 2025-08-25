import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { localePath } from '@/lib/i18n/localePath';
import { LinkL } from '@/lib/i18n/LinkL';

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-2xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-lg mx-auto">
          {isArabic ? 'عذراً! الصفحة غير موجودة' : 'Oops! Page not found'}
        </p>
        <LinkL to="/" className="text-primary hover:text-primary/80 underline text-lg">
          {isArabic ? 'العودة إلى الصفحة الرئيسية' : 'Return to Home'}
        </LinkL>
      </div>
    </div>
  );
};

export default NotFound;
