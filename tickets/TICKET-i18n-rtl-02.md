# 🔧 High-Priority Fix Ticket – Arabic Locale 🔥

## Issue ID: i18n-rtl-02
**Priority:** HIGH  
**Branch:** `hotfix/i18n-rtl-02`  
**Assignee:** Lovable.dev  
**Created:** 2025-01-09  

## Problem Statement
Arabic locale (lang=ar) rendering raw i18n keys instead of proper translations across multiple pages. RTL layout issues causing overflow and misalignment. Missing routes for critical government integrations.

## Tasks

### 1. i18n Gaps
- [ ] Run `npm run i18n:audit --lang=ar`, plug every missing key
- [ ] Wrap nav + KPI labels in `t()`
- [ ] Delete hard-coded EN strings
- [ ] Never force `fallbackLng` to `'en'` when `dir==='rtl'`

### 2. RTL Layout
- [ ] In ProcessStep → `flex-row-reverse` & `rtl:transform rotate-180`
- [ ] `MetricCard`: add `text-right`, `break-words`, `min-w-[10rem]`
- [ ] Fix Arabic text overflow in cards and navigation

### 3. Broken Routes
- [ ] Map `/government/gosi` (also `/payroll/gosi`) to `GOSIIntegration`
- [ ] Build `HealthInsurancePlatform.tsx` + menu link
- [ ] Sync `routes.tsx` + sideNav JSON

### 4. Gov Pages still English
- [ ] Add `government.mudad_title_ar`, `gov_elm_desc_ar`, etc.
- [ ] Translate tab captions
- [ ] Ensure all government integration pages support Arabic

### 5. QA
- [ ] New Cypress `rtl_i18n_spec.ts` (see code in ticket)
- [ ] Extend TestHarness quick-suite: assert zero dotted keys in AR

## Acceptance Criteria

**Done ==>**
- [ ] Arabic UI: 0 untranslated keys across 106 modules
- [ ] Process arrows reversed in RTL
- [ ] GOSI & Health Insurance routes live
- [ ] `rtl_i18n_spec` and `npm run i18n:audit` pass in CI
- [ ] All metric cards properly handle Arabic text overflow
- [ ] Navigation labels properly translated

## Test Cases

### Cypress RTL i18n Spec Template
```typescript
describe('RTL i18n Validation', () => {
  it('should not contain raw i18n keys in Arabic mode', () => {
    cy.visit('/', { 
      onBeforeLoad: (win) => {
        win.localStorage.setItem('language', 'ar');
      }
    });
    
    // Check that no elements contain dotted keys
    cy.get('body').should('not.contain', /\w+\.\w+/);
    
    // Test navigation
    cy.get('[data-testid="sidebar"]').should('exist');
    cy.get('[data-testid="sidebar"]').should('not.contain', /nav\./);
    
    // Test key pages
    const testRoutes = [
      '/core-hr/benefits',
      '/ai-automation/smart-recommendations', 
      '/government/qiwa',
      '/government/gosi'
    ];
    
    testRoutes.forEach(route => {
      cy.visit(route);
      cy.get('body').should('not.contain', /\w+\.\w+/);
    });
  });
});
```

## Definition of Done
- All Arabic translations render correctly without raw keys
- RTL layouts properly handle text direction and overflow
- Government integration routes accessible and functional
- Cypress tests pass for RTL i18n validation
- Zero hard-coded English strings in components

**Estimated Effort:** 4-6 hours  
**Risk Level:** Medium (affects user experience but no data corruption)  

---
**Close via commit:** `Fix #i18n-rtl-02`