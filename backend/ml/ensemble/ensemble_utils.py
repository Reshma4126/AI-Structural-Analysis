# ============================================================
# AI-Powered Structural Decision Support Platform
# Adaptive Hybrid Ensemble Model (AHEM)
#
# File : ensemble_utils.py
#
# Purpose:
#     Common utility functions used by the ensemble.
#
# ============================================================

import json
import numpy as np
import pandas as pd

from pathlib import Path

from sklearn.metrics import (
    r2_score,
    mean_absolute_error,
    mean_squared_error,
    mean_absolute_percentage_error
)

from sklearn.ensemble import (
    RandomForestRegressor,
    ExtraTreesRegressor
)

from lightgbm import LGBMRegressor

from catboost import CatBoostRegressor


# ============================================================
# Dataset Path
# ============================================================

DATASET_PATH = (
    r"D:\studies\mini project\RC_Synthetic_Dataset_Generator"
    r"\generated_dataset\beam_ml_dataset.csv"
)


# ============================================================
# Models Folder
# ============================================================

MODEL_DIR = Path(__file__).resolve().parent.parent / "models_trained"

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# Load Dataset
# ============================================================

def load_dataset():

    df = pd.read_csv(DATASET_PATH)

    return df


# ============================================================
# Clean Column Names
#
# LightGBM does not allow:
#   Δ
#   #
#   %
#   ,
#   ()
#
# Therefore every model in the project should use
# these standardized names.
# ============================================================

def clean_columns(df):

    df = df.copy()

    df.columns = [

        "Width",

        "Depth",

        "Span",

        "Concrete_Strength",

        "Num_Tensile_Bars",

        "Diameter_Tensile_Bars",

        "Tension_Reinforcement_Ratio",

        "Num_Stirrup_Legs",

        "Stirrup_Spacing",

        "Stirrup_Diameter",

        "fy_Longitudinal_Bars",

        "fy_Stirrup_Bars",

        "Pmax",

        "Delta_ult",

        "Failure_Mode"

    ]

    return df


# ============================================================
# Feature Matrix
# ============================================================

def get_features(df):

    X = df.drop(
        columns=[
            "Pmax",
            "Delta_ult",
            "Failure_Mode"
        ]
    )

    return X


# ============================================================
# Regression Target
# ============================================================

def get_target(df, target):

    if target not in ["Pmax", "Delta_ult"]:

        raise ValueError(
            "Target must be either 'Pmax' or 'Delta_ult'"
        )

    return df[target]


# ============================================================
# Load Optimized Hyperparameters
# ============================================================

def load_best_params(filename):

    filepath = MODEL_DIR / filename

    with open(filepath, "r") as f:

        params = json.load(f)

    return params


# ============================================================
# Create Optimized Models
# ============================================================

def create_models(target="Pmax"):

    target = target.lower()

    if target == "pmax":

        rf_params = load_best_params(
            "random_forest_pmax_best_params.json"
        )

        et_params = load_best_params(
            "extra_trees_pmax_best_params.json"
        )

        lgbm_params = load_best_params(
            "lightgbm_pmax_best_params.json"
        )

        cat_params = load_best_params(
            "catboost_pmax_best_params.json"
        )

    else:

        rf_params = load_best_params(
            "random_forest_deltault_best_params.json"
        )

        et_params = load_best_params(
            "extra_trees_deltault_best_params.json"
        )

        lgbm_params = load_best_params(
            "lightgbm_deltault_best_params.json"
        )

        cat_params = load_best_params(
            "catboost_deltault_best_params.json"
        )

    rf = RandomForestRegressor(

        **rf_params,

        random_state=42,

        n_jobs=-1

    )

    et = ExtraTreesRegressor(

        **et_params,

        random_state=42,

        n_jobs=-1

    )

    lgbm = LGBMRegressor(

        **lgbm_params,

        random_state=42,

        verbosity=-1

    )

    cat = CatBoostRegressor(

        **cat_params,

        random_seed=42,

        verbose=0,

        loss_function="RMSE"

    )

    return {

        "Random Forest": rf,

        "Extra Trees": et,

        "LightGBM": lgbm,

        "CatBoost": cat

    }


# ============================================================
# Evaluate Regression
# ============================================================

def evaluate_model(y_true, prediction):

    metrics = {

        "R2":

            float(
                r2_score(
                    y_true,
                    prediction
                )
            ),

        "MAE":

            float(
                mean_absolute_error(
                    y_true,
                    prediction
                )
            ),

        "RMSE":

            float(
                np.sqrt(
                    mean_squared_error(
                        y_true,
                        prediction
                    )
                )
            ),

        "MAPE":

            float(
                mean_absolute_percentage_error(
                    y_true,
                    prediction
                )
            )

    }

    return metrics


# ============================================================
# Print Metrics
# ============================================================

def print_metrics(metrics):

    print("\n")

    print("=" * 60)

    print("Evaluation Metrics")

    print("=" * 60)

    for key, value in metrics.items():

        print(f"{key:10s}: {value:.6f}")


# ============================================================
# Save JSON
# ============================================================

def save_json(data, filename):

    filepath = MODEL_DIR / filename

    with open(filepath, "w") as f:

        json.dump(
            data,
            f,
            indent=4
        )


# ============================================================
# Save Predictions
# ============================================================

def save_predictions(df, filename):

    filepath = MODEL_DIR / filename

    df.to_csv(
        filepath,
        index=False
    )


# ============================================================
# End of File
# ============================================================