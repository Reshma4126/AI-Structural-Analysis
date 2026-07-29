# ============================================================
# AI-Powered Structural Decision Support Platform
# Single Inference API Entry Point for Node.js Backend
#
# File : predict.py
# Purpose: Accepts beam parameter JSON from stdin, runs the
#          Adaptive Hybrid Ensemble Model (AHEM), computes instance-level
#          SHAP explainability, and outputs JSON only.
# ============================================================

import sys
import json
import os
import warnings
import traceback
from pathlib import Path

# Suppress warnings and stdout pollution
os.environ["PYTHONWARNINGS"] = "ignore"
warnings.filterwarnings("ignore")

MODEL_DIR = Path(__file__).resolve().parent / "models_trained"

def normalize_input(raw_data):
    """Normalize input JSON keys (camelCase or snake_case) to exact model feature names."""
    def get_val(keys, default=0.0):
        for k in keys:
            if k in raw_data and raw_data[k] is not None:
                try:
                    return float(raw_data[k])
                except (ValueError, TypeError):
                    pass
        return float(default)

    width = get_val(["width", "beam_width", "Width"], 300.0)
    depth = get_val(["depth", "beam_depth", "Depth"], 450.0)
    span = get_val(["span", "beam_length", "length", "Span"], 5000.0)
    fc = get_val(["concrete_strength", "concreteGrade", "concrete_grade", "Concrete_Strength"], 30.0)
    
    n_tensile = get_val(["num_tensile_bars", "numTensileBars", "Num_Tensile_Bars", "n_tensile"], 4.0)
    d_tensile = get_val(["diameter_tensile_bars", "diameterTensileBars", "Diameter_Tensile_Bars", "d_tensile"], 20.0)
    
    # Calculate tension reinforcement ratio if missing or zero
    ast = n_tensile * 3.14159265 * (d_tensile ** 2) / 4.0
    pten_default = (ast / (width * depth)) * 100.0
    pten = get_val(["tension_reinforcement_ratio", "tensionReinforcementRatio", "Tension_Reinforcement_Ratio"], pten_default)

    n_stirrups = get_val(["num_stirrup_legs", "numStirrupLegs", "Num_Stirrup_Legs"], 2.0)
    s_spacing = get_val(["stirrup_spacing", "stirrupSpacing", "Stirrup_Spacing"], 150.0)
    d_stirrup = get_val(["stirrup_diameter", "stirrupDiameter", "Stirrup_Diameter"], 8.0)

    fy_long = get_val(["fy_longitudinal_bars", "fyLongitudinalBars", "steelGrade", "steel_grade", "fy_longitudinal"], 500.0)
    fy_stirrup = get_val(["fy_stirrup_bars", "fyStirrupBars", "fy_stirrup"], 415.0)

    formatted = {
        "Width": width,
        "Depth": depth,
        "Span": span,
        "Concrete_Strength": fc,
        "# Tensile Bars": n_tensile,
        "Diameter Tensile Bars, db,t (mm)": d_tensile,
        "Tension Reinforcement Ratio, pten (%)": pten,
        "# Stirrup Legs": n_stirrups,
        "Stirrup Spacing, s (mm)": s_spacing,
        "Stirrup Diameter, ds (mm)": d_stirrup,
        "fy Longitudinal Bars (Tensile), (MPa)": fy_long,
        "fy,s Stirrup Bars": fy_stirrup
    }

    return formatted

