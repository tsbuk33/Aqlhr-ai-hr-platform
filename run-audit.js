const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log('Running module audit...');
  const output = execSync('npx tsx scripts/audit-module-features.ts', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log(output);
  
  // Check if audit-manifest.json was created
  if (fs.existsSync('audit-manifest.json')) {
    const manifest = JSON.parse(fs.readFileSync('audit-manifest.json', 'utf8'));
    console.log('\n✅ Audit manifest generated successfully!');
    console.log(`Found ${manifest.totalModules} modules`);
    console.log(`Feature completeness summary:`);
    Object.entries(manifest.featuresCompleteness).forEach(([feature, percentage]) => {
      console.log(`  - ${feature}: ${percentage}%`);
    });
  }
} catch (error) {
  console.error('Audit failed:', error.message);
  if (error.stdout) console.log('STDOUT:', error.stdout);
  if (error.stderr) console.log('STDERR:', error.stderr);
}