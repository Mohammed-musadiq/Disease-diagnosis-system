# train_xray_model.py
import tensorflow as tf
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

print("TensorFlow Version:", tf.__version__)

# --- 1. Define Directories and Parameters ---
train_dir = 'datasets/chest_xray/train'
val_dir = 'datasets/chest_xray/val'
IMG_SIZE = 224
BATCH_SIZE = 32

# --- 2. Image Data Generators with Augmentation ---
train_datagen = ImageDataGenerator(
    rescale=1./255.,
    rotation_range=15,
    width_shift_range=0.1,
    height_shift_range=0.1,
    shear_range=0.1,
    zoom_range=0.1,
    horizontal_flip=True,
    fill_mode='nearest'
)
val_datagen = ImageDataGenerator(rescale=1./255.)

try:
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='binary'
    )

    validation_generator = val_datagen.flow_from_directory(
        val_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='binary'
    )
except FileNotFoundError:
    print(f"Error: Could not find the dataset directories. Please make sure the 'datasets/chest_xray' folder is structured correctly.")
    exit()


# --- 3. Build the X-Ray Model (Transfer Learning) ---
print("Building X-ray model...")
base_model = MobileNetV2(
    input_shape=(IMG_SIZE, IMG_SIZE, 3),
    include_top=False,
    weights='imagenet'
)
base_model.trainable = False

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(512, activation='relu')(x)
x = Dropout(0.5)(x)
predictions = Dense(1, activation='sigmoid')(x)

# This is where the 'model' variable is created
model = Model(inputs=base_model.input, outputs=predictions)

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
model.summary()

# --- 4. Train the Model ---
print("Training X-ray model... This will take a while.")
EPOCHS = 5
history = model.fit(
    train_generator,
    epochs=EPOCHS,
    validation_data=validation_generator
)

# --- 5. Save the Model ---
SAVE_DIR = 'saved_models'
os.makedirs(SAVE_DIR, exist_ok=True) 

print(f"Saving X-ray model to {os.path.join(SAVE_DIR, 'xray_model.h5')}...")
model.save(os.path.join(SAVE_DIR, 'xray_model.h5'))

print("✅ Training complete and model saved!")