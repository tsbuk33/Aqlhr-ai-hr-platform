import { useLanguage } from "@/hooks/useLanguageCompat";
import { Outlet } from "react-router-dom";
import RouteDebug from "@/components/dev/RouteDebug";

// Navigation - Keep sidebar but center main content
const MainLayout = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <div className={`main-layout ${isArabic ? 'rtl' : 'ltr'}`}>
      <main className="main-content">
        <div className="content-wrapper">
          <RouteDebug />
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
