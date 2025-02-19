import React, { useState } from "react";
import axios from "axios";

// Pest dictionary with crop and harmful status
const pestInfo = {
  "rice leaf roller": { harmful: true, crop: "Rice" },
  "rice leaf caterpillar": { harmful: true, crop: "Rice" },
  "paddy stem maggot": { harmful: true, crop: "Rice" },
  "asiatic rice borer": { harmful: true, crop: "Rice" },
  "yellow rice borer": { harmful: true, crop: "Rice" },
  "brown plant hopper": { harmful: true, crop: "Rice" },
  "aphids": { harmful: true, crop: "Various crops" },
  "army worm": { harmful: true, crop: "Various crops" },
  "corn borer": { harmful: true, crop: "Corn" },
  "mango flat beak leafhopper": { harmful: true, crop: "Mango" },
  "cabbage army worm": { harmful: true, crop: "Cabbage" },
  "alfalfa weevil": { harmful: true, crop: "Alfalfa" },
  "rice gall midge": { harmful: true, crop: "Rice" },
  "rice Stemfly": { harmful: true, crop: "Rice" },
  "white backed plant hopper": { harmful: true, crop: "Rice"},
  "small brown plant hopper": { harmful: true, crop: "Rice" },
  "rice water weevil": { harmful: true, crop: "Rice" },
  "rice leafhopper": { harmful: true, crop: "Rice"},
  "grain spreader thrips": { harmful: true, crop: "Rice"},
  "rice shell pest": { harmful: true, crop: "Rice"},
  "grub": {harmful: true, crop: "Various crops, including cereals, vegetables, and root crops."},
  "mole cricket": {harmful: true, crop: "Various crops, especially seedlings and root systems."},
  "wireworm": { harmful: true, crop: "Various crops, especially root crops and seedlings"},
  "white margined moth": { harmful: true, crop: "Various crops"},
  "black cutworm": { harmful: true, crop: "Various crops, especially seedlings."},
  "large cutworm": { harmful: true, crop: "Various crops, especially seedlings."},
  "yellow cutworm": { harmful: true, crop: "Various crops, especially seedlings."},
  "red spider": { harmful: true, crop: "Various crops, including fruits, vegetables, and ornamentals."},
  "Potosiabre vitarsis": { harmful: true, crop: "Information limited, potentially harmful to various plants."},
  "peach borer": { harmful: true, crop: "Primarily peach trees, but can affect other stone fruits."},
  "english grain aphid": { harmful: true, crop: "Primarily wheat and other grains."},
  "green bug": { harmful: true, crop: "Various crops"},
  "bird cherry-oataphid": { harmful: true, crop: "Primarily cereals"},
  "wheat blossom midge": { harmful: true, crop: "Wheat"},
  "penthaleus major": { harmful: true, crop: "Information limited, potentially harmful to various plants."},
  "longlegged spider mite": { harmful: true, crop: "Various plants"},
  "wheat phloeothrips": { harmful: true, crop: "Wheat"},
  "wheat sawfly": { harmful: true, crop: "Wheat"},
  "cerodonta denticornis": { harmful: true, crop: "Potentially harmful to grasses"},
  "beet fly": { harmful: true, crop: "Beet and related crops."},
  "flea beetle": { harmful: true, crop: "Various crops, especially seedlings and leafy vegetables."},
  "beet army worm": { harmful: true, crop: "Beet and related crops."},
  "Beet spot flies": { harmful: true, crop: "Beet"},
  "meadow moth": { harmful: true, crop: "Grasses and other plants."},
  "beet weevil": { harmful: true, crop: "Beet"},
  "sericaorient alismots chulsky": { harmful: true, crop: "Information limited, potentially harmful to various plants."},
  "flax budworm": { harmful: true, crop: "Flax"},
  "alfalfa plant bug": { harmful: true, crop: "Alfalfa"},
  "tarnished plant bug": { harmful: true, crop: "Various crops"},
  "Locustoidea": { harmful: true, crop: "Various crops"},
  "lytta polita": { harmful: true, crop: "Various crops"},
  "legume blister beetle": { harmful: true, crop: "Legumes and related crops."},
  "blister beetle": { harmful: true, crop: "Various crops"},
  "therioaphis maculata Buckton": { harmful: true, crop: "Alfalfa and other legumes"},
  "odontothrips loti": { harmful: true, crop: "Legumes"},
  "Thrips": { harmful: true, crop: "Various crops"},
  "alfalfa seed chalcid": { harmful: true, crop: "Alfalfa"},
  "Pieris canidia": { harmful: true, crop: "Various crops"},
  "Apolygus lucorum": { harmful: true, crop: "Various crops"},
  "Limacodidae": { harmful: true, crop: "Various crops"},
  "Viteus vitifoliae": { harmful: true, crop: "Grapes"},
  "Colomerus vitis": { harmful: true, crop: "Grapes"},
  "Brevipoalpus lewisi McGregor": { harmful: true, crop: "Citrus and other plants."},
  "oides decempunctata": { harmful: true, crop: "Makes it harder for grass and plants to grow."},
  "Polyphagotars onemus latus": { harmful: true, crop: "Various plants"},
  "Pseudococcus comstocki Kuwana": { harmful: true, crop: "Various plants"},
  "parathrene regalis": { harmful: true, crop: "Peach and other stone fruits."},
  "Ampelophaga": { harmful: true, crop: "Grapes"},
  "Lycorma delicatula": { harmful: true, crop: "Wide range of plants, including fruit trees, grapes, and hardwoods."},
  "Xylotrechus": { harmful: true, crop: "Trees and shrubs."},
  "Cicadella viridis": { harmful: true, crop: "Various plants"},
  "Miridae": { harmful: true, crop: "Various plants"},
  "Trialeurodes vaporariorum": { harmful: true, crop: "Various plants"},
  "Erythroneura apicalis": { harmful: true, crop: "Grapes and other plants"},
  "Papilio xuthus": { harmful: true, crop: "Citrus"},
  "Panonchus citri McGregor": { harmful: true, crop: "Citrus"},
  "Phyllocoptes oleiverus ashmead": { harmful: true, crop: "Citrus"},
  "Icerya purchasi Maskell": { harmful: true, crop: "Citrus and other plants"},
  "Unaspis yanonensis": { harmful: true, crop: "Citrus"},
  "Ceroplastes rubens": { harmful: true, crop: "Citrus and other plants"},
  "Chrysomphalus aonidum": { harmful: true, crop: "Citrus and other plants"},
  "Parlatoria zizyphus Lucus": { harmful: true, crop: "Citrus and other plants"},
  "Nipaecoccus vastalor": { harmful: true, crop: "Grapes and other plants"},
  "Aleurocanthus spiniferus": { harmful: true, crop: "Citrus and other plants"},
  "Tetradacus c Bactrocera minax": { harmful: true, crop: "Citrus"},
  "Dacus dorsalis(Hendel)": { harmful: true, crop: "Wide range of fruits and vegetables."},
  "Bactrocera tsuneonis": { harmful: true, crop: "Fruits"},
  "Prodenia litura": { harmful: true, crop: "Cotton and other crops."},
  "Adristyrannus": { harmful: true, crop: "Wide range of ornamental plants and fruits"},
  "Phyllocnistis citrella Stainton": { harmful: true, crop: "Citrus"},
  "Toxoptera citricidus": { harmful: true, crop: "Citrus"},
  "Toxoptera aurantii": { harmful: true, crop: "Citrus"},
  "Aphis citricola Vander Goot": { harmful: true, crop: "Citrus"},
  "Scirtothrips dorsalis Hood": { harmful: true, crop: "A wide range of crops, including chillies, cotton, peanuts, and others"},
  "Dasineura sp": { harmful: true, crop: "Various crops"},
  "Lawana imitata Melichar": { harmful: true, crop: "Specific host plants need to be identified, but planthoppers, in general, can be pests."},
  "Salurnis marginella Guerr": { harmful: true, crop: "Rice"},
  "Deporaus marginatus Pascoe": { harmful: true, crop: "Specific host plants need to be identified. Leaf-rolling weevils can damage foliage"},
  "Chlumetia transversa": { harmful: true, crop: "Rice"},
  "Rhytidodera bowrinii white": { harmful: true, crop: "Longhorn beetles often damage trees and shrubs. The specific host plant needs to be identified."},
  "Sternochetus frigidus": { harmful: true, crop: "Mango"},
  "Cicadellidae": { harmful: true, crop: "Various crops, including grains, vegetables, fruits, and trees. They can transmit plant diseases."}
};

