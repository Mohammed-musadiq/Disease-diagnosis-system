# models/xray_analyzer.py
import numpy as np
import tensorflow as tf
from PIL import Image

MODEL = tf.keras.models.load_model('saved_models/xray_model.h5')
LABELS = ['NORMAL', 'PNEUMONIA']

def preprocess(pil_img):
    img = pil_img.convert("RGB").resize((224, 224))
    img_array = np.asarray(img)
    return np.expand_dims(img_array, axis=0) / 255.0

def predict(pil_img: Image.Image):
    processed_img = preprocess(pil_img)
    prediction = MODEL.predict(processed_img)[0][0]
    
    if prediction > 0.5:
        top_label, confidence = 'PNEUMONIA', prediction
    else:
        top_label, confidence = 'NORMAL', 1 - prediction
        
    return {
        "top_label": top_label,
        "confidence": float(confidence),
        "ranked": [
            {"label": "PNEUMONIA", "prob": float(prediction)},
            {"label": "NORMAL", "prob": float(1 - prediction)}
        ]
    }