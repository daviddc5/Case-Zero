/**
 * SuspectProfileScene - View detailed suspect information
 * Mobile landscape optimized (812×375)
 */

export class SuspectProfileScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SuspectProfileScene' });
        this.currentSuspectIndex = 0;
    }

    create() {
        const { width, height } = this.cameras.main;
        
        const engine = this.registry.get('caseEngine');
        const validator = this.registry.get('validator');
        const suspects = engine.currentCase.suspects;
        
        // Get selected suspect or default to first
        const selectedId = this.registry.get('selectedSuspect');
        if (selectedId) {
            this.currentSuspectIndex = suspects.findIndex(s => s.id === selectedId);
            if (this.currentSuspectIndex === -1) this.currentSuspectIndex = 0;
        }

        this.displaySuspect(suspects[this.currentSuspectIndex], suspects, validator);
    }

    displaySuspect(suspect, allSuspects, validator) {
        const { width, height } = this.cameras.main;

        // Clear previous content
        this.children.removeAll();

        // Header
        this.add.rectangle(0, 0, width, 50, 0x000000, 0.9).setOrigin(0);
        this.add.text(10, 10, 'SUSPECT PROFILE', {
            fontSize: '16px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ff6666'
        });
        
        this.add.text(10, 32, `${this.currentSuspectIndex + 1} of ${allSuspects.length}`, {
            fontSize: '10px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        });

        // Navigation arrows
        if (this.currentSuspectIndex > 0) {
            const prevBtn = this.add.text(width - 100, 25, '[< Prev]', {
                fontSize: '11px',
                fontFamily: 'Courier Prime, monospace',
                color: '#00ff00'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            
            prevBtn.on('pointerdown', () => {
                this.currentSuspectIndex--;
                this.displaySuspect(allSuspects[this.currentSuspectIndex], allSuspects, validator);
            });
        }

        if (this.currentSuspectIndex < allSuspects.length - 1) {
            const nextBtn = this.add.text(width - 30, 25, '[Next >]', {
                fontSize: '11px',
                fontFamily: 'Courier Prime, monospace',
                color: '#00ff00'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            
            nextBtn.on('pointerdown', () => {
                this.currentSuspectIndex++;
                this.displaySuspect(allSuspects[this.currentSuspectIndex], allSuspects, validator);
            });
        }

        // Main content area
        const contentY = 60;
        const contentHeight = height - 110; // Leave room for header and footer

        // Name and basic info
        const nameColor = suspect.isKira ? '#ff0000' : '#ffffff';
        this.add.text(10, contentY, suspect.name, {
            fontSize: '18px',
            fontFamily: 'Courier Prime, monospace',
            color: nameColor,
            fontStyle: 'bold'
        });

        this.add.text(10, contentY + 25, `Age: ${suspect.age} | Occupation: ${suspect.occupation}`, {
            fontSize: '10px',
            fontFamily: 'Courier Prime, monospace',
            color: '#cccccc'
        });

        // Motive
        this.add.text(10, contentY + 45, 'MOTIVE:', {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ffaa00'
        });

        this.add.text(10, contentY + 60, suspect.motive, {
            fontSize: '10px',
            fontFamily: 'Courier Prime, monospace',
            color: '#cccccc',
            wordWrap: { width: width - 20 }
        });

        // Alibi summary
        this.add.text(10, contentY + 110, 'ALIBI SUMMARY:', {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00aaff'
        });

        const witnessNames = suspect.alibi.witnesses && suspect.alibi.witnesses.length > 0 
            ? suspect.alibi.witnesses.join(', ') 
            : 'None';
        const alibiText = `${suspect.alibi.statement}\nWitnesses: ${witnessNames}`;
        this.add.text(10, contentY + 125, alibiText, {
            fontSize: '9px',
            fontFamily: 'Courier Prime, monospace',
            color: '#cccccc',
            wordWrap: { width: width - 20 }
        });

        // Contradictions
        const contradictions = validator.findContradictionsForSuspect(suspect.id);
        
        if (contradictions.length > 0) {
            this.add.text(10, contentY + 190, `CONTRADICTIONS: ${contradictions.length}`, {
                fontSize: '11px',
                fontFamily: 'Courier Prime, monospace',
                color: '#ff0000'
            });

            let yPos = contentY + 210;
            contradictions.slice(0, 2).forEach((contra, index) => {
                const marker = contra.isKeyContradiction ? '⚠' : '•';
                const text = this.add.text(10, yPos, `${marker} ${contra.description}`, {
                    fontSize: '9px',
                    fontFamily: 'Courier Prime, monospace',
                    color: contra.isKeyContradiction ? '#ff0000' : '#ffaa00',
                    wordWrap: { width: width - 20 }
                });
                yPos += text.height + 5;
            });
        } else {
            this.add.text(10, contentY + 190, 'CONTRADICTIONS: None found', {
                fontSize: '11px',
                fontFamily: 'Courier Prime, monospace',
                color: '#666666'
            });
        }

        // Bottom navigation
        this.createBottomNav(width, height);
    }

    createBottomNav(width, height) {
        const navBg = this.add.rectangle(0, height - 50, width, 50, 0x000000, 0.9).setOrigin(0);
        
        const backBtn = this.add.text(10, height - 30, '[← Timeline]', {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
        
        backBtn.on('pointerdown', () => {
            backBtn.setColor('#ffffff');
            this.scene.start('TimelineAnalysisScene');
        });

        const evidenceBtn = this.add.text(width / 2, height - 30, '[Evidence Room]', {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00ff00'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        evidenceBtn.on('pointerdown', () => {
            evidenceBtn.setColor('#ffff00');
            this.scene.start('EvidenceViewerScene');
        });

        const accuseBtn = this.add.text(width - 10, height - 30, '[Make Accusation →]', {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ff0000'
        }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
        
        accuseBtn.on('pointerdown', () => {
            accuseBtn.setColor('#ffff00');
            this.scene.start('AccusationScene');
        });
    }
}
