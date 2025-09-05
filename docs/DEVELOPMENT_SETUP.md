# AqlHR Development Environment Setup Guide

## Prerequisites

### Required Software
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: Latest stable version
- **VS Code**: Recommended IDE with extensions

### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "supabase.supabase-vscode",
    "ms-vscode.vscode-json"
  ]
}
```

## Environment Setup

### 1. Clone Repository
```bash
git clone [repository-url]
cd aqlhr-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create `.env.local` file:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://qcuhjcyjlkfizesndmth.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdWhqY3lqbGtmaXplc25kbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NDY4NzgsImV4cCI6MjA2MzQyMjg3OH0.Vr1tBpNjv8e6sNtjfISJul12Mg9ROQVrlRTgWB1dPoc

# Development Flags
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true
```

### 4. Development Server
```bash
npm run dev
```

Access the application at: `http://localhost:5173`

## Project Structure

```
aqlhr-platform/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ai/             # AI integration components
│   │   ├── government/     # Government integration UI
│   │   ├── layout/         # Layout components
│   │   └── ui/             # Base UI components (shadcn)
│   ├── pages/              # Page components (route-based)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   │   ├── i18n/          # Internationalization
│   │   └── utils/         # Helper functions
│   ├── integrations/       # External service integrations
│   │   └── supabase/      # Supabase client & types
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles & Tailwind config
├── supabase/
│   ├── functions/          # Edge functions
│   └── migrations/         # Database migrations
├── docs/                   # Project documentation
└── public/                 # Static assets
```

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: description of your feature"

# Push and create PR
git push origin feature/your-feature-name
```

### 2. Code Quality Checks
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format

# Run all checks
npm run pre-commit
```

### 3. Testing
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests (if implemented)
npm run test:e2e
```

## Database Development

### Local Supabase Setup (Optional)
```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Apply migrations
supabase db reset
```

### Database Migrations
```bash
# Create new migration
supabase migration new migration_name

# Apply migrations
supabase db push
```

## AI Development

### AI Assistant Testing
```bash
# Access AI test interface
http://localhost:5173/en/test-ai

# Enable dev mode for enhanced debugging
http://localhost:5173/en/dashboard?dev=1
```

### AI Configuration
- Edge functions in `supabase/functions/ai-assistant/`
- Universal AI Integrator: `src/components/ai/UniversalAIIntegrator.tsx`
- AI testing components: `src/components/ai/`

## Government Integration Development

### Mock Government APIs
```bash
# Enable simulation mode
http://localhost:5173/en/dashboard?dev=1&mock_gov=1
```

### Government Integration Testing
- Qiwa simulator: `src/lib/government/qiwa-simulator.ts`
- GOSI simulator: `src/lib/government/gosi-simulator.ts`
- Integration status: `http://localhost:5173/en/government/`

## Internationalization (i18n)

### Language System
- English routes: `/en/*`
- Arabic routes: `/ar/*`
- Translation files: `src/i18n/locales/`

### Testing RTL Support
```bash
# Test Arabic interface
http://localhost:5173/ar/dashboard

# Enable RTL debugging
http://localhost:5173/ar/dashboard?debug=1
```

## Build & Deployment

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Build analysis
npm run build:analyze
```

### Environment-specific Builds
```bash
# Staging build
npm run build:staging

# Production build with optimization
npm run build:prod
```

## Debugging & Monitoring

### Debug Mode
Add `?debug=1` to any URL for enhanced debugging:
- Component hierarchy visualization
- Performance metrics
- State inspection
- API call monitoring

### Development Tools
- React DevTools extension
- Supabase Studio for database inspection
- Network tab for API monitoring
- Console logs with structured logging

### Logging Levels
```typescript
// Use structured logging
console.log('AqlHR: [MODULE] Message', { data });
console.warn('AqlHR: [MODULE] Warning', { context });
console.error('AqlHR: [MODULE] Error', { error, stack });
```

## Common Development Tasks

### 1. Adding New Components
```bash
# Create component with proper structure
mkdir src/components/new-feature
touch src/components/new-feature/index.ts
touch src/components/new-feature/NewFeature.tsx
```

### 2. Adding New Pages
```bash
# Create page component
touch src/pages/NewPage.tsx

# Add to routing configuration
# Edit src/components/routing/AppRoutes.tsx
```

### 3. Database Schema Changes
```bash
# Create migration
supabase migration new add_new_feature_table

# Edit the migration file
# Apply with: supabase db push
```

### 4. Adding AI Features
```typescript
// Add to UniversalAIIntegrator
<UniversalAIIntegrator 
  pageType="your-module" 
  moduleName="feature-name" 
  enabledFeatures={['new-feature']}
/>
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Type Errors**
   ```bash
   # Regenerate Supabase types
   supabase gen types typescript --local > src/integrations/supabase/types.ts
   ```

3. **Styling Issues**
   ```bash
   # Rebuild Tailwind
   npm run build:css
   ```

4. **Database Connection Issues**
   ```bash
   # Check Supabase status
   supabase status
   
   # Restart local Supabase
   supabase stop && supabase start
   ```

### Performance Optimization

1. **Bundle Analysis**
   ```bash
   npm run build:analyze
   # Check for large dependencies
   ```

2. **Database Query Optimization**
   - Use React Query for caching
   - Implement proper indexing
   - Use materialized views for complex queries

3. **Component Optimization**
   - Use React.memo for expensive components
   - Implement proper dependency arrays in hooks
   - Use lazy loading for large components

## Code Standards

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Use type assertions sparingly
- Prefer union types over any

### React
- Use functional components with hooks
- Implement proper error boundaries
- Use custom hooks for complex logic
- Follow component composition patterns

### Styling
- Use Tailwind CSS utility classes
- Follow design system tokens
- Implement responsive design patterns
- Use semantic HTML elements

### Git Conventions
- Use conventional commit messages
- Keep commits atomic and focused
- Write descriptive commit messages
- Use feature branches for development

## Team Collaboration

### Code Reviews
- All changes require peer review
- Focus on logic, security, and maintainability
- Test new features thoroughly
- Document complex implementations

### Communication
- Use GitHub issues for bug tracking
- Document architectural decisions
- Share knowledge through team sessions
- Maintain up-to-date documentation

### Knowledge Sharing
- Regular architecture review sessions
- Code walkthrough for complex features
- Documentation of best practices
- Peer programming for critical features