import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Clock, 
  Key, 
  Lock, 
  Save,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const SecurityConfigPanel: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const { securityConfig, loading, updateSecurityConfig } = useSecurityAudit();
  const [formData, setFormData] = useState({
    session_idle_timeout_minutes: securityConfig?.session_idle_timeout_minutes || 30,
    session_max_duration_hours: securityConfig?.session_max_duration_hours || 24,
    require_2fa_for_admins: securityConfig?.require_2fa_for_admins || true,
    password_min_length: securityConfig?.password_min_length || 12,
    password_require_special: securityConfig?.password_require_special || true,
    login_attempt_limit: securityConfig?.login_attempt_limit || 5,
    lockout_duration_minutes: securityConfig?.lockout_duration_minutes || 30,
    audit_retention_days: securityConfig?.audit_retention_days || 2555,
    data_encryption_at_rest: securityConfig?.data_encryption_at_rest || true,
    require_session_confirmation: securityConfig?.require_session_confirmation || false,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await updateSecurityConfig(formData);
    setHasChanges(false);
  };

  const getSecurityScore = () => {
    let score = 0;
    const checks = [
      formData.require_2fa_for_admins,
      formData.password_min_length >= 12,
      formData.password_require_special,
      formData.session_idle_timeout_minutes <= 30,
      formData.session_max_duration_hours <= 24,
      formData.login_attempt_limit <= 5,
      formData.data_encryption_at_rest
    ];
    
    score = (checks.filter(Boolean).length / checks.length) * 100;
    return Math.round(score);
  };

  const securityScore = getSecurityScore();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {isArabic ? 'نقاط الأمان' : 'Security Score'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-muted-foreground"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - securityScore / 100)}`}
                  className={securityScore >= 80 ? 'text-green-500' : securityScore >= 60 ? 'text-yellow-500' : 'text-red-500'}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{securityScore}%</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">
                {securityScore >= 80 ? (isArabic ? 'ممتاز' : 'Excellent') :
                 securityScore >= 60 ? (isArabic ? 'جيد' : 'Good') :
                 (isArabic ? 'يحتاج تحسين' : 'Needs Improvement')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'تقييم الوضع الأمني الحالي' : 'Current security posture'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {isArabic ? 'أمان الجلسات' : 'Session Security'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="idle-timeout">
                {isArabic ? 'انتهاء صلاحية عدم النشاط (دقائق)' : 'Idle Timeout (minutes)'}
              </Label>
              <Input
                id="idle-timeout"
                type="number"
                value={formData.session_idle_timeout_minutes}
                onChange={(e) => handleInputChange('session_idle_timeout_minutes', parseInt(e.target.value))}
                min="5"
                max="120"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {isArabic ? 'الموصى به: 30 دقيقة' : 'Recommended: 30 minutes'}
              </p>
            </div>
            <div>
              <Label htmlFor="max-duration">
                {isArabic ? 'أقصى مدة للجلسة (ساعات)' : 'Max Session Duration (hours)'}
              </Label>
              <Input
                id="max-duration"
                type="number"
                value={formData.session_max_duration_hours}
                onChange={(e) => handleInputChange('session_max_duration_hours', parseInt(e.target.value))}
                min="1"
                max="72"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {isArabic ? 'الموصى به: 24 ساعة' : 'Recommended: 24 hours'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="session-confirmation">
                {isArabic ? 'تأكيد الجلسة المطلوب' : 'Require Session Confirmation'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'طلب تأكيد إضافي للعمليات الحساسة' : 'Require additional confirmation for sensitive operations'}
              </p>
            </div>
            <Switch
              id="session-confirmation"
              checked={formData.require_session_confirmation}
              onCheckedChange={(checked) => handleInputChange('require_session_confirmation', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Authentication Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            {isArabic ? 'أمان المصادقة' : 'Authentication Security'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="require-2fa">
                {isArabic ? 'مطلوب 2FA للمسؤولين' : 'Require 2FA for Admins'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'المصادقة الثنائية إجبارية للمسؤولين' : 'Two-factor authentication mandatory for administrators'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {formData.require_2fa_for_admins ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
              <Switch
                id="require-2fa"
                checked={formData.require_2fa_for_admins}
                onCheckedChange={(checked) => handleInputChange('require_2fa_for_admins', checked)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password-length">
                {isArabic ? 'الحد الأدنى لطول كلمة المرور' : 'Min Password Length'}
              </Label>
              <Input
                id="password-length"
                type="number"
                value={formData.password_min_length}
                onChange={(e) => handleInputChange('password_min_length', parseInt(e.target.value))}
                min="8"
                max="32"
              />
            </div>
            <div>
              <Label htmlFor="login-attempts">
                {isArabic ? 'حد محاولات تسجيل الدخول' : 'Login Attempt Limit'}
              </Label>
              <Input
                id="login-attempts"
                type="number"
                value={formData.login_attempt_limit}
                onChange={(e) => handleInputChange('login_attempt_limit', parseInt(e.target.value))}
                min="3"
                max="10"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="special-chars">
                {isArabic ? 'مطلوب أحرف خاصة' : 'Require Special Characters'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'أحرف خاصة مطلوبة في كلمة المرور' : 'Special characters required in passwords'}
              </p>
            </div>
            <Switch
              id="special-chars"
              checked={formData.password_require_special}
              onCheckedChange={(checked) => handleInputChange('password_require_special', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            {isArabic ? 'أمان البيانات' : 'Data Security'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="encryption">
                {isArabic ? 'تشفير البيانات أثناء الراحة' : 'Data Encryption at Rest'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'تشفير البيانات في قاعدة البيانات' : 'Encrypt sensitive data in database'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {formData.data_encryption_at_rest ? (
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  {isArabic ? 'مُفعل' : 'Enabled'}
                </Badge>
              ) : (
                <Badge variant="destructive">
                  {isArabic ? 'معطل' : 'Disabled'}
                </Badge>
              )}
              <Switch
                id="encryption"
                checked={formData.data_encryption_at_rest}
                onCheckedChange={(checked) => handleInputChange('data_encryption_at_rest', checked)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="audit-retention">
              {isArabic ? 'فترة الاحتفاظ بسجل المراجعة (أيام)' : 'Audit Retention Period (days)'}
            </Label>
            <Input
              id="audit-retention"
              type="number"
              value={formData.audit_retention_days}
              onChange={(e) => handleInputChange('audit_retention_days', parseInt(e.target.value))}
              min="365"
              max="3650"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {isArabic ? 'الافتراضي: 7 سنوات (2555 يوم)' : 'Default: 7 years (2555 days)'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      {hasChanges && (
        <Card className="border-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">
                  {isArabic ? 'تغييرات غير محفوظة' : 'Unsaved Changes'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'لديك تغييرات لم تحفظ في إعدادات الأمان' : 'You have unsaved changes to security settings'}
                </p>
              </div>
              <Button onClick={handleSave} className="ml-4">
                <Save className="w-4 h-4 mr-2" />
                {isArabic ? 'حفظ التغييرات' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SecurityConfigPanel;