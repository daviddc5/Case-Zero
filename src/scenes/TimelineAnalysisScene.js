/**
 * TimelineAnalysisScene - Analyze suspect alibis and find timeline contradictions
 * Shows hour-by-hour movements of all suspects and victims
 */

export class TimelineAnalysisScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TimelineAnalysisScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        const engine = this.registry.get('caseEngine');
        const validator = this.registry.get('validator');
        const currentKillIndex = this.registry.get('currentKillIndex');
        
        const currentKill = engine.currentCase.kills[currentKillIndex];
        const suspects = engine.currentCase.suspects;

        // Compact header for mobile
        this.add.rectangle(0, 0, width, 50, 0x000000, 0.9).setOrigin(0);
        this.add.text(10, 10, 'TIMELINE ANALYSIS', {
            fontSize: '16px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00aaff'
        });

        // Help button (top right)
        const helpBtn = this.add.text(width - 10, 10, '[?]', {
            fontSize: '16px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
        
        helpBtn.on('pointerdown', () => {
            helpBtn.setColor('#ffff00');
            this.scene.start('InfoScene');
        });
        
        this.add.text(10, 32, `${currentKill.victim.name} (${currentKill.victim.timeOfDeath}:00)`, {
            fontSize: '10px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        });

        // Simplified timeline grid (no contradiction panel - info shown inline)
        this.createTimelineGrid(suspects, currentKill, validator);

        // Bottom navigation
        this.createBottomNav(width, height);
    }

    createTimelineGrid(suspects, currentKill, validator) {
        const gridX = 10;
        const gridY = 60;
        const cellWidth = 65;
        const cellHeight = 50;
        const startHour = 18;
        const endHour = 24;
        const hourCount = endHour - startHour;

        // Compact grid for mobile - narrower columns
        const panelWidth = 100 + (hourCount * cellWidth);
        const panelHeight = 40 + (suspects.length * cellHeight);
        
        this.add.rectangle(gridX, gridY, panelWidth, panelHeight, 0x0a0a0a, 0.8).setOrigin(0);
        this.add.rectangle(gridX, gridY, panelWidth, panelHeight).setOrigin(0).setStrokeStyle(2, 0x444444);

        // Hour headers - compact
        for (let i = 0; i < hourCount; i++) {
            const hour = startHour + i;
            const x = gridX + 100 + (i * cellWidth);
            
            this.add.text(x + cellWidth / 2, gridY + 15, `${hour}:00`, {
                fontSize: '9px',
                fontFamily: 'Courier Prime, monospace',
                color: '#00aaff'
            }).setOrigin(0.5);

            // Vertical grid lines
            this.add.line(0, 0, x, gridY + 35, x, gridY + panelHeight, 0x333333, 0.5).setOrigin(0);
        }

        // Kill time marker
        const killHour = currentKill.victim.timeOfDeath;
        if (killHour >= startHour && killHour < endHour) {
            const killX = gridX + 100 + ((killHour - startHour) * cellWidth);
            
            this.add.rectangle(killX, gridY + 35, cellWidth, panelHeight - 35, 0xff0000, 0.15).setOrigin(0);
            this.add.line(0, 0, killX + cellWidth / 2, gridY + 35, killX + cellWidth / 2, gridY + panelHeight, 0xff0000, 2).setOrigin(0);
            
            this.add.text(killX + cellWidth / 2, gridY + 27, '☠', {
                fontSize: '12px',
                color: '#ff0000'
            }).setOrigin(0.5);
        }

        // Suspect rows - more compact
        suspects.forEach((suspect, suspectIndex) => {
            const rowY = gridY + 40 + (suspectIndex * cellHeight);

            // Horizontal grid line
            this.add.line(0, 0, gridX, rowY, gridX + panelWidth, rowY, 0x333333, 0.5).setOrigin(0);

            // Suspect name - abbreviated for mobile
            const nameColor = '#ffffff';
            const displayName = suspect.name.split(' ')[0]; // First name only
            const nameText = this.add.text(gridX + 6, rowY + cellHeight / 2, displayName, {
                fontSize: '10px',
                fontFamily: 'Courier Prime, monospace',
                color: nameColor
            }).setOrigin(0, 0.5);

            // Make name clickable to view profile
            nameText.setInteractive({ useHandCursor: true });
            nameText.on('pointerover', () => nameText.setColor('#ffff00'));
            nameText.on('pointerout', () => nameText.setColor('#ffffff'));
            nameText.on('pointerdown', () => {
                this.registry.set('selectedSuspect', suspect.id);
                this.scene.start('SuspectProfileScene');
            });
            // Timeline entries - simplified for mobile
            for (let hour = startHour; hour < endHour; hour++) {
                const entry = suspect.alibi.timeline.find(t => t.hour === hour);
                if (entry) {
                    const cellX = gridX + 100 + ((hour - startHour) * cellWidth);
                    
                    // Check for contradictions
                    const hasContradiction = this.checkContradictionAtTime(
                        suspect, 
                        hour, 
                        entry, 
                        currentKill, 
                        validator
                    );

                    const cellColor = hasContradiction ? 0xff0000 : 
                                     hour === killHour ? 0xffaa00 : 0x1a1a1a;
                    const cellAlpha = hasContradiction ? 0.4 : 0.5;

                    const cell = this.add.rectangle(
                        cellX + 2, 
                        rowY + 2, 
                        cellWidth - 4, 
                        cellHeight - 4, 
                        cellColor, 
                        cellAlpha
                    ).setOrigin(0);

                    if (hasContradiction) {
                        cell.setStrokeStyle(2, 0xff0000);
                    }

                    // Location text - very abbreviated
                    const locationText = this.abbreviateLocation(entry.location);
                    this.add.text(cellX + cellWidth / 2, rowY + cellHeight / 2 - 8, locationText, {
                        fontSize: '7px',
                        fontFamily: 'Courier Prime, monospace',
                        color: hasContradiction ? '#ff0000' : '#cccccc'
                    }).setOrigin(0.5);

                    // Witnesses indicator - more compact
                    if (entry.witnesses && entry.witnesses.length > 0) {
                        this.add.text(cellX + cellWidth / 2, rowY + cellHeight / 2 + 8, `👁 ${entry.witnesses.length}`, {
                            fontSize: '8px',
                            color: '#00ff00'
                        }).setOrigin(0.5);
                    }

                    // Tap to see details
                    cell.setInteractive({ useHandCursor: true });
                    cell.on('pointerdown', () => {
                        this.showDetailPopup(entry, suspect, hasContradiction);
                    });
                }
            }
        });
    }

    checkContradictionAtTime(suspect, hour, entry, kill, validator) {
        const engine = this.registry.get('caseEngine');
        const caseData = engine.currentCase;
        
        // Get all contradictions for this suspect from case data
        const suspectContradictions = caseData.contradictions.filter(c => c.suspectId === suspect.id);
        
        // Check if any contradiction specifically mentions this hour
        const hasHourContradiction = suspectContradictions.some(c => 
            c.hours && c.hours.includes(hour)
        );
        if (hasHourContradiction) return true;
        
        // Check if this is the kill time
        if (hour === kill.victim.timeOfDeath) {
            // Red if no witnesses at murder time
            if (!entry.witnesses || entry.witnesses.length === 0) {
                return true;
            }
            
            // Red if any key contradiction relates to this kill
            const hasKeyContradiction = suspectContradictions.some(c => 
                c.isKeyContradiction && 
                c.evidenceIds && 
                c.evidenceIds.some(eid => {
                    const evidence = engine.getEvidence(eid);
                    return evidence && evidence.killIndex === kill.index;
                })
            );
            if (hasKeyContradiction) return true;
        }
        
        // Check if suspect was at crime scene location
        if (entry.location === kill.victim.location && hour === kill.victim.timeOfDeath) {
            return true;
        }
        
        // Check for CCTV contradictions at this specific hour
        const cctvEvidence = caseData.evidence.filter(e => 
            e.type === 'cctv' && 
            e.metadata.hour === hour &&
            e.metadata.capturedPerson === suspect.id
        );
        
        for (const cctv of cctvEvidence) {
            if (entry.location !== cctv.metadata.location) {
                return true; // Says one place, CCTV shows another
            }
        }
        
        return false;
    }

    abbreviateLocation(location) {
        const abbrev = {
            'university_library': 'Library',
            'home_apartment': 'Home',
            'private_clinic': 'Clinic',
            'restaurant_downtown': 'Restaurant',
            'downtown_office': 'Office',
            'office_building': 'Office Bldg',
            'downtown_bar': 'Bar',
            'riverside_bridge': 'Bridge',
            'startup_office': 'Startup',
            'gym_downtown': 'Gym'
        };
        return abbrev[location] || location.substring(0, 8);
    }

    showDetailPopup(entry, suspect, hasContradiction) {
        // Destroy existing popup
        if (this.popup) this.popup.destroy();
        
        const { width, height } = this.cameras.main;
        
        const popup = this.add.container(width / 2, height / 2);
        
        const bg = this.add.rectangle(0, 0, width - 40, 140, 0x000000, 0.95);
        bg.setStrokeStyle(3, hasContradiction ? 0xff0000 : 0x00ff00);
        
        const title = this.add.text(0, -50, `${suspect.name} @ ${entry.hour}:00`, {
            fontSize: '14px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00aaff'
        }).setOrigin(0.5);
        
        const location = this.add.text(0, -25, `Location: ${entry.location}`, {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        const activity = this.add.text(0, -5, `Activity: ${entry.activity}`, {
            fontSize: '10px',
            fontFamily: 'Courier Prime, monospace',
            color: '#cccccc',
            wordWrap: { width: width - 80 }
        }).setOrigin(0.5);
        
        const witnesses = this.add.text(0, 20, 
            entry.witnesses.length > 0 ? `Witnesses: ${entry.witnesses.join(', ')}` : 'No witnesses', {
            fontSize: '10px',
            fontFamily: 'Courier Prime, monospace',
            color: entry.witnesses.length > 0 ? '#00ff00' : '#666666'
        }).setOrigin(0.5);
        
        if (hasContradiction) {
            const contra = this.add.text(0, 45, '⚠ CONTRADICTION DETECTED', {
                fontSize: '11px',
                fontFamily: 'Courier Prime, monospace',
                color: '#ff0000',
                backgroundColor: '#330000',
                padding: { x: 8, y: 4 }
            }).setOrigin(0.5);
            popup.add(contra);
        }

        popup.add([bg, title, location, activity, witnesses]);
        popup.setDepth(1000);
        
        // Make background clickable to close
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerdown', () => popup.destroy());
        
        this.popup = popup;
    }

    createBottomNav(width, height) {
        const navBg = this.add.rectangle(0, height - 50, width, 50, 0x000000, 0.9).setOrigin(0);
        
        // Back to Evidence Room
        const backBtn = this.add.text(10, height - 30, '[← Evidence Room]', {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
        
        backBtn.on('pointerdown', () => {
            backBtn.setColor('#ffffff');
            this.scene.start('EvidenceViewerScene');
        });

        // Crime Scene
        const crimeBtn = this.add.text(width / 2 - 100, height - 30, '[Crime Scene]', {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00ff00'
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
        
        crimeBtn.on('pointerdown', () => {
            crimeBtn.setColor('#ffff00');
            this.scene.start('CrimeSceneScene');
        });

        // Suspects
        const suspectsBtn = this.add.text(width / 2 + 20, height - 30, '[Suspect Profiles]', {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ff6666'
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
        
        suspectsBtn.on('pointerdown', () => {
            suspectsBtn.setColor('#ffff00');
            this.scene.start('SuspectProfileScene');
        });

        // Make Accusation
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