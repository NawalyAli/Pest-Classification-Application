from collections import OrderedDict
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torchvision.transforms as transforms
from PIL import Image
import io
import json
import torchvision.models as models

# Define the model class (exact same as in training)
class PestClassifier(torch.nn.Module):
    def __init__(self, num_classes=102):  # Ensure this matches training
        super(PestClassifier, self).__init__()
        self.model = models.resnet18(weights=None)
        self.model.fc = torch.nn.Linear(self.model.fc.in_features, num_classes)

    def forward(self, x):
        return self.model(x)

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Load the trained model checkpoint
checkpoint_path = r"C:\Users\Nawal\OneDrive\Desktop\Pest-Classification-Application\best_pest_classification_model.pth"

# Step 1: Load the checkpoint
checkpoint = torch.load(checkpoint_path, map_location="cpu")

# Check if it's a full model or a state_dict
if isinstance(checkpoint, dict) and "state_dict" in checkpoint:
    checkpoint = checkpoint["state_dict"]  # If using a checkpoint dict

# Step 2: Fix the key names if necessary
new_state_dict = OrderedDict()
for k, v in checkpoint.items():
    if k.startswith("model."):  # Remove "model." prefix if it exists
        k = k.replace("model.", "")
    elif k.startswith("module."):  # Remove "module." if trained with DataParallel
        k = k.replace("module.", "")
    new_state_dict[k] = v

# Step 3: Load the model architecture and state dict
model = PestClassifier(num_classes=102)  # Ensure num_classes matches training
model.load_state_dict(new_state_dict, strict=False)  # strict=False to ignore minor mismatches

# Set model to evaluation mode
model.eval()
print("✅ Model loaded successfully!")

# Define image transformations
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Load class labels
try:
    with open("class_labels.json", "r") as f:
        class_labels = json.load(f)
except FileNotFoundError:
    print("❌ Error: class_labels.json not found")
    class_labels = {}

# Define harmful pests (replace with actual names)
harmful_pests = {"Pest1", "Pest2"}

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    image = Image.open(io.BytesIO(file.read())).convert("RGB")
    image = transform(image).unsqueeze(0)  # Add batch dimension

    with torch.no_grad():
        output = model(image)
        _, predicted_class = torch.max(output, 1)

    class_id = str(predicted_class.item())

    if class_id not in class_labels:
        return jsonify({"error": "Class not found in labels"}), 500

    class_name = class_labels[class_id]
    is_harmful = class_name in harmful_pests

    return jsonify({"class": class_name, "harmful": is_harmful})

if __name__ == "__main__":
    app.run(debug=True)
