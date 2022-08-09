const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const Service = require('./models/service');
const Appointment = require('./models/appointment');

const app = express();

app.set('view engine', 'ejs');

const PORT = 3000;
const db = 'mongodb+srv://user1:password2001@cluster0.azqca.mongodb.net/hairSalon?retryWrites=true&w=majority';

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log('Подключен к ДБ')
    console.log(`http://localhost:${PORT}/`)
  })
  .catch((error) => console.log(error));

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`Сервер запущен на порту ${PORT}`);
});

app.use(express.json());

const openingTime = 480
const closingTime = 840

app.get('/', async (req, res) => {
  const services = await Service.find()
  const appointments = await Appointment.find()

  res.render(path.resolve(__dirname, 'ejs-views', `index.ejs`), { openingTime, closingTime, services, appointments })
});

app.post('/', async (req, res) => {
  const { service, time } = req.body;
  const appointment = new Appointment({ service, time });
  await appointment.save()
  res.redirect('back');
});