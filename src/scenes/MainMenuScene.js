/**
 * MainMenuScene - Entry point for the game
 */

export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Title
        this.add.text(width / 2, 150, 'CASE: KIRA', {
            fontSize: '72px',
            fontFamily: 'DeathNote, serif',
            color: '#ffffff',
            stroke: '#8B0000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(width / 2, 240, 'A Battle of Wits', {
            fontSize: '20px',
            fontFamily: 'Courier Prime, monospace',
            color: '#cccccc',
            letterSpacing: '2px'
        }).setOrigin(0.5);

        // Detective Mode Button
        const detectiveBtn = this.createButton(width / 2, 350, 'DETECTIVE MODE', '#00ff00');
        detectiveBtn.on('pointerdown', () => this.startDetectiveMode());

        this.add.text(width / 2, 410, 'Investigate the murders. Find contradictions. Catch Kira.', {
            fontSize: '14px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        }).setOrigin(0.5);

        // Kira Mode Button (disabled for now)
        const kiraBtn = this.createButton(width / 2, 480, 'KIRA MODE', '#666666');
        kiraBtn.removeInteractive(); // Disabled until Step 4

        this.add.text(width / 2, 540, '[Coming in Step 4]', {
            fontSize: '14px',
            fontFamily: 'Courier Prime, monospace',
            color: '#666666'
        }).setOrigin(0.5);

        // Footer
        this.add.text(width / 2, height - 40, 'Step 3: Detective Mode MVP', {
            fontSize: '12px',
            fontFamily: 'Courier Prime, monospace',
            color: '#444444'
        }).setOrigin(0.5);
    }

    createButton(x, y, text, color) {
        const bg = this.add.rectangle(x, y, 400, 50, 0x000000, 0.8);
        bg.setStrokeStyle(2, parseInt(color.replace('#', '0x'), 16));
        
        const label = this.add.text(x, y, text, {
            fontSize: '18px',
            fontFamily: 'Courier Prime, monospace',
            color: color
        }).setOrigin(0.5);

        bg.setInteractive({ useHandCursor: true });
        
        bg.on('pointerover', () => {
            bg.setFillStyle(0x222222, 0.8);
            label.setScale(1.05);
        });
        
        bg.on('pointerout', () => {
            bg.setFillStyle(0x000000, 0.8);
            label.setScale(1);
        });

        return bg;
    }

    startDetectiveMode() {
        // Load the case and start investigation
        console.log('Starting Detective Mode...');
        this.scene.start('CaseLoadingScene');
    }
}
