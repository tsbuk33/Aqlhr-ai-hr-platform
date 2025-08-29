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
          <div className="flex flex-col items-center justify-center text-center mx-auto max-w-screen-xl p-4 min-h-screen">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
