const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const structureSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   квартира: {
//     type: String,
//     required: true,
//   },
//   resources: {
//     type: Array,
//     required: true,
//   },
// });

const structureSchema = new Schema({
  structure: {
    type: String,
    required: true,
  },
});

const Structure = mongoose.model('Structure', structureSchema);

module.exports = Structure;
