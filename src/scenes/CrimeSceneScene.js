/**
 * CrimeSceneScene - Interactive crime scene investigation
 * Mobile landscape optimized (812×375)
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

        // Compact header for mobile
        this.add.rectangle(0, 0, width, 50, 0x000000, 0.9).setOrigin(0);
        this.add.text(10, 10, `CRIME SCENE: ${currentKill.victim.name}`, {
            fontSize: '16px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ff0000'
        });
        
        this.add.text(10, 30, `Location: ${currentKill.victim.location} | Click hotspots to investigate`, {
            fontSize: '10px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        });

        // Create room visualization (full width)
        this.createRoom(currentKill, discoveredEvidence);

        // Bottom navigation
        this.createBottomNav(width, height, currentKillIndex, engine.currentCase.kills.length);
    }

    createRoom(kill, discoveredEvidence) {
        const { width, height } = this.cameras.main;
        const roomX = 10;
        const roomY = 60;
        const roomWidth = width - 20;
        const roomHeight = height - 120;

        // Room background with visible outline
        const room = this.add.rectangle(roomX, roomY, roomWidth, roomHeight, 0x1a1a1a).setOrigin(0);
        room.setStrokeStyle(3, 0x00ff00);

        // Room label in corner
        this.add.text(roomX + 10, roomY + 10, `[${kill.room.toUpperCase()}]`, {
            fontSize: '12px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 6, y: 3 }
        });

        // Get evidence for this kill
        const killEvidence = kill.evidenceIds.map(id => this.registry.get('caseEngine').getEvidence(id));

        // Evidence count
        const discoveredCount = killEvidence.filter(e => discoveredEvidence.includes(e.id)).length;
        this.add.text(roomX + roomWidth - 10, roomY + 10, `${discoveredCount}/${killEvidence.length}`, {
            fontSize: '12px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ffff00',
            backgroundColor: '#000000',
            padding: { x: 6, y: 3 }
        }).setOrigin(1, 0);

        // Create hotspots for each piece of evidence
        const hotspotPositions = this.generateHotspotPositions(killEvidence.length, roomWidth - 40, roomHeight - 40);
        
        killEvidence.forEach((evidence, index) => {
            const isDiscovered = discoveredEvidence.includes(evidence.id);
            const pos = hotspotPositions[index];
            
            this.createHotspot(
                roomX + 20 + pos.x,
                roomY + 30 + pos.y,
                evidence,
                isDiscovered
            );
        });
    }

    generateHotspotPositions(count, roomWidth, roomHeight) {
        // Fixed positions so hotspots don't move when scene restarts
        const positions = [];
        const padding = 40;
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        
        const spacingX = (roomWidth - padding * 2) / (cols + 1);
        const spacingY = (roomHeight - padding * 2) / (rows + 1);

        for (let i = 0; i < count; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            
            // Add slight randomness but seeded consistently
            const offsetX = (Math.sin(i * 123.456) * 20);
            const offsetY = (Math.cos(i * 78.901) * 20);
            
            positions.push({
                x: padding + (col + 1) * spacingX + offsetX,
                y: padding + (row + 1) * spacingY + offsetY
            });
        }

        return positions;
    }

    createHotspot(x, y, evidence, isDiscovered) {
        const size = 50;
        const color = isDiscovered ? 0x00aa00 : 0xffaa00;
        const alpha = isDiscovered ? 0.3 : 0.8;

        const hotspot = this.add.circle(x, y, size / 2, color, alpha);
        hotspot.setStrokeStyle(3, color);
        
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
            hotspot.on('pointerdown', () => {
                this.discoverEvidence(evidence, hotspot);
            });
        }

        const labelText = isDiscovered ? '✓' : '?';
        const label = this.add.text(x, y, labelText, {
            fontSize: isDiscovered ? '20px' : '28px',
            fontFamily: 'Courier Prime, monospace',
            color: isDiscovered ? '#00ff00' : '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        if (!isDiscovered) {
            label.setInteractive({ useHandCursor: true });
            label.on('pointerdown', () => {
                this.discoverEvidence(evidence, hotspot);
            });
        }

        this.hotspots.push({ hotspot, label, evidence });
    }

    discoverEvidence(evidence, hotspot) {
        const discoveredEvidence = this.registry.get('discoveredEvidence');
        if (!discoveredEvidence.includes(evidence.id)) {
            discoveredEvidence.push(evidence.id);
            this.registry.set('discoveredEvidence', discoveredEvidence);

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

            this.showDiscoveryNotification(evidence);
        }
    }

    showDiscoveryNotification(evidence) {
        const { width, height } = this.cameras.main;
        
        const notification = this.add.container(width / 2, height / 2);
        notification.setDepth(1000);
        
        const bg = this.add.rectangle(0, 0, width - 40, 180, 0x000000, 0.95);
        bg.setStrokeStyle(3, 0x00ff00);
        
        const title = this.add.text(0, -65, 'EVIDENCE DISCOVERED', {
            fontSize: '16px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00ff00'
        }).setOrigin(0.5);
        
        const name = this.add.text(0, -35, evidence.name, {
            fontSize: '14px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        const desc = this.add.text(0, 0, evidence.description, {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#cccccc',
            wordWrap: { width: width - 80 },
            align: 'center'
        }).setOrigin(0.5);

        // OK button
        const okButton = this.add.text(0, 60, '[OK]', {
            fontSize: '14px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ffff00',
            backgroundColor: '#003300',
            padding: { x: 20, y: 6 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        okButton.on('pointerdown', () => {
            okButton.setColor('#ffffff');
            notification.destroy();
            this.scene.restart();
        });

        notification.add([bg, title, name, desc, okButton]);
        
        notification.setAlpha(0);
        this.tweens.add({
            targets: notification,
            alpha: 1,
            duration: 300
        });
    }

    createBottomNav(width, height, currentKillIndex, totalKills) {
        const navBg = this.add.rectangle(0, height - 50, width, 50, 0x000000, 0.9).setOrigin(0);
        
        // Left: Back button
        const backBtn = this.add.text(10, height - 30, '[← Evidence Room]', {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
        
        backBtn.on('pointerdown', () => {
            backBtn.setColor('#ffffff');
            this.scene.start('EvidenceViewerScene');
        });

        // Center: Scene navigation
        if (totalKills > 1) {
            // Previous kill button (left of center)
            if (currentKillIndex > 0) {
                const prevBtn = this.add.text(width / 2 - 100, height - 30, '[< Prev]', {
                    fontSize: '11px',
                    fontFamily: 'Courier Prime, monospace',
                    color: '#00ff00'
                }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
                
                prevBtn.on('pointerdown', () => {
                    prevBtn.setColor('#ffff00');
                    this.registry.set('currentKillIndex', currentKillIndex - 1);
                    this.scene.restart();
                });
            }

            // Scene counter (center)
            const killText = this.add.text(width / 2, height - 30, `Crime Scene ${currentKillIndex + 1}/${totalKills}`, {
                fontSize: '10px',
                fontFamily: 'Courier Prime, monospace',
                color: '#666666'
            }).setOrigin(0.5);

            // Next kill button (right of center)
            if (currentKillIndex < totalKills - 1) {
                const nextBtn = this.add.text(width / 2 + 100, height - 30, '[Next >]', {
                    fontSize: '11px',
                    fontFamily: 'Courier Prime, monospace',
                    color: '#00ff00'
                }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
                
                nextBtn.on('pointerdown', () => {
                    nextBtn.setColor('#ffff00');
                    this.registry.set('currentKillIndex', currentKillIndex + 1);
                    this.scene.restart();
                });
            }
        }

        // Right: Timeline button
        const timelineBtn = this.add.text(width - 10, height - 30, '[Timeline →]', {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00aaff'
        }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
        
        timelineBtn.on('pointerdown', () => {
            timelineBtn.setColor('#ffff00');
            this.scene.start('TimelineAnalysisScene');
        });
    }
}
