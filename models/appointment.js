const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  service: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
