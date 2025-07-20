import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguageCompat";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">
          {isArabic ? 'عذراً! الصفحة غير موجودة' : 'Oops! Page not found'}
        </p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          {isArabic ? 'العودة إلى الصفحة الرئيسية' : 'Return to Home'}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
