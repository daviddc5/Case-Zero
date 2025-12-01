import Phaser from 'phaser';

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true
};

// Initialize the game
const game = new Phaser.Game(config);

function preload() {
    // Assets will be loaded here
}

function create() {
    // Temporary welcome screen
    const titleText = this.add.text(640, 300, 'SHADOW LEDGER', {
        fontSize: '64px',
        fontFamily: 'Courier New',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5);

    const subtitleText = this.add.text(640, 380, 'A Death Note-Inspired Logic Game', {
        fontSize: '24px',
        fontFamily: 'Courier New',
        color: '#cccccc'
    }).setOrigin(0.5);

    const statusText = this.add.text(640, 450, 'Phase: Foundation Setup Complete ✓', {
        fontSize: '18px',
        fontFamily: 'Courier New',
        color: '#00ff00'
    }).setOrigin(0.5);

    const instructionText = this.add.text(640, 520, 'Next: Build Core Data Systems', {
        fontSize: '16px',
        fontFamily: 'Courier New',
        color: '#888888'
    }).setOrigin(0.5);

    // Pulse effect on title
    this.tweens.add({
        targets: titleText,
        alpha: 0.7,
        duration: 1500,
        yoyo: true,
        repeat: -1
    });
}

function update() {
    // Game loop will be implemented here
}
