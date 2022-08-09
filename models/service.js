const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