function App() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Preview image before upload
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first!");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    setLoading(true);
    setResult(null); // Reset previous result
  
    try {
      const response = await axios.post(`http://127.0.0.1:5000/predict?t=${Date.now()}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const pest = response.data.class;
      setResult({ pest, ...pestInfo[pest] });
    } catch (error) {
      console.error("Error uploading file:", error.response ? error.response.data : error.message);
      alert("Failed to classify the image. Check the console for details.");
    }
  
    setLoading(false);
  };

  const handleNewUpload = () => {
    setFile(null);
    setImagePreview(null);
    setResult(null);
    setLoading(false);
  };
  
  

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Pest Classification</h2>

      <div style={styles.content}>
        {/* Left Side: Image Preview */}
        <div style={styles.imageContainer}>
          {imagePreview ? (
            <img src={imagePreview} alt="Uploaded" style={styles.image} />
          ) : (
            <p style={styles.placeholder}>Image Preview</p>
          )}
        </div>

        {/* Right Side: Classification Results */}
        <div style={styles.resultContainer}>
          {result ? (
            <div style={{ ...styles.resultBox, backgroundColor: result.harmful ? "#ffcccc" : "#ccffcc" }}>
              <h3>Classification Result:</h3>
              <p><strong>Pest Type:</strong> {result.pest}</p>
              <p><strong>Harmful:</strong> {result.harmful ? "✅ Yes" : "❌ No"}</p>
              <p><strong>Affected Crop:</strong> {result.crop || "Unknown"}</p>
            </div>
          ) : (
            <p style={styles.placeholder}>No classification yet</p>
          )}
        </div>
      </div>

      {/* Bottom Section: Upload Controls */}
      <div style={styles.bottomSection}>
      <input 
      key={file ? file.name : "new-file"}
      type="file"
      accept="image/*" 
      onChange={handleFileChange} 
      style={styles.fileInput}

      />

        <button 
          onClick={handleUpload} 
          disabled={loading} 
          style={{ ...styles.button, backgroundColor: loading ? "gray" : "#007bff" }}
        >
          {loading ? "Classifying..." : "Upload & Classify"}
        </button>
        {result && (
          <button onClick={handleNewUpload} style={styles.newUploadButton}>
            Upload New Image
          </button>
        )}
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
  },
  imageContainer: {
    width: "300px",
    height: "300px",
    border: "2px dashed #ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: "10px",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  resultContainer: {
    width: "300px",
    minHeight: "200px",
    border: "1px solid #ccc",
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  resultBox: {
    padding: "15px",
    borderRadius: "10px",
  },
  placeholder: {
    color: "#888",
  },
  bottomSection: {
    marginTop: "20px",
  },
  fileInput: {
    marginBottom: "10px",
  },
  button: {
    padding: "10px 15px",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    marginLeft: "10px",
  },
  newUploadButton: {
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    marginLeft: "10px",
  },
};

export default App;

