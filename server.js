const express = require('express')
const path = require('path')
const {
	openDb,
	getAll,
	getOne,
	saveOrder,
	saveFeedback,
	getFeedbacks
} = require('./database')

const pathToFile = (page) => {
	// eslint-disable-next-line no-undef
	return path.resolve(__dirname, './views', `${page}.ejs`)
}

// const { Feedback, Order, Pizza } = require('./models')

const server = express()
server.set('view engine', 'ejs')

const SERVER_PORT = 3333

let db
openDb()
	.then((res) => {
		db = res
		console.log('Connected to DB')

		server.listen(SERVER_PORT, error => {
			error ? console.log(error) : console.log(`Server running on ${SERVER_PORT}`)
		})
	})
	.catch((err) => 
		console.log('Caught error: ', err)
	)

server.use(express.urlencoded({ extended: false }))

server.get('/', async (req, res) => {
	const pizzas = await getAll(db)
	console.log(pizzas)
	res.render(pathToFile('index'), { pizzas })
})

server.get('/order/:id', async (req, res) => {
	const id = req.params.id
	const pizza = await getOne(db, id)
	res.render(pathToFile('order'), { pizza })
})

server.post('/order/:id', async (req, res) => {
	const { address, name, tel } = req.body
	const order = { address, name, phone: tel }
	order.pizza = req.params.id
	
	const temp = req.body
	delete temp['address']
	delete temp['name']
	delete temp['tel']
	order.dop = temp
	
	await saveOrder(db, order).then(() => {
		res.redirect('/feedback')
	})
})

server.get('/feedback', (req, res) => {
	res.render(pathToFile('feedback'))
})

server.post('/feedback', async (req, res) => {
	const { name, text } = req.body
	const feedback = { name, text }

	await saveFeedback(db, feedback)
	res.redirect('/')
})

server.get('/feedbacks', async (req, res) => {
	const feedbacks = await getFeedbacks(db)
	res.render(pathToFile('feedbacks'), { feedbacks })
})

server.use(express.static('./'))
server.use(express.static('pizzas'))
