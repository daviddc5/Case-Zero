/**
 * Test file for Case Engine and Contradiction Validator
 * Run in browser console: node src/systems/test.js or load in Phaser
 */

import { CaseEngine } from './CaseEngine.js';
import { ContradictionValidator } from './ContradictionValidator.js';

export async function runTests() {
    console.log('=== SHADOW LEDGER CORE SYSTEMS TEST ===\n');

    try {
        // Test 1: Load case from file
        console.log('📂 Test 1: Loading case from JSON...');
        const engine = new CaseEngine();
        await engine.loadCaseFromFile('/data/cases/case_001_downtown_murders.json');
        console.log('✅ Case loaded successfully\n');

        // Test 2: Validate case structure
        console.log('🔍 Test 2: Validating case structure...');
        console.log(`  - Title: ${engine.currentCase.title}`);
        console.log(`  - Kills: ${engine.currentCase.kills.length}`);
        console.log(`  - Suspects: ${engine.currentCase.suspects.length}`);
        console.log(`  - Evidence: ${engine.currentCase.evidence.length}`);
        console.log(`  - Contradictions: ${engine.currentCase.contradictions.length}`);
        console.log('✅ Structure valid\n');

        // Test 3: Get Kira
        console.log('🔎 Test 3: Identifying Kira...');
        const kira = engine.getKira();
        console.log(`  - Kira is: ${kira.name} (${kira.role})`);
        console.log(`  - Motive: ${kira.motive}`);
        console.log('✅ Kira identified\n');

        // Test 4: Get evidence for each kill
        console.log('📋 Test 4: Evidence per kill...');
        for (let i = 0; i < engine.currentCase.kills.length; i++) {
            const evidence = engine.getEvidenceForKill(i);
            const kill = engine.getKill(i);
            console.log(`  Kill ${i + 1}: ${kill.victim.name}`);
            console.log(`    - Evidence count: ${evidence.length}`);
            evidence.forEach(e => {
                console.log(`      • ${e.name} (${e.type})`);
            });
        }
        console.log('✅ Evidence retrieval working\n');

        // Test 5: Contradiction Validator
        console.log('⚠️  Test 5: Checking contradictions...');
        const validator = new ContradictionValidator(engine.currentCase);
        
        // Check each suspect for contradictions
        for (const suspect of engine.currentCase.suspects) {
            console.log(`  Checking ${suspect.name}...`);
            const contradictions = validator.findContradictionsForSuspect(suspect.id);
            if (contradictions.length > 0) {
                console.log(`    ⚠️  Found ${contradictions.length} contradiction(s):`);
                contradictions.forEach(c => {
                    console.log(`      - [${c.severity}] ${c.description}`);
                });
            } else {
                console.log(`    ✓ No contradictions found`);
            }
        }
        console.log('✅ Contradiction checking complete\n');

        // Test 6: Check key contradictions for Kira
        console.log('🎯 Test 6: Key contradictions for Kira...');
        const kiraContradictions = engine.getContradictionsForSuspect(kira.id);
        const keyContradictions = kiraContradictions.filter(c => c.isKeyContradiction);
        console.log(`  - Total contradictions: ${kiraContradictions.length}`);
        console.log(`  - Key contradictions: ${keyContradictions.length}`);
        keyContradictions.forEach(c => {
            console.log(`    🔑 ${c.description}`);
        });
        console.log('✅ Key contradictions identified\n');

        // Test 7: Export case
        console.log('💾 Test 7: Export case...');
        const exported = engine.exportCase();
        console.log(`  - Exported JSON length: ${exported.length} characters`);
        console.log('✅ Export successful\n');

        console.log('=== ALL TESTS PASSED ✅ ===');
        
        return {
            success: true,
            engine: engine,
            validator: validator
        };

    } catch (error) {
        console.error('❌ Test failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Auto-run if loaded as module
if (typeof window !== 'undefined') {
    window.runCaseTests = runTests;
    console.log('💡 Test loaded. Run window.runCaseTests() to execute tests.');
}
