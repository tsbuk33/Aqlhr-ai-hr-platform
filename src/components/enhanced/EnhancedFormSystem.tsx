import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { usePerformantLocalization } from "@/hooks/usePerformantLocalization";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    message?: string;
  };
  arabicLabel?: string;
  arabicPlaceholder?: string;
}

interface EnhancedFormProps {
  title: string;
  description?: string;
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  loading?: boolean;
  submitText?: string;
  showProgress?: boolean;
  allowFileUpload?: boolean;
  maxFiles?: number;
}

interface ValidationError {
  field: string;
  message: string;
}

export const EnhancedFormSystem: React.FC<EnhancedFormProps> = ({
  title,
  description,
  fields,
  onSubmit,
  loading = false,
  submitText,
  showProgress = false,
  allowFileUpload = false,
  maxFiles = 5
}) => {
  const { language, isRTL } = useLanguage();
  const { directionClasses } = usePerformantLocalization();
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Calculate form progress
  const totalFields = fields.length;
  const completedFields = fields.filter(field => {
    const value = formData[field.name];
    return value !== undefined && value !== '' && value !== null;
  }).length;
  const progress = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value === '')) {
      return language === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required';
    }

    if (field.validation) {
      if (field.validation.pattern && !field.validation.pattern.test(value)) {
        return field.validation.message || (language === 'ar' ? 'تنسيق غير صحيح' : 'Invalid format');
      }
      
      if (field.validation.min && value < field.validation.min) {
        return language === 'ar' ? `القيمة يجب أن تكون أكبر من ${field.validation.min}` : `Value must be greater than ${field.validation.min}`;
      }
      
      if (field.validation.max && value > field.validation.max) {
        return language === 'ar' ? `القيمة يجب أن تكون أقل من ${field.validation.max}` : `Value must be less than ${field.validation.max}`;
      }
    }

    return null;
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Real-time validation
    const field = fields.find(f => f.name === fieldName);
    if (field) {
      const error = validateField(field, value);
      setErrors(prev => {
        const filtered = prev.filter(e => e.field !== fieldName);
        return error ? [...filtered, { field: fieldName, message: error }] : filtered;
      });
    }
  };

  const handleFileUpload = (files: FileList) => {
    const newFiles = Array.from(files).slice(0, maxFiles - uploadedFiles.length);
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: ValidationError[] = [];
    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors.push({ field: field.name, message: error });
      }
    });

    setErrors(newErrors);

    if (newErrors.length === 0) {
      onSubmit({ ...formData, files: uploadedFiles });
    }
  };

  const getFieldError = (fieldName: string) => {
    return errors.find(e => e.field === fieldName)?.message;
  };

  const renderField = (field: FormField) => {
    const error = getFieldError(field.name);
    const label = language === 'ar' && field.arabicLabel ? field.arabicLabel : field.label;
    const placeholder = language === 'ar' && field.arabicPlaceholder ? field.arabicPlaceholder : field.placeholder;

    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={field.name} className={cn(directionClasses.text, field.required && "after:content-['*'] after:text-destructive after:ml-1")}>
          {label}
        </Label>
        
        {field.type === 'text' || field.type === 'email' || field.type === 'number' ? (
          <Input
            id={field.name}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={placeholder}
            className={cn(error && "border-destructive", directionClasses.text)}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        ) : field.type === 'date' ? (
          <Input
            id={field.name}
            type="date"
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={cn(error && "border-destructive", directionClasses.text)}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        ) : field.type === 'textarea' ? (
          <Textarea
            id={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={placeholder}
            className={cn(error && "border-destructive", directionClasses.text)}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        ) : field.type === 'select' ? (
          <Select value={formData[field.name]} onValueChange={(value) => handleFieldChange(field.name, value)}>
            <SelectTrigger className={cn(error && "border-destructive", directionClasses.text)}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : field.type === 'checkbox' ? (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={formData[field.name] || false}
              onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
            />
            <Label htmlFor={field.name} className="text-sm">
              {label}
            </Label>
          </div>
        ) : field.type === 'radio' ? (
          <RadioGroup
            value={formData[field.name]}
            onValueChange={(value) => handleFieldChange(field.name, value)}
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
                <Label htmlFor={`${field.name}-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : null}

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={directionClasses.text}>{title}</CardTitle>
        {description && (
          <CardDescription className={directionClasses.text}>{description}</CardDescription>
        )}
        
        {showProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{language === 'ar' ? 'تقدم النموذج' : 'Form Progress'}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map(renderField)}
          </div>

          {allowFileUpload && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  {language === 'ar' ? 'اسحب الملفات هنا أو انقر للاختيار' : 'Drag files here or click to select'}
                </p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                  {language === 'ar' ? 'اختر الملفات' : 'Choose Files'}
                </Button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">{language === 'ar' ? 'الملفات المرفوعة' : 'Uploaded Files'}</h4>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={loading || errors.length > 0}>
              {loading ? (
                language === 'ar' ? 'جاري الحفظ...' : 'Saving...'
              ) : (
                submitText || (language === 'ar' ? 'حفظ' : 'Save')
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};