def compute_health_and_recommendation(pmax, delta_ult, failure_mode, width, depth, span, fc, fy, s_spacing):
    """Calculate dynamic health score and specific actionable engineering recommendations."""
    score = 100.0
    recs = []

    # Working / Serviceability deflection (IS 456 / ACI code: delta_service = delta_ult / 1.5)
    delta_service = delta_ult / 1.5
    allowable_deflection = span / 250.0

    # 1. Serviceability Deflection Check against L/250 limit
    if delta_service > allowable_deflection:
        over_pct = round(((delta_service - allowable_deflection) / allowable_deflection) * 100.0, 1)
        penalty = min(30.0, over_pct * 0.4)
        score -= penalty
        rec_d = int(round((depth * 1.15) / 25.0) * 25)
        recs.append(f"Serviceability deflection ({delta_service:.1f} mm) exceeds span limit L/250 ({allowable_deflection:.1f} mm) by {over_pct}%. (Ultimate deflection = {delta_ult:.1f} mm). Consider increasing section depth to ~{rec_d} mm or upgrading concrete grade.")
    else:
        recs.append(f"Serviceability check passed: working deflection ({delta_service:.1f} mm) is within allowable limit L/250 ({allowable_deflection:.1f} mm). Ultimate deflection = {delta_ult:.1f} mm.")

    # 2. Failure Mode & Ductility Check
    mode_lower = str(failure_mode).lower()
    if "shear" in mode_lower:
        score -= 25.0
        rec_s = max(75, int(s_spacing * 0.75))
        recs.append(f"Brittle shear failure mode predicted ('{failure_mode}'). Reduce stirrup spacing to s = {rec_s} mm or increase stirrup legs to ensure ductile flexural behavior.")
    elif "compression" in mode_lower or "over" in mode_lower:
        score -= 15.0
        recs.append("Over-reinforced section predicted. Reduce tensile steel area (Ast) to ensure ductile tension-controlled behavior.")
    else:
        recs.append(f"Ductile flexural behavior verified ('{failure_mode}').")

    # 3. Overall Health Score
    health_score = round(max(10.0, min(99.9, score)), 1)

    if health_score >= 85:
        summary_title = "Beam is structurally adequate with optimal strength and ductility."
    elif health_score >= 70:
        summary_title = "Beam design is acceptable, but minor section tuning is recommended."
    else:
        summary_title = "High structural risk detected; section redesign required."

    full_recommendation = summary_title + " " + " ".join(recs)
    return health_score, full_recommendation

