const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  category: { type: String, required: true }, // e.g., IT, Sales, Banking, Government
  description: { type: String, required: true },
  skills: [String],
  location: String,
  salary: String,
  jobType: String,
  applyLink: { type: String, required: true },
  lastDateToApply: { type: Date, required: true },
  isExpired: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
