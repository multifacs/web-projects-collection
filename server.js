const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

const MONGO_URL = 'mongodb+srv://user1:password2001@cluster0.azqca.mongodb.net/battleship?retryWrites=true&w=majority'

// mongoose
//   .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then((res) => console.log('Connected to DB'))

app.use(express.urlencoded({ extended: false }));

let playerCounter = 0
let readyPlayers = 0

let timeStart = 0
let timeEnd = 0
let duration = 0
let winner = ''

// Run when client connects
io.on('connection', socket => {
  const player = Object.keys(io.sockets.sockets).indexOf(socket.id) + 1

  console.log('player connected')
  playerCounter += 1

  if (playerCounter < 3) {
    socket.emit('playerName', playerCounter)
  } else {
    socket.emit('playerName', 0)
  }

  socket.on('playerReady', () => {
    readyPlayers += 1
    console.log(readyPlayers)
    if (readyPlayers === 2) {
      console.log('game started')
      io.emit('start')
      timeStart = Date.now()
    }
  })

  socket.on('playerGo', id => {
    console.log(socket.id, id)
    // console.log(Object.keys(io.sockets.sockets))
    if (player === 1) {
      io.to(Object.keys(io.sockets.sockets)[1]).emit('getCell', id)
    } else {
      io.to(Object.keys(io.sockets.sockets)[0]).emit('getCell', id)
    }
  })

  socket.on('cellResponse', taken => {
    console.log(socket.id, taken)
    
    if (player === 1) {
      // console.log(Object.keys(io.sockets.sockets).indexOf(socket.id))
      io.to(Object.keys(io.sockets.sockets)[1]).emit('goResponse', taken)
    } else {
      // console.log(Object.keys(io.sockets.sockets).indexOf(socket.id))
      io.to(Object.keys(io.sockets.sockets)[0]).emit('goResponse', taken)
    }
  })

  socket.on('playerWon', () => {

    console.log(player, 'player won!')

    if (player === 1) {
      io.to(Object.keys(io.sockets.sockets)[1]).emit('playerLost')
    } else {
      io.to(Object.keys(io.sockets.sockets)[0]).emit('playerLost')
    }

    timeEnd = Date.now()
    duration = Math.floor((timeEnd - timeStart) / 1000)
    winner = `Player #${ player }`
    timeEnd = 0
    timeStart = 0

    const result = new Result({ winner, duration });
    result.save()
  })

  socket.on('disconnect', () => {
    playerCounter -= 1
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const resultSchema = new Schema({
  winner: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Result = mongoose.model('Result', resultSchema);

app.get('/leaderboard', (req, res) => {
  Result
    .find()
    .then(results => res.render(__dirname + '/public/leaderboard.ejs', { results }))
});