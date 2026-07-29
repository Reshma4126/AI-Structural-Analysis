# ============================================================
# AI-Powered Structural Decision Support Platform
# Adaptive Hybrid Ensemble Model (AHEM)
#
# File : ensemble_predictor.py
#
# Purpose:
#     Train optimized models on the training data,
#     generate individual predictions,
#     and compute weighted ensemble predictions.
#
# ============================================================

import pandas as pd

from ml.ensemble.ensemble_utils import (
    create_models,
    evaluate_model,
    print_metrics,
    save_predictions,
    save_json
)


# ============================================================
# Train Models
# ============================================================

def train_models(models, X_train, y_train):

    print("\n")
    print("=" * 60)
    print("Training Optimized Models")
    print("=" * 60)

    for model_name, model in models.items():

        print(f"Training {model_name}...")

        model.fit(
            X_train,
            y_train
        )

    print("\nAll models trained successfully.")

    return models


# ============================================================
# Individual Predictions
# ============================================================

def predict_individual(models, X_test):

    predictions = {}

    print("\n")
    print("=" * 60)
    print("Generating Individual Predictions")
    print("=" * 60)

    for model_name, model in models.items():

        predictions[model_name] = model.predict(X_test)

        print(f"{model_name} prediction completed.")

    return predictions


# ============================================================
# Weighted Ensemble Prediction
# ============================================================

def adaptive_prediction(predictions, weights):

    ensemble = None

    for model_name in predictions:

        if ensemble is None:

            ensemble = (
                weights[model_name] *
                predictions[model_name]
            )

        else:

            ensemble += (
                weights[model_name] *
                predictions[model_name]
            )

    return ensemble


# ============================================================
# Complete Prediction Pipeline
# ============================================================

def run_prediction_pipeline(
    X_train,
    X_test,
    y_train,
    y_test,
    weights,
    target="Pmax"
):

    models = create_models(target)

    models = train_models(
        models,
        X_train,
        y_train
    )

    predictions = predict_individual(
        models,
        X_test
    )

    ensemble_prediction = adaptive_prediction(
        predictions,
        weights
    )

    metrics = evaluate_model(
        y_test,
        ensemble_prediction
    )

    print_metrics(metrics)

    results = pd.DataFrame({

        "Actual": y_test.values,

        "RandomForest":
            predictions["Random Forest"],

        "ExtraTrees":
            predictions["Extra Trees"],

        "LightGBM":
            predictions["LightGBM"],

        "CatBoost":
            predictions["CatBoost"],

        "AdaptiveHybrid":
            ensemble_prediction

    })

    if target.lower() == "pmax":

        prediction_file = (
            "adaptive_hybrid_predictions_pmax.csv"
        )

        metric_file = (
            "adaptive_hybrid_metrics_pmax.json"
        )

    else:

        prediction_file = (
            "adaptive_hybrid_predictions_deltault.csv"
        )

        metric_file = (
            "adaptive_hybrid_metrics_deltault.json"
        )

    save_predictions(
        results,
        prediction_file
    )

    save_json(
        metrics,
        metric_file
    )

    print("\nPrediction results saved successfully.")

    return {

        "models": models,

        "predictions": predictions,

        "ensemble_prediction": ensemble_prediction,

        "metrics": metrics

    }