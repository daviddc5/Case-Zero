# 🎮 GAME DESIGN DOCUMENT (GDD)

## **Title (Working):** *Shadow Ledger*

*A dual-perspective detective vs. killer logic game inspired by Death Note.*

---

# **1. GAME OVERVIEW**

## **1.1 High Concept**

A psychological strategy/deduction game where the player can play **both roles**:

### **1) Kira Mode — "Judge the World"**

You commit a series of morally targeted killings, craft alibis, manipulate evidence, and try to avoid suspicion.

Your corruption grows as you kill, pushing you toward becoming a tyrant or staying a "just" killer.

### **2) Detective Mode — "Find the Pattern"**

You investigate a sequence of connected deaths, analyze evidence, identify contradictions, and try to narrow down suspects as Kira evolves.

Both modes use the **same shared case system**, and **Kira Mode cases can be played in Detective Mode.**

---

## **1.2 Design Pillars**

- **Psychological Warfare** – A battle of wits between Kira and an L-like detective.
- **Moral Ambiguity** – The player justifies or rationalizes killings.
- **Logic & Deduction** – Evidence analysis, timelines, contradictions.
- **Pattern-Based Gameplay** – Multiple cases build a larger investigation.
- **Replayability** – Kira Mode generates evolving cases.

---

# **2. GAME STRUCTURE**

Two intertwined campaigns:

---

# **2.1 KIRA MODE (Primary System)**

## **2.1.1 Player Fantasy**

Feel like a growing Kira figure:

- Judge who should die
- Stay hidden behind complex alibis
- Plant false evidence
- Manipulate investigations
- Grow in ego, power, and corruption

---

## **2.1.2 Gameplay Loop**

### **Each "Episode" (Killing Cycle):**

1. **Choose target**
    - criminals, corrupt people, random civilians (if corrupt)
2. **Assign motive (good justification or selfish)**
    
    This affects corruption and suspicion.
    
3. **Plan kill method**
    - heart attack (clean)
    - accident staging
    - poisoning
    - physical murder (high risk)
4. **Set time of death**
5. **Craft alibi timeline**
    
    A grid showing where you claim you were each hour.
    
6. **Plant false evidence or mislead investigators**
    - fake CCTV
    - fake messages
    - misdirected items
    - planted witnesses
7. **Submit crime → system checks for contradictions**
8. **Detective AI reacts**
    - narrows suspects
    - publicly announces theories
    - grows suspicion of you
9. **Kira's corruption increases**
    - ego
    - justification
    - risk-taking
    - options unlock / lock
10. **Repeat**
    
    More murders → more attention → more suspicion → more pressure.
    

---

## **2.1.3 Kira Stats**

- **Corruption (0–100%)**
- **Suspicion (how much detective suspects you)**
- **Fear (public impact)**
- **Alibi Strength**
- **Consistency Rating**

High corruption:

✔ unlocks easier killing

❌ increases suspicion dramatically

❌ allows killing innocents

---

## **2.1.4 Win Conditions**

- **Complete X kills without being caught** (e.g., 5, 10, or full season)
- **Maintain low enough suspicion** to avoid direct accusation
- **Reduce detective's confidence to 0%** (make them give up)
- **Frame another suspect successfully** (redirect all suspicion)
- **Achieve "Perfect Kira"** status (high kills, low corruption, never suspected)

## **2.1.5 Failure Conditions**

- A contradiction exposes your alibi
- Evidence backfires
- Detective accuses you with enough proof (>80% confidence + key evidence)
- You become too corrupt and make a reckless kill that's immediately traced
- Your suspicion meter reaches 100%

---

# **2.2 DETECTIVE MODE (Secondary but more accessible)**

## **2.2.1 Player Fantasy**

Feel like L:

- Investigate a sequence of murders
- Extract connections
- Find contradictions
- Profile Kira's psychology
- Identify the killer from multiple suspects

---

## **2.2.2 Gameplay Loop**

For each episode (kill):

1. **Crime Scene Exploration**
    - Static pixel room
    - Clickable evidence nodes
