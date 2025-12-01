/**
 * InfoScene - Tutorial/Help explaining game mechanics
 * Mobile landscape optimized (812×375)
 */

export class InfoScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InfoScene' });
        this.currentPage = 0;
        this.pages = [
            {
                title: 'HOW TO PLAY',
                content: [
                    'Your goal: Find the killer among 4 suspects.',
                    '',
                    'Use evidence and contradictions to identify who is',
                    'using technology to kill corrupt targets.',
                    '',
                    'Navigate through different investigation tools to',
                    'build your case before making the final accusation.'
                ]
            },
            {
                title: 'EVIDENCE ROOM',
                content: [
                    'Browse all discovered evidence:',
                    '• Autopsy reports (cause of death, time)',
                    '• CCTV footage (who was where)',
                    '• Digital forensics (hacking traces)',
                    '• Physical evidence (items at crime scenes)',
                    '',
                    'Click evidence cards to read full details.'
                ]
            },
            {
                title: 'CRIME SCENES',
                content: [
                    'Interactive investigation of murder locations.',
                    '',
                    'Click pulsing [?] circles to discover evidence.',
                    'Each crime scene has 3-4 pieces of evidence.',
                    '',
                    'Navigate between scenes using [Prev] [Next].',
                    'Evidence counter shows X/Y discovered.'
                ]
            },
            {
                title: 'TIMELINE ANALYSIS',
                content: [
                    'The KEY detective tool! Shows where each suspect',
                    'claims they were hour-by-hour (6pm-midnight).',
                    '',
                    '🟢 Green cells = alibi checks out',
                    '🔴 Red cells = CONTRADICTION (caught lying!)',
                    '☠️ Skull icon = murder time',
                    '👁 Eye + number = witnesses present',
                    '',
                    'Tap any cell to see details and contradictions.'
                ]
            },
            {
                title: 'CONTRADICTIONS',
                content: [
                    'Red cells appear when:',
                    '• No witnesses during murder time',
                    '• CCTV shows different location than claimed',
                    '• Timing doesn\'t add up (arrival/departure)',
                    '• Digital evidence links them to crime',
                    '• Evidence conflicts with their statement',
                    '',
                    'More red cells = more suspicious!'
                ]
            },
            {
                title: 'SUSPECT PROFILES',
                content: [
                    'View detailed information about each suspect:',
                    '• Background & occupation',
                    '• Motive for wanting victims dead',
                    '• Full alibi statement',
                    '• List of all contradictions found',
                    '',
                    'Use [Prev] [Next] to browse suspects.',
                    'Click names in timeline to jump to profiles.'
                ]
            },
            {
                title: 'MAKING ACCUSATION',
                content: [
                    'When ready, go to Make Accusation page.',
                    '',
                    'Select the suspect you believe is the hacker.',
                    'Review their contradiction count.',
                    'Click [ACCUSE SELECTED SUSPECT].',
                    '',
                    '✅ Correct = Case Solved!',
                    '❌ Wrong = Get feedback, continue investigating',
                    '',
                    'Tip: Focus on KEY contradictions, not just quantity.'
                ]
            },
            {
                title: 'DETECTIVE TIPS',
                content: [
                    '1. Discover ALL evidence at crime scenes first',
                    '2. Study the timeline - red cells are crucial',
                    '3. Check who has no witnesses at murder times',
                    '4. Look for tech skills (hacking evidence)',
                    '5. Read suspect motives - who benefits?',
                    '6. Multiple contradictions = pattern of lying',
                    '7. Don\'t rush - analyze before accusing!'
                ]
            }
        ];
    }

    create() {
        const { width, height } = this.cameras.main;

        // Header
        this.add.rectangle(0, 0, width, 50, 0x000000, 0.9).setOrigin(0);
        this.titleText = this.add.text(width / 2, 25, 'GAME INFO', {
            fontSize: '18px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00ff00'
        }).setOrigin(0.5);

        // Content area
        this.contentArea = this.add.container(width / 2, height / 2 + 10);
        
        // Navigation
        this.createNavigation(width, height);

        // Display first page
        this.displayPage();
    }

    displayPage() {
        const { width, height } = this.cameras.main;
        
        // Clear previous content
        this.contentArea.removeAll(true);

        const page = this.pages[this.currentPage];

        // Page title
        const pageTitle = this.add.text(0, -120, page.title, {
            fontSize: '16px',
            fontFamily: 'Courier Prime, monospace',
            color: '#ffff00'
        }).setOrigin(0.5);

        // Content lines
        let yOffset = -80;
        page.content.forEach((line, index) => {
            const fontSize = line === '' ? '8px' : '11px';
            const color = line.startsWith('•') || line.startsWith('🟢') || line.startsWith('🔴') || line.startsWith('☠️') || line.startsWith('👁') 
                ? '#00ff00' 
                : line.startsWith('Tip:') || line.startsWith('✅') || line.startsWith('❌')
                ? '#ffaa00'
                : '#cccccc';
            
            const text = this.add.text(0, yOffset, line, {
                fontSize: fontSize,
                fontFamily: 'Courier Prime, monospace',
                color: color,
                align: 'center',
                wordWrap: { width: width - 60 }
            }).setOrigin(0.5);

            yOffset += line === '' ? 10 : 18;
            this.contentArea.add(text);
        });

        this.contentArea.add(pageTitle);

        // Update page counter
        this.pageCounter.setText(`Page ${this.currentPage + 1}/${this.pages.length}`);

        // Update button states
        this.prevBtn.setAlpha(this.currentPage > 0 ? 1 : 0.3);
        this.nextBtn.setAlpha(this.currentPage < this.pages.length - 1 ? 1 : 0.3);
    }

    createNavigation(width, height) {
        // Bottom navigation bar
        this.add.rectangle(0, height - 50, width, 50, 0x000000, 0.9).setOrigin(0);

        // Close button (left)
        const closeBtn = this.add.text(10, height - 25, '[← Back]', {
            fontSize: '12px',
            fontFamily: 'Courier Prime, monospace',
            color: '#888888'
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerdown', () => {
            closeBtn.setColor('#ffffff');
            this.scene.start('MainMenuScene');
        });

        // Page counter (center)
        this.pageCounter = this.add.text(width / 2, height - 25, `Page 1/${this.pages.length}`, {
            fontSize: '10px',
            fontFamily: 'Courier Prime, monospace',
            color: '#666666'
        }).setOrigin(0.5);

        // Previous button
        this.prevBtn = this.add.text(width / 2 - 80, height - 25, '[< Previous]', {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00ff00'
        }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });

        this.prevBtn.on('pointerdown', () => {
            if (this.currentPage > 0) {
                this.currentPage--;
                this.displayPage();
            }
        });

        // Next button
        this.nextBtn = this.add.text(width / 2 + 80, height - 25, '[Next >]', {
            fontSize: '11px',
            fontFamily: 'Courier Prime, monospace',
            color: '#00ff00'
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });

        this.nextBtn.on('pointerdown', () => {
            if (this.currentPage < this.pages.length - 1) {
                this.currentPage++;
                this.displayPage();
            }
        });
    }
}
