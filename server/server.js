const express = require('express');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "http://localhost:8080"
}))
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:8080'],
    credentials: true
  }
});

mongoose
  .connect("mongodb+srv://user1:password2001@cluster0.azqca.mongodb.net/battleship-game?authSource=admin&replicaSet=atlas-qurk0u-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true", { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log('Connected to DB'))
  .catch((error) => console.log(error));

const Schema = mongoose.Schema;

const resultSchema = new Schema({
  winner: {
    type: String,
    required: true,
  },
  dur: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Result = mongoose.model('Result', resultSchema);

const rooms = []
const readyPlayers = []
let currentRoom = 0

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', socket => {
  // console.log(socket.id)

  socket.on('playerConnect', () => {
    setTimeout(() => {
      socket.emit('playerName', socket.id);
    }, 500);
    console.log(socket.id);
    if (rooms[currentRoom] == undefined) {
      const room = []
      room.push(socket.id)
      rooms.push(room)

      const ready = [0, 0]
      readyPlayers.push(ready)
    } else if (rooms[currentRoom].length == 2) {
      currentRoom += 1

      const room = []
      room.push(socket.id)
      rooms.push(room)

      const ready = [0, 0]
      readyPlayers.push(ready)
    } else {
      rooms[currentRoom].push(socket.id)
    }
    console.log(rooms)
  })

  const getIds = () => {
    let index;
    let player;
    rooms.forEach((room, idx) => {
      if (room.indexOf(socket.id) !== -1) {
        index = idx;
        player = room.indexOf(socket.id);
      }
    })
    let enemy = 0;
    if (player == 0) {
      enemy = 1;
    }

    return { index, player, enemy }
  }

  socket.on("playerReady", () => {
    const { index, player } = getIds();

    readyPlayers[index][player] = 1;

    if (readyPlayers[index][0] + readyPlayers[index][1] == 2) {
      io.to(rooms[index][0]).emit('startGame', true);
      io.to(rooms[index][1]).emit('startGame', false);

      readyPlayers[index][0] = new Date();
    }
  })

  socket.on("playerGo", (id) => {
    const { index, enemy } = getIds();
    io.to(rooms[index][enemy]).emit('fieldCheck', id);
  })

  socket.on("enemyResponse", (check) => {
    const { index, enemy } = getIds();

    io.to(rooms[index][enemy]).emit('hit', check);
  })

  socket.on("playerWin", () => {
    const { index, player, enemy } = getIds();
    io.to(rooms[index][enemy]).emit('playerLose');

    readyPlayers[index][1] = new Date();
    const dur = Math.floor((readyPlayers[index][1] - readyPlayers[index][0]) / 1000);
    const result = new Result({ winner: `Player ${player}`, dur });
    result.save();
  })

  socket.on('disconnect', () => {
    console.log('player disconnected')
  });
});

http.listen(3000, (error) => {
  error ? console.log(error) : console.log(`listening port ${3000}`);
});

app.use(express.urlencoded({ extended: false }));

app.get('/games', async (req, res) => {
  const games = await Result.find();
  res.json(games);
});