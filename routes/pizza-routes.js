const express = require('express');
const {
  getPizza, 
  getPizzas,
  addOrder,
  getAddFeedback,
  addFeedback,
  getFeedbacks,
} = require('../controllers/controller');

const router = express.Router();

router.get('/pizza/:id', getPizza);
router.get('/', getPizzas);
router.post('/pizza/:id', addOrder);
router.get('/feedback/:id', getAddFeedback);
router.post('/feedback/:id', addFeedback);
router.get('/feedbacks', getFeedbacks);

module.exports = router;
