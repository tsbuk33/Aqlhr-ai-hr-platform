import React from 'react';
import { Bell, Settings, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserRole } from '@/hooks/useUserRole';

export const SuperAdminHeader: React.FC = () => {
  const { userRole } = useUserRole();

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">AqlHR Super Admin</h1>
        <Badge variant="destructive" className="text-xs">
          SYSTEM CONTROL
        </Badge>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
            3
          </Badge>
        </Button>
        
        <Button variant="ghost" size="sm">
          <Globe className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Super Admin</span>
        </div>
      </div>
    </header>
  );
};