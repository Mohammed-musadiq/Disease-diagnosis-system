# models/mri_analyzer.py
import numpy as np
import tensorflow as tf
from PIL import Image

MODEL = tf.keras.models.load_model('saved_models/mri_model.h5')
LABELS = np.load('saved_models/mri_classes.npy', allow_pickle=True)

def preprocess(pil_img):
    img = pil_img.convert("RGB").resize((224, 224))
    img_array = np.asarray(img)
    return np.expand_dims(img_array, axis=0) / 255.0

def predict(pil_img: Image.Image):
    processed_img = preprocess(pil_img)
    predictions = MODEL.predict(processed_img)[0]
    ranked = sorted(zip(LABELS.tolist(), predictions.tolist()), key=lambda x: x[1], reverse=True)
    return {
        "top_label": ranked[0][0],
        "confidence": ranked[0][1],
        "ranked": [{"label": l, "prob": p} for l, p in ranked],
    }