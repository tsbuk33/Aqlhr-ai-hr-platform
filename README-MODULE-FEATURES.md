# AqlHR Module Features Framework

This framework ensures every module in AqlHR has consistent, user-friendly features including hover tooltips, how-to panels, document upload, AI diagnostics, and chat support.

## Features Overview

Every module automatically includes:

- **🎯 Hover Tooltips**: Clear guidance on module/tool usage
- **📚 How-to-Use Panels**: Step-by-step instructions with bilingual support
- **📁 Document Upload**: Context-aware file upload for each module
- **🔍 AI Diagnostics**: Automated analysis and recommendations
- **💬 AI Chat**: Embedded assistant for module-specific help
- **🌐 Localization**: Full English/Arabic support with RTL handling
- **🎨 Centered Layouts**: WCAG-compliant responsive design

## Universal Components

### ModuleTooltip
```tsx
import ModuleTooltip from '@/components/universal/ModuleTooltip';

<ModuleTooltip moduleKey="dashboard" showIcon>
  <YourComponent />
</ModuleTooltip>
```

### HowToUsePanel
```tsx
import HowToUsePanel from '@/components/universal/HowToUsePanel';

<HowToUsePanel moduleKey="dashboard" />
```

### ModuleDocumentUploader
```tsx
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';

<ModuleDocumentUploader 
  moduleKey="dashboard"
  maxFiles={5}
  maxSize={10}
  acceptedTypes={['.pdf', '.doc', '.xlsx']}
  onFilesUploaded={handleFiles}
/>
```

### ModuleAIChat
```tsx
import ModuleAIChat from '@/components/universal/ModuleAIChat';

<ModuleAIChat 
  moduleKey="dashboard"
  context={{
    moduleName: "Dashboard",
    currentData: data,
    uploadedDocs: docs
  }}
/>
```

### ModuleDiagnosticPanel
```tsx
import ModuleDiagnosticPanel from '@/components/universal/ModuleDiagnosticPanel';

<ModuleDiagnosticPanel 
  moduleKey="dashboard"
  contextData={moduleData}
  autoRefresh={true}
  refreshInterval={300}
/>
```

## Localization Structure

Translation keys follow this pattern:

```json
{
  "moduleKey": {
    "tooltip": "How to use this module",
    "howToUse": {
      "title": "How to Use",
      "description": "Module description",
      "steps": ["Step 1", "Step 2", "Step 3"]
    },
    "documentUpload": {
      "title": "Upload Documents"
    },
    "aiChat": {
      "title": "AI Assistant",
      "welcomeMessage": "How can I help you?"
    },
    "diagnostic": {
      "title": "Module Diagnostic",
      "issues": {
        "dataIncomplete": "Data Incomplete",
        "dataIncompleteDesc": "Some required data is missing"
      }
    }
  }
}
```

## CLI Tools

### Audit All Modules
```bash
npm run audit:modules
```
Generates `audit-manifest.json` with feature completeness for all modules.

### Run Tests
```bash
# Unit tests
npm run test

# UI tests
npm run test:ui

# Complete CI pipeline
npm run ci:audit
```

### Development Workflow

1. **Create new module**: Components automatically inherit universal features
2. **Add translations**: Use consistent key patterns
3. **Test features**: Run audit to ensure completeness
4. **Verify integration**: UI tests confirm proper behavior

## Audit Manifest

The audit script generates a comprehensive report:

```json
{
  "version": "1.0.0",
  "totalModules": 15,
  "featuresCompleteness": {
    "hoverTooltips": 100,
    "howToUsePanels": 100,
    "documentUpload": 95,
    "aiDiagnostics": 90,
    "aiChat": 85,
    "localization": 100,
    "centeredLayout": 100
  },
  "modules": [...],
  "missingFeaturesSummary": {...},
  "nextActions": [...]
}
```

## Testing

### Unit Tests
- All universal components have comprehensive test coverage
- Mock implementations for Supabase and translation hooks
- Coverage threshold: 80% across all metrics

### Integration Tests
- Cypress E2E tests verify features across all modules
- Automated checks for tooltips, panels, uploads, chat, diagnostics
- RTL and localization testing
- WCAG color contrast verification

### CI/CD Integration
- GitHub Actions workflow runs on every push
- Nightly audits catch feature drift
- Blocks PRs if any module loses required features

## Best Practices

### Adding New Modules
1. Create page component in `src/pages/`
2. Add translation keys following the pattern
3. Import and use universal components
4. Run audit to verify feature completeness

### Customization
- Universal components accept customization props
- Use `useModuleFeatures` hook for feature toggles
- Maintain consistent styling with design tokens

### Performance
- Components are lazy-loaded where possible
- File uploads use progressive enhancement
- AI features gracefully degrade if services unavailable

## Maintenance

### Regular Tasks
- Run weekly audits: `npm run audit:modules`
- Update translation files for new modules
- Monitor test coverage and fix failing tests
- Review and update diagnostic algorithms

### Troubleshooting
- Check `audit-manifest.json` for missing features
- Use `npm run test:coverage` to identify untested code
- Review CI logs for integration failures
- Verify Supabase edge functions are deployed

## Contributing

When adding new modules:
1. Follow the universal component patterns
2. Add comprehensive translations
3. Include data-testid attributes for testing
4. Run the audit before submitting PRs
5. Update documentation if needed

This framework ensures consistency, accessibility, and user-friendliness across the entire AqlHR platform.