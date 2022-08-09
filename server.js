// подключаем библиотеки
const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// создаем объект сервера и подключаем шаблонизатор ejs
const app = express();
app.set('view engine', 'ejs');

// порт и ссылка для подключения к базе данных
const PORT = 3000;
const db = 'mongodb+srv://Olga:2001_13q@cluster0.fghgw.mongodb.net/quiz?retryWrites=true&w=majority';

// подключаемся к базе данных
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log('База данных подключена'))
  .catch((error) => console.log(error));

// запускаем сервер
app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`Запущен на порте ${PORT}`);
});

// middleware (промежуточно) для обработки тела запроса (request body)
app.use(express.urlencoded({ extended: false }));

// get-запрос для стартовой страницы
app.get('/', (req, res) => {
  res.render(__dirname + '/ejs-views/index.ejs');
});

// post-запрос (для кнопки) перехода на страницу с вопросами
app.post('/', (req, res) => {
  res.redirect('/quiz');
});

// модель объекта базы данных для вопроса
const Question = mongoose.model('Question', new Schema({
  question: {
    type: String,
    required: true,
  },
  answers: {
    type: Array,
    required: true,
  },
}));

// страница с вопросами
app.get('/quiz', (req, res) => {
  Question
    .find() // метод поиска всех объектов этой модели в базе данных
    .then((questions) => {
      res.render(__dirname + '/ejs-views/quiz.ejs', { questions }) // Отображаем страницу и передаем туда questions
    })
});

// модель для результата
const Result = mongoose.model('Result', new Schema({
  user: {
    type: String,
    required: true,
  },
  passed: {
    type: Boolean,
    required: true,
  },
  answers: {
    type: Array,
    required: true,
  },
}));

// пост запрос для результата
app.post('/quiz', (req, res) => {
  Question
    .find()
    .then((questions) => {
      const userAnswer = req.body // получаем данные формы из тела запроса
      const user = userAnswer.user
      const userResult = []
      let passed = true // флаг, прошел ли пользователь викторину
      questions.forEach(({ question, answers }) => {
        const correct = answers.find(x => x.correct === true).answer // находим верный вариант ответа
        const choice = userAnswer[`${question}`] // получаем ответ пользователя
        if (choice !== correct) { // сравниваем
          passed = false // если неверно, то флаг ставим в false
        }
        userResult.push({ question, choice, correct }) // заносим все результаты в массив
      })
      const result = new Result({ user, passed, answers: userResult }) // создаем новый объект базы данных
      result
        .save() // сохраняем его в базе данных
        .then((result) => res.redirect('/result/' + result._id)) // переходим на страницу с результатом и нужным id
    })
});

// страница для результата
app.get('/result/:id', (req, res) => { // :id - динамический параметр
  Result
    .findById(req.params.id) // находим в базе данных по id
    .then(({ user, passed, answers }) => {
      // res.send(result)
      res.render(__dirname + '/ejs-views/result.ejs', { user, passed, answers })
    })
});