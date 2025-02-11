import os
import torch
import torch.nn as nn
import torch.optim as optim
import torchvision.transforms as transforms
import torchvision.models as models
from torch.utils.data import DataLoader, Dataset
from PIL import Image
import glob

# Define dataset paths
train_image_path = r"C:\Users\Nawal\OneDrive\Desktop\Pest-Classification2.0\IP102_YOLOv5\images\train"
val_image_path = r"C:\Users\Nawal\OneDrive\Desktop\Pest-Classification2.0\IP102_YOLOv5\images\val"
train_label_path = r"C:\Users\Nawal\OneDrive\Desktop\Pest-Classification2.0\IP102_YOLOv5\labels\train"
val_label_path = r"C:\Users\Nawal\OneDrive\Desktop\Pest-Classification2.0\IP102_YOLOv5\labels\val"

# Transformations
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])


# Custom dataset class
class PestDataset(Dataset):
    def __init__(self, image_dir, label_dir, transform=None):
        self.image_paths = glob.glob(os.path.join(image_dir, "*.jpg"))
        self.label_dir = label_dir
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        image_path = self.image_paths[idx]
        image_name = os.path.basename(image_path).replace(".jpg", ".txt")
        label_path = os.path.join(self.label_dir, image_name)

        # Open image
        image = Image.open(image_path).convert("RGB")
        if self.transform:
            image = self.transform(image)

        # Read label
        with open(label_path, "r") as f:
            label = int(f.readline().strip().split()[0])  # Assuming the first number is the class ID

        return image, label


if __name__ == "__main__":
    # Load datasets
    train_dataset = PestDataset(train_image_path, train_label_path, transform=transform)
    val_dataset = PestDataset(val_image_path, val_label_path, transform=transform)

    train_loader = DataLoader(train_dataset, batch_size=8, shuffle=True, num_workers=4)
    val_loader = DataLoader(val_dataset, batch_size=8, shuffle=False, num_workers=4)

    # Define model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)  # Updated for newer torchvision versions
    model.fc = nn.Linear(model.fc.in_features, 102)  # Assuming 102 pest classes
    model = model.to(device)

    # Define loss and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.0001)

    # Training loop
    num_epochs = 10
    best_val_acc = 0.0  # Track best validation accuracy
    best_model_path = "best_pest_classification_model.pth"

    for epoch in range(num_epochs):
        model.train()
        total_loss = 0
        correct_train = 0
        total_train = 0

        print(f"🚀 Epoch {epoch+1}/{num_epochs} starting...")

        for i, (images, labels) in enumerate(train_loader):
            images, labels = images.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)

            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

            # Compute training accuracy
            _, predicted = torch.max(outputs, 1)
            correct_train += (predicted == labels).sum().item()
            total_train += labels.size(0)

            # Print loss every 100 batches
            if i % 100 == 0:
                print(f"🟢 Epoch {epoch+1}, Batch {i}/{len(train_loader)}: Loss = {loss.item():.4f}")

        avg_loss = total_loss / len(train_loader)
        train_acc = 100 * correct_train / total_train
        print(f"✅ Epoch {epoch+1} complete. Avg Loss: {avg_loss:.4f}, Training Accuracy: {train_acc:.2f}%")

        # ---- Validation ----
        model.eval()
        correct_val = 0
        total_val = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)

                _, predicted = torch.max(outputs, 1)
                correct_val += (predicted == labels).sum().item()
                total_val += labels.size(0)

        val_acc = 100 * correct_val / total_val
        print(f"🔵 Validation Accuracy: {val_acc:.2f}%")

        # Save the best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), best_model_path)
            print(f"💾 Best model saved with Validation Accuracy: {best_val_acc:.2f}%")

    print(f"🏆 Training complete. Best Model Saved at {best_model_path} with Accuracy: {best_val_acc:.2f}%")
