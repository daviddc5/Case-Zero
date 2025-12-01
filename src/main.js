import Phaser from 'phaser';
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { CaseLoadingScene } from './scenes/CaseLoadingScene.js';
import { EvidenceViewerScene } from './scenes/EvidenceViewerScene.js';
import { CrimeSceneScene } from './scenes/CrimeSceneScene.js';
import { TimelineAnalysisScene } from './scenes/TimelineAnalysisScene.js';
import { SuspectProfileScene } from './scenes/SuspectProfileScene.js';
import { AccusationScene } from './scenes/AccusationScene.js';

// Phaser game configuration - Mobile landscape (perfect for detective games)
const config = {
    type: Phaser.AUTO,
    width: 812,   // iPhone landscape width (most phones 812-844px)
    height: 375,  // iPhone landscape height
    parent: 'game-container',
    backgroundColor: '#000000',
    scene: [MainMenuScene, CaseLoadingScene, EvidenceViewerScene, CrimeSceneScene, TimelineAnalysisScene, SuspectProfileScene, AccusationScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true
};

// Initialize the game
const game = new Phaser.Game(config);
