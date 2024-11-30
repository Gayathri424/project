# Use a pipeline as a high-level helper
from transformers import pipeline

pipe = pipeline("image-classification", model="linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification")