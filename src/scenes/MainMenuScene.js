/**
 * MainMenuScene - Entry point (MOBILE LANDSCAPE)
 * Spacious horizontal layout
 */

export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Title on left side
        this.add.text(width * 0.25, height / 2, 'CASE: KIRA', {
            fontSize: '42px',
            fontFamily: 'DeathNote, serif',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Button on right side (plenty of space)
        const detectiveBtn = this.createButton(
            width * 0.7, 
            height / 2, 
            'START INVESTIGATION'
        );
        detectiveBtn.on('pointerdown', () => this.startDetectiveMode());

        // Footer
        this.add.text(width / 2, height - 20, 'Detective Mode • Landscape', {
            fontSize: '10px',
            fontFamily: 'Courier Prime, monospace',
            color: '#444444'
        }).setOrigin(0.5);
    }

    createButton(x, y, text) {
        const buttonWidth = 220;
        const buttonHeight = 60;

        const bg = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x1a1a1a);
        bg.setStrokeStyle(2, 0x00ff00);
        
        const label = this.add.text(x, y, text, {
            fontSize: '16px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00ff00',
            align: 'center'
        }).setOrigin(0.5);

        bg.setInteractive({ useHandCursor: true });
        
        bg.on('pointerdown', () => {
            bg.setFillStyle(0x00ff00);
            label.setColor('#000000');
        });
        
        bg.on('pointerup', () => {
            bg.setFillStyle(0x1a1a1a);
            label.setColor('#00ff00');
        });

        return bg;
    }

    startDetectiveMode() {
        this.scene.start('CaseLoadingScene');
    }
}
