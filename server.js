const path = require('path');
const express = require('express');
const fs = require('fs');
// const serialize = require('serialize-javascript');
const { renderToString } = require('@vue/server-renderer');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-unresolved
const manifest = require('./dist/server/ssr-manifest.json');

const server = express();
const htmlServer = http.createServer(server);
const io = socketio(htmlServer);

const appPath = path.join(__dirname, './dist', 'server', manifest['app.js']);
// eslint-disable-next-line import/no-dynamic-require
const createApp = require(appPath).default;

// mongoose
//   .connect('mongodb+srv://user1:password2001@cluster0.azqca.mongodb.net/virus-war-vuessr?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const Result = mongoose.model('Result', new mongoose.Schema({
  winner: {
    type: String,
    required: true,
  },
  score: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
}));

server.use('/img', express.static(path.join(__dirname, './dist/client', 'img')));
server.use('/js', express.static(path.join(__dirname, './dist/client', 'js')));
server.use('/css', express.static(path.join(__dirname, './dist/client', 'css')));
server.use('/favicon.ico', express.static(path.join(__dirname, './dist/client', 'favicon.ico')));

const joinedPlayers = [];
const gameState = {
  time: 0,
  winner: 0,
  score: [0, 0],
};

// Run when client connects
io.on('connection', (socket) => {
  console.log('user connected');
  socket.emit('user', socket.id);

  socket.on('ping', () => {
    console.log(socket.id, 'pinged');
    socket.emit('pingResp');
  });

  socket.on('join', () => {
    if (joinedPlayers.length < 2) {
      joinedPlayers.push(socket.id);
      console.log(joinedPlayers);
      socket.emit('playAs', joinedPlayers.length);
    }
    if (joinedPlayers.length === 2) {
      joinedPlayers.forEach((player) => {
        setTimeout(() => {
          io.to(player).emit('startGame');
        }, 1000);
      });

      gameState.time = new Date();
    }
  });

  socket.on('playerMove', (x) => {
    console.log('Player', joinedPlayers.indexOf(socket.id) + 1, 'made a move on', x);
    socket.broadcast.emit('movePassthrough', { x, player: joinedPlayers.indexOf(socket.id) + 1 });
  });

  socket.on('playerSkip', () => {
    socket.broadcast.emit('skipPassthrough');
  });

  socket.on('playerWon', ({ user, score }) => {
    gameState.winner = user;
    gameState.score[joinedPlayers.indexOf(socket.id)] = score;
    gameState.time = Math.floor((new Date() - gameState.time) / 1000);

    setTimeout(() => {
      const gameResult = new Result({ winner: `Игрок ${gameState.winner}`, time: `${gameState.time} секунд`, score: `${gameState.score[0]}-${gameState.score[1]}` });
      gameResult.save().then((res) => {
        console.log(res);
      });

      console.log('Game ended with result:', gameState);
    }, 1000);
  });

  socket.on('playerLost', (score) => {
    gameState.score[joinedPlayers.indexOf(socket.id)] = score;
  });

  socket.on('disconnect', () => {
    const index = joinedPlayers.indexOf(socket.id);
    if (index !== -1) {
      joinedPlayers.splice(index, 1);
    }
    console.log(joinedPlayers);
  });
});

const port = process.env.PORT || 8087;
htmlServer.listen(port, () => {
  console.log(`You can navigate to http://localhost:${port}`);
});

server.get('/res', async (req, res) => {
  const results = await Result.find();
  res.json(results);
});

server.get('*', async (req, res) => {
  const { app, router } = await createApp();

  router.push(req.url);

  await router.isReady();

  let appContent = await renderToString(app);

  fs.readFile(path.join(__dirname, '/dist/client/index.html'), (err, html) => {
    if (err) {
      throw err;
    }

    appContent = `<div id="app">${appContent}</div>`;

    // eslint-disable-next-line no-param-reassign
    html = html.toString().replace('<div id="app"></div>', `${appContent}`);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });
});
