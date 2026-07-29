# ============================================================
# AI-Powered Structural Decision Support Platform
# Module: Recommendation Engine - Templates
#
# File : recommendation_templates.py
# Purpose: Externalized message templates, issue descriptions,
#          root causes, and recommendation text placeholders.
# ============================================================

"""
Recommendation Templates Repository

This module contains template definitions for:
- Structural Statuses
- Primary Issues
- Root Causes
- Recommendation Titles, Current Values, Recommended Values
- SHAP Justification Statements
- Executive Summaries
"""

# Structural Status Options
STATUS_TEMPLATES = {
    "OPTIMAL": "Optimal",
    "WARNING": "Warning",
    "CRITICAL": "Critical",
    "NEEDS_IMPROVEMENT": "Needs Improvement"
}

# Primary Issue Templates
PRIMARY_ISSUE_TEMPLATES = {
    "EXCESSIVE_DEFLECTION": "Excessive Serviceability Deflection (L/250 Limit Exceeded)",
    "LOW_CONCRETE_STRENGTH": "Sub-optimal Concrete Compressive Strength Grade",
    "SHEAR_FAILURE_RISK": "Brittle Shear Failure Mode Predicted under Ultimate Load",
    "FLEXURE_SHEAR_MODE": "Combined Flexure-Shear Failure Mode Detected",
    "LOW_REINFORCEMENT_RATIO": "Low Tensile Reinforcement Ratio below Flexural Capacity Target",
    "OVER_REINFORCED_SECTION": "Over-Reinforced Section (Brittle Concrete Crushing Risk)",
    "POOR_HEALTH_SCORE": "Multiple Structural Performance Penalties Detected",
    "OPTIMAL_DESIGN": "None (Section Fully Satisfies Strength, Serviceability & Ductility Limits)"
}

# Root Cause Templates
ROOT_CAUSE_TEMPLATES = {
    "EXCESSIVE_DEFLECTION": (
        "Calculated working deflection ({delta_service:.1f} mm) exceeds the allowable L/250 limit ({allowable:.1f} mm) "
        "by {over_pct:.1f}% due to inadequate section depth ({depth:.0f} mm) relative to span ({span:.0f} mm)."
    ),
    "LOW_CONCRETE_STRENGTH": (
        "Concrete compressive strength f_c = {fc:.1f} MPa is insufficient for the flexural zone stress demand "
        "and diagonal compression shear resistance."
    ),
    "SHEAR_FAILURE_RISK": (
        "Transverse shear capacity is insufficient due to wide stirrup spacing (s = {s_spacing:.0f} mm) "
        "or inadequate stirrup leg confinement ({n_legs} legs), causing brittle web shear collapse."
    ),
    "FLEXURE_SHEAR_MODE": (
        "Diagonal tension cracking in shear zone initiates prior to flexural yield at stirrup spacing s = {s_spacing:.0f} mm."
    ),
    "LOW_REINFORCEMENT_RATIO": (
        "Tension reinforcement ratio (pten = {pten:.2f}%) provides inadequate ultimate flexural capacity "
        "P_max ({pmax:.1f} kN) for long-span loading."
    ),
    "OVER_REINFORCED_SECTION": (
        "Tension reinforcement ratio (pten = {pten:.2f}%) exceeds balanced steel ratio, forcing concrete compression crushing "
        "before steel yielding."
    ),
    "POOR_HEALTH_SCORE": (
        "Overall beam health score is low ({health_score:.1f}/100) due to compound deficiencies across deflection, "
        "capacity, and failure mode criteria."
    ),
    "OPTIMAL_DESIGN": (
        "The beam design achieves a high structural health score ({health_score:.1f}/100) with balanced capacity, "
        "deflection control, and guaranteed ductile yield."
    )
}

