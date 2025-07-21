import { useLanguage } from "@/hooks/useLanguageCompat";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

// Page Header Component - CENTERED
const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <div className={`page-header ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="header-content">
        <h1 className="page-title text-center">
          {title}
        </h1>
        {description && (
          <p className="page-description text-center text-muted-foreground">
            {description}
          </p>
        )}
        {children && (
          <div className="header-actions text-center mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;