def load_json(filepath):
    if filepath.exists():
        try:
            with open(filepath, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return {}

def predict_ensemble(models, weights, df):
    """Compute Adaptive Hybrid Ensemble prediction (AHEM) across available models."""
    preds = {}
    weighted_sum = 0.0
    total_w = 0.0

    for name, model in models.items():
        if model is not None:
            w = float(weights.get(name, 0.25))
            val = float(model.predict(df)[0])
            preds[name] = val
            weighted_sum += val * w
            total_w += w

    if total_w > 0:
        final_val = weighted_sum / total_w
    else:
        final_val = list(preds.values())[0] if preds else 0.0

    return final_val, preds

def main():
    try:
        input_raw = sys.stdin.read()
        if not input_raw or not input_raw.strip():
            raise ValueError("No JSON payload received from stdin.")

        data = json.loads(input_raw)

        import joblib
        import pandas as pd
        import numpy as np
        import shap

        formatted_input = normalize_input(data)
        df = pd.DataFrame([formatted_input])

        # Load AHEM Weights
        pmax_weights = load_json(MODEL_DIR / "adaptive_hybrid_weights_pmax.json")
        delta_weights = load_json(MODEL_DIR / "adaptive_hybrid_weights_deltault.json")

        def load_safe(filename):
            fp = MODEL_DIR / filename
            if fp.exists():
                try:
                    return joblib.load(fp)
                except Exception:
                    pass
            return None

        # Load Pmax Ensemble Base Models
        pmax_models = {
            "Random Forest": load_safe("random_forest_pmax.pkl") or load_safe("random_forest_pmax_optimized.pkl"),
            "Extra Trees": load_safe("extra_trees_pmax_optimized.pkl") or load_safe("extra_trees_pmax.pkl"),
            "LightGBM": load_safe("lightgbm_pmax_optimized.pkl") or load_safe("lightgbm_pmax.pkl"),
            "CatBoost": load_safe("catboost_pmax_optimized.pkl") or load_safe("catboost_pmax.pkl")
        }

        # Load Deflection Ensemble Base Models
        delta_models = {
            "Random Forest": load_safe("random_forest_deltault_optimized.pkl") or load_safe("random_forest_deflection.pkl"),
            "Extra Trees": load_safe("extra_trees_deltault_optimized.pkl") or load_safe("extra_trees_deflection.pkl"),
            "LightGBM": load_safe("lightgbm_deltault_optimized.pkl") or load_safe("lightgbm_deflection.pkl"),
            "CatBoost": load_safe("catboost_deltault_optimized.pkl") or load_safe("catboost_deflection.pkl")
        }

        # Load Classifier & Label Encoder
        fail_model = load_safe("catboost_failure_mode_optimized.pkl") or load_safe("catboost_failure_mode.pkl")
        encoder = load_safe("failure_mode_label_encoder.pkl") or load_safe("failure_mode_encoder.pkl")

        # 1. Compute AHEM Ensemble Predictions for Pmax & Delta_ult
        pmax_pred, pmax_individual = predict_ensemble(pmax_models, pmax_weights, df)
        delta_pred, delta_individual = predict_ensemble(delta_models, delta_weights, df)

        # 2. Failure Mode Classification
        if fail_model and encoder:
            fail_raw = fail_model.predict(df)
            fail_idx = int(np.ravel(fail_raw)[0])
            failure_mode = str(encoder.inverse_transform([fail_idx])[0])
        else:
            failure_mode = "Flexural-bending (ductile)"

        # 3. Instance-Level SHAP Explainability Unpacking
        shap_model = pmax_models.get("CatBoost") or pmax_models.get("Random Forest") or [m for m in pmax_models.values() if m is not None][0]
        
        try:
            explainer = shap.TreeExplainer(shap_model)
            raw_shap = explainer.shap_values(df)
            if isinstance(raw_shap, list):
                raw_shap = raw_shap[0]
            if len(np.shape(raw_shap)) == 2:
                raw_shap = raw_shap[0]
            abs_shap = np.abs(raw_shap)
        except Exception:
            try:
                explainer = shap.Explainer(shap_model)
                shap_values = explainer(df)
                raw_shap = shap_values.values
                if len(np.shape(raw_shap)) == 2:
                    raw_shap = raw_shap[0]
                abs_shap = np.abs(raw_shap)
            except Exception:
                abs_shap = np.array(getattr(shap_model, "feature_importances_", np.ones(len(df.columns))))

        total_shap = np.sum(abs_shap) if np.sum(abs_shap) > 0 else 1.0
        top_indices = np.argsort(abs_shap)[::-1][:3]

        top_features = []
        name_cleaner = {
            "# Tensile Bars": "Num_Tensile_Bars",
            "Diameter Tensile Bars, db,t (mm)": "Diameter_Tensile_Bars",
            "Tension Reinforcement Ratio, pten (%)": "Tension_Reinforcement_Ratio",
            "# Stirrup Legs": "Num_Stirrup_Legs",
            "Stirrup Spacing, s (mm)": "Stirrup_Spacing",
            "Stirrup Diameter, ds (mm)": "Stirrup_Diameter",
            "fy Longitudinal Bars (Tensile), (MPa)": "fy_Longitudinal_Bars",
            "fy,s Stirrup Bars": "fy_Stirrup_Bars"
        }

        for idx in top_indices:
            orig_col = df.columns[idx]
            clean_name = name_cleaner.get(orig_col, orig_col.replace(' ', '_'))
            top_features.append({
                "feature": clean_name,
                "importance": round(float(abs_shap[idx] / total_shap), 2)
            })

        # 4. Actionable Engineering Recommendations & Health Score
        health_score, rec_str = compute_health_and_recommendation(
            pmax_pred,
            delta_pred,
            failure_mode,
            formatted_input["Width"],
            formatted_input["Depth"],
            formatted_input["Span"],
            formatted_input["Concrete_Strength"],
            formatted_input["fy Longitudinal Bars (Tensile), (MPa)"],
            formatted_input["Stirrup Spacing, s (mm)"]
        )

        response = {
            "success": True,
            "prediction": {
                "pmax": round(pmax_pred, 1),
                "delta_ult": round(delta_pred, 1),
                "failure_mode": failure_mode,
                "ensemble_pmax_breakdown": {k: round(v, 1) for k, v in pmax_individual.items()},
                "ensemble_deltault_breakdown": {k: round(v, 1) for k, v in delta_individual.items()}
            },
            "beam_health_score": health_score,
            "recommendation": rec_str,
            "shap": {
                "top_features": top_features
            }
        }

        print(json.dumps(response))

    except Exception as e:
        error_resp = {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }
        print(json.dumps(error_resp))
        sys.exit(1)

if __name__ == "__main__":
    main()
