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
- **Crime scene exploration**
  - 1-2 pixel art rooms per kill (3-6 total)
  - Clickable evidence hotspots
- **Evidence system**
  - Autopsy reports
  - CCTV footage (text descriptions)
  - Timeline reports
  - Suspect statements
  - Physical items
- **3-4 suspects total** (including Kira)
  - Each with motive, alibi, profile
- **Timeline analysis view**
  - Horizontal grid showing suspect movements
  - Highlight conflicts and gaps
- **1 key contradiction per kill**
  - Alibi vs evidence conflicts
  - Timeline impossibilities
- **Final accusation phase**
  - Select suspect + provide evidence chain
  - Win/lose conditions

### ✅ Shared Systems

- **Case engine** (JSON data structure)
- **Contradiction validator** (logic checks)
- **Basic UI panels and navigation**

---

## What's NOT in the MVP

### ❌ Not Yet

- Advanced detective AI reactions
- Media/public influence system
- Political storylines
- Branching narrative paths
- Multiple endings
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
