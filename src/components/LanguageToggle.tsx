import { Globe } from 'lucide-react';
import { useSwitchLang } from '@/lib/i18n/LinkL';
import { resolveLang } from '@/lib/i18n/localePath';
import { useNavigate } from 'react-router-dom';

export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const switchLang = useSwitchLang();
  const navigate = useNavigate();
  const locale = resolveLang();
  const next = locale === 'en' ? 'ar' : 'en';
  
  return (
    <button 
      onClick={() => navigate(switchLang(next))}
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