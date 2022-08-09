<template>
  <router-view />
</template>

<script>
import { provide } from 'vue';
import io from 'socket.io-client';

export default {
  setup() {
    provide('io', io());
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Comfortaa&display=swap');
</style>

<style>
#app {
  font-family: 'Comfortaa', cursive;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

button, a {
  font-family: 'Comfortaa', cursive;
}
</style>
