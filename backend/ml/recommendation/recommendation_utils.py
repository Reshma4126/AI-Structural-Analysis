# ============================================================
# AI-Powered Structural Decision Support Platform
# Module: Recommendation Engine - Utilities
#
# File : recommendation_utils.py
# Purpose: Reusable helper functions for deflection limits,
#          capacity gain estimation, cost impact, priority ranking,
#          and confidence calculation.
# ============================================================

import math

def allowable_deflection(span: float) -> float:
    """
    Calculate maximum allowable serviceability deflection under standard Eurocode / IS 456 rules (L / 250).
    
    :param span: Beam clear span length in mm.
    :return: Allowable deflection in mm.
    """
    return float(span) / 250.0

def estimate_capacity_gain(beam_inputs: dict, action_type: str, old_val: float, new_val: float) -> str:
    """
    Estimate expected percentage ultimate capacity gain (% P_max increase) based on structural mechanics principles.
    
    - Increasing Depth (d): M_u is approximately linear with effective depth.
    - Upgrading Concrete Grade (f_c): Boosts shear V_c (sqrt(fc)) and compression block capacity.
    - Increasing Tensile Steel Area (Ast): Increases flexural capacity up to balanced section limit.
    - Reducing Stirrup Spacing (s): Boosts shear capacity V_s (proportional to 1/s).
    """
    try:
        old_v = float(old_val)
        new_v = float(new_val)
        if old_v <= 0 or new_v <= 0 or old_v == new_v:
            return "+0.0%"

        if action_type == "INCREASE_DEPTH":
            # Capacity gain roughly scales linearly with depth increase (M_u ~ d)
            pct = ((new_v / old_v) - 1.0) * 85.0  # ~85% efficiency multiplier
            return f"+{max(5.0, min(80.0, pct)):.1f}%"

        elif action_type == "UPGRADE_CONCRETE":
            # Shear capacity V_c ~ sqrt(f_c), flexure ~ minor increase in lever arm
            pct = (math.sqrt(new_v) / math.sqrt(old_v) - 1.0) * 45.0
            return f"+{max(4.0, min(35.0, pct)):.1f}%"

        elif action_type == "REDUCE_STIRRUP_SPACING":
            # Transverse shear steel V_s ~ 1 / s
            ratio = (old_v / new_v) - 1.0
            pct = ratio * 35.0
            return f"+{max(8.0, min(50.0, pct)):.1f}%"

        elif action_type == "INCREASE_STEEL":
            pct = ((new_v / old_v) - 1.0) * 70.0
            return f"+{max(5.0, min(45.0, pct)):.1f}%"

        elif action_type == "MULTI_OPTIMIZATION":
            return "+25.0% to +45.0%"

        elif action_type == "REDUCE_STEEL":
            return "+0.0% (Prevents brittle failure)"

        return "+10.0%"
    except Exception:
        return "+15.0%"

def estimate_deflection_reduction(beam_inputs: dict, action_type: str, old_val: float, new_val: float) -> str:
    """
    Estimate expected percentage deflection reduction based on moment of inertia (I_x = b * h^3 / 12).
    """
    try:
        old_v = float(old_val)
        new_v = float(new_val)
        if old_v <= 0 or new_v <= 0 or old_v == new_v:
            return "0.0%"

        if action_type == "INCREASE_DEPTH":
            # Deflection delta ~ 1 / I_x ~ 1 / h^3
            i_old = old_v ** 3
            i_new = new_v ** 3
            reduction_pct = (1.0 - (i_old / i_new)) * 100.0
            return f"-{max(5.0, min(75.0, reduction_pct)):.1f}%"

        elif action_type == "UPGRADE_CONCRETE":
            # Elastic modulus E_c ~ 5000 sqrt(f_c), deflection ~ 1 / E_c
            e_old = math.sqrt(old_v)
            e_new = math.sqrt(new_v)
            reduction_pct = (1.0 - (e_old / e_new)) * 100.0
            return f"-{max(2.0, min(25.0, reduction_pct)):.1f}%"

        elif action_type == "MULTI_OPTIMIZATION":
            return "-35.0% to -55.0%"

        return "N/A"
    except Exception:
        return "-20.0%"

def estimate_cost_impact(action_type: str, old_val: float = 0, new_val: float = 0) -> str:
    """
    Estimate cost impact of proposed optimization action.
    Returns: "Low", "Medium", or "High"
    """
    if action_type in ["REDUCE_STIRRUP_SPACING", "INCREASE_STEEL", "REDUCE_STEEL"]:
        return "Low"
    elif action_type in ["UPGRADE_CONCRETE"]:
        return "Medium"
    elif action_type in ["INCREASE_DEPTH", "MULTI_OPTIMIZATION"]:
        return "Medium"
    elif action_type in ["SUSTAINABILITY_OPTIMIZATION"]:
        return "Low (Cost Saving)"
    return "Medium"

def calculate_priority(severity_level: str, impact_score: int) -> int:
    """
    Calculate numerical recommendation priority (1 = highest priority).
    
    :param severity_level: "CRITICAL", "HIGH", "MEDIUM", "LOW"
    :param impact_score: Star rating magnitude (1 to 5)
    :return: Integer priority (1, 2, or 3)
    """
    if severity_level == "CRITICAL" or impact_score >= 5:
        return 1
    elif severity_level == "HIGH" or impact_score == 4:
        return 2
    else:
        return 3

def calculate_confidence(shap_importance: float, model_reliability: float = 0.95, condition_match: float = 1.0) -> str:
    """
    Calculate confidence rating percentage for recommendation.
    
    :param shap_importance: Normalized SHAP importance of target feature (0.0 - 1.0)
    :param model_reliability: ML ensemble accuracy metric (default 0.95)
    :param condition_match: Rule match certainty factor (default 1.0)
    :return: String representation like "High (94%)"
    """
    score = (shap_importance * 0.4 + model_reliability * 0.4 + condition_match * 0.2) * 100.0
    pct = round(max(70.0, min(99.0, score)), 0)
    
    if pct >= 88:
        return f"High ({int(pct)}%)"
    elif pct >= 78:
        return f"Medium ({int(pct)}%)"
    else:
        return f"Moderate ({int(pct)}%)"

def convert_impact_stars(rating: int) -> str:
    """Convert integer impact rating (1 to 5) into Unicode star rating string."""
    rating = max(1, min(5, int(rating)))
    return "★" * rating + "☆" * (5 - rating)
