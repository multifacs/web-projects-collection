<template>
  <div class="container">
    <h2>Вы игрок: {{ playerName }}</h2>
    <h2 class="announcement" ref="announcement">Не готов</h2>
    <div class="game">
      <div class="player-grid" ref="playerGrid"></div>
      <div class="enemy-grid" ref="enemyGrid"></div>
    </div>
    <div class="controls">
      <button class="place-btn" ref="placeBtn" @click="placeShips">
        Расставить корабли
      </button>
      <button class="ready-btn" ref="readyBtn" @click="getReady">Готов</button>
      <template v-if="showResults">
        <router-link to="/results">Посмотреть результаты</router-link>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, inject, onMounted, onUnmounted } from "vue";

export default {
  setup() {
    const socket = inject("io");

    const announcement = ref(null);
    const playerGrid = ref(null);
    const enemyGrid = ref(null);
    const readyBtn = ref(null);
    const placeBtn = ref(null);
    const showResults = ref(false);

    const hits = ref(0);
    let enemyFields;
    let lastHit = 0;

    const playerName = ref("");
    socket.on("playerName", async (id) => {
      console.log(id);
      playerName.value = id;
    });

    const onGo = (e) => {
      const id = parseInt(e.target.id) - 100;
      socket.emit("playerGo", id);
      lastHit = id + 100;
    };

    socket.on("fieldCheck", (id) => {
      const field = document.getElementById(id);
      console.log(field);
      const hit = field.classList.contains("ship");
      socket.emit("enemyResponse", hit);
      if (!hit) {
        playerGo();
      } else {
        field.style.backgroundColor = "";
        field.classList.add("hit");
      }
    });

    socket.on("hit", (hit) => {
      const field = document.getElementById(lastHit);
      console.log(field);
      if (hit) {
        field.classList.add("hit");
        hits.value += 1;
        if (hits.value == 19) {
          socket.emit("playerWin");
          win();
        }
      } else {
        field.classList.add("miss");
        announcement.value.innerHTML = "Ход противника";
        enemyFields.forEach((field) => {
          field.removeEventListener("click", onGo);
        });
      }
    });

    const playerGo = () => {
      announcement.value.innerHTML = "Ваш ход";

      enemyFields.forEach((field) => {
        field.addEventListener("click", onGo);
      });
    };

    const placeShips = () => {
      const lengths = [3, 3, 4, 4, 5];
      const colors = ["crimson", "green", "blue", "cyan", "orange"];

      document.querySelectorAll(".ship").forEach((elem) => {
        elem.classList.remove("ship");
        elem.style.backgroundColor = "";
      });

      lengths.forEach(async (length, idx) => {
        const direction = Math.round(Math.random());
        console.log("direction: ", direction);
        let flag = false;
        let start = 0;
        while (!flag) {
          start = Math.floor(Math.random() * 100);
          console.log("start: ", start);
          if (!direction) {
            console.log(
              Math.floor(start / 10),
              Math.floor((start + length) / 10)
            );
            if (Math.floor(start / 10) === Math.floor((start + length) / 10)) {
              flag = true;
              for (let i = 0; i < length; i++) {
                const field = document.getElementById(start + i);
                if (field.classList.contains("ship")) {
                  flag = false;
                }
              }
            }
          } else {
            console.log("start + length", start + length);
            if (start + length * 10 < 100) {
              flag = true;
              for (let i = 0; i < length; i++) {
                const field = document.getElementById(start + i * 10);
                if (field.classList.contains("ship")) {
                  flag = false;
                }
              }
            }
          }
        }
        if (!direction) {
          for (let i = 0; i < length; i++) {
            const field = document.getElementById(start + i);
            field.classList.add("ship");
            field.style.backgroundColor = colors[idx];
          }
        } else {
          for (let i = 0; i < length; i++) {
            const field = document.getElementById(start + i * 10);
            field.classList.add("ship");
            field.style.backgroundColor = colors[idx];
          }
        }
      });
    };

    onMounted(() => {
      for (let i = 0; i < 100; i++) {
        const playerField = document.createElement("div");
        playerField.classList.add("field");
        playerField.id = i;
        playerGrid.value.appendChild(playerField);

        const enemyField = document.createElement("div");
        enemyField.classList.add("field");
        enemyField.id = i + 100;
        enemyGrid.value.appendChild(enemyField);
      }

      enemyFields = document.querySelectorAll(".enemy-grid .field");

      placeShips();
    });

    const getReady = () => {
      announcement.value.innerHTML = "Готов. Ожидаем";
      placeBtn.value.hidden = "true";
      readyBtn.value.hidden = "true";

      socket.emit("playerReady");
    };

    socket.on("startGame", (first) => {
      announcement.value.innerHTML = "Ход противника";

      if (first) {
        playerGo();
      }
    });

    const win = () => {
      enemyFields.forEach((field) => {
        field.removeEventListener("click", onGo);
      });
      announcement.value.innerHTML = "Вы победили";
      showResults.value = true;
    };

    socket.on("playerLose", () => {
      announcement.value.innerHTML = "Вы проиграли";
      showResults.value = true;
    });

    onUnmounted(() => {
      socket.removeAllListeners();
    });

    return {
      announcement,
      playerGrid,
      enemyGrid,
      readyBtn,
      placeBtn,
      playerName,
      getReady,
      placeShips,
      showResults,
    };
  },
};
</script>

<style>
.game {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.player-grid,
.enemy-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 2px;
}

:root {
  --border: 5px dotted #1c6ea4;
}

.field {
  width: 40px;
  height: 40px;
  border: var(--border);
}

.field:nth-child(-n + 10) {
  border-bottom: var(--border);
}

.field:nth-child(10n + 1) {
  border-right: var(--border);
}

.field:nth-child(10n) {
  border-left: var(--border);
}

.field:nth-child(n + 11) {
  border-top: var(--border);
}

.hit {
  background-color: red;
}

.miss {
  background-color: rgb(53, 53, 53);
}

.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 5rem;
}
</style>
