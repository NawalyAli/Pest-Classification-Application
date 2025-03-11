import React, { useState } from "react";
import axios from "axios";
import { CircularProgress, Button, Card, CardContent, Typography, Box, Snackbar, Alert } from "@mui/material";
import { CloudUpload, BugReport } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";

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
  const [error, setError] = useState(null);

  // Drag & Drop File Handler
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: false,
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    },
  });

  // Upload Image for Classification
  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`http://127.0.0.1:5000/predict?t=${Date.now()}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const pest = response.data.class;
      setResult({ pest, ...pestInfo[pest] });
    } catch (error) {
      console.error("Error uploading file:", error.response ? error.response.data : error.message);
      setError("Failed to classify the image. Please try again.");
    }

    setLoading(false);
  };

  // Reset the app state
  const handleReset = () => {
    setFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <Box sx={styles.container}>
      <Card sx={styles.card}>
        <Typography variant="h4" sx={styles.header}>
          🐛 Pest Classification
        </Typography>

        {/* Drag & Drop Area */}
        <Box {...getRootProps()} sx={styles.dropzone}>
          <input {...getInputProps()} />
          {imagePreview ? (
            <img src={imagePreview} alt="Uploaded" style={styles.image} />
          ) : (
            <Typography color="textSecondary" sx={styles.dropzoneText}>
              Drag & drop an image here, or click to select a file
            </Typography>
          )}
        </Box>

        {/* Upload Button & Loader */}
        <Box sx={styles.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUpload />}
            onClick={handleUpload}
            disabled={loading || !file}
            sx={styles.button}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Upload & Classify"}
          </Button>
        </Box>

        {/* Classification Results */}
        {result && (
          <CardContent sx={{ ...styles.resultBox, backgroundColor: result.harmful ? "#f8d7da" : "#d4edda" }}>
            <Typography variant="h6" sx={styles.resultHeader}>
              <BugReport fontSize="large" /> {result.pest}
            </Typography>
            <Typography variant="body1">
              <strong>Harmful:</strong> {result.harmful ? "✅ Yes" : "❌ No"}
            </Typography>
            <Typography variant="body1">
              <strong>Affected Crop:</strong> {result.crop}
            </Typography>
          </CardContent>
        )}

        {/* Reset Button */}
        {result && (
          <Box sx={styles.buttonContainer}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CloudUpload />}
              onClick={handleReset}
              sx={styles.button}
            >
              Upload New Image
            </Button>
          </Box>
        )}
      </Card>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f7fc",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  dropzone: {
    border: "2px dashed #007bff",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#f9f9f9",
    marginBottom: "20px",
  },
  dropzoneText: {
    color: "#666",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "300px",
    borderRadius: "10px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "8px",
  },
  resultBox: {
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  resultHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
};

export default App;

