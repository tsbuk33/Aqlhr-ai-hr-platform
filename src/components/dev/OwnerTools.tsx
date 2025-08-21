import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Crown, Check, ChevronsUpDown, UserCog, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface TenantOption {
  id: string;
  name: string;
  type: string;
}

export function OwnerTools() {
  const [isVisible, setIsVisible] = useState(false);
  const [tenantId, setTenantId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [tenants, setTenants] = useState<TenantOption[]>([]);
  const [currentImpersonation, setCurrentImpersonation] = useState<string | null>(null);

  // Check if we should show the tools (preview/dev only)
  useEffect(() => {
    const shouldShow = 
      typeof window !== 'undefined' && (
        window.location.hostname.includes('lovable.app') || 
        process.env.NODE_ENV !== 'production'
      );
    setIsVisible(shouldShow);
    
    // Check current impersonation status
    const current = localStorage.getItem('devTenantId');
    setCurrentImpersonation(current);
    setTenantId(current || '');
  }, []);

  // Load available tenants for autocomplete
  useEffect(() => {
    const loadTenants = async () => {
      try {
        // Try to get tenants from various tables
        const promises = [
          supabase.from('companies').select('id, name').limit(20),
          supabase.from('kpi_snapshots').select('company_id').limit(20),
          supabase.from('hr_employees').select('company_id').limit(20),
        ];

        const results = await Promise.allSettled(promises);
        const allTenants: TenantOption[] = [];

        // Process companies
        if (results[0].status === 'fulfilled' && results[0].value.data) {
          results[0].value.data.forEach((company: any) => {
            allTenants.push({
              id: company.id,
              name: company.name || `Company ${company.id.slice(0, 8)}`,
              type: 'Company'
            });
          });
        }

        // Process KPI snapshots
        if (results[1].status === 'fulfilled' && results[1].value.data) {
          const uniqueIds = new Set(allTenants.map(t => t.id));
          results[1].value.data.forEach((snap: any) => {
            if (snap.company_id && !uniqueIds.has(snap.company_id)) {
              allTenants.push({
                id: snap.company_id,
                name: `Tenant ${snap.company_id.slice(0, 8)}`,
                type: 'KPI Data'
              });
              uniqueIds.add(snap.company_id);
            }
          });
        }

        // Process HR employees
        if (results[2].status === 'fulfilled' && results[2].value.data) {
          const uniqueIds = new Set(allTenants.map(t => t.id));
          results[2].value.data.forEach((emp: any) => {
            if (emp.company_id && !uniqueIds.has(emp.company_id)) {
              allTenants.push({
                id: emp.company_id,
                name: `Tenant ${emp.company_id.slice(0, 8)}`,
                type: 'HR Data'
              });
              uniqueIds.add(emp.company_id);
            }
          });
        }

        setTenants(allTenants);
      } catch (error) {
        console.warn('Could not load tenants for autocomplete:', error);
      }
    };

    if (isVisible) {
      loadTenants();
    }
  }, [isVisible]);

  const handleImpersonate = () => {
    if (tenantId.trim()) {
      localStorage.setItem('devTenantId', tenantId.trim());
      window.location.reload();
    }
  };

  const handleClear = () => {
    localStorage.removeItem('devTenantId');
    window.location.reload();
  };

  if (!isVisible) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className={cn(
            "text-foreground-muted hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200",
            currentImpersonation && "text-purple-600 bg-purple-50 dark:bg-purple-950/30"
          )}
        >
          <Crown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-purple-600" />
            <h4 className="text-sm font-semibold">Owner Tools</h4>
            <span className="text-xs text-muted-foreground bg-purple-100 dark:bg-purple-950/50 px-2 py-0.5 rounded">
              Preview Only
            </span>
          </div>

          {currentImpersonation && (
            <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded border border-purple-200 dark:border-purple-800">
              <div className="text-xs text-purple-800 dark:text-purple-200">
                Currently impersonating:
              </div>
              <div className="text-sm font-mono text-purple-900 dark:text-purple-100 break-all">
                {currentImpersonation}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Tenant ID</label>
            <div className="flex gap-2">
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    className="flex-1 justify-between text-xs"
                  >
                    {tenantId 
                      ? tenants.find(t => t.id === tenantId)?.name || tenantId.slice(0, 16) + '...'
                      : "Select or enter tenant ID..."
                    }
                    <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search tenants..." 
                      value={tenantId}
                      onValueChange={setTenantId}
                    />
                    <CommandList>
                      <CommandEmpty>No tenants found.</CommandEmpty>
                      <CommandGroup>
                        {tenants.map((tenant) => (
                          <CommandItem
                            key={tenant.id}
                            value={tenant.id}
                            onSelect={(currentValue) => {
                              setTenantId(currentValue);
                              setIsOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-3 w-3",
                                tenantId === tenant.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate">
                                {tenant.name}
                              </div>
                              <div className="text-xs text-muted-foreground font-mono truncate">
                                {tenant.id}
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground ml-2">
                              {tenant.type}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <Input
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              placeholder="Enter tenant UUID..."
              className="text-xs font-mono"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleImpersonate}
              disabled={!tenantId.trim()}
              size="sm"
              className="flex-1"
            >
              <UserCog className="h-3 w-3 mr-1" />
              Impersonate
            </Button>
            <Button 
              onClick={handleClear}
              disabled={!currentImpersonation}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>

          <div className="text-xs text-muted-foreground border-t pt-2">
            ⚠️ Dev/Preview only. Uses localStorage + reload.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}