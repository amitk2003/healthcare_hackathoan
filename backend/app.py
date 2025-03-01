from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token
from flask_cors import CORS

import os
from PIL import Image
import pymongo
from Predict import predict_image, return_model
# Initialize Flask App
app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = 'amitk22'
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# MongoDB Connection
MONGO_URI = "mongodb+srv://amitk200703:QOUaCOsofITfX1PH@cluster0.lpufl.mongodb.net/user_registration?retryWrites=true&w=majority&appName=Cluster0"
client = pymongo.MongoClient(MONGO_URI)
db = client['medical_app']
users_collection = db['users']
reports_collection = db["reports"]

# Check MongoDB Connection
try:
    client.admin.command('ping')
    print("✅ Connected to MongoDB")
    print("🔗 URI:", MONGO_URI)
except Exception as e:
    print("❌ MongoDB Connection Error:", e)

# model related info

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load model
model_path = os.path.join("Model", "cancer_model_V1.pth")
model = return_model(model_path)





# Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = {
        "email": data['email'],
        "password": hashed_password,
        "role": data['role']
    }
    users_collection.insert_one(user)
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one({"email": data['email']})
    if user and bcrypt.check_password_hash(user['password'], data['password']):
        token = create_access_token(identity={"email": user['email'], "role": user['role']})
        return jsonify({"token": token, "user": {"email": user['email'], "role": user['role']}})
    return jsonify({"message": "Invalid credentials"}), 401


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

    if response.status_code == 200:
        result = response.json()
        report_data = {
            "user_email": user_email,
            "result": result
        }
        reports_collection.insert_one(report_data)
        return jsonify({"message": "Diagnosis completed", "result": result})
    else:
        return jsonify({"error": "Failed to get prediction"}), 500

@app.route("/history", methods=["GET"])
def history():
    user_email = request.args.get("user_email")
    reports = list(reports_collection.find({"user_email": user_email}, {"_id": 0}))
    return jsonify(reports)

# Run Flask Server
if __name__ == '__main__':
    app.run(debug=True)

