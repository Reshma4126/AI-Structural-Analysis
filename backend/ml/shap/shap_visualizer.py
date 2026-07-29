# ============================================================
# AI-Powered Structural Decision Support Platform
# SHAP Visualizer
#
# File : shap_visualizer.py
#
# Optional visualization utilities for dissertation figures.
# ============================================================

import matplotlib.pyplot as plt
import shap


def save_dependence_plot(shap_values, X, feature_name, output_path):
    """Generate a SHAP dependence plot."""
    shap.dependence_plot(
        feature_name,
        shap_values.values,
        X,
        show=False
    )
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close()


def save_decision_plot(explainer, shap_values, sample_index, output_path):
    """Generate a SHAP decision plot for a sample."""
    shap.decision_plot(
        explainer.expected_value,
        shap_values.values[sample_index],
        feature_names=shap_values.feature_names,
        show=False
    )
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close()


def save_force_plot(explainer, shap_values, sample_index, output_html):
    """Generate an interactive SHAP force plot."""
    force = shap.force_plot(
        explainer.expected_value,
        shap_values.values[sample_index],
        shap_values.data[sample_index],
        feature_names=shap_values.feature_names,
        matplotlib=False
    )

    shap.save_html(output_html, force)


def plot_top_features(feature_importance_df, output_path):
    """Generate a horizontal bar chart of top SHAP features."""
    plt.figure(figsize=(8, 5))
    plt.barh(
        feature_importance_df["Feature"],
        feature_importance_df["MeanAbsSHAP"]
    )
    plt.gca().invert_yaxis()
    plt.xlabel("Mean |SHAP Value|")
    plt.ylabel("Feature")
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close()
