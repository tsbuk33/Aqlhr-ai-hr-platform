# ESG-HR Module Documentation

## Overview
The ESG-HR module integrates Environmental, Social, and Governance (ESG) principles with Human Resources management in the AqlHR platform.

## Features
- **Environmental**: Climate adaptive practices, responsible operations, resource management, sustainable workplaces
- **Social**: Employee wellbeing programs, diversity & inclusion, community engagement, fair labor practices  
- **Governance**: Ethical leadership, transparent reporting, risk management, regulatory compliance

## Components

### EsgHrPage (`src/pages/esg-hr/index.tsx`)
Main page component that displays three ESG cards using the `CenteredLayout` for proper LTR/RTL support.

### EsgCard (`src/components/esg/EsgCard.tsx`)
Reusable card component for displaying ESG categories with:
- Icon display
- Internationalized titles
- Bullet point lists from translations
- Color coding by category

## Internationalization
All text content is managed through the API translation system:
- English: `public/api/translations/en.json` → `esgHr` section
- Arabic: `public/api/translations/ar.json` → `esgHr` section

## Routing
- **English**: `/esg-hr`
- **Arabic**: `/ar/esg-hr` (handled by language context)

## Accessibility & Quality Compliance
✅ **LTR/RTL Compliance**: Uses `CenteredLayout` with proper `dir` attributes  
✅ **Heading Case**: All headings follow Title Case standards  
✅ **Color Contrast**: Uses semantic design tokens for WCAG compliance  
✅ **Center Layout**: Everything properly centered using established patterns  

## CLI Commands for Testing
```bash
# Test center layout compliance
npx tsx scripts/fix-center-layout.ts --dry-run

# Test LTR/RTL compliance  
npx tsx scripts/fix-ltr-rtl-compliance.ts --dry-run

# Test heading case compliance
npx tsx scripts/fix-heading-case.ts --dry-run

# Test color contrast
npx tsx scripts/fix-color-contrast.ts --dry-run

# Apply all fixes
npm run quality-fix-all
```

## Integration Points
- Uses `useAPITranslations` hook for i18n
- Uses `useLanguage` hook for RTL/LTR detection  
- Follows established AqlHR design patterns
- Auto-detected by audit pipelines

## Screenshots
*[Screenshots would be included showing English and Arabic versions]*

## Sample JSON
```json
{
  "esgHr": {
    "pageTitle": "ESG and HR",
    "environmental": "Environmental",
    "envBullets": [
      "Climate adaptive practices",
      "Responsible operations", 
      "Resource management",
      "Sustainable workplaces"
    ]
  }
}
```