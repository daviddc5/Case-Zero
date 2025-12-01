/**
 * ContradictionValidator - Logic engine to detect conflicts and inconsistencies
 */

import { ContradictionTypes } from './DataTypes.js';

export class ContradictionValidator {
    /**
     * @param {import('./DataTypes.js').Case} caseData
     */
    constructor(caseData) {
        this.case = caseData;
    }

    /**
     * Check if a suspect's alibi contradicts the kill time
     * @param {string} suspectId - Suspect to check
     * @param {number} killIndex - Which kill
     * @returns {Object|null} Contradiction details or null
     */
    checkAlibiVsKillTime(suspectId, killIndex) {
        const suspect = this.case.suspects.find(s => s.id === suspectId);
        const kill = this.case.kills[killIndex];

        if (!suspect || !kill) return null;

        const alibiAtKillTime = suspect.alibi.timeline.find(
            t => t.hour === kill.victim.timeOfDeath
        );

        if (!alibiAtKillTime) {
            return {
                type: ContradictionTypes.ALIBI_TIME,
                description: `${suspect.name} has no alibi for hour ${kill.victim.timeOfDeath}`,
                severity: 'high'
            };
        }

        // Check if location matches kill location
        if (alibiAtKillTime.location === kill.victim.location) {
            return {
                type: ContradictionTypes.ALIBI_TIME,
                description: `${suspect.name} was at ${kill.victim.location} during time of death`,
                severity: 'critical'
            };
        }

        return null;
    }

    /**
     * Check if CCTV evidence contradicts a suspect's claimed location
     * @param {string} suspectId - Suspect to check
     * @param {string} evidenceId - CCTV evidence ID
     * @returns {Object|null} Contradiction details or null
     */
    checkCCTVContradiction(suspectId, evidenceId) {
        const suspect = this.case.suspects.find(s => s.id === suspectId);
        const evidence = this.case.evidence.find(e => e.id === evidenceId);

        if (!suspect || !evidence || evidence.type !== 'cctv') return null;

        const { hour, location, capturedPerson } = evidence.metadata;

        if (capturedPerson !== suspectId) return null;

        const alibiAtTime = suspect.alibi.timeline.find(t => t.hour === hour);

        if (alibiAtTime && alibiAtTime.location !== location) {
            return {
                type: ContradictionTypes.EVIDENCE_CONFLICT,
                description: `${suspect.name} claimed to be at ${alibiAtTime.location} at ${hour}:00, but CCTV shows them at ${location}`,
                severity: 'critical'
            };
        }

        return null;
    }

    /**
     * Check if timeline has impossible travel times
     * @param {string} suspectId - Suspect to check
     * @returns {Object|null} Contradiction details or null
     */
    checkImpossibleTravel(suspectId) {
        const suspect = this.case.suspects.find(s => s.id === suspectId);
        if (!suspect) return null;

        const timeline = suspect.alibi.timeline.sort((a, b) => a.hour - b.hour);

        // Simple distance map (could be expanded)
        const travelTimes = {
            'downtown_to_suburbs': 2,
            'office_to_home': 1,
            'apartment_to_bridge': 1
        };

        for (let i = 0; i < timeline.length - 1; i++) {
            const current = timeline[i];
            const next = timeline[i + 1];
            
            const hourDiff = next.hour - current.hour;
            
            // Check if locations are too far apart for time gap
            if (hourDiff === 1 && current.location !== next.location) {
                const key = `${current.location}_to_${next.location}`;
                const reverseKey = `${next.location}_to_${current.location}`;
                
                const requiredTime = travelTimes[key] || travelTimes[reverseKey];
                
                if (requiredTime && requiredTime > hourDiff) {
                    return {
                        type: ContradictionTypes.TIMELINE_IMPOSSIBLE,
                        description: `${suspect.name} couldn't travel from ${current.location} to ${next.location} in ${hourDiff} hour(s)`,
                        severity: 'high'
                    };
                }
            }
        }

        return null;
    }

    /**
     * Validate all contradictions in the case
     * @returns {Object} Validation results
     */
    validateAllContradictions() {
        const results = {
            valid: [],
            invalid: [],
            missing: []
        };

        for (const contradiction of this.case.contradictions) {
            let validator = null;

            switch (contradiction.type) {
                case ContradictionTypes.ALIBI_TIME:
                    // Check if alibi actually conflicts
                    validator = this.checkAlibiVsKillTime(
                        contradiction.suspectId,
                        contradiction.evidenceIds[0] // killIndex stored here
                    );
                    break;
                
                case ContradictionTypes.EVIDENCE_CONFLICT:
                    // Check CCTV or other evidence
                    validator = this.checkCCTVContradiction(
                        contradiction.suspectId,
                        contradiction.evidenceIds[0]
                    );
                    break;
            }

            if (validator) {
                results.valid.push(contradiction);
            } else {
                results.invalid.push(contradiction);
            }
        }

        return results;
    }

    /**
     * Find all potential contradictions for a suspect
     * @param {string} suspectId - Suspect to analyze
     * @returns {Object[]} Array of found contradictions
     */
    findContradictionsForSuspect(suspectId) {
        const found = [];

        // Check alibi vs all kills
        for (let i = 0; i < this.case.kills.length; i++) {
            const alibiCheck = this.checkAlibiVsKillTime(suspectId, i);
            if (alibiCheck) {
                found.push({ ...alibiCheck, killIndex: i });
            }
        }

        // Check CCTV evidence
        const cctvEvidence = this.case.evidence.filter(e => e.type === 'cctv');
        for (const evidence of cctvEvidence) {
            const cctvCheck = this.checkCCTVContradiction(suspectId, evidence.id);
            if (cctvCheck) {
                found.push({ ...cctvCheck, evidenceId: evidence.id });
            }
        }

        // Check impossible travel
        const travelCheck = this.checkImpossibleTravel(suspectId);
        if (travelCheck) {
            found.push(travelCheck);
        }

        return found;
    }

    /**
     * Check if player has found the key contradictions to solve the case
     * @param {string[]} foundContradictionIds - IDs player has discovered
     * @returns {boolean} True if case can be solved
     */
    canSolveCase(foundContradictionIds) {
        const keyContradictions = this.case.contradictions.filter(c => c.isKeyContradiction);
        const foundKey = keyContradictions.filter(kc => 
            foundContradictionIds.includes(kc.id)
        );

        // Must find at least 1 key contradiction
        return foundKey.length > 0;
    }
}
