# train_skin_model.py
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.utils.class_weight import compute_class_weight
import os

# --- 1. Load and Prepare Data ---
df = pd.read_csv('HAM10000_metadata.csv')
base_image_dir = 'datasets/skin_images'
df['image_path'] = df['image_id'].apply(lambda x: os.path.join(base_image_dir, f'{x}.jpg'))
df = df[df['image_path'].apply(os.path.exists)]

le = LabelEncoder()
df['label'] = le.fit_transform(df['dx'])
train_df, _ = train_test_split(df, test_size=0.2, random_state=42, stratify=df['label'])

# --- 2. Calculate Class Weights ---
class_weights = compute_class_weight(
    class_weight='balanced',
    classes=np.unique(train_df['label']),
    y=train_df['label']
)
class_weights_dict = dict(enumerate(class_weights))
print("Class Weights to fix imbalance:", class_weights_dict)

# --- 3. Image Data Generators (Using the full dataframe for generator setup) ---
IMG_SIZE = 224
BATCH_SIZE = 32
datagen = ImageDataGenerator(
    rescale=1./255.,
    validation_split=0.2, # Let the generator handle the split
    rotation_range=20, width_shift_range=0.1, height_shift_range=0.1,
    shear_range=0.1, zoom_range=0.1, horizontal_flip=True, fill_mode='nearest'
)
df['label'] = df['label'].astype(str) # Generator needs string labels

train_generator = datagen.flow_from_dataframe(
    df, x_col='image_path', y_col='label',
    target_size=(IMG_SIZE, IMG_SIZE), batch_size=BATCH_SIZE,
    class_mode='categorical', subset='training', shuffle=True
)
validation_generator = datagen.flow_from_dataframe(
    df, x_col='image_path', y_col='label',
    target_size=(IMG_SIZE, IMG_SIZE), batch_size=BATCH_SIZE,
    class_mode='categorical', subset='validation', shuffle=False
)

# --- 4. Build & Train Model ---
base_model = MobileNetV2(input_shape=(IMG_SIZE, IMG_SIZE, 3), include_top=False, weights='imagenet')
base_model.trainable = False
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(1024, activation='relu')(x)
predictions = Dense(len(le.classes_), activation='softmax')(x)
model = Model(inputs=base_model.input, outputs=predictions)
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

print("Training balanced model...")
model.fit(
    train_generator,
    epochs=10, # Increased epochs for better learning
    validation_data=validation_generator,
    class_weight=class_weights_dict # <-- APPLYING THE FIX
)

# --- 5. Save the Final Model ---
SAVE_DIR = 'saved_models'
os.makedirs(SAVE_DIR, exist_ok=True)
model.save(os.path.join(SAVE_DIR, 'skin_model.h5'))
np.save(os.path.join(SAVE_DIR, 'skin_classes.npy'), le.classes_)
print("✅ New balanced skin model saved!")