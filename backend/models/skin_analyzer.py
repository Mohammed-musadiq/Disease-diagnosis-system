# skin_analyzer.py
# Loads your trained TF model and returns prediction + short dynamic explanation.

import numpy as np
import tensorflow as tf
from PIL import Image
import os
from typing import Dict

# import label map if present; otherwise handle gracefully
try:
    from models.label_map import LABEL_MAP
except Exception:
    LABEL_MAP = {}

# import explanation logic from separate module
from models.disease_explainer import explain_disease

# safe load - raise helpful error if file missing
MODEL_PATH = os.path.join("saved_models", "skin_model.h5")
LABELS_PATH = os.path.join("saved_models", "skin_classes.npy")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")

MODEL = tf.keras.models.load_model(MODEL_PATH)

if os.path.exists(LABELS_PATH):
    LABELS = np.load(LABELS_PATH, allow_pickle=True)
else:
    LABELS = np.array([])

def preprocess(pil_img: Image.Image):
    img = pil_img.convert("RGB").resize((224, 224))
    img_array = np.asarray(img, dtype=np.float32)
    return np.expand_dims(img_array, axis=0) / 255.0

def _map_label(code):
    if isinstance(code, str):
        return LABEL_MAP.get(code, code)
    try:
        s = str(code)
        return LABEL_MAP.get(s, s)
    except Exception:
        return str(code)

def predict(pil_img: Image.Image):
    """
    Returns:
    {
      "top_label": "human friendly name",
      "confidence": float,
      "ranked": [{"label": "...", "prob": ...}, ...],
      "explanation": "short 2-sentence explanation"
    }
    """
    processed_img = preprocess(pil_img)
    predictions = MODEL.predict(processed_img)[0]

    if LABELS.size:
        labels_list = LABELS.tolist()
    else:
        labels_list = [str(i) for i in range(predictions.shape[0])]

    ranked = sorted(zip(labels_list, predictions.tolist()), key=lambda x: x[1], reverse=True)

    top_label_code = ranked[0][0]
    top_label_name = _map_label(top_label_code)

    explanation_struct = explain_disease(top_label_name)
    explanation_text = explanation_struct.get("explanation", "")

    return {
        "top_label": top_label_name,
        "confidence": float(ranked[0][1]),
        "ranked": [{"label": _map_label(l), "prob": float(p)} for l, p in ranked],
        "explanation": explanation_text
    }

# quick CLI test helper
if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python skin_analyzer.py <image_path>")
        sys.exit(1)
    img_path = sys.argv[1]
    if not os.path.exists(img_path):
        print("Image not found:", img_path)
        sys.exit(1)
    pil = Image.open(img_path)
    out = predict(pil)
    print("Prediction:", out["top_label"], f"(confidence: {out['confidence']:.3f})\n")
    print("Explanation:", out["explanation"])