# Recommendation Action Item Templates
RECOMMENDATION_ITEM_TEMPLATES = {
    "INCREASE_DEPTH": {
        "title": "Increase Beam Section Depth to {rec_depth:.0f} mm",
        "current": "Section Depth h = {current_depth:.0f} mm (Span L = {span:.0f} mm)",
        "recommended": "Increase Section Depth h to {rec_depth:.0f} mm (Increases moment of inertia I_x by {i_increase:.1f}%)"
    },
    "UPGRADE_CONCRETE": {
        "title": "Upgrade Concrete Compressive Strength to {rec_fc:.0f} MPa",
        "current": "Concrete Strength Grade f_c = {current_fc:.0f} MPa",
        "recommended": "Upgrade Concrete Grade f_c to {rec_fc:.0f} MPa (Boosts concrete shear & crush limit)"
    },
    "REDUCE_STIRRUP_SPACING": {
        "title": "Reduce Transverse Stirrup Spacing to s = {rec_spacing:.0f} mm",
        "current": "Stirrup Spacing s = {current_spacing:.0f} mm ({n_legs} legs)",
        "recommended": "Reduce Stirrup Spacing to s = {rec_spacing:.0f} mm (or increase to {rec_legs} legs)"
    },
    "INCREASE_STEEL": {
        "title": "Increase Tensile Reinforcement Steel Area",
        "current": "Tension Reinforcement Ratio pten = {current_pten:.2f}% ({n_bars} bars @ {d_bar} mm)",
        "recommended": "Increase Tension Steel to pten ≈ {rec_pten:.2f}% ({rec_bars} bars @ {d_bar} mm)"
    },
    "REDUCE_STEEL": {
        "title": "Reduce Tensile Steel Area to Ensure Tension-Controlled Ductility",
        "current": "Tension Reinforcement Ratio pten = {current_pten:.2f}% (Over-reinforced)",
        "recommended": "Reduce Tension Steel to pten ≤ {rec_pten:.2f}% to achieve ductile yielding before compression crushing"
    },
    "MULTI_OPTIMIZATION": {
        "title": "Comprehensive Section Respecification & Geometry Adjustment",
        "current": "Depth = {current_depth:.0f} mm, f_c = {current_fc:.0f} MPa, s = {current_spacing:.0f} mm",
        "recommended": "Set Depth = {rec_depth:.0f} mm, f_c = {rec_fc:.0f} MPa, Stirrup Spacing s = {rec_spacing:.0f} mm"
    },
    "SUSTAINABILITY_OPTIMIZATION": {
        "title": "Material Weight & Embodied Carbon Optimization",
        "current": "Fully compliant design (P_max = {pmax:.1f} kN, Health Score = {health_score:.1f})",
        "recommended": "Optimize section width by 25–50 mm to reduce material volume while retaining > 90% structural margin"
    }
}

# SHAP Justification Templates
SHAP_JUSTIFICATION_TEMPLATES = {
    "DOMINANT_FEATURE": (
        "SHAP feature importance analysis indicates that '{feature_name}' is the top controlling parameter "
        "(importance: {importance_pct:.1f}%), confirming that targeting {feature_alias} yields the highest impact."
    ),
    "MULTI_FEATURE": (
        "SHAP feature importance attributes key influence to {feature_list}, justifying parameter tuning across these dimensions."
    ),
    "GENERAL": (
        "SHAP global feature contribution confirms {feature_name} significantly governs the model's structural capacity prediction."
    )
}

# Executive Summary Templates
SUMMARY_TEMPLATES = {
    "DEFLECTION_DRIVEN": (
        "Structural evaluation indicates an overall health score of {health_score:.1f}/100, driven primarily by an L/250 "
        "serviceability deflection breach of {over_pct:.1f}%. {action_summary} {shap_justification}"
    ),
    "SHEAR_DRIVEN": (
        "Beam design exhibits a brittle shear failure risk under ultimate load, producing a health score of {health_score:.1f}/100. "
        "{action_summary} {shap_justification}"
    ),
    "DUCTILITY_DRIVEN": (
        "Beam section is over-reinforced, creating brittle failure hazards. {action_summary} {shap_justification}"
    ),
    "GENERAL_WARNING": (
        "Beam design requires optimization (Health Score: {health_score:.1f}/100). {action_summary} {shap_justification}"
    ),
    "OPTIMAL_SUMMARY": (
        "Beam section demonstrates high performance across all criteria with a Beam Health Score of {health_score:.1f}/100. "
        "{action_summary} {shap_justification}"
    )
}