2. **Evidence Filing**
    - autopsy
    - CCTV
    - timeline reports
    - suspect statements
    - items found
3. **Suspect Interrogation**
Each has:
    - motive
    - alibi
    - contradictions
    - suspicious behavior
4. **Timeline Analysis**
    - horizontal grid
    - all suspects & victim's movements
    - highlight conflicts
5. **Pattern & Psychological Profiling**
    - motive evolution
    - kill method changes
    - signature behaviors
    - "pattern board" view
6. **Accusation Phase**
Player can accuse anytime.
    
    Wrong accusation ends the case.
    

---

## **2.2.3 Detective Stats**

- Accuracy
- Uncovered contradictions
- Confidence score
- Pattern recognition

---

## **2.2.4 Win Conditions**

- Correctly identify Kira
- Provide key contradiction(s)
- Build a convincing logical chain

---

# **3. SHARED SYSTEMS**

## **3.1 Case Engine**

A core system that holds:

- victim info
- suspects
- alibis
- evidence objects
- kill method
- contradictions

Cases generated in Kira Mode can be saved as JSON and loaded by Detective Mode.

---

## **3.2 Rooms**

Simple pixel scenes with clickable hotspots:

Examples:

- Victim's apartment
- Alleyway
- Office
- Bridge
- Living room
- Storefront

Each kill adds a new room.

---

## **3.3 Evidence Types**

- **Physical** (knife, footprint, pill bottle)
- **Digital** (messages, logs, searches)
- **CCTV**
- **Profile data**
- **Autopsy report**
- **Room clues**

---

## **3.4 Contradiction Validator**

A logic engine checks:

- Does alibi match kill time?
- Does CCTV contradict statements?
- Do two pieces of evidence conflict?
- Do kill methods reveal patterns?

This engine is used in both modes.

---

# **4. ART & STYLE**

## **4.1 Pixel Portraits**

- 64×64
- Emotion variations
- Used for dialogue, suspects, Kira, detective

## **4.2 Rooms**

- Simple pixel environments
- Limited palette (Obra-Dinn inspired optional)

## **4.3 UI**

- Panels
- Evidence folders
- Timeline bars
- Detective "profile map"
- Kira "kill planning board"

---

# **5. TECHNICAL DESIGN**

## **5.1 Core Technologies**

- **JavaScript + Phaser 3**
- JSON case files
- LocalStorage for saves
- Node.js optional for a desktop app
- Pixel art assets

---

## **5.2 Scene Structure**

### Scenes:

- Main Menu
- Kira Planning Scene
- Alibi Builder
- Evidence Generator
- Detective Crime Scene
- Detective Evidence Room
- Timeline View
- Accusation/Results

---

# **6. MVP VERSION**

## **Goal:**

Build a *mini-season* of 3 killings.

### **MVP includes:**

### ✔ Kira Mode:

- 3 kills
- 3 alibis
- simple corruption meter
- simple suspicion system
- JSON export

### ✔ Detective Mode:

- load 3-kill case
- 1–2 rooms per kill
- 3–4 suspects total
- 1 contradiction per kill
- final accusation

### ✔ No:

- advanced AI
- spreading media influence
- political storylines
- branching narrative
(Yet!)

---

# **7. DEVELOPMENT ROADMAP**

## **Phase 1 — Foundations (1–2 weeks)**

- Phaser setup
- JSON case reader
- Basic UI
- Data structures

## **Phase 2 — Detective MVP (3–5 weeks)**

- Evidence viewer
- Timeline viewer
- 1 test case
- Room clicking
- Accusation logic

## **Phase 3 — Kira MVP (4–6 weeks)**

- Kill planner
- Alibi timeline
- Evidence generator
- Contradiction validator

## **Phase 4 — Connect Modes (2–3 weeks)**

- Kira → JSON → Detective
- Season flow

---

# 🎉 **Complete GDD**

This is the complete blueprint for building Shadow Ledger - a narrative-deduction game with Death Note's core tension.
