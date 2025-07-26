# AqlHR Localization Style Guide

## Overview
This document defines the official style guidelines for all text content in the AqlHR platform, ensuring consistency across English and Arabic languages while maintaining cultural sensitivity and professional tone.

## Language Policies

### Supported Languages
- **Primary**: Arabic (Saudi dialect/Modern Standard Arabic)
- **Secondary**: English (International/Business English)

### Language Selection Priority
1. Arabic is the primary language for Saudi users
2. English is provided for international users and technical contexts
3. All critical business functions must be available in both languages

## Tone & Voice Guidelines

### Overall Tone
- **Professional**: Maintain business-appropriate language
- **Authoritative**: Position AqlHR as the expert in HR solutions
- **Helpful**: Be informative and solution-oriented
- **Respectful**: Honor Saudi cultural values and business practices

### Arabic Tone Specifications
- Use **Modern Standard Arabic (MSA)** for formal content
- Incorporate **Saudi business terminology** where appropriate
- Maintain **respectful formality** (استخدام ضمير الجمع المؤدب)
- Use **gender-neutral** language where possible
- Employ **active voice** constructions

### English Tone Specifications
- Use **International Business English**
- Maintain **professional formality**
- Employ **clear, concise** language
- Use **active voice** where possible
- Avoid **colloquialisms** and slang

## Cultural Considerations

### Saudi Cultural Sensitivity
- Honor **Islamic values** in all content
- Respect **gender considerations** in language choices
- Acknowledge **Saudi Vision 2030** initiatives
- Reference **local business practices** and regulations
- Use **appropriate titles** and formal address

### Business Context
- Emphasize **compliance** with Saudi labor law
- Highlight **government integration** capabilities
- Reference **local regulatory bodies** (MOL, GOSI, HRDF)
- Acknowledge **Saudization requirements**

## Formatting Conventions

### Date Formats
**Arabic Context:**
- Short: `DD/MM/YYYY` (e.g., 15/03/2024)
- Long: `DD Month YYYY` (e.g., 15 مارس 2024)
- Hijri: `DD/MM/YYYY هـ` (e.g., 05/09/1445 هـ)

**English Context:**
- Short: `MM/DD/YYYY` (e.g., 03/15/2024)
- Long: `Month DD, YYYY` (e.g., March 15, 2024)
- ISO: `YYYY-MM-DD` (for technical contexts)

### Time Formats
**Arabic:**
- 12-hour: `HH:MM ص/م` (e.g., 02:30 م)
- 24-hour: `HH:MM` (for technical contexts)

**English:**
- 12-hour: `HH:MM AM/PM` (e.g., 2:30 PM)
- 24-hour: `HH:MM` (for technical contexts)

### Currency Formats
**Saudi Riyal:**
- Arabic: `{amount} ريال` (e.g., 1,500 ريال)
- English: `SAR {amount}` (e.g., SAR 1,500)

**US Dollar (when applicable):**
- Arabic: `{amount} دولار أمريكي`
- English: `USD {amount}`

### Number Formats
**Arabic:**
- Thousands: Use Arabic comma `٬` (e.g., 1٬500)
- Decimals: Use Arabic decimal `٫` (e.g., 15٫50)
- Percentages: `{value}%` (e.g., 75%)

**English:**
- Thousands: Use comma `,` (e.g., 1,500)
- Decimals: Use period `.` (e.g., 15.50)
- Percentages: `{value}%` (e.g., 75%)

## Gendered Language Guidelines

### Arabic Gender Considerations
- Use **dual forms** when addressing mixed groups: `الموظفون والموظفات`
- Employ **masculine plural** as default for generic references
- Specify **feminine forms** when context requires: `مديرة الموارد البشرية`
- Use **neutral job titles** where possible: `أخصائي/ة الموارد البشرية`

### English Gender Considerations
- Use **gender-neutral** terms: "Employee" instead of "Workman"
- Employ **inclusive pronouns**: "they/their" for generic references
- Use **job titles** without gender markers: "Manager" not "Manageress"
- Reference **both genders** explicitly when necessary: "his or her"

## Technical Terminology

### System Interface Terms
- Keep **technical terms** consistent across languages
- Do not translate **proper nouns**: "AqlHR", "Nitaqat", "Qiwa"
- Use **established translations** for common tech terms
- Maintain **acronym consistency**: "API", "HR", "KPI"

### Government & Legal Terms
- Use **official translations** for Saudi government entities
- Reference **legal terms** in their official language
- Provide **Arabic-first** naming for Saudi institutions
- Include **English equivalents** in parentheses when helpful

