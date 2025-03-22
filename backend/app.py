from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import os
import pymongo
import torch
from Predict import predict_image, return_model
from werkzeug.utils import secure_filename
from PIL import Image

# Initialize Flask App
app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'amitk22'  # Changed for session-based auth
bcrypt = Bcrypt(app)

# MongoDB Connection
MONGO_URI = "mongodb+srv://amitk200703:QOUaCOsofITfX1PH@cluster0.lpufl.mongodb.net/user_registration?retryWrites=true&w=majority&appName=Cluster0"
client = pymongo.MongoClient(MONGO_URI)
db = client['medical_app']
users_collection = db['users']
reports_collection = db["reports"]

# Upload Folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load Breast Cancer Model
model_path = os.path.join("Model", "cancer_model_V1.pth")
model = return_model(model_path)

# User Registration
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = {"email": data['email'], "password": hashed_password, "role": data['role']}
    users_collection.insert_one(user)
    return jsonify({"message": "User registered successfully"}), 201

# User Login (Session-based)
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one({"email": data["email"]})
    
    if user and bcrypt.check_password_hash(user["password"], data["password"]):
        session['user'] = {"email": user["email"], "role": user["role"]}  # Store session
        return jsonify({"message": "Login successful", "user": session['user']})

    return jsonify({"error": "Invalid credentials"}), 401

# User Logout
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({"message": "Logged out successfully"})

# Predict Breast Cancer (No authentication required)
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
    
    # Save report in MongoDB
    report = {"filename": filename, "prediction": result}
    reports_collection.insert_one(report)
    
    return jsonify({"prediction": result})

if __name__ == '__main__':
    app.run(debug=True)