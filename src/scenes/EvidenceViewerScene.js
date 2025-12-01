/**
 * EvidenceViewerScene - Browse collected evidence
 */

export class EvidenceViewerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EvidenceViewerScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        const engine = this.registry.get('caseEngine');
        const discoveredEvidence = this.registry.get('discoveredEvidence');
        const currentKill = this.registry.get('currentKillIndex');

        // Compact header for mobile
        this.add.rectangle(0, 0, width, 50, 0x000000, 0.9).setOrigin(0);
        this.add.text(10, 10, 'EVIDENCE ROOM', {
            fontSize: '18px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00ff00'
        });
        
        this.add.text(10, 32, `Case: ${engine.currentCase.title} | Kill ${currentKill + 1} of ${engine.currentCase.kills.length}`, {
            fontSize: '9px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        });

        // Right side navigation
        this.createNavButton(width - 100, 15, '[Crime Scene]', 'CrimeSceneScene');
        this.createNavButton(width - 100, 35, '[Timeline]', 'TimelineAnalysisScene');

        // Evidence list - scrollable area
        let yPos = 65;
        
        if (discoveredEvidence.length === 0) {
            this.add.text(width / 2, height / 2, 'No evidence discovered yet.\nVisit the Crime Scene to investigate.', {
                fontSize: '14px',
                fontFamily: 'Courier Prime, monospace',
                color: '#666666',
                align: 'center'
            }).setOrigin(0.5);
        } else {
            this.add.text(10, yPos, `Evidence Found: ${discoveredEvidence.length}/${engine.currentCase.evidence.length}`, {
                fontSize: '12px',
                fontFamily: 'Courier Prime, monospace',
                color: '#ffff00'
            });
            yPos += 30;

            // Compact cards for mobile
            discoveredEvidence.forEach((evidenceId, index) => {
                const evidence = engine.getEvidence(evidenceId);
                if (evidence) {
                    this.createEvidenceCard(10, yPos, evidence, index, width);
                    yPos += 70;
                }
            });
        }

        // Bottom navigation
        this.createBottomNav(width, height);
    }

    createEvidenceCard(x, y, evidence, index, screenWidth) {
        const cardWidth = screenWidth - 20;
        const card = this.add.rectangle(x, y, cardWidth, 60, 0x111111, 0.9).setOrigin(0);
        card.setStrokeStyle(2, 0x00ff00);

        // Evidence number and type badge on same line
        this.add.text(x + 8, y + 8, `[${index + 1}]`, {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00ff00'
        });

        // Type badge - compact
        const typeColor = this.getTypeColor(evidence.type);
        this.add.rectangle(x + 45, y + 12, 80, 18, parseInt(typeColor.replace('#', '0x'), 16), 0.3).setOrigin(0);
        this.add.text(x + 85, y + 21, evidence.type.toUpperCase(), {
            fontSize: '9px',
            fontFamily: 'Courier Prime, monospace',
            color: typeColor
        }).setOrigin(0.5);

        // Name - prominent
        this.add.text(x + 8, y + 28, evidence.name, {
            fontSize: '13px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ffffff'
        });

        // Location - bottom right corner
        this.add.text(x + cardWidth - 8, y + 50, `📍 ${evidence.location}`, {
            fontSize: '9px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        }).setOrigin(1, 0.5);
    }

    getTypeColor(type) {
        const colors = {
            'physical': '#ff6b6b',
            'digital': '#4ecdc4',
            'cctv': '#95e1d3',
            'autopsy': '#f38181',
            'profile': '#aa96da',
            'room_clue': '#fcbf49'
        };
        return colors[type] || '#888888';
    }

    createNavButton(x, y, label, sceneName) {
        const btn = this.add.text(x, y, label, {
            fontSize: '10px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00ff00'
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

        btn.on('pointerdown', () => {
            btn.setColor('#ffff00');
            this.scene.start(sceneName);
        });
    }
    createBottomNav(width, height) {
        const navBg = this.add.rectangle(0, height - 50, width, 50, 0x000000, 0.9).setOrigin(0);
        
        const backBtn = this.add.text(10, height - 30, '[← Main Menu]', {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
        
        backBtn.on('pointerdown', () => {
            backBtn.setColor('#ffffff');
            this.scene.start('MainMenuScene');
        });

        const accuseBtn = this.add.text(width - 10, height - 30, '[Make Accusation →]', {
            fontSize: '12px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ff0000'
        }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
        
        accuseBtn.on('pointerdown', () => {
            accuseBtn.setColor('#ffff00');
            this.scene.start('AccusationScene');
        });
    }
}
