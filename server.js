const express = require('express');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Structure = require('./models/structure.js');

const app = express();

app.set('view engine', 'ejs');

const PORT = 3000;
const db = 'mongodb+srv://user1:password2001@cluster0.azqca.mongodb.net/HCS?retryWrites=true&w=majority';

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log('Connected to DB'))
  .catch((error) => console.log(error));

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const fetchStructure = async () => {
  return JSON.parse((await Structure.find())[0].structure)
}

let Data = false

const createData = async () => {
  const structure = await fetchStructure()
  let data = {}

  for (const [key, value] of Object.entries(structure)) {
    if (value == 'number') {
      data[key] = {
        type: Number,
        required: true,
      }
    } else if (typeof(value) == 'string') {
      data[key] = {
        type: String,
        required: true,
      }
    } else if (Array.isArray(value)) {
      data[key] = {
        type: Array,
        required: true,
      }
    }
  }

  Data = mongoose.model('Data', new Schema(data, { timestamps: true }));
}

app.get('/', async (req, res) => {
  res.render(__dirname + '/ejs-views/index.ejs', { structure: await fetchStructure() })
});

app.post('/', async (req, res) => {
  const body = req.body

  let data = {}
  for (const [key, value] of Object.entries(body)) {
    if (typeof(value) == 'number') {
      data[key] = {
        type: Number,
        required: true,
      }
    } else if (typeof(value) == 'string') {
      data[key] = {
        type: String,
        required: true,
      }
    } else if (Array.isArray(value)) {
      data[key] = {
        type: Array,
        required: true,
      }
    }
  }

  if (!Data) {
    Data = mongoose.model('Data', new Schema(data, { timestamps: true }));
  }

  const user_data = new Data(body)

  user_data
    .save()
    .then((result) => res.redirect(`/data/${result._id}`))
});

app.get('/data/:id', async (req, res) => {
  if (!Data) {
    await createData()
  }

  console.log(req.params.id)

  Data
    .findById(req.params.id)
    .then((data) => res.render(__dirname + '/ejs-views/data.ejs', { data }))
});

app.get('/data', async (req, res) => {
  if (!Data) {
    await createData()
  }

  Data
    .find()
    .then((data) => res.render(__dirname + '/ejs-views/all_data.ejs', { data }))
});