# Shadow Ledger

*A dual-perspective detective vs. killer logic game inspired by Death Note.*

## 🎮 Overview

Shadow Ledger is a psychological strategy/deduction game where you play as both the killer (Kira Mode) and the detective (Detective Mode). Create complex murder cases with alibis and evidence, then investigate them to find contradictions and unmask the killer.

**Key Features:**
- 🔪 **Kira Mode** - Plan killings, craft alibis, manipulate evidence
- 🔍 **Detective Mode** - Investigate crime scenes, analyze timelines, catch contradictions
- 🧠 **Psychological Warfare** - Corruption system affects your choices and risks
- 📊 **Pattern Recognition** - Multiple cases build a larger investigation
- 💾 **Case Sharing** - Export cases as JSON for others to solve

## 🛠️ Tech Stack

- **Phaser 3** - Game framework
- **Vite** - Build tool and dev server
- **JavaScript (ES6+)** - Core language
- **JSON** - Case file format
- **Pixel Art** - Visual style

## 📁 Project Structure

```
Case-Zero/
├── src/              # Source code
│   ├── scenes/       # Phaser game scenes
│   ├── systems/      # Core game systems
│   └── main.js       # Entry point
├── assets/           # Sprites, portraits, UI
├── data/             # JSON case files
├── docs/             # Documentation
│   ├── GDD.md        # Full game design document
│   └── MVP.md        # MVP scope and roadmap
└── index.html        # Main HTML file
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Status

**Current Phase:** Step 1 - Foundation Setup ✅

See [docs/MVP.md](docs/MVP.md) for full roadmap and [docs/GDD.md](docs/GDD.md) for complete game design.

## 📖 Documentation

- **[Game Design Document](docs/GDD.md)** - Complete game design and systems
- **[MVP Scope](docs/MVP.md)** - Minimal viable product goals and timeline

## 📝 License

MIT