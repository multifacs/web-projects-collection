<template>
  <router-view v-slot="{ Component }">
    <transition name="bounce" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
import { provide } from "vue";
import io from "socket.io-client";

export default {
  setup() {
    provide("io", io("http://localhost:3000"));
  },
};
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.bounce-enter-active {
  animation: bounce-in 0.3s;
}
.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
