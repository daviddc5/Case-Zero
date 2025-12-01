import Phaser from 'phaser';
import { CaseEngine } from './systems/CaseEngine.js';
import { ContradictionValidator } from './systems/ContradictionValidator.js';

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true
};

// Initialize the game
const game = new Phaser.Game(config);

function preload() {
    // Load custom font
    const fontStyle = document.createElement('style');
    fontStyle.innerHTML = `
        @font-face {
            font-family: 'DeathNote';
            src: url('/assets/fonts/Death Note.ttf') format('truetype');
        }
    `;
    document.head.appendChild(fontStyle);
    
    // Wait for font to load
    document.fonts.load('72px DeathNote').then(() => {
        console.log('✓ Death Note font loaded');
    });
}

async function create() {
    // Temporary welcome screen
    const titleText = this.add.text(640, 200, 'CASE: KIRA', {
        fontSize: '80px',
        fontFamily: 'DeathNote, Old English Text MT, UnifrakturMaguntia, serif',
        color: '#ffffff',
        stroke: '#8B0000',
        strokeThickness: 3
    }).setOrigin(0.5);

    const subtitleText = this.add.text(640, 290, 'A Death Note-Inspired Logic Game', {
        fontSize: '20px',
        fontFamily: 'Courier Prime, monospace',
        color: '#cccccc',
        letterSpacing: '2px'
    }).setOrigin(0.5);

    const statusText = this.add.text(640, 360, 'Testing Core Systems...', {
        fontSize: '18px',
        fontFamily: 'Courier Prime, monospace',
        color: '#ffff00'
    }).setOrigin(0.5);

    // Pulse effect on title
    this.tweens.add({
        targets: titleText,
        alpha: 0.7,
        duration: 1500,
        yoyo: true,
        repeat: -1
    });

    // Run tests automatically
    try {
        console.log('=== SHADOW LEDGER CORE SYSTEMS TEST ===\n');
        
        const engine = new CaseEngine();
        await engine.loadCaseFromFile('/data/cases/case_001_downtown_murders.json');
        console.log('✅ Case loaded:', engine.currentCase.title);
        
        const kira = engine.getKira();
        console.log('✅ Kira identified:', kira.name);
        
        const validator = new ContradictionValidator(engine.currentCase);
        const kiraContradictions = validator.findContradictionsForSuspect(kira.id);
        console.log('✅ Found', kiraContradictions.length, 'contradictions for Kira');
        
        console.log('\n=== ALL TESTS PASSED ✅ ===');
        
        statusText.setText('Step 2 Complete ✓ - Check Console (F12)');
        statusText.setColor('#00ff00');
        
        this.add.text(640, 420, 'Open Console (F12) to see test results', {
            fontSize: '16px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        }).setOrigin(0.5);
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        statusText.setText('Test Failed - Check Console');
        statusText.setColor('#ff0000');
    }
}

function update() {
    // Game loop will be implemented here
}
