import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Use existing types for now
export interface SaudiLegalFramework {
  id: string;
  name_ar: string;
  name_en: string;
  url: string;
  [key: string]: any;
}

export interface SaudiGovEntity {
  id: string;
  name_ar: string;
  name_en: string;
  entity_key: string;
  url: string;
  [key: string]: any;
}

export const useSaudiKnowledgeBase = () => {
  const [loading, setLoading] = useState(false);
  const [legalFrameworks, setLegalFrameworks] = useState<SaudiLegalFramework[]>([]);
  const [govEntities, setGovEntities] = useState<SaudiGovEntity[]>([]);

  // Mock data for now until types are regenerated
  const mockLegalFrameworks: SaudiLegalFramework[] = [
    {
      id: '1',
      name_ar: 'نظام العمل السعودي',
      name_en: 'Saudi Labor Law',
      url: 'https://example.com'
    },
    {
      id: '2', 
      name_ar: 'نظام الضمان الاجتماعي',
      name_en: 'Social Security Law',
      url: 'https://example.com'
    }
  ];

  const mockGovEntities: SaudiGovEntity[] = [
    {
      id: '1',
      name_ar: 'وزارة الموارد البشرية',
      name_en: 'Ministry of Human Resources',
      entity_key: 'hrsd',
      url: 'https://hrsd.gov.sa'
    },
    {
      id: '2',
      name_ar: 'المؤسسة العامة للتأمينات الاجتماعية',
      name_en: 'General Organization for Social Insurance',
      entity_key: 'gosi',
      url: 'https://gosi.gov.sa'
    }
  ];

  const searchLegalFramework = useCallback(async (query: string) => {
    setLoading(true);
    try {
      // Filter mock data based on query
      const filtered = mockLegalFrameworks.filter(item => 
        item.name_ar.includes(query) || item.name_en.toLowerCase().includes(query.toLowerCase())
      );
      
      setLegalFrameworks(filtered);
      return filtered;
    } catch (error) {
      console.error('Error searching legal framework:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchGovEntities = useCallback(async (query: string) => {
    setLoading(true);
    try {
      // Filter mock data based on query
      const filtered = mockGovEntities.filter(item => 
        item.name_ar.includes(query) || item.name_en.toLowerCase().includes(query.toLowerCase())
      );
      
      setGovEntities(filtered);
      return filtered;
    } catch (error) {
      console.error('Error searching government entities:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllLegalFrameworks = useCallback(async () => {
    setLoading(true);
    try {
      setLegalFrameworks(mockLegalFrameworks);
      return mockLegalFrameworks;
    } catch (error) {
      console.error('Error fetching legal frameworks:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllGovEntities = useCallback(async () => {
    setLoading(true);
    try {
      setGovEntities(mockGovEntities);
      return mockGovEntities;
    } catch (error) {
      console.error('Error fetching government entities:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    legalFrameworks,
    govEntities,
    searchLegalFramework,
    searchGovEntities,
    getAllLegalFrameworks,
    getAllGovEntities
  };
};