const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

async function newDB(path) {
	const db = await open({
		filename: path,
		driver: sqlite3.Database,
	})

	return {
		async getAll() {
			const pizzas = await db.all('SELECT id, name, description, cost, dop FROM pizzas')
			return pizzas.map((pizza) => {
				pizza.dop = JSON.parse(pizza.dop)
				return pizza
			})
		},
    
		async getOne(id) {
			const pizza = await db.get('SELECT id, name, description, cost, dop FROM pizzas WHERE id = ?', id)
			pizza.dop = JSON.parse(pizza.dop)
			return pizza
		},
    
		async saveOrder(order) {
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
		},

		async saveFeedback(feedback) {
			const date = Date.now()
			const result = await db.run(
				'INSERT INTO feedbacks (name, text, date) VALUES (?, ?, ?)',
				feedback.name,
				feedback.text,
				date
			)
			return result
		},

		async getFeedbacks() {
			return await db.all('SELECT name, text, date FROM feedbacks')
		},

		async closeDB() {
			await db.close()
		}
	}
}

module.exports = {
	newDB,
}