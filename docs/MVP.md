# MVP Scope - Shadow Ledger

## Goal

Build a **minimal viable product** covering a 3-kill case that can be played in both Kira Mode and Detective Mode.

---

## What's In the MVP

### ✅ Kira Mode

- **3 sequential kills** with different targets
- **Kill planning interface**
  - Choose target from list
  - Assign motive (affects corruption)
  - Select kill method (heart attack, poison, accident, physical)
  - Set time of death
- **Alibi timeline builder**
  - Grid-based hour-by-hour location system
  - Must craft believable alibi for kill window
- **Simple corruption meter** (0-100%)
  - Increases with each kill
  - Affects available options and suspicion rate
- **Simple suspicion system**
  - Detective AI narrows suspects after each kill
  - Contradictions increase suspicion dramatically
- **JSON case export**
  - Save created case to `data/cases/`
  - Can be loaded into Detective Mode

### ✅ Detective Mode

- **Load 3-kill case** from JSON
- **Crime scene exploration** (Death Note DS dual-screen style)
  - Top screen: Room visual, evidence details, internal monologue
  - Bottom screen: Interactive tap zones for hotspots, navigation buttons
  - 1-2 point-and-click rooms per kill (3-6 total)
- **Evidence system**
  - Autopsy reports
  - CCTV footage (text descriptions)
  - Timeline reports
  - Suspect statements
  - Physical items
  - Detective notebook UI (touch-scrollable)
- **3-4 suspects total** (including Kira)
  - Character portraits on top screen
  - Each with motive, alibi, profile
  - Touch-based dialogue/interrogation system
- **Timeline analysis view**
  - Top screen: Selected suspect details
  - Bottom screen: Scrollable hour-by-hour grid (swipe to scroll)
  - Tap cells for details
  - Visual contradiction indicators
- **1 key contradiction per kill**
  - Alibi vs evidence conflicts
  - Timeline impossibilities
  - Tap evidence to present
- **Final accusation phase**
  - Top screen: Suspect portrait + profile
  - Bottom screen: Evidence selection, accusation button
  - Touch-based evidence presentation
  - Win/lose conditions with feedback

### ✅ Mobile-First Design
- **360×1280 portrait layout** (dual screens: 360×640 each)
- Touch event handlers (tap, press, swipe)
- Larger fonts (16-24px)
- 44×44px minimum tap targets
- Bottom-thumb navigation zone
- Works on desktop in narrow window

### ✅ Shared Systems

- **Case engine** (JSON data structure)
### ❌ Not Yet

- Advanced detective AI reactions
- Media/public influence system
- Political storylines
- Complex branching narrative paths
- Multiple endings
- Evidence planting complexity
- Deep psychological profiling mechanics
- Pattern recognition scoring system
- Full save/load system (beyond JSON export)
- Sound effects / music
- Complex animations
- Multiple case campaigns
- Fully animated character sprites
- Voice acting
- Advanced dialogue branching
- Landscape mode (portrait-first for MVP)
- Desktop-wide layouts (narrow window for MVP)
- Evidence planting complexity
- Psychological profiling depth
- Pattern recognition scoring
- Save/load system (beyond JSON export)
- Sound effects / music
- Animations
- Multiple case campaigns

---

## Success Criteria

The MVP is complete when:

1. ✅ Player can create a 3-kill case in Kira Mode with alibis
2. ✅ Created case exports to valid JSON
3. ✅ Player can load that JSON in Detective Mode
4. ✅ Player can explore crime scenes and collect evidence
5. ✅ Player can identify contradictions in suspect alibis
6. ✅ Player can make a final accusation
7. ✅ Game correctly validates win/lose conditions

---

## Development Order

Following the main plan:

1. **Step 2: Core data systems** → Build JSON case engine first
2. **Step 3: Detective Mode MVP** → Easier to test with hand-written cases
3. **Step 4: Kira Mode MVP** → Build the case generator
4. **Step 5: Connect & test** → Full Kira → Detective loop

---

## Time Estimate

Based on GDD roadmap:

- **Phase 1:** Foundations (1-2 weeks)
- **Phase 2:** Detective MVP (3-5 weeks)
- **Phase 3:** Kira MVP (4-6 weeks)
- **Phase 4:** Connect modes (2-3 weeks)

**Total: 10-16 weeks** for solo development
