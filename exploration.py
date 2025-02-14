import os
import glob
import numpy as np
import matplotlib.pyplot as plt
from collections import Counter
from PIL import Image
import seaborn as sns

# Define dataset paths
train_image_path = r"C:\Users\Nawal\OneDrive\Desktop\Pest-Classification2.0\IP102_YOLOv5\images\train"
train_label_path = r"C:\Users\Nawal\OneDrive\Desktop\Pest-Classification2.0\IP102_YOLOv5\labels\train"

# Get all image and label file paths
image_paths = glob.glob(os.path.join(train_image_path, "*.jpg"))
label_paths = glob.glob(os.path.join(train_label_path, "*.txt"))

# Check number of images and labels
print(f"Total Images: {len(image_paths)}")
print(f"Total Labels: {len(label_paths)}")

# Check for missing or corrupt data
missing_labels = [img for img in image_paths if not os.path.exists(img.replace(
    "images", "labels").replace(".jpg", ".txt"))]
missing_images = [lbl for lbl in label_paths if not os.path.exists(lbl.replace(
    "labels", "images").replace(".txt", ".jpg"))]
print(f"Missing Labels: {len(missing_labels)}")
print(f"Missing Images: {len(missing_images)}")

# Plot class distribution
class_counts = Counter()
for label_path in label_paths:
    with open(label_path, "r") as f:
        for line in f:
            class_id = int(line.strip().split()[0])
            class_counts[class_id] += 1

plt.figure(figsize=(12, 6))
sns.barplot(x=list(class_counts.keys()), y=list(class_counts.values()), palette="viridis",
            hue=list(class_counts.keys()), legend=False)
plt.xlabel("Class ID")
plt.ylabel("Count")
plt.title("Class Distribution in Training Data")
plt.show()

# Analyze image sizes
image_sizes = []
for img_path in image_paths:
    with Image.open(img_path) as img:
        image_sizes.append(img.size)  # (width, height)

image_sizes = np.array(image_sizes)

# Convert image sizes to numpy array for easier analysis
widths, heights = image_sizes[:, 0], image_sizes[:, 1]

# Plot Image Size Distribution
plt.figure(figsize=(10, 5))
sns.histplot(widths, bins=30, color='blue', kde=True, label="Width")
sns.histplot(heights, bins=30, color='red', kde=True, label="Height")
plt.xlabel("Pixels")
plt.ylabel("Count")
plt.title("Image Size Distribution")
plt.legend()
plt.show()

# Calculate and output the average image resolution
avg_width = np.mean(widths)
avg_height = np.mean(heights)
print(f"Average Image Resolution: {int(avg_width)}x{int(avg_height)} pixels")

# Show 5 Random Images from Training Dataset
random_images = np.random.choice(image_paths, 5, replace=False)
plt.figure(figsize=(15, 5))
for i, img_path in enumerate(random_images):
    with Image.open(img_path) as img:
        plt.subplot(1, 5, i+1)
        plt.imshow(img)
        plt.axis("off")
        plt.title(os.path.basename(img_path))
plt.show()
