import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ComplianceLetter {
  id: string;
  tenant_id: string;
  employee_id: string;
  type: 'iqama_renewal' | 'visa_renewal' | 'custom';
  lang: 'en' | 'ar';
  expiry_date: string;
  reminder_day: number;
  storage_path: string;
  created_at: string;
  created_by?: string;
}

interface Employee {
  id: string;
  full_name_en: string;
  full_name_ar: string;
  employee_no: string;
  iqama_expiry: string;
}

export const useComplianceLetters = () => {
  const [letters, setLetters] = useState<ComplianceLetter[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchLetters = async () => {
    try {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      if (!userRoles?.company_id) return;

      const { data, error } = await supabase
        .from('compliance_letters')
        .select('*')
        .eq('tenant_id', userRoles.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLetters((data as ComplianceLetter[]) || []);

    } catch (error) {
      console.error('Error fetching compliance letters:', error);
      toast({
        title: "Error",
        description: "Failed to load compliance letters",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateLetterPDF = async (employee: Employee, language: 'en' | 'ar' = 'en') => {
    try {
      // Get company data
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      if (!userRoles?.company_id) return;

      const { data: company } = await supabase
        .from('companies')
        .select('name, company_name_arabic')
        .eq('id', userRoles.company_id)
        .single();

      if (!company) return;

      // Get compliance settings for footer
      const { data: settings } = await supabase
        .from('compliance_settings')
        .select('letter_footer_en, letter_footer_ar')
        .eq('tenant_id', userRoles.company_id)
        .maybeSingle();

      // Call edge function to generate PDF
      const { data, error } = await supabase.functions.invoke('compliance-letter-generator', {
        body: {
          tenant_id: userRoles.company_id,
          employee: {
            id: employee.id,
            full_name_en: employee.full_name_en,
            full_name_ar: employee.full_name_ar || employee.full_name_en,
            employee_no: employee.employee_no,
            iqama_expiry: employee.iqama_expiry
          },
          company: {
            name: company.name,
            name_ar: company.company_name_arabic
          },
          language,
          letter_type: 'iqama_renewal',
          footer: language === 'ar' ? settings?.letter_footer_ar : settings?.letter_footer_en
        }
      });

      if (error) {
        throw new Error(`Failed to generate letter: ${error.message}`);
      }

      if (data?.success && data?.buffer) {
        // Convert array back to Uint8Array and trigger download
        const uint8Array = new Uint8Array(data.buffer);
        const blob = new Blob([uint8Array], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Letter Generated",
          description: `${language === 'ar' ? 'Arabic' : 'English'} Iqama renewal letter for ${employee.full_name_en} has been downloaded.`
        });

        await fetchLetters();
      }

    } catch (error) {
      console.error('Error generating letter PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate renewal letter",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  return {
    letters,
    loading,
    generateLetterPDF,
    refreshLetters: fetchLetters
  };
};