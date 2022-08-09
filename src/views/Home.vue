<template>
  <div class="container">
    <h1>Война вирусов</h1>
    <button @click="join">Присоединиться</button>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const socket = inject('io');
socket.on('user', (id) => {
  console.log('your id', id);
});

const join = () => {
  socket.emit('join');
  router.push('game');
};
</script>

<style scoped>
.container {
  margin-top: 20em;
}

button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 14px 25px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  border-radius: 10px;
}
</style>
