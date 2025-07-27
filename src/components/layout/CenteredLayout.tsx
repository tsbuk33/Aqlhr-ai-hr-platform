import { useLanguage } from "@/hooks/useLanguageCompat";
import PageHeader from "@/components/common/PageHeader";
import { ReactNode } from "react";

interface CenteredLayoutProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

// Universal Centered Layout - ALWAYS CENTER EVERYTHING
const CenteredLayout = ({ title, description, children, className = "" }: CenteredLayoutProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <div 
      className={`flex flex-col items-center justify-center text-center mx-auto max-w-screen-xl p-4 min-h-screen ${isArabic ? 'rtl' : 'ltr'} ${className}`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {title && (
        <PageHeader title={title} description={description} />
      )}
      <div className="w-full flex flex-col items-center justify-center text-center space-y-6">
        {children}
      </div>
    </div>
  );
};

export default CenteredLayout;

// Export a HOC for easy wrapping
export const withCenteredLayout = <P extends object>(
  Component: React.ComponentType<P>,
  layoutProps?: Omit<CenteredLayoutProps, 'children'>
) => {
  return (props: P) => (
    <CenteredLayout {...layoutProps}>
      <Component {...props} />
    </CenteredLayout>
  );
};