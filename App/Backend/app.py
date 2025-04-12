from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torchvision.transforms as transforms
from PIL import Image
import json
import time
from PIL import UnidentifiedImageError

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}})  # Allow all origins

# Load the trained model (Full model loading)
checkpoint_path = r"C:\Users\Nawal\OneDrive\Desktop\Pest-Classification-Application\best_pest_classification_model.pth"

try:
    model = torch.load(checkpoint_path, map_location="cpu", weights_only=False)  # Load full model
    model.eval()
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None  # Avoid crashes if model fails to load

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
harmful_pests = {"rice leaf roller", "rice leaf caterpillar", "paddy stem maggot", "asiatic rice borer", "yellow rice borer", "rice gall midge",
                 "Rice Stemfly", "brown plant hopper", "white backed plant hopper", "small brown plant hopper", "rice water weevil", "rice leafhopper",
                 "grain spreader thrips", "rice shell pest", "grub", "mole cricket", "wireworm", "white margined moth", "black cutworm", "large cutworm",
                 "yellow cutworm", "red spider", "corn borer", "army worm", "aphids", "Potosiabre vitarsis", "peach borer", "english grain aphid", "green bug",
                 "bird cherry-oataphid", "wheat blossom midge", "penthaleus major", "longlegged spider mite", "wheat phloeothrips", "wheat sawfly", "cerodonta denticornis",
                 "beet fly", "flea beetle", "cabbage army worm", "beet army worm", "Beet spot flies", "meadow moth", "beet weevil", "sericaorient alismots chulsky",
                 "alfalfa weevil", "flax budworm", "alfalfa plant bug", "tarnished plant bug", "Locustoidea", "lytta polita", "legume blister beetle", "blister beetle",
                 "therioaphis maculata Buckton", "odontothrips loti", "Thrips", "alfalfa seed chalcid", "Pieris canidia", "Apolygus lucorum", "Limacodidae",
                 "Viteus vitifoliae", "Colomerus vitis", "Brevipoalpus lewisi McGregor", "oides decempunctata","Polyphagotars onemus latus", "Pseudococcus comstocki Kuwana",
                 "parathrene regalis", "Ampelophaga", "Lycorma delicatula", "Xylotrechus", "Cicadella viridis", "Miridae", "Trialeurodes vaporariorum",
                 "Erythroneura apicalis", "Papilio xuthus", "Panonchus citri McGregor", "Phyllocoptes oleiverus ashmead", "Icerya purchasi Maskell", "Unaspis yanonensis",
                 "Ceroplastes rubens", "Chrysomphalus aonidum", "Parlatoria zizyphus Lucus", "Nipaecoccus vastalor", "Aleurocanthus spiniferus", "Tetradacus c Bactrocera minax",
                 "Dacus dorsalis(Hendel)", "Bactrocera tsuneonis", "Prodenia litura", "Adristyrannus", "Phyllocnistis citrella Stainton", "Toxoptera citricidus",
                 "Toxoptera aurantii", "Aphis citricola Vander Goot", "Scirtothrips dorsalis Hood", "Dasineura sp", "Lawana imitata Melichar", "Salurnis marginella Guerr",
                 "Deporaus marginatus Pascoe", "Chlumetia transversa", "Mango flat beak leafhopper", "Rhytidodera bowrinii white", "Sternochetus frigidus", "Cicadellidae"}


@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    # Debugging: Print filename & timestamp
    print(f"📸 Received file: {file.filename} at {time.strftime('%H:%M:%S')}")

    try:
        file.stream.seek(0)
        image = Image.open(file.stream).convert("RGB")
    except UnidentifiedImageError:
        return jsonify({"error": "Uploaded file is not a valid image"}), 400

    # Apply transformations
    image = transform(image).unsqueeze(0)  # Add batch dimension

    # Ensure fresh model inference every time
    with torch.no_grad():
        output = model(image)  # Get raw model outputs
        probabilities = torch.nn.functional.softmax(output, dim=1)  # Convert to probabilities
        confidence, predicted_class = torch.max(probabilities, 1)  # Get top class & confidence

    class_id = str(predicted_class.item())

    if class_id not in class_labels:
        print("⚠️ Class not found in labels")
        return jsonify({"error": "Class not found in labels"}), 500

    class_name = class_labels[class_id]
    is_harmful = class_name in harmful_pests

    print(f"✅ Classified as: {class_name} (Harmful: {is_harmful})")
    print(f"🎯 Confidence: {confidence.item()}")

    return jsonify({
        "class": class_name,
        "harmful": is_harmful,
        "confidence": confidence.item()
    }), 200


if __name__ == "__main__":
    app.run(debug=True)
