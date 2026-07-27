/**
 * Evaluation Engine (Module 5)
 * Assesses predicted structural engineering parameters against code limit states
 * and computes a weighted Beam Health Score (0-100).
 */

const evaluatePredictions = (predictions) => {
    const {
        ultimateLoad = 0,
        ultimateDeflection = 0,
        deflection = 0,
        ductility = 0,
        energy = 0,
        energyDissipation = 0,
        failureMode = 'Flexure'
    } = predictions;

    const load = ultimateLoad || predictions.pmax || 0;
    const defl = ultimateDeflection || deflection;
    const nrg = energy || energyDissipation;

    // 1. Ultimate Load Status (>250 PASS, 180-250 WARNING, <180 FAIL)
    let ultimateLoadStatus = 'FAIL';
    if (load > 250) ultimateLoadStatus = 'PASS';
    else if (load >= 180) ultimateLoadStatus = 'WARNING';

    // 2. Deflection Status (<10 PASS, 10-20 WARNING, >20 FAIL)
    let deflectionStatus = 'FAIL';
    if (defl < 10) deflectionStatus = 'PASS';
    else if (defl <= 20) deflectionStatus = 'WARNING';

    // 3. Ductility Status (>4 Excellent, 2-4 Good, <2 Poor)
    let ductilityStatus = 'POOR';
    if (ductility > 4) ductilityStatus = 'EXCELLENT';
    else if (ductility >= 2) ductilityStatus = 'GOOD';

    // 4. Energy Dissipation Status (>1500 Excellent, 800-1500 Moderate, <800 Low)
    let energyStatus = 'LOW';
    if (nrg > 1500) energyStatus = 'EXCELLENT';
    else if (nrg >= 800) energyStatus = 'MODERATE';

    // 5. Failure Mode Status (Flexure -> Preferred, Flexure-Shear -> Warning, Shear -> Critical)
    let failureStatus = 'CRITICAL';
    const modeNormalized = (failureMode || '').toLowerCase();
    if (modeNormalized.includes('flexure') && !modeNormalized.includes('shear')) {
        failureStatus = 'PREFERRED';
    } else if (modeNormalized.includes('flexure-shear') || modeNormalized.includes('flexureshear')) {
        failureStatus = 'WARNING';
    } else if (modeNormalized.includes('shear')) {
        failureStatus = 'CRITICAL';
    } else {
        failureStatus = 'PREFERRED';
    }

    // --- BEAM HEALTH SCORE CALCULATION (0 - 100) ---
    // Weighted scoring: Load 40%, Ductility 25%, Energy 20%, Failure Mode 15%
    const scoreLoad = Math.min(100, Math.max(0, (load / 300) * 100));
    const scoreDuctility = Math.min(100, Math.max(0, (ductility / 5.0) * 100));
    const scoreEnergy = Math.min(100, Math.max(0, (nrg / 2000) * 100));
    
    let scoreFailure = 20;
    if (failureStatus === 'PREFERRED') scoreFailure = 100;
    else if (failureStatus === 'WARNING') scoreFailure = 60;

    const beamHealth = Math.round(
        (scoreLoad * 0.40) + 
        (scoreDuctility * 0.25) + 
        (scoreEnergy * 0.20) + 
        (scoreFailure * 0.15)
    );

    // Overall Status
    let overallStatus = 'FAIL';
    if (beamHealth >= 80) overallStatus = 'PASS';
    else if (beamHealth >= 60) overallStatus = 'WARNING';

    return {
        beamHealth,
        overallStatus,
        ultimateLoadStatus,
        deflectionStatus,
        ductilityStatus,
        energyStatus,
        failureStatus,
        metrics: {
            ultimateLoad: load,
            deflection: defl,
            ductility,
            energy: nrg,
            failureMode
        }
    };
};

module.exports = {
    evaluatePredictions
};
