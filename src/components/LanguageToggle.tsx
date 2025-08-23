import { Globe } from 'lucide-react';
import { useLocalePath } from '@/lib/i18n/LinkL';
import { getCurrentLang } from '@/lib/i18n/localeDriver';

export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { switchLanguage } = useLocalePath();
  const locale = getCurrentLang();
  const next = locale === 'en' ? 'ar' : 'en';
  
  return (
    <button 
      onClick={() => switchLanguage(next)} 
      className="inline-flex items-center gap-2 px-3 py-1 rounded border border-border hover:bg-muted transition-colors"
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">
        {next === 'ar' ? 'عربي' : 'English'}
      </span>
      <span className="text-xs opacity-60">
        ({next.toUpperCase()})
      </span>
    </button>
  );
}