# ============================================================
# AI-Powered Structural Decision Support Platform
# SHAP Utilities
#
# File : shap_utils.py
#
# Shared utility functions for SHAP explainability.
# ============================================================

import shap
import joblib
import pandas as pd
from pathlib import Path

from ml.ensemble.ensemble_utils import (
    load_dataset,
    clean_columns,
    get_features
)

MODEL_DIR = Path(__file__).resolve().parent.parent / "models_trained"
OUTPUT_DIR = Path(__file__).resolve().parent / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def load_model(filename: str):
    """Load a trained model."""
    return joblib.load(MODEL_DIR / filename)


def load_preprocessed_dataset():
    """Load and preprocess the dataset."""
    df = load_dataset()
    df = clean_columns(df)
    X = get_features(df)
    return df, X


def create_explainer(model, background_data):
    """Create a SHAP explainer."""
    return shap.Explainer(model, background_data)


def compute_shap_values(explainer, X):
    """Compute SHAP values."""
    return explainer(X)


def save_summary_plot(shap_values, X, filename):
    """Save SHAP summary plot."""
    import matplotlib.pyplot as plt

    shap.summary_plot(
        shap_values,
        X,
        show=False
    )

    plt.tight_layout()
    plt.savefig(
        OUTPUT_DIR / filename,
        dpi=300,
        bbox_inches="tight"
    )
    plt.close()


def save_bar_plot(shap_values, X, filename):
    """Save SHAP feature importance bar plot."""
    import matplotlib.pyplot as plt

    shap.plots.bar(
        shap_values,
        show=False
    )

    plt.tight_layout()
    plt.savefig(
        OUTPUT_DIR / filename,
        dpi=300,
        bbox_inches="tight"
    )
    plt.close()


def save_waterfall_plot(shap_values, index, filename):
    """Save SHAP waterfall plot for a sample."""
    import matplotlib.pyplot as plt

    shap.plots.waterfall(
        shap_values[index],
        show=False
    )

    plt.tight_layout()
    plt.savefig(
        OUTPUT_DIR / filename,
        dpi=300,
        bbox_inches="tight"
    )
    plt.close()


def get_top_features(shap_values, X, top_n=10):
    """Return top features ranked by mean absolute SHAP value."""
    importance = abs(shap_values.values).mean(axis=0)

    ranking = (
        pd.DataFrame({
            "Feature": X.columns,
            "MeanAbsSHAP": importance
        })
        .sort_values(
            "MeanAbsSHAP",
            ascending=False
        )
        .head(top_n)
    )

    return ranking


def save_feature_importance(df, filename):
    """Save feature importance table."""
    df.to_csv(
        OUTPUT_DIR / filename,
        index=False
    )
