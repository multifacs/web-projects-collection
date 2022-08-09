const express = require('express')
const {
	openDb,
} = require('./src/database')
const routes = require('./src/routes')

const server = express()
server.set('view engine', 'ejs')

const SERVER_PORT = 3333
const dbPath = './src/pizza-store.db'

let db
openDb(dbPath)
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

const useDB = (req, res, next) => {
	req.db = db
	next()
}

server.use(useDB)

server.use(routes)

server.use(express.static('./static/images'))
