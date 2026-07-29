# ============================================================
# AI-Powered Structural Decision Support Platform
# Stage 1 - Hyperparameter Optimization
# Model : Random Forest Regressor
# Target: Maximum Load Capacity (Pmax)
# ============================================================

# -----------------------------
# Import Libraries
# -----------------------------
import pandas as pd
import numpy as np
import joblib
import optuna
from pathlib import Path

from sklearn.model_selection import (
    train_test_split,
    cross_val_score
)

from sklearn.ensemble import RandomForestRegressor

from sklearn.metrics import (
    r2_score,
    mean_absolute_error,
    mean_squared_error,
    mean_absolute_percentage_error
)

# ============================================================
# Load Dataset
# ============================================================

# Change this path to your dataset
df = pd.read_csv(r"D:\studies\mini project\RC_Synthetic_Dataset_Generator\generated_dataset\beam_ml_dataset.csv")

# ============================================================
# Features and Target
# ============================================================

X = df.drop(columns=["Pmax", "Δult (mm)", "Failure_Mode"])

y = df["Pmax"]

# ============================================================
# Train-Test Split
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)

# ============================================================
# Objective Function
# ============================================================

def objective(trial):

    params = {

        "n_estimators": trial.suggest_int(
            "n_estimators",
            100,
            1000
        ),

        "max_depth": trial.suggest_int(
            "max_depth",
            5,
            40
        ),

        "min_samples_split": trial.suggest_int(
            "min_samples_split",
            2,
            10
        ),

        "min_samples_leaf": trial.suggest_int(
            "min_samples_leaf",
            1,
            5
        ),

        "max_features": trial.suggest_categorical(
            "max_features",
            ["sqrt", "log2", None]
        ),

        "random_state": 42,

        "n_jobs": -1

    }

    model = RandomForestRegressor(**params)

    score = cross_val_score(
        model,
        X_train,
        y_train,
        cv=5,
        scoring="r2",
        n_jobs=-1
    )

    return score.mean()

# ============================================================
# Create Study
# ============================================================

study = optuna.create_study(
    direction="maximize"
)

study.optimize(
    objective,
    n_trials=50,
    show_progress_bar=True
)

# ============================================================
# Best Parameters
# ============================================================

print("\nBest Parameters")
print("--------------------------------")

print(study.best_params)

print("\nBest Cross Validation R²")

print(study.best_value)

# ============================================================
# Train Final Optimized Model
# ============================================================

best_model = RandomForestRegressor(

    **study.best_params,

    random_state=42,

    n_jobs=-1

)

best_model.fit(
    X_train,
    y_train
)

# ============================================================
# Predictions
# ============================================================

train_pred = best_model.predict(X_train)

test_pred = best_model.predict(X_test)

# ============================================================
# Training Metrics
# ============================================================

print("\nTraining Performance")
print("--------------------------------")

print("R²   :", r2_score(y_train, train_pred))

print("MAE  :", mean_absolute_error(y_train, train_pred))

print("RMSE :", np.sqrt(mean_squared_error(y_train, train_pred)))

# ============================================================
# Testing Metrics
# ============================================================

print("\nTesting Performance")
print("--------------------------------")

print("R²   :", r2_score(y_test, test_pred))

print("MAE  :", mean_absolute_error(y_test, test_pred))

print("RMSE :", np.sqrt(mean_squared_error(y_test, test_pred)))

print("MAPE :", mean_absolute_percentage_error(y_test, test_pred))

# ============================================================
# Feature Importance
# ============================================================

print("\nFeature Importance")
print("--------------------------------")

importance = best_model.feature_importances_

feature_importance = sorted(

    zip(X.columns, importance),

    key=lambda x: x[1],

    reverse=True

)

for feature, score in feature_importance:

    print(f"{feature:<40} {score:.4f}")

# ============================================================
# Save Model
# ============================================================
# Create models_trained directory if it doesn't exist
model_dir = Path(__file__).resolve().parent.parent / "models_trained"
model_dir.mkdir(parents=True, exist_ok=True)

# Save optimized model
joblib.dump(
    best_model,
    model_dir / "random_forest_pmax.pkl"
)

print("\nOptimized model saved successfully.")

import json

with open(model_dir / "random_forest_pmax_best_params.json", "w") as f:
    json.dump(study.best_params, f, indent=4)

print("Best parameters saved successfully.")