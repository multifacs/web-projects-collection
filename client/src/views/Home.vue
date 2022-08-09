<template>
  <div class="container">
    <h1>Морской бой</h1>
    <div id="links">
      <router-link to="/game" @click="connect">Присоединиться</router-link>
      <router-link to="/results">Посмотреть результаты</router-link>
    </div>
    <div class="container-bottom"></div>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  setup() {
    const socket = inject("io");

    const connect = () => {
      console.log("player connect");
      socket.emit("playerConnect");
    };

    socket.on("playerName", async (id) => {
      console.log(id);
    });

    return {
      connect,
    };
  },
};
</script>

<style>
body {
  overflow: hidden;
  min-height: 100vh;
  padding: 0;
}
</style>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  background: linear-gradient(
    0deg,
    rgba(103, 211, 255, 1) 0%,
    rgba(0, 176, 255, 1) 82%
  );
  margin: 0 auto;
  height: 45rem;
  width: 100%;
  position: relative;
}

.container-bottom {
  content: "";
  width: 100%;
  height: 100vh;
  position: absolute;
  bottom: -17rem;
  z-index: -1;
  background: linear-gradient(
    0deg,
    rgba(28, 20, 154, 1) 0%,
    rgba(35, 35, 215, 1) 3%,
    rgba(0, 212, 255, 1) 32%
  );
}

@import url("https://fonts.googleapis.com/css2?family=Russo+One&display=swap");

h1 {
  font-family: "Russo One", sans-serif;
  font-size: 100pt;
  margin: 0;
  text-shadow: 4px 3px 0px #dbdbdb;
  z-index: 2;
}

#links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  z-index: 2;
}

a {
  border: none;
  color: white;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  border-radius: 8px;
  font-family: "Russo One", sans-serif;
  transition: 0.5s all ease;
}

a:nth-child(1) {
  background-color: rgb(45, 175, 77);
}

a:nth-child(1):hover {
  background-color: rgb(35, 189, 73);
  box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
}

a:nth-child(2) {
  background-color: rgb(221, 191, 56);
}

a:nth-child(2):hover {
  background-color: rgb(228, 193, 37);
  box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
}
</style>
