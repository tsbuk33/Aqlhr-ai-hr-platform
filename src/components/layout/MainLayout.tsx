import { useLanguage } from "@/hooks/useLanguageCompat";
import { Outlet } from "react-router-dom";
import RouteDebug from "@/components/dev/RouteDebug";
import { centerStyleObject } from '@/hooks/useForceCenterStyle';

// Navigation - Keep sidebar but center main content
const MainLayout = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <div className={`main-layout ${isArabic ? 'rtl' : 'ltr'}`}>
      <main className="main-content" style={centerStyleObject}>
        <div className="content-wrapper" style={centerStyleObject}>
          <RouteDebug />
          <div style={centerStyleObject} className="force-center">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
