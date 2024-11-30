import express from 'express';
import fileUpload from 'express-fileupload';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Directory setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4000;

// Hugging Face API details
const hfToken = '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'; // Replace with your Hugging Face token
const modelUrl = 'https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification';

// Middleware for file uploads
app.use(fileUpload());

// Serve static files (CSS, JS, images) from the `public` directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve the frontend HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'diagnosis.html'));
});

// Load JSON data from the file
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8'));

// Function to call Hugging Face API with retry logic
const callHuggingFaceAPI = async (imageBuffer, retries = 3, delay = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`Attempt ${attempt}: Sending request to Hugging Face API...`);
    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: imageBuffer.toString('base64'),
      }),
    });

    if (response.ok) {
      console.log("Hugging Face API request successful.");
      return await response.json();
    } else {
      const errorText = await response.text();
      console.log(`Hugging Face API response: ${errorText}`);

      const error = JSON.parse(errorText);
      if (response.status === 503 && error.error.includes('currently loading')) {
        console.log(`Model is loading. Retrying in ${delay / 1000} seconds... (Attempt ${attempt}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
      } else {
        throw new Error(`Error calling Hugging Face API: ${response.status} - ${error.error}`);
      }
    }
  }

  throw new Error('Hugging Face API is unavailable after retries.');
};

// Diagnose route
app.post('/diagnose', async (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).send('No image uploaded.');
  }

  const imageFile = req.files.image;
  const uploadDir = path.join(__dirname, '../uploads');
  const imagePath = path.join(uploadDir, imageFile.name);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  imageFile.mv(imagePath, async (err) => {
    if (err) {
      console.error('Error saving file:', err);
      return res.status(500).send('Failed to save the image.');
    }

    console.log('Sending image to Hugging Face API...');

    try {
      const imageBuffer = fs.readFileSync(imagePath);
      const result = await callHuggingFaceAPI(imageBuffer);

      const prediction = result[0]; // Assuming the most probable result

      // Retrieve the disease details and supplements from data.json
      const diseaseDetails = data[prediction.label] || {};

      res.json({
        label: prediction.label,
        score: prediction.score,
        diseaseDetails,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    } finally {
      // Clean up the file after processing
      fs.unlinkSync(imagePath);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
