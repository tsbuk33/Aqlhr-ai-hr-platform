import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateRenewalLetterPDF } from '@/utils/letterGenerator';

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

      // Generate PDF
      await generateRenewalLetterPDF({
        company_name_en: company.name,
        company_name_ar: company.company_name_arabic || company.name,
        employee_name_en: employee.full_name_en,
        employee_name_ar: employee.full_name_ar || employee.full_name_en,
        employee_id: employee.employee_no,
        iqama_expiry: employee.iqama_expiry,
        generated_date: new Date().toISOString().split('T')[0],
        language: language,
        footer_en: settings?.letter_footer_en,
        footer_ar: settings?.letter_footer_ar
      });

      // Store letter record
      const storagePath = `${userRoles.company_id}/${employee.id}/${Date.now()}_iqama_renewal.pdf`;
      
      await supabase.from('compliance_letters').insert({
        tenant_id: userRoles.company_id,
        employee_id: employee.id,
        type: 'iqama_renewal',
        lang: language,
        expiry_date: employee.iqama_expiry,
        reminder_day: 0, // Manual generation
        storage_path: storagePath,
        created_by: userData.user.id
      });

      toast({
        title: "Letter Generated",
        description: `Iqama renewal letter for ${employee.full_name_en} has been downloaded.`
      });

      await fetchLetters();

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