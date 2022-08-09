const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  adress: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  pizza: {
    type: String,
    required: false,
  },
  additional: {
    type: Object,
    required: false,
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;