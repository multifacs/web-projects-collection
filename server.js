const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const pizzaRoutes = require('./routes/pizza-routes');
const createPath = require('./helpers/create-path');

const app = express();

app.set('view engine', 'ejs');

const PORT = 3000;
const db = 'mongodb+srv://user1:password2001@cluster0.azqca.mongodb.net/pizza-shop?retryWrites=true&w=majority';

// mongoose
//   .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then((res) => console.log('Connected to DB'))
//   .catch((error) => console.log(error));

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(express.urlencoded({ extended: false }));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.static('styles'));
app.use(express.static('img'));

app.use(methodOverride('_method'));

app.use(pizzaRoutes);

app.use((req, res) => {
  const title = 'Error Page';
  res
    .status(404)
    .render(createPath('error'), { title });
});
