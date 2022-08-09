const express = require('express');
const mongoose = require('mongoose');
const { readFile } = require('fs')

const app = express();

const MONGO_URL = ''

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
app.listen(3000)
app.use(express.urlencoded({ extended: false }));

const CLIENT_URL = 'http://localhost:8080'
const METHODS = 'GET, POST'
const HEADERS = 'X-Requested-With,content-type'

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', CLIENT_URL);
  res.setHeader('Access-Control-Allow-Methods', METHODS);
  res.setHeader('Access-Control-Allow-Headers', HEADERS);
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.json());

let dataTemplate
readFile('./template.json', 'utf8', (err, template) => {
  dataTemplate = (JSON.parse(template))
})

app.get('/template', (req, res) => {
  res.status(200).json(dataTemplate)
});

const Schema = mongoose.Schema;

const userDataSchema = new Schema({
  data: {
    type: String,
    required: true,
  },
});

const userData = mongoose.model('userData', userDataSchema);

const checkData = (data) => {
  const userData = JSON.parse(data)
  let flag = true
  if (Object.keys(dataTemplate)[1] != Object.keys(userData)[1]) {
    flag = false
  }

  dataTemplate.resources.forEach((element, idx) => {
    const templateEntries = Object.entries(element)
    const userEntries = Object.entries(userData.resources[idx])

    templateEntries.forEach((elem, idx) => {
      if (elem[0] != userEntries[idx][0]) {
        flag = false
      }

      if (elem[1] == 'number') {
        if (parseInt(userEntries[idx][1]) != userEntries[idx][1]) {
          flag = false
        }
      }
    })

    console.log(templateEntries)
    console.log(userEntries)
  });

  return flag
}

app.post('/post-data', (req, res) => {
  const { data } = req.body;
  console.log(data)
  if (checkData(data)) {
    const userDataObj = new userData({ data });
    userDataObj
      .save()
  }
});

app.get('/get-data', (req, res) => {
  userData
    .find()
    .then((datas) => res.status(200).json(datas))
});