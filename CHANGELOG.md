# AqlHR - Change Log

## Project Information
- **Project Name:** AqlHR (Saudi Arabian HR Analytics Platform)
- **Technology Stack:** React, TypeScript, Vite, Tailwind CSS, Supabase
- **Business Critical:** Client-facing application requiring quality assurance

---

## Recent Changes

### 2025-01-24 - Retention v1 Module Completion
**Issue:** Complete Retention Strategy module v1 with overview, drivers, watchlist, and AI-generated actions
**Impact:** Major Feature Addition - Full retention analytics capability for client
**Resolution:** Created comprehensive retention system with AI-powered action recommendations

#### Database Changes:
- Created `retention_overview_v1` RPC for avg_risk, high_risk_percentage, target_turnover, risk distribution counts, exits sparkline
- Created `retention_drivers_v1` RPC for top 5 retention drivers with contribution percentages
- Created `retention_watchlist_v1` RPC for organizational units above risk threshold
- Updated `dev_seed_retention_v1` function for robust tenant-scoped data seeding

#### Frontend Implementation:
- **src/hooks/useRetention.ts** - Updated to use new RPC endpoints with legacy compatibility
- **supabase/functions/agent-retention-plan-v1/index.ts** - Edge function for AI action generation
- **Retention UI Components** - Enhanced with sparkline data, new driver structure, watchlist improvements

#### Features Delivered:
- **Overview**: avg_risk metrics, %high_risk, risk distribution bars, exits sparkline by month
- **Drivers**: Top 5 drivers with contribution % (Compensation, Manager Relationship, Growth, Workload, Commute)
- **Watchlist**: Sortable organizational units (departments/grades) above risk threshold
- **Actions**: AI-generated playbook suggestions via Ask Aql integration, task creation system

**Status:** ✅ COMPLETED - Retention v1 module fully functional with bilingual support and task integration

### 2025-01-24 - Business Communication & Documentation Protocol
**Issue:** Client requested comprehensive record-keeping of all AI-user communications
**Impact:** Business Critical - Client accountability and transparency requirements
**Resolution:** Established formal changelog documentation system

#### Communications Summary:
1. **Initial Translation Issues** - Client reported chart labels showing raw keys
2. **Translation System Overhaul** - AI fixed useAPITranslations.ts and locale files
3. **OSI System Implementation** - Complete organizational chart system built
4. **Record Keeping Request** - Client emphasized business-critical nature of proper documentation
5. **GitHub Integration Discussion** - Recommended version control for client projects
6. **Comprehensive Documentation** - All communications now logged in this changelog

**Business Context:** Client explicitly stated "this is business it is not a joke my clients will never like this"
**Response:** Implemented strict documentation protocol for all future changes

**Status:** ✅ ESTABLISHED - All communications now properly documented

### 2025-01-24 - Translation System Fixes
**Issue:** Chart legends and tooltips showing raw translation keys instead of proper labels
**Impact:** Business Critical - Client-facing charts displayed technical keys like "dashboard.trends.hse_safety"
**Resolution:** Complete translation system overhaul

#### Files Modified:
1. **src/hooks/useAPITranslations.ts**
   - Enhanced translation resolver to handle dot-notation keys (e.g., "dashboard.trends.title")
   - Added backwards compatibility for existing translation calls
   - Fixed namespace resolution logic

2. **src/i18n/locale.tsx** 
   - Added complete dashboard.trends translation bundle
   - English translations: title, subtitle, saudization_rate, hse_safety, compliance, employee_experience
   - Arabic translations: اتجاهات مؤشرات الأداء، السعودة، السلامة، الامتثال، تجربة الموظف
   - Added OSI organizational chart translations

3. **src/components/dashboard/DashboardTrendsChart.tsx**
   - Replaced all hardcoded English strings with translation calls
   - Updated chart titles, legends, and tooltips
   - Fixed tooltip formatter for proper value display

**Before:** `dashboard.trends.hse_safety` displayed in charts
**After:** `HSE Safety Score` (EN) / `درجة السلامة` (AR)

**Status:** ✅ RESOLVED - All charts now display proper translated labels

### 2025-01-24 - OSI System Implementation
**Issue:** Organization Structure Intelligence module needed full implementation
**Impact:** Major Feature Addition

#### Database Changes:
- Created `osi_layers_by_grade_v1` view for organizational layer analysis
- Created `osi_overview_v1` RPC function for OSI data retrieval
- Created `dev_seed_osi_v1` function for sample data generation
- Added index on `hr_employees(company_id, grade_id)` for performance

#### Frontend Implementation:
- **src/hooks/useOSI.ts** - Complete rewrite using new RPC endpoints
- **src/components/diagnostic/OSIOverview.tsx** - Enhanced UI with layer visualization
- **src/components/diagnostic/OrgChart.tsx** - New organizational chart component

**Status:** ✅ COMPLETED - OSI system fully functional with org chart visualization

---

## Future Change Template

### YYYY-MM-DD - [Change Title]
**Issue:** [Description of problem/requirement]
**Impact:** [Business Impact Level: Critical/High/Medium/Low]
**Resolution:** [How it was solved]

#### Files Modified:
- **file/path.tsx** - [What was changed and why]

**Before:** [Previous behavior]
**After:** [New behavior]
**Status:** [✅ RESOLVED / 🔄 IN PROGRESS / ❌ FAILED]

---

## Business Rules for Changes

### Critical Issues (Immediate Priority)
- Client-facing display errors
- Translation/localization problems  
- Data accuracy issues
- Security vulnerabilities

### High Priority
- Performance optimization
- New feature requests
- UX/UI improvements

### Documentation Requirements
- All changes must be documented in this changelog
- Include business impact assessment
- Record exact files modified
- Document before/after behavior
- Mark resolution status

### Quality Assurance
- Test in both Arabic and English
- Verify responsive design
- Check console for errors
- Validate data accuracy
- Confirm proper translations

---

## Contact & Escalation
- **Primary Developer:** AI Assistant via Lovable
- **Business Owner:** [User Name]
- **Escalation:** For critical client issues, document in this changelog and prioritize immediately

---

## Notes
This changelog serves as the official record for all AqlHR modifications. Every change, no matter how small, should be documented here for business accountability and client transparency.