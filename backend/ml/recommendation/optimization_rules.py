# ============================================================
# AI-Powered Structural Decision Support Platform
# Module: Recommendation Engine - Optimization Rules
#
# File : optimization_rules.py
# Purpose: Core engineering decision logic executing targeted
#          rules based on beam mechanics, ML predictions, and SHAP.
# ============================================================

from .recommendation_utils import allowable_deflection

class OptimizationRuleEngine:
    """
    Engineering Rule Engine for Structural Beam Optimization.
    """

    def __init__(self):
        pass

    def evaluate_all_rules(self, beam_inputs: dict, prediction_results: dict, shap_features: list, health_score: float) -> list:
        """
        Evaluate all engineering rules in order of structural priority.
        Returns a list of triggered rule result dictionaries.
        """
        triggered_rules = []

        # Extract normalized beam parameters
        width = float(beam_inputs.get("Width", 300.0))
        depth = float(beam_inputs.get("Depth", 450.0))
        span = float(beam_inputs.get("Span", 5000.0))
        fc = float(beam_inputs.get("Concrete_Strength", 30.0))
        pten = float(beam_inputs.get("Tension Reinforcement Ratio, pten (%)", 1.2))
        n_legs = float(beam_inputs.get("# Stirrup Legs", 2.0))
        s_spacing = float(beam_inputs.get("Stirrup Spacing, s (mm)", 150.0))
        d_bar = float(beam_inputs.get("Diameter Tensile Bars, db,t (mm)", 20.0))
        n_bars = float(beam_inputs.get("# Tensile Bars", 4.0))

        # Extract prediction results
        pmax = float(prediction_results.get("pmax", 250.0))
        delta_ult = float(prediction_results.get("delta_ult", 20.0))
        failure_mode = str(prediction_results.get("failure_mode", "")).strip().lower()

        # Serviceability deflection check
        delta_service = delta_ult / 1.5
        allowable = allowable_deflection(span)

        # Map SHAP feature importances into dictionary for quick lookup
        shap_dict = {}
        for sf in shap_features:
            if isinstance(sf, dict) and "feature" in sf and "importance" in sf:
                shap_dict[sf["feature"]] = float(sf["importance"])

        # ------------------------------------------------------------
        # RULE 1: Excessive Deflection (Serviceability Limit Failure)
        # ------------------------------------------------------------
        if delta_service > allowable:
            over_pct = ((delta_service - allowable) / allowable) * 100.0
            # Target depth calculation to bring I_x up to required stiffness
            # I_required / I_current = delta_service / allowable = (h_rec / h_current)^3
            stiffness_ratio = delta_service / allowable
            h_rec_raw = depth * (stiffness_ratio ** (1.0 / 3.0))
            # Round up to nearest 25 mm increment
            rec_depth = int((math_ceil(h_rec_raw) + 24) // 25) * 25.0
            rec_depth = max(depth + 25.0, rec_depth)

            i_increase = ((rec_depth / depth) ** 3 - 1.0) * 100.0
            depth_shap = shap_dict.get("Depth", shap_dict.get("Span", 0.35))

            triggered_rules.append({
                "rule_id": "RULE_DEFLECTION",
                "severity": "CRITICAL" if over_pct > 30 else "HIGH",
                "impact_rating": 5,
                "primary_issue_key": "EXCESSIVE_DEFLECTION",
                "root_cause_key": "EXCESSIVE_DEFLECTION",
                "root_cause_params": {
                    "delta_service": delta_service,
                    "allowable": allowable,
                    "over_pct": over_pct,
                    "depth": depth,
                    "span": span
                },
                "action_key": "INCREASE_DEPTH",
                "action_params": {
                    "rec_depth": rec_depth,
                    "current_depth": depth,
                    "span": span,
                    "i_increase": i_increase
                },
                "target_feature": "Depth",
                "shap_importance": depth_shap,
                "old_val": depth,
                "new_val": rec_depth,
                "action_type": "INCREASE_DEPTH",
                "expected_health_score": min(98.0, health_score + min(35.0, 15.0 + over_pct * 0.4))
            })

        # ------------------------------------------------------------
        # RULE 2: Brittle Shear Failure / Flexure-Shear Mode
        # ------------------------------------------------------------
        is_shear = "shear" in failure_mode
        is_flexure_shear = "flexure-shear" in failure_mode or "shear-flexure" in failure_mode

        if is_shear or is_flexure_shear:
            rec_spacing = max(75.0, float(int((s_spacing * 0.75) // 25) * 25))
            rec_legs = int(n_legs + 2) if s_spacing <= 100.0 else int(n_legs)
            spacing_shap = shap_dict.get("Stirrup_Spacing", shap_dict.get("Num_Stirrup_Legs", 0.30))

            triggered_rules.append({
                "rule_id": "RULE_SHEAR_FAILURE",
                "severity": "CRITICAL" if is_shear else "HIGH",
                "impact_rating": 5 if is_shear else 4,
                "primary_issue_key": "SHEAR_FAILURE_RISK" if is_shear else "FLEXURE_SHEAR_MODE",
                "root_cause_key": "SHEAR_FAILURE_RISK" if is_shear else "FLEXURE_SHEAR_MODE",
                "root_cause_params": {
                    "s_spacing": s_spacing,
                    "n_legs": int(n_legs)
                },
                "action_key": "REDUCE_STIRRUP_SPACING",
                "action_params": {
                    "rec_spacing": rec_spacing,
                    "current_spacing": s_spacing,
                    "n_legs": int(n_legs),
                    "rec_legs": rec_legs
                },
                "target_feature": "Stirrup Spacing, s (mm)",
                "shap_importance": spacing_shap,
                "old_val": s_spacing,
                "new_val": rec_spacing,
                "action_type": "REDUCE_STIRRUP_SPACING",
                "expected_health_score": min(98.0, health_score + (22.0 if is_shear else 15.0))
            })

        # ------------------------------------------------------------
        # RULE 3: Over-Reinforced Section (Brittle Failure Risk)
        # ------------------------------------------------------------
        is_over_reinforced = "over" in failure_mode or "compression" in failure_mode or pten > 2.5
        if is_over_reinforced and not any(r["rule_id"] == "RULE_DEFLECTION" for r in triggered_rules):
            rec_pten = min(1.8, max(0.8, pten * 0.75))
            steel_shap = shap_dict.get("Tension_Reinforcement_Ratio", 0.28)

            triggered_rules.append({
                "rule_id": "RULE_OVER_REINFORCED",
                "severity": "HIGH",
                "impact_rating": 4,
                "primary_issue_key": "OVER_REINFORCED_SECTION",
                "root_cause_key": "OVER_REINFORCED_SECTION",
                "root_cause_params": {
                    "pten": pten
                },
                "action_key": "REDUCE_STEEL",
                "action_params": {
                    "current_pten": pten,
                    "rec_pten": rec_pten
                },
                "target_feature": "Tension Reinforcement Ratio, pten (%)",
                "shap_importance": steel_shap,
                "old_val": pten,
                "new_val": rec_pten,
                "action_type": "REDUCE_STEEL",
                "expected_health_score": min(98.0, health_score + 18.0)
            })

        # ------------------------------------------------------------
        # RULE 4: Low Concrete Strength
        # ------------------------------------------------------------
        if fc < 25.0 or (pmax < 200.0 and fc <= 30.0 and not triggered_rules):
            rec_fc = 35.0 if fc <= 25.0 else 40.0
            fc_shap = shap_dict.get("Concrete_Strength", 0.25)

            triggered_rules.append({
                "rule_id": "RULE_LOW_CONCRETE",
                "severity": "MEDIUM",
                "impact_rating": 3,
                "primary_issue_key": "LOW_CONCRETE_STRENGTH",
                "root_cause_key": "LOW_CONCRETE_STRENGTH",
                "root_cause_params": {
                    "fc": fc
                },
                "action_key": "UPGRADE_CONCRETE",
                "action_params": {
                    "current_fc": fc,
                    "rec_fc": rec_fc
                },
                "target_feature": "Concrete_Strength",
                "shap_importance": fc_shap,
                "old_val": fc,
                "new_val": rec_fc,
                "action_type": "UPGRADE_CONCRETE",
                "expected_health_score": min(98.0, health_score + 12.0)
            })

        # ------------------------------------------------------------
        # RULE 5: Low Reinforcement Ratio
        # ------------------------------------------------------------
        if pten < 0.6 and not triggered_rules:
            rec_pten = 1.0
            rec_bars = int(n_bars + 2)
            steel_shap = shap_dict.get("Tension_Reinforcement_Ratio", 0.25)

            triggered_rules.append({
                "rule_id": "RULE_LOW_STEEL",
                "severity": "MEDIUM",
                "impact_rating": 3,
                "primary_issue_key": "LOW_REINFORCEMENT_RATIO",
                "root_cause_key": "LOW_REINFORCEMENT_RATIO",
                "root_cause_params": {
                    "pten": pten,
                    "pmax": pmax
                },
                "action_key": "INCREASE_STEEL",
                "action_params": {
                    "current_pten": pten,
                    "rec_pten": rec_pten,
                    "n_bars": int(n_bars),
                    "d_bar": d_bar,
                    "rec_bars": rec_bars
                },
                "target_feature": "Tension Reinforcement Ratio, pten (%)",
                "shap_importance": steel_shap,
                "old_val": pten,
                "new_val": rec_pten,
                "action_type": "INCREASE_STEEL",
                "expected_health_score": min(98.0, health_score + 15.0)
            })

        # ------------------------------------------------------------
        # RULE 6: Poor Health Score (Compound Deficiencies)
        # ------------------------------------------------------------
        if health_score < 60.0 and len(triggered_rules) >= 2:
            # Combine multi-optimization action
            rec_depth = depth * 1.15
            rec_fc = max(fc + 10.0, 35.0)
            rec_spacing = max(100.0, s_spacing * 0.8)
            shap_max = max(shap_dict.values()) if shap_dict else 0.35

            triggered_rules.append({
                "rule_id": "RULE_POOR_HEALTH_MULTI",
                "severity": "HIGH",
                "impact_rating": 5,
                "primary_issue_key": "POOR_HEALTH_SCORE",
                "root_cause_key": "POOR_HEALTH_SCORE",
                "root_cause_params": {
                    "health_score": health_score
                },
                "action_key": "MULTI_OPTIMIZATION",
                "action_params": {
                    "current_depth": depth,
                    "rec_depth": rec_depth,
                    "current_fc": fc,
                    "rec_fc": rec_fc,
                    "current_spacing": s_spacing,
                    "rec_spacing": rec_spacing
                },
                "target_feature": "Multiple (Depth, fc, Stirrups)",
                "shap_importance": shap_max,
                "old_val": depth,
                "new_val": rec_depth,
                "action_type": "MULTI_OPTIMIZATION",
                "expected_health_score": min(96.0, health_score + 35.0)
            })

        # ------------------------------------------------------------
        # RULE 7: Optimal Design (No Critical Deficiencies)
        # ------------------------------------------------------------
        if not triggered_rules:
            shap_max = max(shap_dict.values()) if shap_dict else 0.20
            triggered_rules.append({
                "rule_id": "RULE_OPTIMAL",
                "severity": "LOW",
                "impact_rating": 3,
                "primary_issue_key": "OPTIMAL_DESIGN",
                "root_cause_key": "OPTIMAL_DESIGN",
                "root_cause_params": {
                    "health_score": health_score
                },
                "action_key": "SUSTAINABILITY_OPTIMIZATION",
                "action_params": {
                    "pmax": pmax,
                    "health_score": health_score
                },
                "target_feature": "Section Geometry",
                "shap_importance": shap_max,
                "old_val": width,
                "new_val": width - 25.0,
                "action_type": "SUSTAINABILITY_OPTIMIZATION",
                "expected_health_score": health_score
            })

        return triggered_rules


def math_ceil(val):
    import math
    return math.ceil(val)
