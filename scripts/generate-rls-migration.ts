import fs from 'fs';
import path from 'path';

interface AuditResult {
  tables_missing_policies: string[];
  coverage_percentage: number;
  detailed_results: Array<{
    table_name: string;
    rls_enabled: boolean;
    policy_count: number;
    status: string;
  }>;
}

async function generateRLSMigration() {
  console.log('🔍 Generating RLS migration for missing policies...');
  
  // Read the audit results
  const auditPath = path.join(process.cwd(), 'rls-audit.json');
  if (!fs.existsSync(auditPath)) {
    console.error('❌ rls-audit.json not found. Run audit script first.');
    process.exit(1);
  }
  
  const audit: AuditResult = JSON.parse(fs.readFileSync(auditPath, 'utf-8'));
  const missingTables = audit.tables_missing_policies || [];
  
  if (missingTables.length === 0) {
    console.log('✅ No tables missing RLS policies!');
    return;
  }
  
  console.log(`📋 Found ${missingTables.length} tables missing RLS policies`);
  
  // Generate timestamp for migration filename
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 14);
  const migrationId = Math.random().toString(36).substring(2, 15);
  
  let sql = `-- Auto-generated RLS policies for ${missingTables.length} tables
-- Generated on ${new Date().toISOString()}

`;

  // Add policies for each missing table
  for (const tableName of missingTables) {
    const cleanTableName = tableName.replace('public.', '');
    
    sql += `-- Enable RLS and create policies for ${tableName}
ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;

CREATE POLICY "${cleanTableName}_company_select" 
ON ${tableName} 
FOR SELECT 
USING (
  CASE 
    WHEN '${tableName}' IN ('saudi_regions', 'saudi_cities', 'saudi_sectors', 'saudi_activities', 'saudi_gov_entities', 'companies_private_top500') 
    THEN true -- Public reference data
    ELSE company_id = public.get_user_company_id()
  END
);

CREATE POLICY "${cleanTableName}_company_insert" 
ON ${tableName} 
FOR INSERT 
WITH CHECK (
  CASE 
    WHEN '${tableName}' IN ('saudi_regions', 'saudi_cities', 'saudi_sectors', 'saudi_activities', 'saudi_gov_entities', 'companies_private_top500') 
    THEN false -- Read-only reference data
    ELSE company_id = public.get_user_company_id()
  END
);

CREATE POLICY "${cleanTableName}_company_update" 
ON ${tableName} 
FOR UPDATE 
USING (
  CASE 
    WHEN '${tableName}' IN ('saudi_regions', 'saudi_cities', 'saudi_sectors', 'saudi_activities', 'saudi_gov_entities', 'companies_private_top500') 
    THEN false -- Read-only reference data
    ELSE company_id = public.get_user_company_id()
  END
);

CREATE POLICY "${cleanTableName}_company_delete" 
ON ${tableName} 
FOR DELETE 
USING (
  CASE 
    WHEN '${tableName}' IN ('saudi_regions', 'saudi_cities', 'saudi_sectors', 'saudi_activities', 'saudi_gov_entities', 'companies_private_top500') 
    THEN false -- Read-only reference data
    ELSE company_id = public.get_user_company_id()
  END
);

`;
  }
  
  // Write migration file
  const migrationFilename = `${timestamp}_${migrationId}.sql`;
  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', migrationFilename);
  
  // Ensure migrations directory exists
  const migrationsDir = path.dirname(migrationPath);
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }
  
  fs.writeFileSync(migrationPath, sql);
  
  console.log(`🔐 Generated RLS migration: ${migrationFilename}`);
  console.log(`📁 Location: ${migrationPath}`);
  console.log(`📊 Tables covered: ${missingTables.length}`);
  console.log('\n📋 Tables included:');
  missingTables.forEach(table => console.log(`  - ${table}`));
  
  console.log('\n🚀 Next steps:');
  console.log('1. Review the generated migration file');
  console.log('2. Apply via Supabase migration tool');
  console.log('3. Re-run audit: npx tsx scripts/audit-rls-policies.ts');
  console.log('4. Run isolation tests: npx tsx scripts/security-tests/company-isolation.test.ts');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateRLSMigration().catch(console.error);
}

export { generateRLSMigration };