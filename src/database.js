const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

const openDb = async (path) => {
	return open({
		filename: path,
		driver: sqlite3.Database
	})
}

const getAll = async (db) => {
	const pizzas = await db.all('SELECT id, name, description, cost, dop FROM pizzas')
	return pizzas.map((pizza) => {
		pizza.dop = JSON.parse(pizza.dop)
		return pizza
	})
}

const getOne = async (db, id) => {
	const pizza = await db.get('SELECT id, name, description, cost, dop FROM pizzas WHERE id = ?', id)
	pizza.dop = JSON.parse(pizza.dop)
	return pizza
}

const saveOrder = async (db, order) => {
	const date = Date.now()
	const result = await db.run(
		'INSERT INTO orders (address, phone, name, pizza, dop, date) VALUES (?, ?, ?, ?, ?, ?)',
		order.address,
		order.phone,
		order.name,
		order.pizza,
		JSON.stringify(order.dop),
		date
	)
	return result
}

const saveFeedback = async (db, feedback) => {
	const date = Date.now()
	const result = await db.run(
		'INSERT INTO feedbacks (name, text, date) VALUES (?, ?, ?)',
		feedback.name,
		feedback.text,
		date
	)
	return result
}

const getFeedbacks = async (db) => {
	return await db.all('SELECT name, text, date FROM feedbacks')
}

module.exports = {
	openDb,
	getAll,
	getOne,
	saveOrder,
	saveFeedback,
	getFeedbacks
}