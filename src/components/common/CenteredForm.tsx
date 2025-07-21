import { useLanguage } from "@/hooks/useLanguageCompat";
import { Button } from "@/components/ui/button";
import { ReactNode, FormEvent } from "react";

interface CenteredFormProps {
  title: string;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  showActions?: boolean;
  saveText?: string;
  cancelText?: string;
  onCancel?: () => void;
}

// Forms - CENTERED
const CenteredForm = ({ 
  title, 
  children, 
  onSubmit, 
  showActions = true,
  saveText,
  cancelText,
  onCancel 
}: CenteredFormProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <div className={`form-container ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="form-wrapper">
        <h2 className="form-title text-center mb-6">
          {title}
        </h2>
        <form onSubmit={onSubmit} className="centered-form">
          <div className="form-content">
            {children}
          </div>
          {showActions && (
            <div className="form-actions text-center mt-6">
              <Button type="submit" className="mx-2">
                {saveText || (isArabic ? 'حفظ' : 'Save')}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="mx-2"
                onClick={onCancel}
              >
                {cancelText || (isArabic ? 'إلغاء' : 'Cancel')}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CenteredForm;