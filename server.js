const express = require('express')
const {
	openDb,
} = require('./src/database')
const routes = require('./src/routes')

const server = express()
server.set('view engine', 'ejs')

const SERVER_PORT = 3333
const dbPath = './src/pizza-store.db'

server.use(express.urlencoded({ extended: false }))

const useDB = async (req, res, next) => {
	req.db = await openDb(dbPath)
	next()
}

server.use(useDB)

server.listen(SERVER_PORT, error => {
	error ? console.log(error) : console.log(`Server running on ${SERVER_PORT}`)
})

server.use(routes)
server.use(express.static('./static/images'))
