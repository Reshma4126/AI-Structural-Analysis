# ============================================================
# AI-Powered Structural Decision Support Platform
# Adaptive Hybrid Ensemble Model (AHEM)
#
# File : adaptive_hybrid_ensemble.py
#
# Purpose:
#     Main execution pipeline for the Adaptive Hybrid
#     Ensemble Model.
#
# ============================================================

from sklearn.model_selection import train_test_split

from ml.ensemble.ensemble_utils import (
    load_dataset,
    clean_columns,
    get_features,
    get_target
)

from ml.ensemble.adaptive_weights import (
    compute_adaptive_weights
)

from ml.ensemble.ensemble_predictor import (
    run_prediction_pipeline
)


# ============================================================
# Main Pipeline
# ============================================================

def run_pipeline(target="Pmax"):

    print("\n")
    print("=" * 70)
    print("Adaptive Hybrid Ensemble Model")
    print("=" * 70)

    # --------------------------------------------------------
    # Load Dataset
    # --------------------------------------------------------

    df = load_dataset()

    df = clean_columns(df)

    print(f"\nDataset Shape : {df.shape}")

    # --------------------------------------------------------
    # Feature Matrix
    # --------------------------------------------------------

    X = get_features(df)

    y = get_target(df, target)

    # --------------------------------------------------------
    # Train Test Split
    # --------------------------------------------------------

    X_train, X_test, y_train, y_test = train_test_split(

        X,

        y,

        test_size=0.20,

        random_state=42

    )

    print(f"Training Samples : {len(X_train)}")
    print(f"Testing Samples  : {len(X_test)}")

    # --------------------------------------------------------
    # Adaptive Weight Calculation
    # --------------------------------------------------------

    weights = compute_adaptive_weights(

        X_train,

        y_train,

        target

    )

    # --------------------------------------------------------
    # Ensemble Prediction
    # --------------------------------------------------------

    output = run_prediction_pipeline(

        X_train,

        X_test,

        y_train,

        y_test,

        weights,

        target

    )

    print("\n")
    print("=" * 70)
    print("Adaptive Hybrid Ensemble Completed Successfully")
    print("=" * 70)

    return output


# ============================================================
# Execute
# ============================================================

if __name__ == "__main__":

    # --------------------------------------------------------
    # Pmax
    # --------------------------------------------------------

    run_pipeline("Pmax")

    # --------------------------------------------------------
    # Uncomment later for Delta_ult
    # --------------------------------------------------------

    # run_pipeline("Delta_ult")