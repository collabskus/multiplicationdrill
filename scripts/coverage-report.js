#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join } from 'path';

try {
  const coverageFile = join(process.cwd(), 'coverage', 'coverage-summary.json');
  const coverage = JSON.parse(readFileSync(coverageFile, 'utf8'));
  
  console.log('\n📊 Coverage Summary\n');
  console.log('┌─────────────┬──────────┬──────────┬──────────┬──────────┐');
  console.log('│ File        │ Lines    │ Branches │ Functions│ Stmts    │');
  console.log('├─────────────┼──────────┼──────────┼──────────┼──────────┤');
  
  for (const [file, data] of Object.entries(coverage)) {
    if (file === 'total') continue;
    
    const fileName = file.split('/').pop().padEnd(11);
    const lines = `${data.lines.pct}%`.padEnd(8);
    const branches = `${data.branches.pct}%`.padEnd(8);
    const functions = `${data.functions.pct}%`.padEnd(8);
    const statements = `${data.statements.pct}%`.padEnd(8);
    
    console.log(`│ ${fileName} │ ${lines} │ ${branches} │ ${functions} │ ${statements} │`);
  }
  
  console.log('├─────────────┼──────────┼──────────┼──────────┼──────────┤');
  
  const total = coverage.total;
  const totalLines = `${total.lines.pct}%`.padEnd(8);
  const totalBranches = `${total.branches.pct}%`.padEnd(8);
  const totalFunctions = `${total.functions.pct}%`.padEnd(8);
  const totalStatements = `${total.statements.pct}%`.padEnd(8);
  
  console.log(`│ ${'TOTAL'.padEnd(11)} │ ${totalLines} │ ${totalBranches} │ ${totalFunctions} │ ${totalStatements} │`);
  console.log('└─────────────┴──────────┴──────────┴──────────┴──────────┘');
  
  // Check thresholds
  const threshold = 80;
  const failed = [];
  
  if (total.lines.pct < threshold) failed.push('lines');
  if (total.branches.pct < threshold) failed.push('branches');
  if (total.functions.pct < threshold) failed.push('functions');
  if (total.statements.pct < threshold) failed.push('statements');
  
  if (failed.length > 0) {
    console.log(`\n❌ Coverage below ${threshold}% for: ${failed.join(', ')}`);
    process.exit(1);
  } else {
    console.log(`\n✅ All coverage metrics above ${threshold}%`);
  }
  
} catch (error) {
  console.error('❌ Could not read coverage report. Run "yarn test:coverage" first.');
  process.exit(1);
}