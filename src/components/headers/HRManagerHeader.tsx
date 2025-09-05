import React from 'react';
import { Bell, Settings, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserRole } from '@/hooks/useUserRole';

export const HRManagerHeader: React.FC = () => {
  const { userRole } = useUserRole();

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">AqlHR Manager Dashboard</h1>
        <Badge variant="outline" className="text-xs">
          <Users className="h-3 w-3 mr-1" />
          HR MANAGEMENT
        </Badge>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span className="text-muted-foreground">Performance: +12%</span>
        </div>
        
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <Badge variant="default" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
            8
          </Badge>
        </Button>
        
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>HR</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">HR Manager</span>
        </div>
      </div>
    </header>
  );
};