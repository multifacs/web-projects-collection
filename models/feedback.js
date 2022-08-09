const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  order: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;