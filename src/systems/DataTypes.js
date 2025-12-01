/**
 * Data type definitions for Shadow Ledger case system
 * Using JSDoc for type checking without TypeScript
 */

/**
 * @typedef {Object} TimeSlot
 * @property {number} hour - Hour in 24h format (0-23)
 * @property {string} location - Where the person was
 * @property {string} activity - What they were doing
 * @property {string[]} [witnesses] - Optional witnesses
 */

/**
 * @typedef {Object} Alibi
 * @property {string} suspectId - Reference to suspect
 * @property {TimeSlot[]} timeline - Hour-by-hour locations
 * @property {string} statement - Their official story
 */

/**
 * @typedef {Object} Evidence
 * @property {string} id - Unique identifier
 * @property {string} type - Physical, Digital, CCTV, Autopsy, Profile
 * @property {string} name - Display name
 * @property {string} description - Full description
 * @property {string} location - Where it was found
 * @property {number} killIndex - Which kill (0, 1, 2 for 3-kill case)
 * @property {Object.<string, any>} metadata - Additional data
 */

/**
 * @typedef {Object} Suspect
 * @property {string} id - Unique identifier
 * @property {string} name - Full name
 * @property {string} role - Job/position
 * @property {string} motive - Why they might be Kira
 * @property {boolean} isKira - True if this is the killer
 * @property {Alibi} alibi - Their timeline and statement
 * @property {string[]} relatedEvidence - Evidence IDs connected to them
 */

/**
 * @typedef {Object} Victim
 * @property {string} id - Unique identifier
 * @property {string} name - Full name
 * @property {string} background - Who they were
 * @property {string} causeOfDeath - How they died
 * @property {number} timeOfDeath - Hour (0-23)
 * @property {string} location - Where they died
 */

/**
 * @typedef {Object} Kill
 * @property {number} index - Kill number (0, 1, 2)
 * @property {Victim} victim - Victim information
 * @property {string} method - heart_attack, poison, accident, physical
 * @property {string} room - Room key for crime scene
 * @property {string[]} evidenceIds - Evidence found at this scene
 */

/**
 * @typedef {Object} Contradiction
 * @property {string} id - Unique identifier
 * @property {string} type - alibi_time, evidence_conflict, witness_mismatch
 * @property {string} suspectId - Who this contradicts
 * @property {string[]} evidenceIds - Evidence that creates contradiction
 * @property {string} description - What the contradiction is
 * @property {boolean} isKeyContradiction - Required to solve case
 */

/**
 * @typedef {Object} Case
 * @property {string} id - Unique case identifier
 * @property {string} title - Case name
 * @property {string} description - Brief overview
 * @property {Kill[]} kills - All kills in sequence
 * @property {Suspect[]} suspects - All suspects including Kira
 * @property {Evidence[]} evidence - All evidence
 * @property {Contradiction[]} contradictions - All contradictions
 * @property {Object} metadata - Case stats and info
 * @property {number} metadata.totalKills - Number of kills
 * @property {string} metadata.difficulty - easy, medium, hard
 * @property {string} metadata.createdBy - kira_mode or hand_crafted
 */

export const EvidenceTypes = {
    PHYSICAL: 'physical',
    DIGITAL: 'digital',
    CCTV: 'cctv',
    AUTOPSY: 'autopsy',
    PROFILE: 'profile',
    ROOM_CLUE: 'room_clue'
};

export const KillMethods = {
    HEART_ATTACK: 'heart_attack',
    POISON: 'poison',
    ACCIDENT: 'accident',
    PHYSICAL: 'physical'
};

export const ContradictionTypes = {
    ALIBI_TIME: 'alibi_time',
    EVIDENCE_CONFLICT: 'evidence_conflict',
    WITNESS_MISMATCH: 'witness_mismatch',
    TIMELINE_IMPOSSIBLE: 'timeline_impossible'
};
