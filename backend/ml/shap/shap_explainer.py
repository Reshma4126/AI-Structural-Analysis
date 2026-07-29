# ============================================================
# AI-Powered Structural Decision Support Platform
# SHAP Explainer
#
# File : shap_explainer.py
# ============================================================

from sklearn.model_selection import train_test_split

from ml.shap.shap_utils import (
    load_model,
    load_preprocessed_dataset,
    create_explainer,
    compute_shap_values,
    save_summary_plot,
    save_bar_plot,
    save_waterfall_plot,
    get_top_features,
    save_feature_importance
)


def explain_model(model_filename, target_name, sample_index=0):
    print(f"\nExplaining {target_name}")

    df, X = load_preprocessed_dataset()

    if target_name == "Pmax":
        y = df["Pmax"]
    elif target_name == "Delta_ult":
        y = df["Delta_ult"]
    else:
        raise ValueError("Unsupported target.")

    X_train, X_test, _, _ = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = load_model(model_filename)

    explainer = create_explainer(model, X_train)

    shap_values = compute_shap_values(explainer, X_test)

    prefix = target_name.lower()

    save_summary_plot(
        shap_values,
        X_test,
        f"{prefix}_summary_plot.png"
    )

    save_bar_plot(
        shap_values,
        X_test,
        f"{prefix}_bar_plot.png"
    )

    save_waterfall_plot(
        shap_values,
        sample_index,
        f"{prefix}_waterfall_plot.png"
    )

    importance = get_top_features(
        shap_values,
        X_test,
        top_n=10
    )

    save_feature_importance(
        importance,
        f"{prefix}_feature_importance.csv"
    )

    print("SHAP analysis completed.")


if __name__ == "__main__":

    explain_model(
        "catboost_pmax_optimized.pkl",
        "Pmax"
    )

    # Uncomment later
    # explain_model(
    #     "catboost_deltault_optimized.pkl",
    #     "Delta_ult"
    # )
