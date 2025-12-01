import Phaser from 'phaser';
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { CaseLoadingScene } from './scenes/CaseLoadingScene.js';
import { EvidenceViewerScene } from './scenes/EvidenceViewerScene.js';
import { CrimeSceneScene } from './scenes/CrimeSceneScene.js';

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#2d2d2d',
    scene: [MainMenuScene, CaseLoadingScene, EvidenceViewerScene, CrimeSceneScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true
};

// Initialize the game
const game = new Phaser.Game(config);
