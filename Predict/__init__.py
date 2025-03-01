import torch
from Transformer import load_model  # Assuming this loads the same model architecture
import torchvision.transforms as transforms
from PIL import Image
import os

# Device setup
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")




# Define the same transformation as used during training
transform = transforms.Compose([
    transforms.Resize((640, 640)),  # Ensure same dimensions
    transforms.ToTensor()
])

# Function to preprocess and predict
def predict_image(image_path, model):
    """Predicts the class of a given image."""
    if not os.path.exists(image_path):
        print(f"Error: File {image_path} not found!")
        return None

    image = Image.open(image_path).convert("RGB")  # Load image
    image = transform(image).unsqueeze(0).to(DEVICE)  # Apply transform and add batch dimension

    with torch.no_grad():  # Disable gradient calculation
        output = model(image)
        _, predicted_class = torch.max(output, 1)  # Get class with highest probability

    return predicted_class.item() 

def return_model(model_path):
    # Load model architecture
    model = load_model().to(DEVICE)

    # Load trained weights
    model.load_state_dict(torch.load(model_path, map_location=DEVICE))
    model.eval()  # Set model to evaluation mode
    return model

