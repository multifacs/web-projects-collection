var express = require("express");
var mongoose = require("mongoose");
var path = require("path");

function pathToFile(page) {
  return path.resolve(__dirname, "./views", `${page}.ejs`);
}

var { Feedback, Order, Pizza } = require("./models");

var server = express();
server.set("view engine", "ejs");

var SERVER_PORT = 3333;
var connectionString =
  "mongodb+srv://user:passwordanton@cluster0.cukuz.mongodb.net/AntonPizza?retryWrites=true&w=majority";

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

server.listen(SERVER_PORT, function (error) {
  error ? console.log(error) : console.log(`Запущен на ${SERVER_PORT}`);
});

server.use(express.urlencoded({ extended: false }));

server.get("/", function (req, res) {
  Pizza.find().then(function (pizzas) {
    res.render(pathToFile("index"), { pizzas });
  });
});

server.get("/order/:id", function (req, res) {
  Pizza.findOne({ id: req.params.id }).then(function (pizza) {
    res.render(pathToFile("order"), { pizza });
  });
});

server.post("/order/:id", function (req, res) {
  var { address, name, phone } = req.body;
  var order = new Order({ address, name, phone });
  order.pizza = req.params.id;
  var temp = req.body;
  delete temp["address"];
  delete temp["name"];
  delete temp["phone"];
  order.dop = temp;
  order.save().then(function () {
    res.redirect("/feedback");
  });
});

server.get("/feedback", function (req, res) {
  res.render(pathToFile("feedback"));
});

server.post("/feedback", function (req, res) {
  var { name, text } = req.body;
  var feedback = new Feedback({ name, text });
  feedback.save().then(function (result) {
    res.redirect("/");
  });
});

server.get("/feedbacks", function (req, res) {
  Feedback.find().then(function (feedbacks) {
    res.render(pathToFile("feedbacks"), { feedbacks });
  });
});

server.use(express.static("./"));
server.use(express.static("pizzas"));
