import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  useRegions, 
  useCities, 
  useSectors, 
  useActivities, 
  useGovEntities, 
  useTop500Companies,
  SaudiRegion,
  SaudiCity,
  SaudiSector,
  SaudiActivity,
  SaudiGovEntity,
  SaudiCompany
} from '@/hooks/useSaudiReference';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Building, Globe } from 'lucide-react';

interface RegionSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const RegionSelect: React.FC<RegionSelectProps> = ({
  value,
  onValueChange,
  placeholder,
  disabled = false
}) => {
  const { language } = useLanguage();
  const [search, setSearch] = useState('');
  const { data: regionsData, isLoading } = useRegions({ search });

  const regions = regionsData?.data || [];

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        {language === 'ar' ? 'المنطقة' : 'Region'}
      </Label>
      
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'ar' ? 'البحث في المناطق...' : 'Search regions...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={value} onValueChange={onValueChange} disabled={disabled || isLoading}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder || (language === 'ar' ? 'اختر المنطقة' : 'Select Region')} />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region: SaudiRegion) => (
              <SelectItem key={region.id} value={region.code}>
                <div className="flex items-center gap-2">
                  <span>{language === 'ar' ? region.name_ar : region.name_en}</span>
                  <Badge variant="outline" className="text-xs">
                    {region.code}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

interface CitySelectProps {
  regionCode?: string;
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showRegionInfo?: boolean;
}

export const CitySelect: React.FC<CitySelectProps> = ({
  regionCode,
  value,
  onValueChange,
  placeholder,
  disabled = false,
  showRegionInfo = false
}) => {
  const { language } = useLanguage();
  const [search, setSearch] = useState('');
  const { data: citiesData, isLoading } = useCities(regionCode, { search });

  const cities = citiesData?.data || [];

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Building className="h-4 w-4" />
        {language === 'ar' ? 'المدينة' : 'City'}
      </Label>
      
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'ar' ? 'البحث في المدن...' : 'Search cities...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={value} onValueChange={onValueChange} disabled={disabled || isLoading}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder || (language === 'ar' ? 'اختر المدينة' : 'Select City')} />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city: SaudiCity) => (
              <SelectItem key={city.id} value={city.code}>
                <div className="flex items-center gap-2">
                  <span>{language === 'ar' ? city.name_ar : city.name_en}</span>
                  <Badge variant="outline" className="text-xs">
                    {city.code}
                  </Badge>
                  {showRegionInfo && city.region && (
                    <Badge variant="secondary" className="text-xs">
                      {language === 'ar' ? city.region.name_ar : city.region.name_en}
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

interface SectorSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SectorSelect: React.FC<SectorSelectProps> = ({
  value,
  onValueChange,
  placeholder,
  disabled = false
}) => {
  const { language } = useLanguage();
  const [search, setSearch] = useState('');
  const { data: sectorsData, isLoading } = useSectors({ search });

  const sectors = sectorsData?.data || [];

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        {language === 'ar' ? 'القطاع' : 'Sector'}
      </Label>
      
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'ar' ? 'البحث في القطاعات...' : 'Search sectors...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={value} onValueChange={onValueChange} disabled={disabled || isLoading}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder || (language === 'ar' ? 'اختر القطاع' : 'Select Sector')} />
          </SelectTrigger>
          <SelectContent>
            {sectors.map((sector: SaudiSector) => (
              <SelectItem key={sector.id} value={sector.sic_code}>
                <div className="flex items-center gap-2">
                  <span>{language === 'ar' ? sector.name_ar : sector.name_en}</span>
                  <Badge variant="outline" className="text-xs">
                    {sector.sic_code}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

interface ActivitySelectProps {
  sectorCode?: string;
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showSectorInfo?: boolean;
}

export const ActivitySelect: React.FC<ActivitySelectProps> = ({
  sectorCode,
  value,
  onValueChange,
  placeholder,
  disabled = false,
  showSectorInfo = false
}) => {
  const { language } = useLanguage();
  const [search, setSearch] = useState('');
  const { data: activitiesData, isLoading } = useActivities(sectorCode, { search });

  const activities = activitiesData?.data || [];

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Building className="h-4 w-4" />
        {language === 'ar' ? 'النشاط الاقتصادي' : 'Economic Activity'}
      </Label>
      
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'ar' ? 'البحث في الأنشطة...' : 'Search activities...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={value} onValueChange={onValueChange} disabled={disabled || isLoading}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder || (language === 'ar' ? 'اختر النشاط' : 'Select Activity')} />
          </SelectTrigger>
          <SelectContent>
            {activities.map((activity: SaudiActivity) => (
              <SelectItem key={activity.id} value={activity.classification_code}>
                <div className="flex items-center gap-2">
                  <span>{language === 'ar' ? activity.name_ar : activity.name_en}</span>
                  <Badge variant="outline" className="text-xs">
                    {activity.classification_code}
                  </Badge>
                  {showSectorInfo && activity.sector && (
                    <Badge variant="secondary" className="text-xs">
                      {language === 'ar' ? activity.sector.name_ar : activity.sector.name_en}
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

interface CompanySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showDetails?: boolean;
}

export const CompanySelect: React.FC<CompanySelectProps> = ({
  value,
  onValueChange,
  placeholder,
  disabled = false,
  showDetails = false
}) => {
  const { language } = useLanguage();
  const [search, setSearch] = useState('');
  const { data: companiesData, isLoading } = useTop500Companies({ search, limit: 50 });

  const companies = companiesData?.data || [];

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Building className="h-4 w-4" />
        {language === 'ar' ? 'الشركة' : 'Company'}
      </Label>
      
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'ar' ? 'البحث في الشركات...' : 'Search companies...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={value} onValueChange={onValueChange} disabled={disabled || isLoading}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder || (language === 'ar' ? 'اختر الشركة' : 'Select Company')} />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company: SaudiCompany) => (
              <SelectItem key={company.id} value={company.id}>
                <div className="flex items-center gap-2">
                  <span>{language === 'ar' ? company.name_ar : company.name_en}</span>
                  {company.revenue_rank && (
                    <Badge variant="outline" className="text-xs">
                      #{company.revenue_rank}
                    </Badge>
                  )}
                  {showDetails && company.sector && (
                    <Badge variant="secondary" className="text-xs">
                      {language === 'ar' ? company.sector.name_ar : company.sector.name_en}
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

// Combined form component for related selects
interface LocationFormProps {
  regionValue?: string;
  cityValue?: string;
  onRegionChange: (value: string) => void;
  onCityChange: (value: string) => void;
  disabled?: boolean;
}

export const LocationForm: React.FC<LocationFormProps> = ({
  regionValue,
  cityValue,
  onRegionChange,
  onCityChange,
  disabled = false
}) => {
  // Reset city when region changes
  useEffect(() => {
    if (regionValue && cityValue) {
      onCityChange('');
    }
  }, [regionValue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <RegionSelect
        value={regionValue}
        onValueChange={onRegionChange}
        disabled={disabled}
      />
      <CitySelect
        regionCode={regionValue}
        value={cityValue}
        onValueChange={onCityChange}
        disabled={disabled || !regionValue}
        showRegionInfo={!regionValue}
      />
    </div>
  );
};

interface SectorActivityFormProps {
  sectorValue?: string;
  activityValue?: string;
  onSectorChange: (value: string) => void;
  onActivityChange: (value: string) => void;
  disabled?: boolean;
}

export const SectorActivityForm: React.FC<SectorActivityFormProps> = ({
  sectorValue,
  activityValue,
  onSectorChange,
  onActivityChange,
  disabled = false
}) => {
  // Reset activity when sector changes
  useEffect(() => {
    if (sectorValue && activityValue) {
      onActivityChange('');
    }
  }, [sectorValue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectorSelect
        value={sectorValue}
        onValueChange={onSectorChange}
        disabled={disabled}
      />
      <ActivitySelect
        sectorCode={sectorValue}
        value={activityValue}
        onValueChange={onActivityChange}
        disabled={disabled || !sectorValue}
        showSectorInfo={!sectorValue}
      />
    </div>
  );
};