const express = require('express');
const path = require('path');
const fs = require('fs')

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

const PORT = 3000;

const createPath = (page) => path.resolve(__dirname, 'ejs-views', `${page}.ejs`);

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(express.static('styles'));

let data
let rent = []

fs.readFile('./data.json', 'utf8' , (err, json) => {
  if (err) {
    console.error(err)
    return
  }
  data = (JSON.parse(json))
  console.log(data)
})


app.get('/', (req, res) => {
  res.render(createPath('index'), { data });
});

app.get('/rent/:id', (req, res) => {
  const id = req.params.id
  res.render(createPath('rent'), { book: data[id] });
});

app.post('/rent/:id', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  const date = new Date()
  rent.push({ id, name, date })
  console.log(rent)
  data[id].quantity -= 1
  res.redirect('/');
});

app.get('/return', (req, res) => {
  res.render(createPath('return'), { rent, data });
});

app.post('/return', (req, res) => {
  const entry = req.body.entry
  const id = rent[entry].id
  rent.splice(entry, 1)
  console.log(rent)
  data[id].quantity += 1
  res.redirect('/');
});


app.use((req, res) => {
  res
    .status(404)
    .render(createPath('error'));
});
