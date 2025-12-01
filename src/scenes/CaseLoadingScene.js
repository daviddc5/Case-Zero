/**
 * CaseLoadingScene - Loads case data and transitions to investigation
 */

import { CaseEngine } from '../systems/CaseEngine.js';
import { ContradictionValidator } from '../systems/ContradictionValidator.js';

export class CaseLoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CaseLoadingScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        this.add.text(width / 2, height / 2 - 50, 'LOADING CASE FILE...', {
            fontSize: '24px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00ff00'
        }).setOrigin(0.5);

        const statusText = this.add.text(width / 2, height / 2 + 20, '', {
            fontSize: '16px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        }).setOrigin(0.5);

        // Load case
        this.loadCase(statusText);
    }

    async loadCase(statusText) {
        try {
            statusText.setText('Reading case file...');
            
            const engine = new CaseEngine();
            await engine.loadCaseFromFile('/data/cases/case_001_downtown_murders.json');
            
            statusText.setText('Validating evidence...');
            await this.delay(500);
            
            const validator = new ContradictionValidator(engine.currentCase);
            
            statusText.setText('Preparing investigation...');
            await this.delay(500);

            // Store globally for all detective scenes
            this.registry.set('caseEngine', engine);
            this.registry.set('validator', validator);
            this.registry.set('discoveredEvidence', []); // Track what player has found
            this.registry.set('currentKillIndex', 0); // Start with first kill

            console.log('✓ Case loaded, starting investigation');
            
            // Transition to evidence room
            this.scene.start('EvidenceViewerScene');
            
        } catch (error) {
            statusText.setText('ERROR: Failed to load case');
            statusText.setColor('#ff0000');
            console.error(error);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
