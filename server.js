const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');

// mongoose.connect(
//   '',
//   { useNewUrlParser: true, useUnifiedTopology: true }
// )

const resultSchema = new Schema({
  winner: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
});
const Result = mongoose.model('Result', resultSchema);

const players = [];
let time = 0;

io.on('connection', socket => {
  let playerId = 0;

  if (players.length < 2) {
    players.push(socket.id);
    playerId = players.length;
    socket.emit('getUserId', playerId);
  }

  if (players.length === 2) {
    time = new Date();
  }

  socket.on('onPlayerMove', id => {
    io.to(players[playerId === 1 ? 1 : 0]).emit('getFieldId', id)
  })

  socket.on('sendFieldId', taken => {
    io.to(players[playerId === 1 ? 1 : 0]).emit('receiveFieldId', taken)
  })

  socket.on('onPlayerLost', () => {
    io.to(players[playerId === 1 ? 1 : 0]).emit('onPlayerWin')
    const gameResult = new Result({
      winner: playerId === 1 ? 2 : 1,
      time: Math.floor((Date.now() - time) / 1000)
    });
    gameResult.save()
  })

  socket.on('disconnect', () => {
    players.splice(players.indexOf(socket.id), 1);
  });
});

server.listen(3000);

app.get('/', (req, res) => {
  res.render(__dirname + '/ejs/index.ejs')
});

app.get('/game', (req, res) => {
  res.render(__dirname + '/ejs/game.ejs')
});

app.get('/scoreboard', (req, res) => {
  Result
    .find()
    .then(gameResults => res.render(__dirname + '/ejs/scoreboard.ejs', { gameResults }))
});