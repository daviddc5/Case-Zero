/**
 * CrimeSceneScene - Interactive crime scene investigation
 * Click on hotspots to discover evidence
 */

export class CrimeSceneScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CrimeSceneScene' });
        this.hotspots = [];
    }

    create() {
        const { width, height } = this.cameras.main;
        
        const engine = this.registry.get('caseEngine');
        const discoveredEvidence = this.registry.get('discoveredEvidence');
        const currentKillIndex = this.registry.get('currentKillIndex');
        
        const currentKill = engine.currentCase.kills[currentKillIndex];

        // Header
        this.add.rectangle(0, 0, width, 80, 0x000000, 0.9).setOrigin(0);
        this.add.text(20, 20, `CRIME SCENE: ${currentKill.victim.name}`, {
            fontSize: '28px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ff0000'
        });
        
        this.add.text(20, 55, `Location: ${currentKill.victim.location} | Click hotspots to investigate`, {
            fontSize: '14px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        });

        // Create room visualization
        this.createRoom(currentKill, discoveredEvidence);

        // Evidence discovered panel (right side)
        this.createEvidencePanel(width, currentKill, discoveredEvidence);

        // Bottom navigation
        this.createBottomNav(width, height, currentKillIndex, engine.currentCase.kills.length);
    }

    createRoom(kill, discoveredEvidence) {
        const roomX = 100;
        const roomY = 120;
        const roomWidth = 700;
        const roomHeight = 500;

        // Room background
        const room = this.add.rectangle(roomX, roomY, roomWidth, roomHeight, 0x1a1a1a, 0.8).setOrigin(0);
        room.setStrokeStyle(2, 0x444444);

        this.add.text(roomX + 10, roomY + 10, `[${kill.room.toUpperCase()}]`, {
            fontSize: '14px',
            fontFamily: 'Courier Prime, monospace',
            color: '#666666'
        });

        // Get evidence for this kill
        const killEvidence = kill.evidenceIds.map(id => this.registry.get('caseEngine').getEvidence(id));

        // Create hotspots for each piece of evidence
        const hotspotPositions = this.generateHotspotPositions(killEvidence.length, roomWidth, roomHeight);
        
        killEvidence.forEach((evidence, index) => {
            const isDiscovered = discoveredEvidence.includes(evidence.id);
            const pos = hotspotPositions[index];
            
            this.createHotspot(
                roomX + pos.x,
                roomY + pos.y,
                evidence,
                isDiscovered
            );
        });
    }

    generateHotspotPositions(count, roomWidth, roomHeight) {
        // Generate non-overlapping positions for hotspots
        const positions = [];
        const padding = 80;
        const minDistance = 120;

        for (let i = 0; i < count; i++) {
            let attempts = 0;
            let pos;
            
            do {
                pos = {
                    x: padding + Math.random() * (roomWidth - padding * 2),
                    y: padding + Math.random() * (roomHeight - padding * 2)
                };
                attempts++;
            } while (attempts < 50 && positions.some(p => 
                Math.hypot(p.x - pos.x, p.y - pos.y) < minDistance
            ));
            
            positions.push(pos);
        }

        return positions;
    }

    createHotspot(x, y, evidence, isDiscovered) {
        const size = 60;
        const color = isDiscovered ? 0x00aa00 : 0xffaa00;
        const alpha = isDiscovered ? 0.3 : 0.8;

        // Hotspot circle
        const hotspot = this.add.circle(x, y, size / 2, color, alpha);
        hotspot.setStrokeStyle(2, color);
        
        // Pulsing animation for undiscovered evidence
        if (!isDiscovered) {
            this.tweens.add({
                targets: hotspot,
                scale: 1.2,
                alpha: 0.5,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            hotspot.setInteractive({ useHandCursor: true });
            
            hotspot.on('pointerover', () => {
                hotspot.setScale(1.3);
            });
            
            hotspot.on('pointerout', () => {
                hotspot.setScale(1);
            });

            hotspot.on('pointerdown', () => {
                this.discoverEvidence(evidence, hotspot);
            });
        }

        // Label
        const labelText = isDiscovered ? '✓' : '?';
        const label = this.add.text(x, y, labelText, {
            fontSize: isDiscovered ? '24px' : '32px',
            fontFamily: 'Courier Prime, monospace',
            color: isDiscovered ? '#00ff00' : '#ffff00'
        }).setOrigin(0.5);

        // Tooltip on hover (for undiscovered)
        if (!isDiscovered) {
            label.setInteractive({ useHandCursor: true });
            label.on('pointerover', () => {
                this.showTooltip(x, y - 50, evidence.type);
            });
            label.on('pointerout', () => {
                this.hideTooltip();
            });
            label.on('pointerdown', () => {
                this.discoverEvidence(evidence, hotspot);
            });
        }

        this.hotspots.push({ hotspot, label, evidence });
    }

    showTooltip(x, y, type) {
        if (this.tooltip) this.tooltip.destroy();
        
        this.tooltip = this.add.text(x, y, `[${type.toUpperCase()}]`, {
            fontSize: '12px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ffff00',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5);
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
    }

    discoverEvidence(evidence, hotspot) {
        // Add to discovered evidence
        const discoveredEvidence = this.registry.get('discoveredEvidence');
        if (!discoveredEvidence.includes(evidence.id)) {
            discoveredEvidence.push(evidence.id);
            this.registry.set('discoveredEvidence', discoveredEvidence);

            // Visual feedback
            this.tweens.killTweensOf(hotspot);
            
            this.tweens.add({
                targets: hotspot,
                alpha: 0.3,
                scale: 1.5,
                duration: 300,
                onComplete: () => {
                    hotspot.setFillStyle(0x00aa00);
                    hotspot.setScale(1);
                }
            });

            // Show discovery notification
            this.showDiscoveryNotification(evidence);

            // Refresh the scene
            this.time.delayedCall(1500, () => {
                this.scene.restart();
            });
        }
    }

    showDiscoveryNotification(evidence) {
        const { width, height } = this.cameras.main;
        
        const notification = this.add.container(width / 2, height / 2);
        
        const bg = this.add.rectangle(0, 0, 600, 200, 0x000000, 0.95);
        bg.setStrokeStyle(3, 0x00ff00);
        
        const title = this.add.text(0, -60, 'EVIDENCE DISCOVERED', {
            fontSize: '24px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00ff00'
        }).setOrigin(0.5);
        
        const name = this.add.text(0, -20, evidence.name, {
            fontSize: '18px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        const desc = this.add.text(0, 20, evidence.description, {
            fontSize: '14px',
            fontFamily: 'Courier Prime, monospace',
            color: '#cccccc',
            wordWrap: { width: 550 },
            align: 'center'
        }).setOrigin(0.5);

        notification.add([bg, title, name, desc]);
        
        // Fade in
        notification.setAlpha(0);
        this.tweens.add({
            targets: notification,
            alpha: 1,
            duration: 300
        });
    }

    createEvidencePanel(screenWidth, kill, discoveredEvidence) {
        const panelX = 820;
        const panelY = 120;
        const panelWidth = 440;
        const panelHeight = 500;

        // Panel background
        this.add.rectangle(panelX, panelY, panelWidth, panelHeight, 0x0a0a0a, 0.9).setOrigin(0);
        this.add.rectangle(panelX, panelY, panelWidth, panelHeight).setOrigin(0).setStrokeStyle(2, 0x00ff00);

        this.add.text(panelX + 15, panelY + 15, 'EVIDENCE LOG', {
            fontSize: '16px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00ff00'
        });

        // List discovered evidence for this kill
        const killEvidenceIds = kill.evidenceIds;
        const discoveredHere = killEvidenceIds.filter(id => discoveredEvidence.includes(id));
        
        this.add.text(panelX + 15, panelY + 50, `Found: ${discoveredHere.length}/${killEvidenceIds.length}`, {
            fontSize: '14px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ffff00'
        });

        let yPos = panelY + 85;
        
        killEvidenceIds.forEach(evidenceId => {
            const evidence = this.registry.get('caseEngine').getEvidence(evidenceId);
            const isDiscovered = discoveredEvidence.includes(evidenceId);
            
            const status = isDiscovered ? '✓' : '?';
            const color = isDiscovered ? '#00ff00' : '#444444';
            const name = isDiscovered ? evidence.name : '???';
            
            this.add.text(panelX + 15, yPos, `${status} ${name}`, {
                fontSize: '12px',
                fontFamily: 'Courier Prime, monospace',
                color: color,
                wordWrap: { width: panelWidth - 30 }
            });
            
            yPos += 30;
        });

        // Instructions
        this.add.text(panelX + 15, panelHeight + panelY - 40, 'Click glowing hotspots to investigate', {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#666666',
            wordWrap: { width: panelWidth - 30 }
        });
    }

    createBottomNav(width, height, currentKillIndex, totalKills) {
        const navBg = this.add.rectangle(0, height - 60, width, 60, 0x000000, 0.9).setOrigin(0);
        
        // Back to Evidence Room
        const backBtn = this.add.text(20, height - 40, '[← Evidence Room]', {
            fontSize: '16px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        }).setInteractive({ useHandCursor: true });
        
        backBtn.on('pointerover', () => backBtn.setColor('#ffffff'));
        backBtn.on('pointerout', () => backBtn.setColor('#888888'));
        backBtn.on('pointerdown', () => this.scene.start('EvidenceViewerScene'));

        // Kill navigation (if multiple kills)
        if (totalKills > 1) {
            const killText = this.add.text(width / 2, height - 40, `Crime Scene ${currentKillIndex + 1} / ${totalKills}`, {
                fontSize: '14px',
                fontFamily: 'Courier Prime, monospace',
                color: '#666666'
            }).setOrigin(0.5);

            // Previous kill button
            if (currentKillIndex > 0) {
                const prevBtn = this.add.text(width / 2 - 150, height - 40, '[< Prev]', {
                    fontSize: '14px',
                    fontFamily: 'Courier Prime, monospace',
                    color: '#00ff00'
                }).setInteractive({ useHandCursor: true });
                
                prevBtn.on('pointerover', () => prevBtn.setColor('#ffff00'));
                prevBtn.on('pointerout', () => prevBtn.setColor('#00ff00'));
                prevBtn.on('pointerdown', () => {
                    this.registry.set('currentKillIndex', currentKillIndex - 1);
                    this.scene.restart();
                });
            }

            // Next kill button
            if (currentKillIndex < totalKills - 1) {
                const nextBtn = this.add.text(width / 2 + 150, height - 40, '[Next >]', {
                    fontSize: '14px',
                    fontFamily: 'Courier Prime, monospace',
                    color: '#00ff00'
                }).setInteractive({ useHandCursor: true }).setOrigin(1, 0.5);
                
                nextBtn.on('pointerover', () => nextBtn.setColor('#ffff00'));
                nextBtn.on('pointerout', () => nextBtn.setColor('#00ff00'));
                nextBtn.on('pointerdown', () => {
                    this.registry.set('currentKillIndex', currentKillIndex + 1);
                    this.scene.restart();
                });
            }
        }

        // Timeline button
        const timelineBtn = this.add.text(width - 20, height - 40, '[Timeline Analysis →]', {
            fontSize: '16px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00aaff'
        }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
        
        timelineBtn.on('pointerover', () => timelineBtn.setColor('#ffff00'));
        timelineBtn.on('pointerout', () => timelineBtn.setColor('#00aaff'));
        timelineBtn.on('pointerdown', () => this.scene.start('TimelineAnalysisScene'));
    }
}
