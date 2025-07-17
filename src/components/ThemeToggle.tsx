import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

export const ThemeToggle: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  
  // Add try-catch to provide better error handling
  let themeHook;
  try {
    themeHook = useTheme();
  } catch (error) {
    console.error('ThemeToggle: ThemeProvider not found', error);
    // Return a fallback component if theme provider is not available
    return (
      <Button variant="ghost" size="icon" className="opacity-50 cursor-not-allowed">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }
  
  const { theme, setTheme } = themeHook;

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    if (newTheme === 'system') {
      // Remove saved preference and use system
      localStorage.removeItem('aql-hr-theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    } else {
      setTheme(newTheme);
    }
  };

  const getCurrentIcon = () => {
    const savedTheme = localStorage.getItem('aql-hr-theme');
    
    if (!savedTheme) {
      return <Monitor className="h-5 w-5" />;
    }
    
    return theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
  };

  const getCurrentLabel = () => {
    const savedTheme = localStorage.getItem('aql-hr-theme');
    
    if (!savedTheme) {
      return isArabic ? 'النظام' : 'System';
    }
    
    return theme === 'dark' 
      ? (isArabic ? 'داكن' : 'Dark')
      : (isArabic ? 'فاتح' : 'Light');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-foreground-muted hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 relative group"
        >
          {getCurrentIcon()}
          <span className="sr-only">
            {isArabic ? 'تبديل المظهر' : 'Toggle theme'}
          </span>
          
          {/* Tooltip */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
            {getCurrentLabel()}
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align={isArabic ? 'start' : 'end'} 
        className="w-36 bg-popover/95 backdrop-blur-sm border border-border/60 shadow-xl"
      >
        <DropdownMenuItem 
          onClick={() => handleThemeChange('light')}
          className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''} cursor-pointer hover:bg-accent`}
        >
          <Sun className="h-4 w-4" />
          <span className="font-medium">{isArabic ? 'فاتح' : 'Light'}</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleThemeChange('dark')}
          className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''} cursor-pointer hover:bg-accent`}
        >
          <Moon className="h-4 w-4" />
          <span className="font-medium">{isArabic ? 'داكن' : 'Dark'}</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleThemeChange('system')}
          className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''} cursor-pointer hover:bg-accent`}
        >
          <Monitor className="h-4 w-4" />
          <span className="font-medium">{isArabic ? 'النظام' : 'System'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};