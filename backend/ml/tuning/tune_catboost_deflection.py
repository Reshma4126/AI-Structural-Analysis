# ============================================================
# AI-Powered Structural Decision Support Platform
# Stage 1 - Hyperparameter Optimization
# Model : CatBoost Regressor
# Target: Ultimate Deflection (Δult)
# ============================================================

import pandas as pd
import numpy as np
import joblib
import optuna
import json

from pathlib import Path

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import (
    r2_score,
    mean_absolute_error,
    mean_squared_error,
    mean_absolute_percentage_error
)

from catboost import CatBoostRegressor

# ============================================================
# Load Dataset
# ============================================================

df = pd.read_csv(
    r"D:\studies\mini project\RC_Synthetic_Dataset_Generator\generated_dataset\beam_ml_dataset.csv"
)

# ============================================================
# Features and Target
# ============================================================

X = df.drop(columns=["Pmax", "Δult (mm)", "Failure_Mode"])
y = df["Δult (mm)"]

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

        "iterations": trial.suggest_int(
            "iterations",
            200,
            1000
        ),

        "learning_rate": trial.suggest_float(
            "learning_rate",
            0.01,
            0.3,
            log=True
        ),

        "depth": trial.suggest_int(
            "depth",
            4,
            10
        ),

        "l2_leaf_reg": trial.suggest_float(
            "l2_leaf_reg",
            1,
            10
        ),

        "random_strength": trial.suggest_float(
            "random_strength",
            0,
            10
        ),

        "bagging_temperature": trial.suggest_float(
            "bagging_temperature",
            0,
            10
        ),

        "loss_function": "RMSE",

        "verbose": 0,

        "random_seed": 42

    }

    model = CatBoostRegressor(**params)

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

study = optuna.create_study(direction="maximize")

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
print("--------------------------------")
print(study.best_value)

# ============================================================
# Train Final Model
# ============================================================

best_model = CatBoostRegressor(
    **study.best_params,
    loss_function="RMSE",
    verbose=0,
    random_seed=42
)

best_model.fit(X_train, y_train)

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

importance = best_model.get_feature_importance()

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

model_dir = Path(__file__).resolve().parent.parent / "models_trained"
model_dir.mkdir(parents=True, exist_ok=True)

joblib.dump(
    best_model,
    model_dir / "catboost_deltault_optimized.pkl"
)

with open(model_dir / "catboost_deltault_best_params.json", "w") as f:
    json.dump(study.best_params, f, indent=4)

print("\nOptimized model saved successfully.")
print("Best parameters saved successfully.")