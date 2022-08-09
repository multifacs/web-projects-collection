const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


//MONGO BD

//mongoose
  //.connect("mongodb+srv://user1:password2001@cluster0.azqca.mongodb.net/virus-war?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })

const Schema = mongoose.Schema;

const GameResult = mongoose.model('GameResult', new Schema({
  winner: {
    type: String,
    required: true,
  },
  score: {
    type: String,
  },
  time: {
    type: Number,
    required: true,
  },
}, { timestamps: true }));

//--------------//

let ids = []

let time = 0
let winner
let score1
let score2

let end = 0;

// Run when client connects
io.on('connection', socket => {
  ids.push(socket.id)
  console.log(Object.keys(io.sockets.sockets))
  // socket.emit('user', Object.keys(io.sockets.sockets).indexOf(socket.id) + 1)

  Object.keys(io.sockets.sockets).forEach((socketId, idx) => {
    io.to(socketId).emit('user', idx + 1);
  })

  socket.on('start', () => {
    time = new Date();
  })

  socket.on('move', id => {
    console.log(id)
    socket.broadcast.emit('bMove', { id, who: Object.keys(io.sockets.sockets).indexOf(socket.id) + 1 })
  })

  socket.on('skip', () => {
    socket.broadcast.emit('enemySkip')
  })

  socket.on('winner', ({ user, score }) => {
    winner = user;
    score1 = score;
    console.log('score1', score1);
    time = Math.floor((new Date() - time) / 1000);
    end += 1
    if (end == 2) {
      saveResult();
    }
  })

  socket.on('loser', (score) => {
    score2 = score;
    console.log('score2', score2);
    end += 1
    if (end == 2) {
      saveResult();
    }
  })

  const saveResult = () => {
    console.log(winner, time);
    const gameResult = new GameResult({ winner: `Игрок ${winner}`, time, score: `${score1}-${score2}` });
    gameResult.save();

    time = 0;
    winner = 0;
  }
});

const PORT = 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/gameresults', async (req, res) => {
  const gameresults = await GameResult.find();
  res.json(gameresults);
});
