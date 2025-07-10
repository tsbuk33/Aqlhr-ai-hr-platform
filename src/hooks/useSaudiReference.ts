import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SaudiRegion {
  id: string;
  code: string;
  name_en: string;
  name_ar: string;
  created_at: string;
  updated_at: string;
}

export interface SaudiCity {
  id: string;
  region_id: string;
  code: string;
  name_en: string;
  name_ar: string;
  timezone: string;
  created_at: string;
  updated_at: string;
  region?: SaudiRegion;
}

export interface SaudiSector {
  id: string;
  sic_code: string;
  name_en: string;
  name_ar: string;
  created_at: string;
  updated_at: string;
}

export interface SaudiActivity {
  id: string;
  sector_id: string;
  classification_code: string;
  name_en: string;
  name_ar: string;
  created_at: string;
  updated_at: string;
  sector?: SaudiSector;
}

export interface SaudiGovEntity {
  id: string;
  entity_key: string;
  name_en: string;
  name_ar: string;
  url?: string;
  created_at: string;
  updated_at: string;
}

export interface SaudiCompany {
  id: string;
  name_en: string;
  name_ar: string;
  sector_id?: string;
  headquarters_city_id?: string;
  revenue_rank?: number;
  website?: string;
  boe_registration_no?: string;
  created_at: string;
  updated_at: string;
  sector?: SaudiSector;
  headquarters_city?: SaudiCity;
}

type SearchOptions = {
  search?: string;
  limit?: number;
};

const saudiReferenceApi = {
  async getRegions(options: SearchOptions = {}) {
    const { data } = await supabase.functions.invoke('saudi-reference-api/regions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  },

  async getCities(regionCode?: string, options: SearchOptions = {}) {
    const params = new URLSearchParams();
    if (regionCode) params.append('region', regionCode);
    if (options.search) params.append('search', options.search);
    if (options.limit) params.append('limit', options.limit.toString());

    const { data } = await supabase.functions.invoke(`saudi-reference-api/cities?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  },

  async getSectors(options: SearchOptions = {}) {
    const params = new URLSearchParams();
    if (options.search) params.append('search', options.search);
    if (options.limit) params.append('limit', options.limit.toString());

    const { data } = await supabase.functions.invoke(`saudi-reference-api/sectors?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  },

  async getActivities(sectorCode?: string, options: SearchOptions = {}) {
    const params = new URLSearchParams();
    if (sectorCode) params.append('sector', sectorCode);
    if (options.search) params.append('search', options.search);
    if (options.limit) params.append('limit', options.limit.toString());

    const { data } = await supabase.functions.invoke(`saudi-reference-api/activities?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  },

  async getGovEntities(options: SearchOptions = {}) {
    const params = new URLSearchParams();
    if (options.search) params.append('search', options.search);
    if (options.limit) params.append('limit', options.limit.toString());

    const { data } = await supabase.functions.invoke(`saudi-reference-api/gov-entities?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  },

  async getCompanies(options: SearchOptions = {}) {
    const params = new URLSearchParams();
    if (options.search) params.append('search', options.search);
    if (options.limit) params.append('limit', options.limit.toString());

    const { data } = await supabase.functions.invoke(`saudi-reference-api/companies?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  },
};

export const useRegions = (options: SearchOptions = {}) => {
  const { search, limit } = options;
  
  return useQuery({
    queryKey: ['saudi-regions', search, limit],
    queryFn: () => saudiReferenceApi.getRegions({ search, limit }),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - reference data rarely changes
  });
};

export const useCities = (regionCode?: string, options: SearchOptions = {}) => {
  const { search, limit } = options;
  
  return useQuery({
    queryKey: ['saudi-cities', regionCode, search, limit],
    queryFn: () => saudiReferenceApi.getCities(regionCode, { search, limit }),
    staleTime: 24 * 60 * 60 * 1000,
    enabled: true, // Always enabled, with or without regionCode
  });
};

export const useSectors = (options: SearchOptions = {}) => {
  const { search, limit } = options;
  
  return useQuery({
    queryKey: ['saudi-sectors', search, limit],
    queryFn: () => saudiReferenceApi.getSectors({ search, limit }),
    staleTime: 24 * 60 * 60 * 1000,
  });
};

export const useActivities = (sectorCode?: string, options: SearchOptions = {}) => {
  const { search, limit } = options;
  
  return useQuery({
    queryKey: ['saudi-activities', sectorCode, search, limit],
    queryFn: () => saudiReferenceApi.getActivities(sectorCode, { search, limit }),
    staleTime: 24 * 60 * 60 * 1000,
    enabled: true,
  });
};

export const useGovEntities = (options: SearchOptions = {}) => {
  const { search, limit } = options;
  
  return useQuery({
    queryKey: ['saudi-gov-entities', search, limit],
    queryFn: () => saudiReferenceApi.getGovEntities({ search, limit }),
    staleTime: 24 * 60 * 60 * 1000,
  });
};

export const useTop500Companies = (options: SearchOptions = {}) => {
  const { search, limit } = options;
  
  return useQuery({
    queryKey: ['saudi-companies', search, limit],
    queryFn: () => saudiReferenceApi.getCompanies({ search, limit }),
    staleTime: 24 * 60 * 60 * 1000,
  });
};