# ============================================================
# AI-Powered Structural Decision Support Platform
# Stage 1 - Hyperparameter Optimization
# Model : CatBoost Classifier
# Target: Failure Mode
# ============================================================

import pandas as pd
import joblib
import optuna
import json

from pathlib import Path

from sklearn.model_selection import (
    train_test_split,
    cross_val_score
)

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)

from sklearn.preprocessing import LabelEncoder

from catboost import CatBoostClassifier

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

label_encoder = LabelEncoder()

y = label_encoder.fit_transform(df["Failure_Mode"])

# ============================================================
# Train-Test Split
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
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

        "loss_function": "MultiClass",

        "verbose": 0,

        "random_seed": 42

    }

    model = CatBoostClassifier(**params)

    score = cross_val_score(
        model,
        X_train,
        y_train,
        cv=5,
        scoring="accuracy",
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

print("\nBest Cross Validation Accuracy")
print("--------------------------------")

print(study.best_value)

# ============================================================
# Train Final Model
# ============================================================

best_model = CatBoostClassifier(

    **study.best_params,

    loss_function="MultiClass",

    verbose=0,

    random_seed=42

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
# Training Performance
# ============================================================

print("\nTraining Performance")
print("--------------------------------")

print("Accuracy :", accuracy_score(y_train, train_pred))

print("Precision:", precision_score(
    y_train,
    train_pred,
    average="weighted"
))

print("Recall   :", recall_score(
    y_train,
    train_pred,
    average="weighted"
))

print("F1 Score :", f1_score(
    y_train,
    train_pred,
    average="weighted"
))

# ============================================================
# Testing Performance
# ============================================================

print("\nTesting Performance")
print("--------------------------------")

print("Accuracy :", accuracy_score(y_test, test_pred))

print("Precision:", precision_score(
    y_test,
    test_pred,
    average="weighted"
))

print("Recall   :", recall_score(
    y_test,
    test_pred,
    average="weighted"
))

print("F1 Score :", f1_score(
    y_test,
    test_pred,
    average="weighted"
))

print("\nClassification Report")
print("--------------------------------")

print(classification_report(y_test, test_pred))

print("\nConfusion Matrix")
print("--------------------------------")

print(confusion_matrix(y_test, test_pred))

# ============================================================
# Save Model
# ============================================================

model_dir = Path(__file__).resolve().parent.parent / "models_trained"
model_dir.mkdir(parents=True, exist_ok=True)

joblib.dump(
    best_model,
    model_dir / "catboost_failure_mode_optimized.pkl"
)

joblib.dump(
    label_encoder,
    model_dir / "failure_mode_label_encoder.pkl"
)

with open(
    model_dir / "catboost_failure_mode_best_params.json",
    "w"
) as f:

    json.dump(
        study.best_params,
        f,
        indent=4
    )

print("\nOptimized classifier saved successfully.")

print("Label Encoder saved successfully.")

print("Best parameters saved successfully.")