const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imagePath: { type: String, required: true },
  diseaseLabel: { type: String },
  confidence: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;