## Content Structure Guidelines

### Headings & Titles
**Arabic:**
- Use **verb-noun** constructions: `إدارة الموظفين`
- Employ **descriptive phrases**: `تقارير الأداء الشهرية`
- Keep **concise** and **informative**

**English:**
- Use **title case** for main headings: "Employee Management"
- Employ **sentence case** for subheadings: "Monthly performance reports"
- Keep **concise** and **action-oriented**

### Button & Action Labels
**Arabic:**
- Use **imperative verbs**: `احفظ`, `ألغي`, `أضف`
- Keep **single words** when possible
- Use **clear action words**: `تصدير البيانات`

**English:**
- Use **imperative verbs**: "Save", "Cancel", "Add"
- Keep **concise**: "Export Data" not "Export the Data"
- Use **clear action words**: avoid ambiguity

### Error Messages
**Arabic:**
- Start with **problem identification**: `خطأ في الإدخال`
- Provide **clear solutions**: `يرجى التحقق من صحة البيانات`
- Use **polite language**: `نعتذر عن هذا الخطأ`

**English:**
- Start with **problem identification**: "Input Error"
- Provide **clear solutions**: "Please check your data and try again"
- Use **helpful tone**: "Something went wrong. Please try again."

## Quality Assurance Standards

### Translation Quality Criteria
1. **Accuracy**: Meaning preserved across languages
2. **Consistency**: Terms used uniformly throughout
3. **Cultural Appropriateness**: Suitable for Saudi business context
4. **Technical Precision**: Correct specialized terminology
5. **User Experience**: Clear and intuitive for end users

### Review Process Requirements
1. **Linguistic Review**: Native speaker verification
2. **Cultural Review**: Saudi business context validation
3. **Technical Review**: HR domain expert approval
4. **User Testing**: End-user comprehension validation

### Compliance Standards
- All content must comply with **Saudi cultural norms**
- Legal terminology must align with **Saudi labor law**
- Government references must use **official translations**
- Financial formats must follow **SAMA guidelines**

## Translation Memory (TM) Integration

### TM System Configuration
The platform integrates with Translation Memory systems (Crowdin, Lokalise, or custom) for automated translation workflow:

```bash
# Extract translation keys from code
npm run extract-keys

# Verify translation completeness  
npm run verify-translations

# Sync with TM system
npm run translations:sync
```

### Local Development Setup
1. Set up TM API credentials in your environment:
```bash
# For Crowdin
export CROWDIN_API_KEY="your_api_key"
export CROWDIN_PROJECT_ID="your_project_id"

# For Lokalise  
export LOKALISE_API_KEY="your_api_key"
export LOKALISE_PROJECT_ID="your_project_id"
```

2. Install pre-commit hooks:
```bash
npm run setup:git-hooks
```

### Pre-Commit Workflow
The pre-commit hook automatically:
- Extracts new translation keys from modified files
- Uploads keys to TM system  
- Validates existing translations
- Aborts commit if translations are incomplete

To bypass temporarily: `git commit --no-verify`

### CI/CD Integration
The CI pipeline includes a `translation-check` job that:
1. Downloads latest translations from TM
2. Verifies completeness across all locales
3. Fails build if critical keys are missing
4. Generates detailed reports

### Fixing Build Failures
If translation checks fail:

1. **Missing Keys**: Run `npm run translations:sync` to download latest
2. **Critical Keys Missing**: Translate critical keys in your TM system first
3. **Outdated Translations**: Update translations in TM and re-run pipeline
4. **Check Reports**: Review artifacts/translation_report.html for details

### Quality Thresholds
- **Minimum Completeness**: 80%
- **Target Completeness**: 95%  
- **Critical Keys**: 100% (must be translated)
- **Translation Age**: Max 7 days before warning

### Development Requirements
- All user-facing text must use **translation keys**
- Hard-coded strings are **prohibited**
- New terms must be added to **terms.yaml** first
- Translations must be **reviewed** before deployment

### Maintenance Procedures
- Regular **terminology audits** (quarterly)
- **Style guide updates** as needed
- **Translation memory** maintenance
- **Quality metrics** tracking

### Team Responsibilities
- **Developers**: Implement translation keys correctly
- **Content Writers**: Follow style guidelines
- **Translators**: Ensure accuracy and consistency
- **Reviewers**: Validate cultural appropriateness
- **Product Managers**: Approve final content

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Next Review**: April 2025  
**Owner**: AqlHR Localization Team