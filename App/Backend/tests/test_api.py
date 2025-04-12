import os
import io
import sys

import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from App.Backend.app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_predict_success(client):
    # Make sure the test image exists
    test_image_path = os.path.join("test_images", "pest.jpg")
    assert os.path.exists(test_image_path), "Test image not found!"

    with open(test_image_path, "rb") as img:
        data = {
            "file": (io.BytesIO(img.read()), "pest.jpg")
        }
        response = client.post("/predict", content_type="multipart/form-data", data=data)

    assert response.status_code == 200
    json_data = response.get_json()
    assert "class" in json_data
    assert "harmful" in json_data
    assert "confidence" in json_data

def test_predict_no_file(client):
    response = client.post("/predict", data={})
    assert response.status_code == 400
    assert response.get_json()["error"] == "No file uploaded"

def test_predict_invalid_file(client):
    fake_file = io.BytesIO(b"This is not an image.")
    data = {"file": (fake_file, "fake.txt")}
    response = client.post("/predict", content_type="multipart/form-data", data=data)
    assert response.status_code in [400, 500]  # Accept either depending on handling
