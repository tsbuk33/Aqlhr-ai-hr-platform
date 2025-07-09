import { useLanguage } from '@/contexts/LanguageContext';

/**
 * I18n Test Component for Arabic Translation Validation
 * Validates that all key pages render Arabic text properly without showing raw keys
 */
export const I18nArabicTest = () => {
  const { t, language, toggleLanguage } = useLanguage();

  // Test key translations that were commonly missing
  const testKeys = [
    // Core HR
    'core_hr.benefits_administration',
    'core_hr.enrolled_employees',
    'core_hr.active_benefits',
    'core_hr.claims_processed',
    'core_hr.satisfaction_rate',
    
    // AI Features
    'ai.predictive_analytics_engine',
    'ai.document_intelligence',
    'ai.automated_workflow_engine',
    'ai.smart_recommendations',
    
    // Government
    'government.mol_compliance',
    'government.compliance_score',
    'government.active_violations',
    'government.resolved_issues',
    'government.inspection_ready',
    
    // Navigation
    'nav.benefits_administration',
    'nav.smart_recommendations',
    'nav.predictive_analytics',
    'nav.document_intelligence',
    'nav.arabic_english_nlp',
    'nav.automated_workflows',
    'nav.qiwa_integration',
    'nav.gosi_integration',
    'nav.hrsd_integration',
  ];

  const validateTranslations = () => {
    const missingKeys = testKeys.filter(key => {
      const translation = t(key);
      // Check if translation contains dots (indicating missing key)
      return translation.includes('.') && translation === key;
    });
    
    return {
      total: testKeys.length,
      missing: missingKeys.length,
      missingKeys,
      coverage: ((testKeys.length - missingKeys.length) / testKeys.length * 100).toFixed(1)
    };
  };

  const results = validateTranslations();

  if (language !== 'ar') {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          Switch to Arabic to test translations. 
          <button 
            onClick={toggleLanguage}
            className="ml-2 text-blue-600 underline"
          >
            Switch to Arabic
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className={`p-4 rounded-lg border ${results.missing === 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <h3 className="font-semibold text-lg">
          Arabic Translation Test Results
        </h3>
        <p className="text-sm text-muted-foreground">
          Coverage: {results.coverage}% ({results.total - results.missing}/{results.total})
        </p>
        
        {results.missing === 0 ? (
          <p className="text-green-700 font-medium mt-2">
            ✅ All key translations are working properly
          </p>
        ) : (
          <div className="mt-2">
            <p className="text-red-700 font-medium">
              ❌ {results.missing} translations missing:
            </p>
            <ul className="list-disc list-inside text-sm text-red-600 mt-1">
              {results.missingKeys.map(key => (
                <li key={key}>{key}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <h4 className="font-medium">Sample Translations:</h4>
        {testKeys.slice(0, 5).map(key => (
          <div key={key} className="flex justify-between text-sm border-b pb-1">
            <span className="text-muted-foreground font-mono">{key}</span>
            <span className={`${t(key).includes('.') ? 'text-red-600' : 'text-green-600'}`}>
              {t(key)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};