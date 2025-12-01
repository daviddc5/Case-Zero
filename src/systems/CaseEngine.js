/**
 * CaseEngine - Core system for loading, managing, and validating cases
 */

import { EvidenceTypes, KillMethods, ContradictionTypes } from './DataTypes.js';

export class CaseEngine {
    constructor() {
        /** @type {import('./DataTypes.js').Case|null} */
        this.currentCase = null;
        this.isLoaded = false;
    }

    /**
     * Load a case from JSON data
     * @param {string|Object} caseData - JSON string or parsed object
     * @returns {Promise<import('./DataTypes.js').Case>}
     */
    async loadCase(caseData) {
        try {
            const caseObj = typeof caseData === 'string' 
                ? JSON.parse(caseData) 
                : caseData;

            // Validate required fields
            this.validateCaseStructure(caseObj);

            this.currentCase = caseObj;
            this.isLoaded = true;

            console.log(`✓ Case loaded: ${this.currentCase.title}`);
            console.log(`  - ${this.currentCase.kills.length} kills`);
            console.log(`  - ${this.currentCase.suspects.length} suspects`);
            console.log(`  - ${this.currentCase.evidence.length} pieces of evidence`);

            return this.currentCase;
        } catch (error) {
            console.error('Failed to load case:', error);
            throw error;
        }
    }

    /**
     * Load a case from a file path
     * @param {string} filePath - Path to JSON file
     * @returns {Promise<import('./DataTypes.js').Case>}
     */
    async loadCaseFromFile(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to fetch case file: ${response.statusText}`);
            }
            const caseData = await response.json();
            return this.loadCase(caseData);
        } catch (error) {
            console.error(`Error loading case from ${filePath}:`, error);
            throw error;
        }
    }

    /**
     * Validate case structure has all required fields
     * @param {Object} caseObj - Case object to validate
     * @throws {Error} If validation fails
     */
    validateCaseStructure(caseObj) {
        const required = ['id', 'title', 'kills', 'suspects', 'evidence', 'contradictions'];
        
        for (const field of required) {
            if (!(field in caseObj)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        if (!Array.isArray(caseObj.kills) || caseObj.kills.length === 0) {
            throw new Error('Case must have at least one kill');
        }

        if (!Array.isArray(caseObj.suspects) || caseObj.suspects.length < 2) {
            throw new Error('Case must have at least 2 suspects');
        }

        // Verify exactly one Kira exists
        const kiraCount = caseObj.suspects.filter(s => s.isKira).length;
        if (kiraCount !== 1) {
            throw new Error(`Case must have exactly 1 Kira, found ${kiraCount}`);
        }
    }

    /**
     * Get all evidence for a specific kill
     * @param {number} killIndex - Which kill (0, 1, 2)
     * @returns {import('./DataTypes.js').Evidence[]}
     */
    getEvidenceForKill(killIndex) {
        if (!this.isLoaded) return [];
        return this.currentCase.evidence.filter(e => e.killIndex === killIndex);
    }

    /**
     * Get evidence by ID
     * @param {string} evidenceId - Evidence identifier
     * @returns {import('./DataTypes.js').Evidence|null}
     */
    getEvidence(evidenceId) {
        if (!this.isLoaded) return null;
        return this.currentCase.evidence.find(e => e.id === evidenceId) || null;
    }

    /**
     * Get suspect by ID
     * @param {string} suspectId - Suspect identifier
     * @returns {import('./DataTypes.js').Suspect|null}
     */
    getSuspect(suspectId) {
        if (!this.isLoaded) return null;
        return this.currentCase.suspects.find(s => s.id === suspectId) || null;
    }

    /**
     * Get the true Kira
     * @returns {import('./DataTypes.js').Suspect|null}
     */
    getKira() {
        if (!this.isLoaded) return null;
        return this.currentCase.suspects.find(s => s.isKira) || null;
    }

    /**
     * Get kill by index
     * @param {number} killIndex - Kill number
     * @returns {import('./DataTypes.js').Kill|null}
     */
    getKill(killIndex) {
        if (!this.isLoaded) return null;
        return this.currentCase.kills[killIndex] || null;
    }

    /**
     * Get contradictions for a suspect
     * @param {string} suspectId - Suspect identifier
     * @returns {import('./DataTypes.js').Contradiction[]}
     */
    getContradictionsForSuspect(suspectId) {
        if (!this.isLoaded) return [];
        return this.currentCase.contradictions.filter(c => c.suspectId === suspectId);
    }

    /**
     * Export current case to JSON
     * @returns {string} JSON string
     */
    exportCase() {
        if (!this.isLoaded) {
            throw new Error('No case loaded to export');
        }
        return JSON.stringify(this.currentCase, null, 2);
    }

    /**
     * Create a new empty case template
     * @param {string} title - Case title
     * @returns {import('./DataTypes.js').Case}
     */
    static createEmptyCase(title) {
        return {
            id: `case_${Date.now()}`,
            title: title,
            description: '',
            kills: [],
            suspects: [],
            evidence: [],
            contradictions: [],
            metadata: {
                totalKills: 0,
                difficulty: 'medium',
                createdBy: 'kira_mode'
            }
        };
    }
}
