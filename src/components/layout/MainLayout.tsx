import { useLanguage } from "@/hooks/useLanguageCompat";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

// Navigation - Keep sidebar but center main content
const MainLayout = ({ children }: MainLayoutProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <div className={`main-layout ${isArabic ? 'rtl' : 'ltr'}`}>
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
