#!/usr/bin/env tsx

/**
 * AqlHR Edge Function Locale Audit
 * Ensures all Supabase Edge Functions properly handle locale parameters
 * Auto-inserts TODO comments for easy fixes
 */

import { promises as fs } from 'fs';
import { glob } from 'glob';
import * as path from 'path';
import chalk from 'chalk';

interface LocaleViolation {
  file: string;
  issue: string;
  line: number;
  code: string;
  fixSuggestion?: string;
}

async function auditEdgeFunctionLocale(): Promise<boolean> {
  console.log(chalk.blue.bold('🌍 AqlHR Edge Function Locale Audit\n'));

  const edgeFunctions = await glob('supabase/functions/*/index.ts');
  console.log(chalk.blue(`Found ${edgeFunctions.length} Edge Functions to audit`));

  const violations: LocaleViolation[] = [];

  for (const functionFile of edgeFunctions) {
    console.log(chalk.gray(`Auditing ${functionFile}...`));
    
    const content = await fs.readFile(functionFile, 'utf-8');
    const lines = content.split('\n');

    // Check for createClient calls without locale parameter
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      const trimmedLine = line.trim();

      // Check for createClient without locale
      if (trimmedLine.includes('createClient') && !trimmedLine.includes('locale') && !trimmedLine.includes('language')) {
        // Auto-insert TODO comment for easy fixes
        const todoComment = '// TODO: inject locale here - add locale parameter from headers or user context';
        if (!lines[i - 1]?.includes('TODO: inject locale here')) {
          lines.splice(i, 0, '    ' + todoComment);
          console.log(chalk.yellow(`📝 Inserted TODO comment in ${functionFile} at line ${lineNumber}`));
          // Write the modified content back to the file
          await fs.writeFile(functionFile, lines.join('\n'));
        }
        
        violations.push({
          file: functionFile,
          issue: `Missing locale parameter in createClient call at line ${lineNumber}`,
          line: lineNumber,
          code: trimmedLine,
          fixSuggestion: 'Add locale parameter from event headers or user context'
        });
      }

      // Check for LLM API calls without locale context
      if ((trimmedLine.includes('openai') || trimmedLine.includes('anthropic') || trimmedLine.includes('llm')) && 
          !content.includes('language') && !content.includes('locale')) {
        // Auto-insert TODO comment for LLM calls
        const todoComment = '// TODO: inject locale here - add locale parameter for proper i18n support';
        if (!lines[i - 1]?.includes('TODO: inject locale here')) {
          lines.splice(i, 0, '    ' + todoComment);
          console.log(chalk.yellow(`📝 Inserted TODO comment in ${functionFile} at line ${lineNumber}`));
          // Write the modified content back to the file
          await fs.writeFile(functionFile, lines.join('\n'));
        }
        
        violations.push({
          file: functionFile,
          issue: `Missing locale in LLM call at line ${lineNumber}`,
          line: lineNumber,
          code: trimmedLine,
          fixSuggestion: 'Add locale parameter for proper multilingual AI responses'
        });
      }
    }
  }

  console.log(`\n${chalk.blue('📊 Audit Results:')}`);
  console.log(`Functions scanned: ${edgeFunctions.length}`);
  console.log(`Violations found: ${violations.length}`);

  if (violations.length > 0) {
    console.log(chalk.red('\n❌ Locale Compliance Issues:'));
    violations.forEach(violation => {
      console.log(chalk.red(`  ${violation.file}:${violation.line} - ${violation.issue}`));
      if (violation.fixSuggestion) {
        console.log(chalk.yellow(`    💡 Fix: ${violation.fixSuggestion}`));
      }
    });
  }

  // Generate summary report
  const report = generateLocaleReport(violations, edgeFunctions.length);
  await fs.writeFile('docs/LOCALE_COMPLIANCE_AUDIT.md', report);
  console.log(chalk.blue(`📄 Generated locale audit report: docs/LOCALE_COMPLIANCE_AUDIT.md`));
  
  // Export results as JSON for CI artifacts
  const resultsData = {
    timestamp: new Date().toISOString(),
    totalFunctions: edgeFunctions.length,
    violationsCount: violations.length,
    complianceScore: ((edgeFunctions.length - violations.length) / edgeFunctions.length * 100).toFixed(1),
    violations,
    recommendations: violations.map(v => v.fixSuggestion).filter(Boolean)
  };
  await fs.writeFile('locale-compliance-results.json', JSON.stringify(resultsData, null, 2));
  console.log(chalk.blue('📁 Exported results: locale-compliance-results.json'));

  return violations.length === 0;
}

function generateLocaleReport(violations: LocaleViolation[], totalFunctions: number): string {
  const complianceScore = ((totalFunctions - violations.length) / totalFunctions * 100).toFixed(1);
  
  return `# AqlHR Edge Function Locale Compliance Audit
Generated: ${new Date().toISOString()}

## Summary
- **Total Functions**: ${totalFunctions}
- **Violations**: ${violations.length}
- **Compliance Score**: ${complianceScore}%
- **Status**: ${violations.length === 0 ? '✅ COMPLIANT' : violations.length > totalFunctions * 0.2 ? '❌ CRITICAL' : '⚠️ NEEDS ATTENTION'}

## Violations Found

${violations.length === 0 ? '✅ No locale compliance violations detected!' : violations.map(violation => `
### ${path.basename(violation.file)}
- **Issue**: ${violation.issue}
- **Line**: ${violation.line}
- **Code**: \`${violation.code}\`
${violation.fixSuggestion ? `- **Fix**: ${violation.fixSuggestion}` : ''}
`).join('\n')}

## Recommendations

${violations.length === 0 ? `
🎉 **Excellent!** All Edge Functions are locale-compliant.

Continue following these best practices:
- Extract locale from request headers
- Pass locale to all AI/LLM calls
- Use locale-aware database queries
- Return responses in the user's preferred language
` : `
### Immediate Actions Required

1. **Review TODO Comments**: Check auto-inserted TODO comments in the functions
2. **Add Locale Extraction**: Extract locale from \`Accept-Language\` header or request body
3. **Update AI Calls**: Pass locale parameter to all LLM/AI service calls
4. **Test Localization**: Verify responses in both English and Arabic

### Code Examples

**Extract locale from headers:**
\`\`\`typescript
const locale = req.headers.get('accept-language')?.split(',')[0] || 'en';
const { language = locale } = await req.json();
\`\`\`

**Pass locale to AI calls:**
\`\`\`typescript
const systemPrompt = \`Respond in \${language === 'ar' ? 'Arabic' : 'English'}\`;
\`\`\`

**Use in database queries:**
\`\`\`typescript
const { data } = await supabase
  .from('content')
  .select('*')
  .eq('language', language);
\`\`\`
`}

## Audit Criteria

Functions are checked for:
- Locale parameter extraction from headers or request body
- Locale awareness in AI/LLM service calls
- Proper internationalization patterns
- TODO comments auto-inserted for fixes

---
*Generated by AqlHR Edge Function Locale Auditor*
`;
}

// CLI execution
if (require.main === module) {
  auditEdgeFunctionLocale()
    .then(passed => {
      console.log(passed ? chalk.green('\n✅ Locale audit passed!') : chalk.red('\n❌ Locale audit failed!'));
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error(chalk.red('Locale audit failed:'), error);
      process.exit(1);
    });
}

export { auditEdgeFunctionLocale };