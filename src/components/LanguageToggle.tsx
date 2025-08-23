import { Globe } from 'lucide-react';
import { useLocale } from '@/i18n/locale';

export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useLocale();
  const next = locale === 'en' ? 'ar' : 'en';
  
  return (
    <button 
      onClick={() => setLocale(next)} 
      className="inline-flex items-center gap-2 px-3 py-1 rounded border border-border hover:bg-muted transition-colors"
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">
        {next === 'ar' ? t('common', 'arabic') : t('common', 'language')}
      </span>
      <span className="text-xs opacity-60">
        ({next.toUpperCase()})
      </span>
    </button>
  );
}