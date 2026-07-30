# ============================================================
# AI-Powered Structural Decision Support Platform
# Module: Recommendation Engine - Core Orchestrator
#
# File : recommendation_engine.py
# Purpose: Accepts beam inputs, predictions, SHAP, & health score;
#          runs optimization rules; ranks recommendations; and
#          formats structured JSON response without hardcoded strings.
# ============================================================

import json
from .optimization_rules import OptimizationRuleEngine
from .recommendation_templates import (
    STATUS_TEMPLATES,
    PRIMARY_ISSUE_TEMPLATES,
    ROOT_CAUSE_TEMPLATES,
    RECOMMENDATION_ITEM_TEMPLATES,
    SHAP_JUSTIFICATION_TEMPLATES,
    SUMMARY_TEMPLATES
)
from .recommendation_utils import (
    estimate_capacity_gain,
    estimate_deflection_reduction,
    estimate_cost_impact,
    calculate_priority,
    calculate_confidence,
    convert_impact_stars
)

class RecommendationEngine:
    """
    AI-Assisted Structural Recommendation Engine.
    """

    def __init__(self):
        self.rule_engine = OptimizationRuleEngine()

    def generate(self, beam_inputs: dict, prediction_results: dict, shap_output: list, beam_health_score: float) -> dict:
        """
        Generate structured AI engineering recommendation payload.

        :param beam_inputs: Normalized beam parameter dictionary
        :param prediction_results: Dict containing pmax, delta_ult, failure_mode
        :param shap_output: List of top SHAP feature dictionaries
        :param beam_health_score: Overall structural health score (0-100)
        :return: Dict conforming to exact API JSON specification
        """
        health_score = float(beam_health_score)

        # Normalize SHAP output into list format
        shap_features = []
        if isinstance(shap_output, list):
            shap_features = shap_output
        elif isinstance(shap_output, dict) and "top_features" in shap_output:
            shap_features = shap_output["top_features"]

        # Evaluate engineering optimization rules
        triggered_rules = self.rule_engine.evaluate_all_rules(
            beam_inputs, prediction_results, shap_features, health_score
        )

        # Primary rule determines overall status, primary issue, and root cause
        primary_rule = triggered_rules[0] if triggered_rules else None

        if primary_rule:
            severity = primary_rule["severity"]
            if severity == "CRITICAL":
                status = STATUS_TEMPLATES["CRITICAL"]
            elif severity == "HIGH":
                status = STATUS_TEMPLATES["WARNING"]
            elif severity == "MEDIUM":
                status = STATUS_TEMPLATES["NEEDS_IMPROVEMENT"]
            else:
                status = STATUS_TEMPLATES["OPTIMAL"]

            issue_key = primary_rule["primary_issue_key"]
            primary_issue = PRIMARY_ISSUE_TEMPLATES.get(issue_key, issue_key)

            root_key = primary_rule["root_cause_key"]
            root_template = ROOT_CAUSE_TEMPLATES.get(root_key, "{health_score}")
            root_cause = root_template.format(**primary_rule["root_cause_params"])
        else:
            status = STATUS_TEMPLATES["OPTIMAL"]
            primary_issue = PRIMARY_ISSUE_TEMPLATES["OPTIMAL_DESIGN"]
            root_cause = ROOT_CAUSE_TEMPLATES["OPTIMAL_DESIGN"].format(health_score=health_score)

        # Process SHAP feature justifications
        top_feature_name = "Depth"
        top_feature_imp = 0.35
        if shap_features and len(shap_features) > 0:
            first_sf = shap_features[0]
            if isinstance(first_sf, dict):
                top_feature_name = str(first_sf.get("feature", "Depth"))
                top_feature_imp = float(first_sf.get("importance", 0.35))

        imp_pct = top_feature_imp * 100.0 if top_feature_imp <= 1.0 else top_feature_imp
        feat_lower = top_feature_name.lower()

        if "depth" in feat_lower:
            shap_justification = SHAP_JUSTIFICATION_TEMPLATES["DEPTH_DOMINANT"].format(importance_pct=imp_pct)
        elif "span" in feat_lower or "length" in feat_lower:
            shap_justification = SHAP_JUSTIFICATION_TEMPLATES["SPAN_DOMINANT"].format(importance_pct=imp_pct)
        elif "concrete" in feat_lower or "fc" in feat_lower:
            shap_justification = SHAP_JUSTIFICATION_TEMPLATES["CONCRETE_DOMINANT"].format(importance_pct=imp_pct)
        else:
            feature_alias = top_feature_name.replace("_", " ").replace("Tension Reinforcement Ratio, pten (%)", "Reinforcement Ratio")
            shap_justification = SHAP_JUSTIFICATION_TEMPLATES["DOMINANT_FEATURE"].format(
                feature_name=top_feature_name,
                importance_pct=imp_pct,
                feature_alias=feature_alias
            )


        # Construct recommendation items list
        recommendations_list = []

        for idx, rule in enumerate(triggered_rules, start=1):
            act_key = rule["action_key"]
            act_template = RECOMMENDATION_ITEM_TEMPLATES.get(act_key, {})

            title = act_template.get("title", "{rec_depth}").format(**rule["action_params"])
            current_desc = act_template.get("current", "").format(**rule["action_params"])
            recommended_desc = act_template.get("recommended", "").format(**rule["action_params"])

            # Use helper functions for estimates
            cap_gain = estimate_capacity_gain(beam_inputs, rule["action_type"], rule["old_val"], rule["new_val"])
            deflect_red = estimate_deflection_reduction(beam_inputs, rule["action_type"], rule["old_val"], rule["new_val"])
            cost_impact = estimate_cost_impact(rule["action_type"], rule["old_val"], rule["new_val"])
            impact_stars = convert_impact_stars(rule["impact_rating"])

            post_health = rule.get("expected_health_score", min(98.0, health_score + 15.0))
            exp_health_str = f"{post_health:.1f} / 100"

            p_val = calculate_priority(rule["severity"], rule["impact_rating"])

            recommendations_list.append({
                "priority": p_val,
                "title": title,
                "current": current_desc,
                "recommended": recommended_desc,
                "expected_capacity_gain": cap_gain,
                "expected_deflection_reduction": deflect_red,
                "expected_health_score": exp_health_str,
                "impact": impact_stars,
                "cost": cost_impact
            })

        # Sort recommendations by priority (ascending 1, 2, 3...)
        recommendations_list.sort(key=lambda x: x["priority"])
        # Re-index priorities 1, 2, 3 sequentially
        for idx, item in enumerate(recommendations_list, start=1):
            item["priority"] = idx

        # Compute engine confidence rating
        primary_shap_imp = primary_rule.get("shap_importance", 0.35) if primary_rule else 0.25
        confidence = calculate_confidence(primary_shap_imp, 0.95, 1.0)

        # Generate Executive Summary
        if primary_rule and primary_rule["rule_id"] == "RULE_DEFLECTION":
            over_pct = primary_rule["root_cause_params"].get("over_pct", 15.0)
            rec_d = primary_rule["action_params"].get("rec_depth", 450)
            action_summary = f"Increasing section depth to {rec_d:.0f} mm suppresses deflection and restores structural health."
            summary = SUMMARY_TEMPLATES["DEFLECTION_DRIVEN"].format(
                health_score=health_score,
                over_pct=over_pct,
                action_summary=action_summary,
                shap_justification=shap_justification
            )
        elif primary_rule and primary_rule["rule_id"] == "RULE_SHEAR_FAILURE":
            rec_s = primary_rule["action_params"].get("rec_spacing", 100)
            action_summary = f"Reducing stirrup spacing to s = {rec_s:.0f} mm secures ductile web shear performance."
            summary = SUMMARY_TEMPLATES["SHEAR_DRIVEN"].format(
                health_score=health_score,
                action_summary=action_summary,
                shap_justification=shap_justification
            )
        elif primary_rule and primary_rule["rule_id"] == "RULE_OVER_REINFORCED":
            action_summary = "Reducing steel area prevents sudden compression crushing."
            summary = SUMMARY_TEMPLATES["DUCTILITY_DRIVEN"].format(
                health_score=health_score,
                action_summary=action_summary,
                shap_justification=shap_justification
            )
        elif status == STATUS_TEMPLATES["OPTIMAL"]:
            action_summary = "Material weight optimization can be performed to improve sustainability."
            summary = SUMMARY_TEMPLATES["OPTIMAL_SUMMARY"].format(
                health_score=health_score,
                action_summary=action_summary,
                shap_justification=shap_justification
            )
        else:
            action_summary = "Parameter tuning is advised to elevate structural health."
            summary = SUMMARY_TEMPLATES["GENERAL_WARNING"].format(
                health_score=health_score,
                action_summary=action_summary,
                shap_justification=shap_justification
            )

        return {
            "status": status,
            "primary_issue": primary_issue,
            "root_cause": root_cause,
            "recommendations": recommendations_list,
            "confidence": confidence,
            "summary": summary
        }


# Singleton entry-point function for predict.py
def generate_recommendation(beam_inputs: dict, prediction_results: dict, shap_output: list, beam_health_score: float) -> dict:
    """
    Public entry point for generating structured recommendations.
    """
    engine = RecommendationEngine()
    return engine.generate(beam_inputs, prediction_results, shap_output, beam_health_score)
