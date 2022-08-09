const express = require('express')
const path = require('path')
const pathToFile = (page) => {
	// eslint-disable-next-line no-undef
	return path.resolve(__dirname, '../views', `${page}.ejs`)
}
const router = express.Router()

router.get('/', async (req, res) => {
	const pizzas = await req.db.getAll()
	// console.log(pizzas)
	res.render(pathToFile('index'), { pizzas })
})

router.get('/order/:id', async (req, res) => {
	const id = req.params.id
	const pizza = await req.db.getOne(id)
	res.render(pathToFile('order'), { pizza })
})

router.post('/order/:id', async (req, res) => {
	const { address, name, tel } = req.body
	const order = { address, name, phone: tel }
	order.pizza = req.params.id
	
	const temp = req.body
	delete temp['address']
	delete temp['name']
	delete temp['tel']
	order.dop = temp
	
	await req.db.saveOrder(order)
	res.redirect('/feedback')
})

router.get('/feedback', (req, res) => {
	res.render(pathToFile('feedback'))
})

router.post('/feedback', async (req, res) => {
	const { name, text } = req.body
	const feedback = { name, text }

	await req.db.saveFeedback(feedback)
	res.redirect('/')
})

router.get('/feedbacks', async (req, res) => {
	const feedbacks = await req.db.getFeedbacks()
	res.render(pathToFile('feedbacks'), { feedbacks })
})

module.exports = router