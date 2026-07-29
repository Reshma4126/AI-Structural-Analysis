# ============================================================
# AI-Powered Structural Decision Support Platform
# Adaptive Hybrid Ensemble Model (AHEM)
#
# File : adaptive_weights.py
#
# Purpose:
#     Compute adaptive weights for the ensemble using
#     5-Fold Cross Validation.
#
# ============================================================

import numpy as np

from sklearn.base import clone
from sklearn.model_selection import KFold
from sklearn.metrics import r2_score

from ml.ensemble.ensemble_utils import (
    create_models,
    save_json
)


# ============================================================
# Cross Validation Score
# ============================================================

def cross_validation_score(model, X, y):

    kfold = KFold(
        n_splits=5,
        shuffle=True,
        random_state=42
    )

    scores = []

    for train_index, validation_index in kfold.split(X):

        X_train = X.iloc[train_index]
        X_valid = X.iloc[validation_index]

        y_train = y.iloc[train_index]
        y_valid = y.iloc[validation_index]

        estimator = clone(model)

        estimator.fit(
            X_train,
            y_train
        )

        prediction = estimator.predict(X_valid)

        score = r2_score(
            y_valid,
            prediction
        )

        scores.append(score)

    return float(np.mean(scores))


# ============================================================
# Adaptive Weight Calculation
# ============================================================

def compute_adaptive_weights(X_train, y_train, target="Pmax"):

    print("\n")
    print("=" * 60)
    print("Adaptive Weight Calculation")
    print("=" * 60)

    models = create_models(target)

    scores = {}

    for model_name, model in models.items():

        score = cross_validation_score(
            model,
            X_train,
            y_train
        )

        scores[model_name] = score

        print(f"{model_name:20s}: {score:.6f}")

    total = sum(scores.values())

    weights = {}

    print("\n")
    print("=" * 60)
    print("Adaptive Weights")
    print("=" * 60)

    for model_name, score in scores.items():

        weight = score / total

        weights[model_name] = float(weight)

        print(f"{model_name:20s}: {weight:.6f}")

    if target.lower() == "pmax":

        save_json(
            weights,
            "adaptive_hybrid_weights_pmax.json"
        )

    else:

        save_json(
            weights,
            "adaptive_hybrid_weights_deltault.json"
        )

    print("\nAdaptive weights saved successfully.")

    return weights