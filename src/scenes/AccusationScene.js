/**
 * AccusationScene - Make final accusation and solve the case
 * Mobile landscape optimized (812×375)
 */

export class AccusationScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AccusationScene' });
        this.selectedSuspectId = null;
    }

    create() {
        const { width, height } = this.cameras.main;
        
        const engine = this.registry.get('caseEngine');
        const validator = this.registry.get('validator');
        const suspects = engine.currentCase.suspects;

        // Header
        this.add.rectangle(0, 0, width, 50, 0x000000, 0.9).setOrigin(0);
        this.add.text(10, 10, 'MAKE ACCUSATION', {
            fontSize: '16px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ff0000'
        });
        
        this.add.text(10, 32, 'Select the suspect you believe is the cyber-vigilante', {
            fontSize: '10px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        });

        // Suspect selection area
        const listY = 60;
        const cardHeight = 50;
        
        suspects.forEach((suspect, index) => {
            const y = listY + (index * (cardHeight + 5));
            this.createSuspectCard(10, y, suspect, width - 20, cardHeight, validator);
        });

        // Accuse button (initially disabled)
        this.accuseButton = this.add.text(width / 2, height - 80, '[ACCUSE SELECTED SUSPECT]', {
            fontSize: '14px',
            fontFamily: 'Courier Prime, monospace',
            color: '#666666',
            backgroundColor: '#1a1a1a',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: false });

        this.accuseButton.on('pointerdown', () => {
            if (this.selectedSuspectId) {
                this.makeAccusation();
            }
        });

        // Bottom navigation
        this.createBottomNav(width, height);
    }

    createSuspectCard(x, y, suspect, cardWidth, cardHeight, validator) {
        const card = this.add.rectangle(x, y, cardWidth, cardHeight, 0x1a1a1a).setOrigin(0);
        card.setStrokeStyle(2, 0x444444);
        card.setInteractive({ useHandCursor: true });

        // Suspect name
        const nameText = this.add.text(x + 10, y + 12, suspect.name, {
            fontSize: '13px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ffffff'
        });

        // Contradiction count
        const contradictions = validator.findContradictionsForSuspect(suspect.id);
        const contraColor = contradictions.length > 0 ? '#ff0000' : '#666666';
        this.add.text(x + cardWidth - 10, y + 12, `${contradictions.length} contradictions`, {
            fontSize: '10px',
            fontFamily: 'Courier Prime, monospace',
            color: contraColor
        }).setOrigin(1, 0);

        // Occupation
        this.add.text(x + 10, y + 32, suspect.occupation, {
            fontSize: '9px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        });

        // Click to select
        card.on('pointerdown', () => {
            this.selectSuspect(suspect.id, card);
        });

        nameText.setInteractive({ useHandCursor: true });
        nameText.on('pointerdown', () => {
            this.selectSuspect(suspect.id, card);
        });

        // Store reference
        card.setData('suspectId', suspect.id);
        card.setData('originalStroke', 0x444444);
    }

    selectSuspect(suspectId, card) {
        // Deselect all cards
        this.children.list.forEach(child => {
            if (child.getData && child.getData('suspectId')) {
                child.setStrokeStyle(2, child.getData('originalStroke'));
            }
        });

        // Select this card
        card.setStrokeStyle(3, 0x00ff00);
        this.selectedSuspectId = suspectId;

        // Enable accuse button
        this.accuseButton.setColor('#ff0000');
        this.accuseButton.setInteractive({ useHandCursor: true });
    }

    makeAccusation() {
        const engine = this.registry.get('caseEngine');
        const validator = this.registry.get('validator');
        
        const result = validator.checkAccusation(this.selectedSuspectId);
        const suspect = engine.currentCase.suspects.find(s => s.id === this.selectedSuspectId);

        // Show result
        this.showResult(suspect, result);
    }

    showResult(suspect, result) {
        const { width, height } = this.cameras.main;

        // Overlay
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.95).setOrigin(0);
        overlay.setDepth(1000);

        const resultContainer = this.add.container(width / 2, height / 2);
        resultContainer.setDepth(1001);

        if (result.success) {
            // SUCCESS
            const bg = this.add.rectangle(0, 0, width - 40, 200, 0x003300, 0.9);
            bg.setStrokeStyle(4, 0x00ff00);

            const title = this.add.text(0, -70, 'CASE SOLVED', {
                fontSize: '24px',
                fontFamily: 'DeathNote, serif',
                color: '#00ff00'
            }).setOrigin(0.5);

            const name = this.add.text(0, -30, `${suspect.name} is the hacker!`, {
                fontSize: '16px',
                fontFamily: 'Courier Prime, monospace',
                color: '#ffffff'
            }).setOrigin(0.5);

            const evidence = this.add.text(0, 0, `Key contradictions found: ${result.contradictions.length}`, {
                fontSize: '12px',
                fontFamily: 'Courier Prime, monospace',
                color: '#00ff00'
            }).setOrigin(0.5);

            const quote = this.add.text(0, 30, '"Justice has been served."', {
                fontSize: '11px',
                fontFamily: 'Courier Prime, monospace',
                color: '#00aaff',
                fontStyle: 'italic'
            }).setOrigin(0.5);

            const continueBtn = this.add.text(0, 70, '[Return to Menu]', {
                fontSize: '12px',
                fontFamily: 'Courier Prime, monospace',
                color: '#ffff00',
                backgroundColor: '#003300',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            continueBtn.on('pointerdown', () => {
                this.scene.start('MainMenuScene');
            });

            resultContainer.add([bg, title, name, evidence, quote, continueBtn]);
        } else {
            // FAILURE
            const bg = this.add.rectangle(0, 0, width - 40, 200, 0x330000, 0.9);
            bg.setStrokeStyle(4, 0xff0000);

            const title = this.add.text(0, -70, 'INCORRECT', {
                fontSize: '24px',
                fontFamily: 'DeathNote, serif',
                color: '#ff0000'
            }).setOrigin(0.5);

            const name = this.add.text(0, -30, `${suspect.name} is not the hacker.`, {
                fontSize: '16px',
                fontFamily: 'Courier Prime, monospace',
                color: '#ffffff'
            }).setOrigin(0.5);

            const reason = this.add.text(0, 0, result.reason, {
                fontSize: '11px',
                fontFamily: 'Courier Prime, monospace',
                color: '#ffaa00',
                wordWrap: { width: width - 80 },
                align: 'center'
            }).setOrigin(0.5);

            const quote = this.add.text(0, 40, '"Investigate more carefully..."', {
                fontSize: '11px',
                fontFamily: 'Courier Prime, monospace',
                color: '#00aaff',
                fontStyle: 'italic'
            }).setOrigin(0.5);

            const retryBtn = this.add.text(0, 70, '[Continue Investigation]', {
                fontSize: '12px',
                fontFamily: 'Courier Prime, monospace',
                color: '#ffff00',
                backgroundColor: '#330000',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            retryBtn.on('pointerdown', () => {
                this.scene.restart();
            });

            resultContainer.add([bg, title, name, reason, quote, retryBtn]);
        }
    }

    createBottomNav(width, height) {
        const navBg = this.add.rectangle(0, height - 50, width, 50, 0x000000, 0.9).setOrigin(0);
        
        const backBtn = this.add.text(10, height - 30, '[← Evidence Room]', {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
        
        backBtn.on('pointerdown', () => {
            backBtn.setColor('#ffffff');
            this.scene.start('EvidenceViewerScene');
        });
    }
}
