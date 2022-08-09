const Pizza = require('../models/pizza');
const Order = require('../models/order');
const Feedback = require('../models/feedback');
const createPath = require('../helpers/create-path');

const handleError = (res, error) => {
  console.log(error);
  res.render(createPath('error'), { title: 'Error' });
}

const getPizza = (req, res) => {
  const title = 'Pizza';
  console.log(req.params)
  Pizza
    .findOne({ id: req.params.id })
    .then(pizza => res.render(createPath('pizza'), { pizza, title }))
    .catch((error) => handleError(res, error));
}

const getPizzas = (req, res) => {
  const title = 'Pizzas';
  Pizza
    .find()
    .then(pizzas => res.render(createPath('index'), { pizzas, title }))
    .catch((error) => handleError(res, error));
}

const addOrder = (req, res) => {
  const { adress, name, phone } = req.body;
  const order = new Order({ adress, name, phone });
  order.pizza = req.params.id;
  let add = req.body;
  delete add['adress'];
  delete add['name'];
  delete add['phone'];
  order.additional = add;
  console.log(req.params, "BACKBACKBACK");
  order
    .save()
    .then((result) => {
      console.log('THIS IS THE ID', result.id)
      res.redirect('/feedback/' + result.id)
    })
    .catch((error) => handleError(res, error));
}

const getAddFeedback = (req, res) => {
  const title = 'Add feedback';
  res.render(createPath('feedback'), { title });
}

const addFeedback = (req, res) => {
  const { name, text } = req.body;
  const feedback = new Feedback({ name, text });
  feedback.order = req.params.id;
  feedback
    .save()
    .then((result) => res.redirect('/'))
    .catch((error) => handleError(res, error));
}

const getFeedbacks = (req, res) => {
  const title = 'All feedback';
  Feedback
    .find()
    .then(feedbacks => res.render(createPath('feedbacks'), { feedbacks, title }))
    .catch((error) => handleError(res, error));
}

module.exports = {
  getPizza,
  getPizzas,
  addOrder,
  getAddFeedback,
  addFeedback,
  getFeedbacks,
};
