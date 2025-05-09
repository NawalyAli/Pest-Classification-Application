import torch
import torch.nn as nn
import torch.optim as optim
import torchvision.transforms as transforms
import torchvision.models as models
from torch.utils.data import DataLoader, Dataset
from PIL import Image
import os
import glob
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# Define dataset paths
train_image_path = r"C:\Users\Nawal\OneDrive\Desktop\Pest-Classification2.0\IP102_YOLOv5\images\train"
val_image_path = r"C:\Users\Nawal\OneDrive\Desktop\Pest-Classification2.0\IP102_YOLOv5\images\val"
train_label_path = r"C:\Users\Nawal\OneDrive\Desktop\Pest-Classification2.0\IP102_YOLOv5\labels\train"
val_label_path = r"C:\Users\Nawal\OneDrive\Desktop\Pest-Classification2.0\IP102_YOLOv5\labels\val"

# Transformations (Data Augmentation)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(15),
    transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1),
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
            label = int(f.readline().strip().split()[0])

        return image, label


# Focal Loss Implementation
class FocalLoss(nn.Module):
    def __init__(self, gamma=2.0, alpha=None, reduction="mean"):
        super(FocalLoss, self).__init__()
        self.gamma = gamma
        self.alpha = alpha
        self.reduction = reduction
        self.ce_loss = nn.CrossEntropyLoss(reduction="none")

    def forward(self, logits, targets):
        ce_loss = self.ce_loss(logits, targets)
        pt = torch.exp(-ce_loss)
        focal_loss = (1 - pt) ** self.gamma * ce_loss

        if self.alpha is not None:
            alpha_factor = self.alpha[targets]
            focal_loss = alpha_factor * focal_loss

        if self.reduction == "mean":
            return focal_loss.mean()
        elif self.reduction == "sum":
            return focal_loss.sum()
        return focal_loss


if __name__ == "__main__":
    # Load datasets
    train_dataset = PestDataset(train_image_path, train_label_path, transform=transform)
    val_dataset = PestDataset(val_image_path, val_label_path, transform=transform)

    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True, num_workers=4)
    val_loader = DataLoader(val_dataset, batch_size=16, shuffle=False, num_workers=4)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Define model
    model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
    model.fc = nn.Sequential(
        nn.Dropout(0.5),
        nn.Linear(model.fc.in_features, 102)
    )
    model = model.to(device)

    # Define Focal Loss and optimizer
    criterion = FocalLoss(gamma=2.0)
    optimizer = optim.Adam(model.parameters(), lr=0.0001)

    # Training loop
    num_epochs = 10
    best_val_acc = 0.0  # Tracking the best validation accuracy
    best_model_path = "best_pest_classification_model.pth"

    # Lists to track metrics over epochs
    train_accuracies = []
    train_precisions = []
    train_recalls = []
    train_f1s = []

    val_accuracies = []
    val_precisions = []
    val_recalls = []
    val_f1s = []

    for epoch in range(num_epochs):
        model.train()
        total_loss = 0
        all_train_labels = []
        all_train_preds = []

        print(f"🚀 Epoch {epoch + 1}/{num_epochs} starting...")

        for i, (images, labels) in enumerate(train_loader):
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()

            _, predicted = torch.max(outputs, 1)
            all_train_labels.extend(labels.cpu().numpy())
            all_train_preds.extend(predicted.cpu().numpy())

            if i % 100 == 0:
                print(f"🟢 Epoch {epoch + 1}, Batch {i}/{len(train_loader)}: Loss = {loss.item():.4f}")

        # Training metrics
        train_acc = accuracy_score(all_train_labels, all_train_preds) * 100
        train_precision = precision_score(all_train_labels, all_train_preds, average='macro', zero_division=1)
        train_recall = recall_score(all_train_labels, all_train_preds, average='macro', zero_division=1)
        train_f1 = f1_score(all_train_labels, all_train_preds, average='macro', zero_division=1)

        train_accuracies.append(train_acc)
        train_precisions.append(train_precision)
        train_recalls.append(train_recall)
        train_f1s.append(train_f1)

        print(f"✅ Epoch {epoch + 1} Training Metrics:")
        print(f"    Accuracy:  {train_acc:.2f}%")
        print(f"    Precision: {train_precision:.4f}")
        print(f"    Recall:    {train_recall:.4f}")
        print(f"    F1 Score:  {train_f1:.4f}")

        # Validation
        model.eval()
        all_val_labels = []
        all_val_preds = []

        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                _, predicted = torch.max(outputs, 1)
                all_val_labels.extend(labels.cpu().numpy())
                all_val_preds.extend(predicted.cpu().numpy())

        val_acc = accuracy_score(all_val_labels, all_val_preds) * 100
        precision = precision_score(all_val_labels, all_val_preds, average="macro", zero_division=1)
        recall = recall_score(all_val_labels, all_val_preds, average="macro", zero_division=1)
        f1 = f1_score(all_val_labels, all_val_preds, average="macro", zero_division=1)
        print(
            f"🔵 Validation Accuracy: {val_acc:.2f}%, Precision: {precision:.4f}, Recall: {recall:.4f}, F1-score: {f1:.4f}")

        val_accuracies.append(val_acc)
        val_precisions.append(precision)
        val_recalls.append(recall)
        val_f1s.append(f1)

        # Save the best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model, best_model_path)  # Save the full model
            print(f"💾 Best model saved with Validation Accuracy: {best_val_acc:.2f}%")

    # Confusion Matrix
    cm = confusion_matrix(all_val_labels, all_val_preds)
    plt.figure(figsize=(12, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.title("Confusion Matrix")
    plt.show()

    print(f"🏆 Training complete. Best Model Saved at {best_model_path} with Accuracy: {best_val_acc:.2f}%")

    epochs = range(1, num_epochs + 1)

    plt.figure(figsize=(16, 10))

    # Accuracy
    plt.subplot(2, 2, 1)
    plt.plot(epochs, train_accuracies, label='Train Accuracy')
    plt.plot(epochs, val_accuracies, label='Val Accuracy')
    plt.title('Accuracy Over Epochs')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy (%)')
    plt.legend()
    plt.grid(True)

    # Precision
    plt.subplot(2, 2, 2)
    plt.plot(epochs, train_precisions, label='Train Precision')
    plt.plot(epochs, val_precisions, label='Val Precision')
    plt.title('Precision Over Epochs')
    plt.xlabel('Epoch')
    plt.ylabel('Precision')
    plt.legend()
    plt.grid(True)

    # Recall
    plt.subplot(2, 2, 3)
    plt.plot(epochs, train_recalls, label='Train Recall')
    plt.plot(epochs, val_recalls, label='Val Recall')
    plt.title('Recall Over Epochs')
    plt.xlabel('Epoch')
    plt.ylabel('Recall')
    plt.legend()
    plt.grid(True)

    # F1 Score
    plt.subplot(2, 2, 4)
    plt.plot(epochs, train_f1s, label='Train F1 Score')
    plt.plot(epochs, val_f1s, label='Val F1 Score')
    plt.title('F1 Score Over Epochs')
    plt.xlabel('Epoch')
    plt.ylabel('F1 Score')
    plt.legend()
    plt.grid(True)

    plt.tight_layout()
    plt.savefig("training_metrics_over_epochs.png")
    plt.show()
