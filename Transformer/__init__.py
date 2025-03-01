# model.py
import torch
import torch.nn as nn
import torchvision.models as models

class CancerDetectionModel(nn.Module):
    def __init__(self, num_classes=2):
        super(CancerDetectionModel, self).__init__()
        self.backbone = models.resnet50(pretrained=True)
        in_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Linear(in_features, num_classes)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        x = self.backbone(x)
        return self.softmax(x)

# Example usage
def load_model():
    model = CancerDetectionModel()
    return model
