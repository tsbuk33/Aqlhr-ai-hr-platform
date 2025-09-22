import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Percent, Calculator, Settings } from 'lucide-react';
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdvancedPayroll, AllowanceDefinition } from '@/hooks/useAdvancedPayroll';
import { toast } from 'sonner';

export const AllowanceManager: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const { allowanceDefinitions, allowancesLoading, createAllowance, updateAllowance } = useAdvancedPayroll();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAllowance, setEditingAllowance] = useState<AllowanceDefinition | null>(null);
  
  const [formData, setFormData] = useState({
    allowance_code: '',
    allowance_name_en: '',
    allowance_name_ar: '',
    calculation_type: 'fixed' as 'fixed' | 'percentage' | 'formula' | 'conditional',
    calculation_formula: {} as any,
    is_taxable: true,
    affects_eos: true,
    affects_gosi: true,
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      allowance_code: '',
      allowance_name_en: '',
      allowance_name_ar: '',
      calculation_type: 'fixed',
      calculation_formula: {},
      is_taxable: true,
      affects_eos: true,
      affects_gosi: true,
      is_active: true
    });
    setEditingAllowance(null);
  };

  const handleEdit = (allowance: AllowanceDefinition) => {
    setEditingAllowance(allowance);
    setFormData({
      allowance_code: allowance.allowance_code,
      allowance_name_en: allowance.allowance_name_en,
      allowance_name_ar: allowance.allowance_name_ar,
      calculation_type: allowance.calculation_type,
      calculation_formula: allowance.calculation_formula,
      is_taxable: allowance.is_taxable,
      affects_eos: allowance.affects_eos,
      affects_gosi: allowance.affects_gosi,
      is_active: allowance.is_active
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.allowance_code || !formData.allowance_name_en) {
      toast.error(isArabic ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields');
      return;
    }

    try {
      if (editingAllowance) {
        updateAllowance({ id: editingAllowance.id, ...formData });
      } else {
        createAllowance({ ...formData, company_id: 'current-company-id' });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving allowance:', error);
    }
  };

  const getCalculationTypeIcon = (type: string) => {
    switch (type) {
      case 'fixed': return <CurrencyIcon className="h-4 w-4" />;
      case 'percentage': return <Percent className="h-4 w-4" />;
      case 'formula': return <Calculator className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getCalculationTypeLabel = (type: string) => {
    if (isArabic) {
      switch (type) {
        case 'fixed': return 'مبلغ ثابت';
        case 'percentage': return 'نسبة مئوية';
        case 'formula': return 'معادلة';
        case 'conditional': return 'شرطي';
        default: return type;
      }
    } else {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  if (allowancesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {isArabic ? 'إدارة البدلات' : 'Allowance Management'}
          </h2>
          <p className="text-muted-foreground">
            {isArabic ? 
              'إدارة أنواع البدلات وقواعد الحساب' :
              'Manage allowance types and calculation rules'
            }
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              {isArabic ? 'إضافة بدل' : 'Add Allowance'}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAllowance ? 
                  (isArabic ? 'تعديل البدل' : 'Edit Allowance') :
                  (isArabic ? 'إضافة بدل جديد' : 'Add New Allowance')
                }
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="allowance_code">
                    {isArabic ? 'رمز البدل' : 'Allowance Code'}
                  </Label>
                  <Input
                    id="allowance_code"
                    value={formData.allowance_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, allowance_code: e.target.value.toUpperCase() }))}
                    placeholder="HOUSING"
                  />
                </div>
                
                <div>
                  <Label htmlFor="calculation_type">
                    {isArabic ? 'نوع الحساب' : 'Calculation Type'}
                  </Label>
                  <Select 
                    value={formData.calculation_type} 
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, calculation_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">
                        <div className="flex items-center gap-2">
                          <CurrencyIcon className="h-4 w-4" />
                          {isArabic ? 'مبلغ ثابت' : 'Fixed Amount'}
                        </div>
                      </SelectItem>
                      <SelectItem value="percentage">
                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4" />
                          {isArabic ? 'نسبة مئوية' : 'Percentage'}
                        </div>
                      </SelectItem>
                      <SelectItem value="formula">
                        <div className="flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          {isArabic ? 'معادلة' : 'Formula'}
                        </div>
                      </SelectItem>
                      <SelectItem value="conditional">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          {isArabic ? 'شرطي' : 'Conditional'}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="allowance_name_en">
                    {isArabic ? 'الاسم بالإنجليزية' : 'Name (English)'}
                  </Label>
                  <Input
                    id="allowance_name_en"
                    value={formData.allowance_name_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, allowance_name_en: e.target.value }))}
                    placeholder="Housing Allowance"
                  />
                </div>
                
                <div>
                  <Label htmlFor="allowance_name_ar">
                    {isArabic ? 'الاسم بالعربية' : 'Name (Arabic)'}
                  </Label>
                  <Input
                    id="allowance_name_ar"
                    value={formData.allowance_name_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, allowance_name_ar: e.target.value }))}
                    placeholder="بدل سكن"
                  />
                </div>
              </div>

              {/* Calculation Formula */}
              <div>
                <Label>
                  {isArabic ? 'معادلة الحساب' : 'Calculation Formula'}
                </Label>
                <div className="mt-2 p-4 border rounded-lg bg-muted/50">
                  {formData.calculation_type === 'fixed' && (
                    <div>
                      <Label htmlFor="fixed_amount">
                        {isArabic ? 'المبلغ الثابت' : 'Fixed Amount'}
                      </Label>
                      <Input
                        id="fixed_amount"
                        type="number"
                        value={formData.calculation_formula.amount || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          calculation_formula: { ...prev.calculation_formula, amount: parseFloat(e.target.value) || 0 }
                        }))}
                        placeholder="500"
                      />
                    </div>
                  )}
                  
                  {formData.calculation_type === 'percentage' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="percentage">
                          {isArabic ? 'النسبة المئوية' : 'Percentage'}
                        </Label>
                        <Input
                          id="percentage"
                          type="number"
                          value={formData.calculation_formula.percentage || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            calculation_formula: { ...prev.calculation_formula, percentage: parseFloat(e.target.value) || 0 }
                          }))}
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <Label htmlFor="max_amount">
                          {isArabic ? 'الحد الأقصى' : 'Maximum Amount'}
                        </Label>
                        <Input
                          id="max_amount"
                          type="number"
                          value={formData.calculation_formula.max_amount || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            calculation_formula: { ...prev.calculation_formula, max_amount: parseFloat(e.target.value) || 0 }
                          }))}
                          placeholder="5000"
                        />
                      </div>
                    </div>
                  )}
                  
                  {formData.calculation_type === 'formula' && (
                    <div>
                      <Label htmlFor="formula_expression">
                        {isArabic ? 'تعبير المعادلة' : 'Formula Expression'}
                      </Label>
                      <Textarea
                        id="formula_expression"
                        value={JSON.stringify(formData.calculation_formula, null, 2)}
                        onChange={(e) => {
                          try {
                            const formula = JSON.parse(e.target.value);
                            setFormData(prev => ({ ...prev, calculation_formula: formula }));
                          } catch {}
                        }}
                        placeholder='{"rate": 1.5, "base": "hourly_rate"}'
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {isArabic ? 'الإعدادات' : 'Settings'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_taxable">
                      {isArabic ? 'خاضع للضريبة' : 'Taxable'}
                    </Label>
                    <Switch
                      id="is_taxable"
                      checked={formData.is_taxable}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_taxable: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="affects_eos">
                      {isArabic ? 'يؤثر على نهاية الخدمة' : 'Affects End of Service'}
                    </Label>
                    <Switch
                      id="affects_eos"
                      checked={formData.affects_eos}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, affects_eos: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="affects_gosi">
                      {isArabic ? 'يؤثر على GOSI' : 'Affects GOSI'}
                    </Label>
                    <Switch
                      id="affects_gosi"
                      checked={formData.affects_gosi}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, affects_gosi: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active">
                      {isArabic ? 'نشط' : 'Active'}
                    </Label>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button onClick={handleSubmit}>
                  {editingAllowance ? 
                    (isArabic ? 'تحديث' : 'Update') :
                    (isArabic ? 'إضافة' : 'Add')
                  }
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Allowances List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allowanceDefinitions?.map((allowance) => (
          <Card key={allowance.id} className={!allowance.is_active ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getCalculationTypeIcon(allowance.calculation_type)}
                  <div>
                    <h3 className="font-semibold">
                      {isArabic ? allowance.allowance_name_ar : allowance.allowance_name_en}
                    </h3>
                    <p className="text-sm text-muted-foreground font-normal">
                      {allowance.allowance_code}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {getCalculationTypeLabel(allowance.calculation_type)}
                  </Badge>
                  {!allowance.is_active && (
                    <Badge variant="destructive">
                      {isArabic ? 'غير نشط' : 'Inactive'}
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Calculation Details */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">
                    {isArabic ? 'تفاصيل الحساب' : 'Calculation Details'}
                  </h4>
                  <div className="text-xs text-muted-foreground">
                    {allowance.calculation_type === 'fixed' && (
                      <p>{isArabic ? 'مبلغ ثابت:' : 'Fixed Amount:'} {allowance.calculation_formula.amount} SAR</p>
                    )}
                    {allowance.calculation_type === 'percentage' && (
                      <div>
                        <p>{isArabic ? 'النسبة:' : 'Percentage:'} {allowance.calculation_formula.percentage}%</p>
                        {allowance.calculation_formula.max_amount && (
                          <p>{isArabic ? 'الحد الأقصى:' : 'Max:'} {allowance.calculation_formula.max_amount} SAR</p>
                        )}
                      </div>
                    )}
                    {allowance.calculation_type === 'formula' && (
                      <p>{isArabic ? 'معادلة مخصصة' : 'Custom formula'}</p>
                    )}
                  </div>
                </div>

                {/* Settings */}
                <div className="flex flex-wrap gap-2">
                  {allowance.is_taxable && (
                    <Badge variant="secondary" className="text-xs">
                      {isArabic ? 'خاضع للضريبة' : 'Taxable'}
                    </Badge>
                  )}
                  {allowance.affects_eos && (
                    <Badge variant="secondary" className="text-xs">
                      {isArabic ? 'نهاية الخدمة' : 'EOS'}
                    </Badge>
                  )}
                  {allowance.affects_gosi && (
                    <Badge variant="secondary" className="text-xs">
                      GOSI
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(allowance)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {allowanceDefinitions?.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CurrencyIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isArabic ? 'لا توجد بدلات' : 'No Allowances'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {isArabic ? 
                'ابدأ بإضافة أنواع البدلات المختلفة' :
                'Start by adding different types of allowances'
              }
            </p>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              {isArabic ? 'إضافة أول بدل' : 'Add First Allowance'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};