const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const evalSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Eval = mongoose.model('Eval', evalSchema);

module.exports = Eval;
