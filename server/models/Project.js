const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  githubUrl: {
    type: String,
    required: true,
  },
  requirementsFileName: {
    type: String,
    required: true,
  },
  requirementsFilePath: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', ProjectSchema);
