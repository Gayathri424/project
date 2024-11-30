// const express=require ('express');
// const Upload = require("../models/upload");
// const path=require('path');

// const fileUpload=require('express-fileupload');
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// const fileURLToPath=require('url');

// const router=express.Router();

// const fs= require('fs');
// router.use(fileUpload({
//   limits: { fileSize: 50 * 1024 * 1024 },}));

// const hfToken = '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'; // Replace with your Hugging Face token
// const modelUrl = 'https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification';

// const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8'));
// const multer=require('multer');
// const axios=require('axios');

// const storage=multer.diskStorage({
//     destination:function(req,file,cb){
//       cb(null,'./uploads');
//     },
//     filename:function(req,file,cb){
//       cb(null,Date.now()+path.extname(file.originalname));
//     },
//   });
  
//   const upload=multer({storage});

// router.post('/', upload.single('image'), async (req, res) => {
//     console.log('File:', req.file);
//     const { userId } = req.user._id;
//     console.log(req.body);
    
//         if (!req.files || !req.files.image) {
//           return res.status(400).send('No image uploaded.');
//         }
      
//         const imageFile = req.files.image;
//         const uploadDir = path.join(__dirname, '../uploads');
//         const imagePath = path.join(uploadDir, imageFile.name);
      
//         if (!fs.existsSync(uploadDir)) {
//           fs.mkdirSync(uploadDir);
//         }
      
//         imageFile.mv(imagePath, async (err) => {
//           if (err) {
//             console.error('Error saving file:', err);
//             return res.status(500).send('Failed to save the image.');
//           }
      
//           console.log('Sending image to Hugging Face API...');
      
//           try {
//             const imageBuffer = fs.readFileSync(imagePath);
//             const result = await callHuggingFaceAPI(imageBuffer);
      
//             const prediction = result[0]; // Assuming the most probable result
      
//             // Retrieve the disease details and supplements from data.json
//             const diseaseDetails = data[prediction.label] || {};
      
//             res.json({
//               label: prediction.label,
//               score: prediction.score,
//               diseaseDetails,
//             });
//           } catch (error) {
//             console.error(error.message);
//             res.status(500).send(error.message);
//           } finally {
//             // Clean up the file after processing
//             fs.unlinkSync(imagePath);
//           }
//         });
//         const modelResult = response.data;
//         if (modelResult && modelResult.length > 0) {
//             const diseaseLabel = modelResult[0].label;
//             const confidence = modelResult[0].score;
  
//             // Save to MongoDB
//             const newUpload = new Upload({
//                 userId,
//                 imagePath,
//                 diseaseLabel,
//                 confidence,
//             });
  
//             await newUpload.save();
  
//             // Send success response
//             res.status(200).json({
//                 message: 'Upload successful',
//                 data: {
//                     diseaseLabel,
//                     confidence,
//                 },
//             });
//         } else {
//             throw new Error(modelResult.error || 'Model returned an error');
//         }
//     } 
//   );

// Function to call Hugging Face API with retry logic
// const callHuggingFaceAPI = async (imageBuffer, retries = 3, delay = 5000) => {
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     console.log(`Attempt ${attempt}: Sending request to Hugging Face API...`);
//     const response = await fetch(modelUrl, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${hfToken}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         inputs: imageBuffer.toString('base64'),
//       }),
//     });

//     if (response.ok) {
//       console.log("Hugging Face API request successful.");
//       return await response.json();
//     } else {
//       const errorText = await response.text();
//       console.log(`Hugging Face API response: ${errorText}`);

//       const error = JSON.parse(errorText);
//       if (response.status === 503 && error.error.includes('currently loading')) {
//         console.log(`Model is loading. Retrying in ${delay / 1000} seconds... (Attempt ${attempt}/${retries})`);
//         await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
//       } else {
//         throw new Error(`Error calling Hugging Face API: ${response.status} - ${error.error}`);
//       }
//     }
//   }

//   throw new Error('Hugging Face API is unavailable after retries.');
// };


// router.post('/', async (req, res) => {
//   if (!req.files || !req.files.image) {
//     console.error('No file uploaded or missing "image" field in the form.');
//     return res.status(400).send('No image uploaded.');
//   }

//   const imageFile = req.files.image;
//   const uploadDir = path.join(__dirname, '../uploads');
//   const imagePath = path.join(uploadDir, imageFile.name);

//   if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
//   }

//   imageFile.mv(imagePath, async (err) => {
//     if (err) {
//       console.error('Error saving file:', err);
//       return res.status(500).send('Failed to save the image.');
//     }

//     console.log('Sending image to Hugging Face API...');

//     try {
//       const imageBuffer = fs.readFileSync(imagePath);
//       const result = await callHuggingFaceAPI(imageBuffer);

//       const prediction = result[0]; // Assuming the most probable result

//       // Retrieve the disease details and supplements from data.json
//       const diseaseDetails = data[prediction.label] || {};

//       res.json({
//         label: prediction.label,
//         score: prediction.score,
//         diseaseDetails,
//       });
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send(error.message);
//     } finally {
//       // Clean up the file after processing
//       fs.unlinkSync(imagePath);
//     }
//   });
// });

  
// module.exports=router;

const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
// router.use(express.json());
// router.use(express.urlencoded({extended:true}));
// Middleware for file uploads
router.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
  debug:true,
  }));

const fs = require('fs');
const path = require('path');
const Upload = require('../models/upload'); // Assuming you're using a MongoDB model for storing results
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


// Hugging Face API details
const hfToken = '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'; // Replace with your Hugging Face token
const modelUrl = 'https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification';



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
      console.log('Hugging Face API request successful.');
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

// Upload and diagnose route
router.post('/', async (req, res) => {
  console.log("request body:",req.body);
  if (!req.files || !req.files.image) {
    return res.status(400).send('No image uploaded.');
  }

  const imageFile = req.files.image[0];
  console.log("imagefile:",imageFile);
  const uploadDir = path.join(__dirname, '../uploads');

  try {
    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const imagePath = path.join(uploadDir, imageFile.name);

    // Save the uploaded image to the upload directory
    await imageFile.mv(imagePath);

    console.log('Sending image to Hugging Face API...');

    try {
      const imageBuffer = fs.readFileSync(imagePath);
      const result = await callHuggingFaceAPI(imageBuffer);

      const prediction = result[0]; // Assuming the most probable result
      console.log(prediction);
      // Retrieve the disease details and supplements from data.json
      const diseaseDetails = data[prediction.label] || {};
      const newUpload = new Upload({
        userId: req.user._id, 
        imagePath: `/uploads/${imageFile.name}`, // Relative path to access the uploaded file
        diseaseLabel: prediction.label,
        confidence: prediction.score,
      });
      await newUpload.save();

      res.json({
        label: prediction.label,
        score: prediction.score,
        diseaseDetails,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  } catch (err) {
    console.error('Error handling file upload:', err);
    res.status(500).send('Failed to process the image.');
  }
});
module.exports=router;