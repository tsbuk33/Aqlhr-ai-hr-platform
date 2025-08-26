import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { resolveLang } from '@/lib/i18n/localePath';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { User as UserType } from '@supabase/supabase-js';

interface UserHeaderProps {
  user?: UserType | null;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ user: propUser }) => {
  const [user, setUser] = useState<UserType | null>(propUser || null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  useEffect(() => {
    if (!propUser) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
      });
    }
  }, [propUser]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: isArabic ? 'تم تسجيل الخروج' : 'Signed out',
        description: isArabic ? 'تم تسجيل خروجك بنجاح' : 'You have been signed out successfully'
      });

      const currentLang = resolveLang();
      navigate(`/${currentLang}/auth`);
    } catch (error) {
      toast({
        title: isArabic ? 'خطأ' : 'Error',
        description: isArabic ? 'حدث خطأ أثناء تسجيل الخروج' : 'An error occurred while signing out',
        variant: 'destructive'
      });
    }
  };

  if (!user) {
    return null;
  }

  const userEmail = user.email || '';
  const userInitials = userEmail.split('@')[0].substring(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={userEmail} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.user_metadata?.full_name || userEmail.split('@')[0]}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isArabic ? 'تسجيل الخروج' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};