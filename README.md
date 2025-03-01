# Breast Cancer Prediction Model - Frontend Integration Guide

## Overview
This guide explains how to integrate the breast cancer prediction model into a frontend application. The model predicts whether an uploaded mammogram image contains cancerous clusters.

## Prerequisites
Ensure you have the following installed:
- Python 3.x
- PyTorch
- torchvision
- PIL (Pillow)
- Flask (for backend API)
- React (or any frontend framework of your choice)

## Backend Setup
1. **Create a Flask API to Serve Predictions**

Create a new Python file `app.py`:

```python
from flask import Flask, request, jsonify
import torch
from Predict import predict_image, return_model
import os
from werkzeug.utils import secure_filename
from PIL import Image

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load model
model_path = os.path.join("Model", "cancer_model_V1.pth")
model = return_model(model_path)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"})
    
    file = request.files['file']
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)
    
    # Predict using model
    prediction = predict_image(file_path, model)
    result = "Cancer clusters detected" if prediction == 1 else "No dangerous clusters found"
    
    return jsonify({"prediction": result})

if __name__ == '__main__':
    app.run(debug=True)
```

2. **Run the Flask Server**
```sh
python app.py
```

The API will be available at `http://127.0.0.1:5000/predict`.

## Frontend Integration (React Example)
1. **Install Axios**
```sh
npm install axios
```

2. **React Component for Uploading Images**
Create a `FileUpload.js` component:

```javascript
import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [prediction, setPrediction] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select an image");
            return;
        }
        
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            <button onClick={handleUpload}>Upload and Predict</button>
            {prediction && <p>Prediction: {prediction}</p>}
        </div>
    );
};

export default FileUpload;
```

3. **Use the Component in App.js**
```javascript
import React from "react";
import FileUpload from "./FileUpload";

const App = () => {
    return (
        <div>
            <h1>Breast Cancer Prediction</h1>
            <FileUpload />
        </div>
    );
};

export default App;
```

## Running the Frontend
```sh
npm start
```

Your frontend should now allow users to upload an image and receive a prediction from the backend API.

## Summary
- A Flask API handles model inference.
- The frontend (React) allows users to upload images and fetch predictions.
- Uses Axios for API communication.

This setup enables easy integration of the model into a web-based interface for breast cancer prediction.

