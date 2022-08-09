const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pizzaSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  additional: {
    type: Object,
    required: true,
  },
});

const Pizza = mongoose.model('Pizza', pizzaSchema);
module.exports = Pizza;
