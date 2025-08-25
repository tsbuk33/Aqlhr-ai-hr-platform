# Route Sentinel Documentation

## Overview

The Route Sentinel is an automated route auditing system that tests all application routes for:
- Render status (ok/error/timeout)
- Mount performance timing
- i18n compliance (missing translation keys)
- RTL support for Arabic language
- General React errors and warnings

## Quick Start

### Access the Route Audit Page

1. **Development Mode**: Navigate to `/en/_/route-audit?dev=1`
2. **Auto-run Mode**: Add `&auto=1` to automatically run both EN and AR audits
3. **Direct URLs**: 
   - English: `/en/_/route-audit`
   - Arabic: `/ar/_/route-audit`

### Running Audits

1. **Single Language**: Click "Run EN Audit" or "Run AR Audit"
2. **Both Languages**: Click "Run Both" for comprehensive testing
3. **Quick Test**: Use individual "Test EN"/"Test AR" buttons for specific routes

## Understanding Results

### Status Indicators

- ✅ **OK**: Route rendered successfully without errors
- ❌ **Error**: React error occurred during render
- ⏰ **Timeout**: Route took longer than 5 seconds to mount

### Performance Metrics

- **Mount Time**: Time in milliseconds for component to mount
- **i18n Count**: Number of missing translation keys detected
- **RTL Status**: Whether Arabic routes properly set `dir="rtl"`

### Filters

- **Module**: Filter by application module (dashboard, diagnostic, dev)
- **Status**: Show only routes with specific status
- **Has i18n Issues**: Show routes with missing translations
- **Hide OK**: Hide successfully tested routes

## Technical Details

### Architecture

```
src/lib/dev/routeSentinel.ts     # Core audit runner
src/lib/dev/routesIndex.ts       # Route definitions
src/lib/observability/logUiEvent.ts # Logging helper
src/pages/_/RouteAudit.tsx       # UI interface
```

### How It Works

1. **Route Collection**: Reads navigable routes from `routesIndex.ts`
2. **Off-screen Testing**: Creates hidden DOM containers for testing
3. **Error Interception**: Captures React errors and console warnings
4. **Performance Measurement**: Uses `performance.now()` for timing
5. **Results Storage**: Logs to `ui_events` table for persistence

### Logged Data

Each test creates a `ui_events` record with:
```json
{
  "route": "/diagnostic/retention",
  "lang": "en",
  "module": "diagnostic", 
  "mountMs": 245,
  "status": "ok",
  "errorMessage": null,
  "i18nMissingCount": 0,
  "rtlOk": true,
  "auditTimestamp": "2025-08-25T10:30:00Z"
}
```

## Adding New Routes

### 1. Update Routes Index

Edit `src/lib/dev/routesIndex.ts`:

```typescript
export const NAVIGABLE_ROUTES: RouteInfo[] = [
  // ... existing routes
  { path: '/new-feature', module: 'feature', title: 'New Feature' },
];
```

### 2. Route Requirements

- **Static Routes**: Direct paths like `/dashboard`, `/settings`
- **Exclude Dynamic**: Avoid routes requiring IDs unless demo data available
- **Module Grouping**: Assign logical module names for filtering

### 3. Testing Considerations

- Ensure routes work in both EN/AR languages
- Test with dev mode (`?dev=1`) for proper tenant handling
- Verify no PII is exposed in error messages

## Troubleshooting

### Common Issues

1. **Timeout Errors**: Routes taking >5s to mount
   - Check for slow API calls or infinite loops
   - Verify proper loading states

2. **i18n Missing Keys**: Translation warnings
   - Use translation audit tools
   - Ensure all user-facing text uses i18n functions

3. **RTL Issues**: Arabic routes not setting proper direction
   - Verify `LanguageLayout` is working correctly
   - Check CSS RTL-specific styles

### Debugging

1. **Console Logs**: Route Sentinel logs progress to browser console
2. **UI Events**: Check Supabase `ui_events` table for detailed logs
3. **Dev Mode**: Use `?dev=1` to bypass auth requirements

### Performance Tips

- Tests run with 100ms delay between routes to prevent overload
- Results are cached in `ui_events` and displayed from last run
- Use filters to focus on problematic routes

## Integration with CI/CD

Future enhancement: Route Sentinel can be integrated into automated testing:

```bash
# Example: Run headless audit
npm run test:routes
```

This would run the audit programmatically and fail builds if critical routes are broken.

## Maintenance

### Regular Tasks

1. **Update Route Index**: Add new routes as features are developed
2. **Review Results**: Check audit results weekly for new issues
3. **Performance Monitoring**: Track mount times for performance regressions

### Data Cleanup

Route audit logs in `ui_events` should be cleaned periodically to prevent table bloat. Consider retention policies based on your needs.
