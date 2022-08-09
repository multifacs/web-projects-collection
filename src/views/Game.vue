<template>
  <div class="container">
    <h1>{{ announcement }}</h1>
    <div class="grid">
      <div class="left">
        <h3>{{ playAs }}</h3>
      </div>
      <div class="field">
        <ul>
          <li v-for="index in 100" :key="index" :id="index" @click="playerMove">
            {{ fieldValues[index - 1] }}
          </li>
        </ul>
        <button v-if="!gameEnd" @click="skip">Пропустить ход</button>
        <router-link to="/leaderboard" v-else>Таблица результатов</router-link>
      </div>
      <div class="right">
        <h3>Счет: {{ score }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';

const socket = inject('io');

const announcement = ref('Ожидаем другого игрока');
const playAs = ref('Пусто');
const score = ref(0);

const fieldValues = ref([]);

let gameEnd = false;

for (let i = 0; i < 100; i += 1) {
  fieldValues.value.push('');
}

const user = ref(0);
socket.on('playAs', (num) => {
  playAs.value = num === 1 ? 'Вы за крестики' : 'Вы за нолики';
  user.value = num === 1 ? 1 : 2;
  console.log(user.value);
});

socket.on('startGame', () => {
  console.log('game started!');
  announcement.value = user.value === 1 ? 'Ваш ход' : 'Ход противника';
});

const currentTurn = ref(0);
const totalTurns = ref(0);

const changeAnnouncementText = (num) => {
  switch (num) {
    case 1:
      announcement.value = 'Ваш ход';
      break;
    case 2:
      announcement.value = 'Ход противника';
      break;
    case 3:
      announcement.value = 'Вы победили';
      break;
    case 4:
      announcement.value = 'Вы проиграли';
      break;
    default:
      announcement.value = '';
  }
};

const checkWin = () => {
  let hasX = false;
  let hasO = false;
  let xScore = 0;
  let oScore = 0;

  if (totalTurns.value > 3) {
    for (let i = 0; i < 100; i += 1) {
      if (fieldValues.value[i] === 'X') {
        hasX = true;
      }
      if (fieldValues.value[i] === 'O') {
        hasO = true;
      }
      if (fieldValues.value[i] === '+') {
        xScore += 1;
      }
      if (fieldValues.value[i] === '-') {
        oScore += 1;
      }
    }

    score.value = user.value === 1 ? oScore : xScore;

    if (user.value === 1) {
      if (!hasX) {
        changeAnnouncementText(4);
        socket.emit('playerLost', score.value);
      }
      if (!hasO) {
        changeAnnouncementText(3);
        socket.emit('playerWon', { user: user.value, score: score.value });
      }
    }

    if (user.value === 2) {
      if (!hasX) {
        changeAnnouncementText(3);
        socket.emit('playerWon', { user: user.value, score: score.value });
      }
      if (!hasO) {
        changeAnnouncementText(4);
        socket.emit('playerLost', score.value);
      }
    }

    if (!hasX || !hasO) {
      gameEnd = true;
    }
  }
};

const canMove = (id, player) => {
  console.log(id, player);
  const ids = [
    [id + 1, id + 10, id + 10 + 1],
    [id - 1, id + 10, id + 10 - 1],
    [id + 1, id - 10, id - 10 + 1],
    [id - 1, id - 10, id - 10 - 1],
    [id + 1, id - 1, id + 10, id + 10 + 1, id + 10 - 1],
    [id + 1, id - 1, id - 10, id - 10 + 1, id - 10 - 1],
    [id - 1, id + 10, id + 10 - 1, id - 10, id - 10 - 1],
    [id + 1, id + 10, id + 10 + 1, id - 10, id - 10 + 1],
    [id + 1, id - 1, id + 10, id - 10, id + 10 + 1, id + 10 - 1, id - 10 + 1, id - 10 - 1],
  ];
  let use = 0;

  switch (true) {
    case id === 1:
      use = 0;
      break;
    case id === 10:
      use = 1;
      break;
    case id === 91:
      use = 2;
      break;
    case id === 100:
      use = 3;
      break;
    case id > 1 && id < 10:
      use = 4;
      break;
    case id > 91 && id < 100:
      use = 5;
      break;
    case id % 10 === 0:
      use = 6;
      break;
    case id % 10 === 1:
      use = 7;
      break;
    default:
      use = 8;
  }

  let flag = false;
  if (currentTurn.value < 3 && player === 1) {
    ids[use].forEach((x) => {
      if (fieldValues.value[x - 1] === 'X' || fieldValues.value[x - 1] === '-') {
        flag = true;
      }
    });
  } else {
    ids[use].forEach((x) => {
      if (fieldValues.value[x - 1] === 'O' || fieldValues.value[x - 1] === '+') {
        flag = true;
      }
    });
  }

  return flag;
};

const makeMove = (x, player = user.value) => {
  console.log(x, player, currentTurn.value, totalTurns.value);
  if (fieldValues.value[x - 1] !== 'X' && fieldValues.value[x - 1] !== 'O') {
    if (currentTurn.value < 3 && player === 1) {
      console.log(canMove(x, player), (totalTurns.value === 0 && x === 91));
      if (canMove(x, player) || (totalTurns.value === 0 && x === 91)) {
        fieldValues.value[x - 1] = 'X';
        currentTurn.value += 1;
        totalTurns.value += 1;
      }
    } else if (currentTurn.value > 2 && currentTurn.value < 6 && player === 2) {
      if (canMove(x, player) || (totalTurns.value === 3 && x === 10)) {
        fieldValues.value[x - 1] = 'O';
        currentTurn.value += 1;
        totalTurns.value += 1;
      }
      if (currentTurn.value === 6) {
        currentTurn.value = 0;
      }
    }
  } else if (fieldValues.value[x - 1] === 'X') {
    if (currentTurn.value > 2 && currentTurn.value < 6 && player === 2) {
      if (canMove(x, player) || (totalTurns.value === 3 && x === 10)) {
        fieldValues.value[x - 1] = '+';
        currentTurn.value += 1;
        totalTurns.value += 1;
      }
      if (currentTurn.value === 6) {
        currentTurn.value = 0;
      }
    }
  } else if (fieldValues.value[x - 1] === 'O') {
    if (currentTurn.value < 3 && player === 1) {
      if (canMove(x, player) || (totalTurns.value === 0 && x === 91)) {
        fieldValues.value[x - 1] = '-';
        currentTurn.value += 1;
        totalTurns.value += 1;
      }
    }
  }

  switch (true) {
    case currentTurn.value === 3 && user.value === 1:
      changeAnnouncementText(2);
      break;
    case currentTurn.value === 3 && user.value === 2:
      changeAnnouncementText(1);
      break;
    case currentTurn.value === 0 && user.value === 2:
      changeAnnouncementText(2);
      break;
    case currentTurn.value === 0 && user.value === 1:
      changeAnnouncementText(1);
      break;
    default:
      console.log('default');
  }

  checkWin();
};

const playerMove = (event) => {
  if (!gameEnd) {
    makeMove(parseInt(event.target.id, 10));
    socket.emit('playerMove', parseInt(event.target.id, 10));
  }
};

const skip = () => {
  if (currentTurn.value < 3 && user.value === 1) {
    currentTurn.value = 3;
  }
  if (currentTurn.value > 2 && currentTurn.value < 6 && user.value === 2) {
    currentTurn.value = 0;
  }
  totalTurns.value += 1;
  socket.emit('playerSkip');
  changeAnnouncementText(2);
};

socket.on('movePassthrough', ({ x, player }) => {
  console.log('movePassthrough:', x, player);
  makeMove(x, player);
});

socket.on('skipPassthrough', () => {
  if (currentTurn.value < 3) {
    currentTurn.value = 3;
  }
  if (currentTurn.value > 2 && currentTurn.value < 6) {
    currentTurn.value = 0;
  }
  totalTurns.value += 1;
  changeAnnouncementText(1);
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');
</style>

<style scoped>
h1 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  margin-top: 3rem;
}

.field {
  margin: 0 auto;
}

.left, .right {
  display: flex;
  justify-content: flex-end;
  padding-top: 10em;
}

.right {
  justify-content: flex-start;
}

ul {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  list-style: none;
  gap: 0.5rem;
  width: 39.5rem;
  padding: 0;
}

li {
  border: 1px solid;
  border-radius: 10px;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Fredoka One', cursive;
  font-size: 20pt;
  text-decoration: none;
  cursor: pointer;
}

button, a {
  background-color: #4c5eaf;
  border: none;
  color: white;
  padding: 12px 22px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  margin-top: 1em;
  border-radius: 10px;
}
</style>
