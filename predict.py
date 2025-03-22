from Predict import predict_image, return_model
import os 

model_path = os.path.join("Model", "cancer_model_V1.pth")
model = return_model(model_path)

image_path = "1-128.jpg"  # Change this to any test image path
predicted_label = predict_image(image_path, model) 

if predicted_label == 1:
    print("Cancer clusters detected")
elif predicted_label == 0:
    print("No dangerous clusters found")

