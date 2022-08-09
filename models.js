const mongoose = require('mongoose')
const Schema = mongoose.Schema

const feedbackSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
)

const Feedback = mongoose.model('Feedback', feedbackSchema)

const orderSchema = new Schema(
	{
		address: {
			type: String,
			required: false,
		},
		phone: {
			type: String,
			required: false,
		},
		name: {
			type: String,
			required: false,
		},
		pizza: {
			type: String,
			required: false,
		},
		dop: {
			type: Object,
			required: false,
		},
	},
	{ timestamps: true }
)

const Order = mongoose.model('Order', orderSchema)

const pizzaSchema = new Schema({
	id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	cost: {
		type: String,
		required: true,
	},
	dop: {
		type: Object,
		required: true,
	},
})

const Pizza = mongoose.model('Pizza', pizzaSchema)

module.exports = {
	Feedback,
	Order,
	Pizza,
}
