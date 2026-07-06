import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib
import os

# Step 1: Load dataset
dataset_path = os.path.join(os.path.dirname(__file__), "../datasets/dataset.csv")
df = pd.read_csv(dataset_path)

# Step 2: Create pipeline
model_pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1,2))),
    ("clf", MultinomialNB())
])

# Step 3: Train model
model_pipeline.fit(df['text'], df['label'])

# Step 4: Save the model for future use
model_file = os.path.join(os.path.dirname(__file__), "text_analyzer_model.pkl")
joblib.dump(model_pipeline, model_file)

# Step 5: Prediction function
def predict(text: str):
    # Load model
    model = joblib.load(model_file)
    pred_label = model.predict([text])[0]
    probs = model.predict_proba([text])[0]
    top_prob = max(probs)
    
    # Build ranked list
    labels = model.classes_
    ranked = sorted(zip(labels, probs), key=lambda x: x[1], reverse=True)
    ranked_list = [{"label": l, "prob": float(p)} for l, p in ranked]
    
    return {
        "top_label": pred_label,
        "confidence": float(top_prob),
        "ranked": ranked_list
    }
