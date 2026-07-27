/**
 * Rule-Based AI Recommendation Engine (Module 6)
 * Analyzes evaluation results and generates targeted structural design recommendations.
 */

const generateRecommendations = (evaluation) => {
    const {
        ultimateLoadStatus,
        deflectionStatus,
        ductilityStatus,
        energyStatus,
        failureStatus
    } = evaluation;

    const recommendations = [];

    // Rule 1: Ultimate Load Capacity Recommendations
    if (ultimateLoadStatus !== 'PASS') {
        recommendations.push({
            title: "Increase Beam Depth",
            description: "Increasing section depth by 50 mm will significantly enhance the plastic section modulus (Zx) and ultimate bending capacity.",
            expectedBenefit: "+15–25% Load Capacity",
            priority: "High",
            icon: "aspect_ratio"
        });
        recommendations.push({
            title: "Upgrade Concrete Grade",
            description: "Upgrading concrete compressive grade increases flexural zone resistance and diagonal crush capacity.",
            expectedBenefit: "+10% Load Resilience",
            priority: "Medium",
            icon: "view_in_ar"
        });
    }

    // Rule 2: Deflection Recommendations
    if (deflectionStatus !== 'PASS') {
        recommendations.push({
            title: "Increase Section Flexural Stiffness",
            description: "Increasing section depth or flange width improves section moment of inertia (I), suppressing serviceability deflections.",
            expectedBenefit: "-30% Mid-span Deflection",
            priority: "High",
            icon: "straighten"
        });
    }

    // Rule 3: Ductility Recommendations
    if (ductilityStatus === 'POOR') {
        recommendations.push({
            title: "Optimize Tensile & Confinement Reinforcement",
            description: "Adjust reinforcement ratio and add compression steel to promote ductile failure behavior over brittle crushing.",
            expectedBenefit: "Ductile Failure Mode Guaranteed",
            priority: "High",
            icon: "tune"
        });
    }

    // Rule 4: Energy Dissipation Recommendations
    if (energyStatus !== 'EXCELLENT') {
        recommendations.push({
            title: "Improve Plastic Hinge Confinement",
            description: "Use closely spaced transverse ties in critical regions to maximize hysteretic energy dissipation under cyclic loads.",
            expectedBenefit: "Higher Cyclic Resiliency",
            priority: "Medium",
            icon: "all_inclusive"
        });
    }

    // Rule 5: Failure Mode Shear Recommendations
    if (failureStatus === 'CRITICAL' || failureStatus === 'WARNING') {
        recommendations.push({
            title: "Reduce Stirrup Spacing & Add Shear Steel",
            description: "Reduce stirrup spacing to 100 mm and increase stirrup bar diameter to resist diagonal tension web shear.",
            expectedBenefit: "Shifts Brittle Shear to Ductile Flexure",
            priority: "High",
            icon: "layers"
        });
    }

    // Default optimization recommendation if section passes all limit states
    if (recommendations.length === 0) {
        recommendations.push({
            title: "Optimize Section Material Weight",
            description: "Structural design fully satisfies AISC / Eurocode ULS and SLS limits. Section can be optimized to save steel weight.",
            expectedBenefit: "10–15% Weight & Carbon Reduction",
            priority: "Low",
            icon: "verified"
        });
    }

    return recommendations;
};

module.exports = {
    generateRecommendations
};
