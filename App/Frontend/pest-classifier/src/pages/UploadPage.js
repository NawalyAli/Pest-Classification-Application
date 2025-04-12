// UploadPage.js
import React, { useState } from "react";
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";
import "./UploadPage.css";

// Define pest information
const pestInfo = {
"rice leaf roller": {affectedCrops: "Rice" },
  "rice leaf caterpillar": {affectedCrops: "Rice" },
  "paddy stem maggot": {affectedCrops: "Rice" },
  "asiatic rice borer": {affectedCrops: "Rice" },
  "yellow rice borer": {affectedCrops: "Rice" },
  "brown plant hopper": {affectedCrops: "Rice" },
  "aphids": {affectedCrops: "Various crops" },
  "army worm": {affectedCrops: "Various crops" },
  "corn borer": {affectedCrops: "Corn" },
  "mango flat beak leafhopper": {affectedCrops: "Mango" },
  "cabbage army worm": {affectedCrops: "Cabbage" },
  "alfalfa weevil": {affectedCrops: "Alfalfa" },
  "rice gall midge": {affectedCrops: "Rice" },
  "rice Stemfly": {affectedCrops: "Rice" },
  "white backed plant hopper": {affectedCrops: "Rice"},
  "small brown plant hopper": {affectedCrops: "Rice" },
  "rice water weevil": {affectedCrops: "Rice" },
  "rice leafhopper": {affectedCrops: "Rice"},
  "grain spreader thrips": {affectedCrops: "Rice"},
  "rice shell pest": {affectedCrops: "Rice"},
  "grub": {affectedCrops: "Various crops, including cereals, vegetables, and root crops."},
  "mole cricket": {affectedCrops: "Various crops, especially seedlings and root systems."},
  "wireworm": {affectedCrops: "Various crops, especially root crops and seedlings"},
  "white margined moth": {affectedCrops: "Various crops"},
  "black cutworm": {affectedCrops: "Various crops, especially seedlings."},
  "large cutworm": {affectedCrops: "Various crops, especially seedlings."},
  "yellow cutworm": {affectedCrops: "Various crops, especially seedlings."},
  "red spider": {affectedCrops: "Various crops, including fruits, vegetables, and ornamentals."},
  "Potosiabre vitarsis": {affectedCrops: "Information limited, potentially harmful to various plants."},
  "peach borer": {affectedCrops: "Primarily peach trees, but can affect other stone fruits."},
  "english grain aphid": {affectedCrops: "Primarily wheat and other grains."},
  "green bug": {affectedCrops: "Various crops"},
  "bird cherry-oataphid": {affectedCrops: "Primarily cereals"},
  "wheat blossom midge": {affectedCrops: "Wheat"},
  "penthaleus major": {affectedCrops: "Information limited, potentially harmful to various plants."},
  "longlegged spider mite": {affectedCrops: "Various plants"},
  "wheat phloeothrips": {affectedCrops: "Wheat"},
  "wheat sawfly": {affectedCrops: "Wheat"},
  "cerodonta denticornis": {affectedCrops: "Potentially harmful to grasses"},
  "beet fly": {affectedCrops: "Beet and related crops."},
  "flea beetle": {affectedCrops: "Various crops, especially seedlings and leafy vegetables."},
  "beet army worm": {affectedCrops: "Beet and related crops."},
  "Beet spot flies": {affectedCrops: "Beet"},
  "meadow moth": {affectedCrops: "Grasses and other plants."},
  "beet weevil": {affectedCrops: "Beet"},
  "sericaorient alismots chulsky": {affectedCrops: "Information limited, potentially harmful to various plants."},
  "flax budworm": {affectedCrops: "Flax"},
  "alfalfa plant bug": {affectedCrops: "Alfalfa"},
  "tarnished plant bug": {affectedCrops: "Various crops"},
  "Locustoidea": {affectedCrops: "Various crops"},
  "lytta polita": {affectedCrops: "Various crops"},
  "legume blister beetle": {affectedCrops: "Legumes and related crops."},
  "blister beetle": {affectedCrops: "Various crops"},
  "therioaphis maculata Buckton": {affectedCrops: "Alfalfa and other legumes"},
  "odontothrips loti": {affectedCrops: "Legumes"},
  "Thrips": {affectedCrops: "Various crops"},
  "alfalfa seed chalcid": {affectedCrops: "Alfalfa"},
  "Pieris canidia": {affectedCrops: "Various crops"},
  "Apolygus lucorum": {affectedCrops: "Various crops"},
  "Limacodidae": {affectedCrops: "Various crops"},
  "Viteus vitifoliae": {affectedCrops: "Grapes"},
  "Colomerus vitis": {affectedCrops: "Grapes"},
  "Brevipoalpus lewisi McGregor": {affectedCrops: "Citrus and other plants."},
  "oides decempunctata": {affectedCrops: "Makes it harder for grass and plants to grow."},
  "Polyphagotars onemus latus": {affectedCrops: "Various plants"},
  "Pseudococcus comstocki Kuwana": {affectedCrops: "Various plants"},
  "parathrene regalis": {affectedCrops: "Peach and other stone fruits."},
  "Ampelophaga": {affectedCrops: "Grapes"},
  "Lycorma delicatula": {affectedCrops: "Wide range of plants, including fruit trees, grapes, and hardwoods."},
  "Xylotrechus": {affectedCrops: "Trees and shrubs."},
  "Cicadella viridis": {affectedCrops: "Various plants"},
  "Miridae": {affectedCrops: "Various plants"},
  "Trialeurodes vaporariorum": {affectedCrops: "Various plants"},
  "Erythroneura apicalis": {affectedCrops: "Grapes and other plants"},
  "Papilio xuthus": {affectedCrops: "Citrus"},
  "Panonchus citri McGregor": {affectedCrops: "Citrus"},
  "Phyllocoptes oleiverus ashmead": {affectedCrops: "Citrus"},
  "Icerya purchasi Maskell": {affectedCrops: "Citrus and other plants"},
  "Unaspis yanonensis": {affectedCrops: "Citrus"},
  "Ceroplastes rubens": {affectedCrops: "Citrus and other plants"},
  "Chrysomphalus aonidum": {affectedCrops: "Citrus and other plants"},
  "Parlatoria zizyphus Lucus": {affectedCrops: "Citrus and other plants"},
  "Nipaecoccus vastalor": {affectedCrops: "Grapes and other plants"},
  "Aleurocanthus spiniferus": {affectedCrops: "Citrus and other plants"},
  "Tetradacus c Bactrocera minax": {affectedCrops: "Citrus"},
  "Dacus dorsalis(Hendel)": {affectedCrops: "Wide range of fruits and vegetables."},
  "Bactrocera tsuneonis": {affectedCrops: "Fruits"},
  "Prodenia litura": {affectedCrops: "Cotton and other crops."},
  "Adristyrannus": {affectedCrops: "Wide range of ornamental plants and fruits"},
  "Phyllocnistis citrella Stainton": {affectedCrops: "Citrus"},
  "Toxoptera citricidus": {affectedCrops: "Citrus"},
  "Toxoptera aurantii": {affectedCrops: "Citrus"},
  "Aphis citricola Vander Goot": {affectedCrops: "Citrus"},
  "Scirtothrips dorsalis Hood": {affectedCrops: "A wide range of crops, including chillies, cotton, peanuts, and others"},
  "Dasineura sp": {affectedCrops: "Various crops"},
  "Lawana imitata Melichar": {affectedCrops: "Specific host plants need to be identified, but planthoppers, in general, can be pests."},
  "Salurnis marginella Guerr": {affectedCrops: "Rice"},
  "Deporaus marginatus Pascoe": {affectedCrops: "Specific host plants need to be identified. Leaf-rolling weevils can damage foliage"},
  "Chlumetia transversa": {affectedCrops: "Rice"},
  "Rhytidodera bowrinii white": {affectedCrops: "Longhorn beetles often damage trees and shrubs. The specific host plant needs to be identified."},
  "Sternochetus frigidus": {affectedCrops: "Mango"},
  "Cicadellidae": {affectedCrops: "Various crops, including grains, vegetables, fruits, and trees. They can transmit plant diseases."}
};

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
  
    // Handle file selection
    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
  
      if (selectedFile) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setError(null); // Clear previous errors
        setResult(null); // Reset previous result
      }
    };
  
    // Handle file upload and classification
    const handleUpload = async () => {
      if (!file) {
        setError("Please select an image first!");
        return;
      }
  
      const formData = new FormData();
      formData.append("file", file);
      setLoading(true);
      setResult(null);
      setError(null);
  
      try {
        const response = await axios.post(
          `http://127.0.0.1:5000/predict?t=${Date.now()}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
  
        const pest = response.data.class;
        setResult({ pest, ...pestInfo[pest] });
      } catch (error) {
        console.error("Error uploading file:", error.response ? error.response.data : error.message);
        setError("Failed to classify. Invalid Format. Please try again.");
      }
  
      setLoading(false);
    };
  
    // Handle new image upload
    const handleNewUpload = () => {
      setFile(null);
      setPreview(null);
      setResult(null);
      setError(null);
    };
  
    return (
      <div className="upload-container">
        {/* File Upload Box */}
        {!preview && (
          <div className="upload-box">
            <FaCloudUploadAlt size={80} className="upload-icon" />
            <p>Drag & Drop An Image Here</p>
            <input type="file" accept="image/*" onChange={handleFileChange} id="file-input" />
            <label htmlFor="file-input" className="upload-button">Choose Image to Upload</label>
          </div>
        )}
  
        {/* Image Preview before classification */}
        {preview && !result && (
          <div className="preview-container">
            <img src={preview} alt="Uploaded Preview" className="uploaded-image" />
            <button onClick={handleUpload} className="upload-button">Classify Image</button>
          </div>
        )}
  
        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}
  
        {/* Loading State */}
        {loading && <p>Processing image...</p>}
  
        {/* Classification Result */}
        {result && (
          <div className={`result-box ${result.pest ? "recognized" : "unknown"}`}>
            <img src={preview} alt="Uploaded Pest" className="classified-image" />
            {result.pest ? (
              <>
                <h2>{result.pest}</h2>
                <p><strong>Affected Crops:</strong> {result.affectedCrops || "Unknown"}</p>
              </>
            ) : (
              <h2>Pest Unknown</h2>
            )}
            {/* Button to Upload a New Image */}
            <button onClick={handleNewUpload} className="upload-button new-upload">Upload New Image</button>
          </div>
        )}
      </div>
    );
  }

