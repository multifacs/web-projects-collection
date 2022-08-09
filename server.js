const express = require('express');
const fs = require('fs');
const upload = require('express-fileupload');
const uploadFolder = './uploads/';

const mongoose = require('mongoose');
const Eval = require('./models/eval');

const app = express();

app.set('view engine', 'ejs');

const PORT = 3000;
const db = 'mongodb+srv://user1:password2001@cluster0.azqca.mongodb.net/evalSystem?retryWrites=true&w=majority';
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(PORT);

app.use(upload());
app.use(express.static('uploads'));

app.get('/', (req, res) => {
  res.render(__dirname + '/views/' + 'index.ejs');
});

const countRates = async () => {
  const contents = fs.readdirSync(uploadFolder)
  const rates = []

  let idx = 0
  for (const file of contents) {
    const ratesNum = (await Eval.find({ id: `${idx}` })).length
    console.log(ratesNum)
    rates.push({rates: ratesNum, id: idx, file});
    idx += 1
  }

  rates.sort();
  rates.sort((a, b) => {
    if (a.rates > b.rates) {
      return 1;
    }
    if (a.rates < b.rates) {
      return -1;
    }
    // a должно быть равным b
    return 0;
  });
  while (rates.length > 3) {
    rates.pop();
  }
  console.log(rates);
  return rates;
}

app.post('/', async (req, res) => {
  if (req.files) {
    const contents = fs.readdirSync(uploadFolder)

    console.log(req.files)
    const file = req.files.file
    const filename = contents.length + '_' + file.name;
    console.log(filename)

    file.mv(uploadFolder + filename, (err) => {
      if (err) {
        res.send(err)
      } else {
        res.redirect('/evals');
      }
    });
  }
});

app.get('/evals', async (req, res) => {
  const uploads = await countRates();
  res.render(__dirname + '/views/' + 'to_eval.ejs', { uploads });
});


app.get('/eval/:id', async (req, res) => {
  const contents = fs.readdirSync(uploadFolder)
  const id = req.params.id

  if (id >= contents.length) {
    res.send('Не найдено')
    return
  }

  let prev
  if (id - 1 < 0) {
    prev = contents.length - 1
  } else {
    prev = id - 1
  }
  const next = (parseInt(id) + 1) % contents.length 

  const ext = contents[id].split('.').slice(-1)[0]

  const rates = await Eval.find({ id })

  res.render(__dirname + '/views/' + 'eval.ejs', { file: contents[id], ext, prev, next, rates });
});

app.post('/eval/:id', async (req, res) => {
  const id = req.params.id
  const { rate, comment } = req.body

  const eval = new Eval({ id, rate: rate ? rate : 0, comment })
  await eval.save();

  res.redirect('/');
});