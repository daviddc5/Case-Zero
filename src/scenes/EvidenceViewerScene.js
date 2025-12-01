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

        // Header
        this.add.rectangle(0, 0, width, 80, 0x000000, 0.9).setOrigin(0);
        this.add.text(20, 20, 'EVIDENCE ROOM', {
            fontSize: '32px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00ff00'
        });
        
        this.add.text(20, 55, `Case: ${engine.currentCase.title} | Kill ${currentKill + 1} of ${engine.currentCase.kills.length}`, {
            fontSize: '14px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        });

        // Navigation buttons
        this.createNavButton(width - 200, 25, 'Crime Scene', 'CrimeSceneScene');
        this.createNavButton(width - 200, 65, 'Timeline', 'TimelineAnalysisScene');

        // Evidence list
        let yPos = 120;
        
        if (discoveredEvidence.length === 0) {
            this.add.text(width / 2, height / 2, 'No evidence discovered yet.\nVisit the Crime Scene to investigate.', {
                fontSize: '18px',
                fontFamily: 'Courier Prime, monospace',
                color: '#666666',
                align: 'center'
            }).setOrigin(0.5);
        } else {
            this.add.text(20, yPos, `Evidence Found: ${discoveredEvidence.length}/${engine.currentCase.evidence.length}`, {
                fontSize: '16px',
                fontFamily: 'Courier Prime, monospace',
                color: '#ffff00'
            });
            yPos += 40;

            discoveredEvidence.forEach((evidenceId, index) => {
                const evidence = engine.getEvidence(evidenceId);
                if (evidence) {
                    this.createEvidenceCard(20, yPos, evidence, index);
                    yPos += 120;
                }
            });
        }

        // Bottom navigation
        this.createBottomNav(width, height);
    }

    createEvidenceCard(x, y, evidence, index) {
        const card = this.add.rectangle(x, y, 1240, 100, 0x111111, 0.9).setOrigin(0);
        card.setStrokeStyle(1, 0x00ff00);

        // Evidence number
        this.add.text(x + 10, y + 10, `[${index + 1}]`, {
            fontSize: '14px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00ff00'
        });

        // Type badge
        const typeColor = this.getTypeColor(evidence.type);
        this.add.rectangle(x + 60, y + 20, 100, 25, parseInt(typeColor.replace('#', '0x'), 16), 0.3).setOrigin(0);
        this.add.text(x + 110, y + 32, evidence.type.toUpperCase(), {
            fontSize: '12px',
            fontFamily: 'Courier Prime, monospace',
            color: typeColor
        }).setOrigin(0.5);

        // Name
        this.add.text(x + 180, y + 15, evidence.name, {
            fontSize: '18px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ffffff'
        });

        // Description
        this.add.text(x + 180, y + 45, evidence.description, {
            fontSize: '14px',
            fontFamily: 'Courier Prime, monospace',
            color: '#cccccc',
            wordWrap: { width: 1000 }
        });

        // Location
        this.add.text(x + 10, y + 80, `📍 ${evidence.location}`, {
            fontSize: '12px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        });
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
        const btn = this.add.text(x, y, `[${label}]`, {
            fontSize: '14px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00ff00'
        }).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setColor('#ffff00'));
        btn.on('pointerout', () => btn.setColor('#00ff00'));
        btn.on('pointerdown', () => this.scene.start(sceneName));
    }

    createBottomNav(width, height) {
        const navBg = this.add.rectangle(0, height - 60, width, 60, 0x000000, 0.9).setOrigin(0);
        
        const backBtn = this.add.text(20, height - 40, '[← Main Menu]', {
            fontSize: '16px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        }).setInteractive({ useHandCursor: true });
        
        backBtn.on('pointerover', () => backBtn.setColor('#ffffff'));
        backBtn.on('pointerout', () => backBtn.setColor('#888888'));
        backBtn.on('pointerdown', () => this.scene.start('MainMenuScene'));

        const accuseBtn = this.add.text(width - 180, height - 40, '[Make Accusation →]', {
            fontSize: '16px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ff0000'
        }).setInteractive({ useHandCursor: true });
        
        accuseBtn.on('pointerover', () => accuseBtn.setColor('#ffff00'));
        accuseBtn.on('pointerout', () => accuseBtn.setColor('#ff0000'));
        accuseBtn.on('pointerdown', () => this.scene.start('AccusationScene'));
    }
}
