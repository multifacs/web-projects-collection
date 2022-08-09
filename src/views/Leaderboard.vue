<template>
  <div class="container">
    <h2>Таблица результатов</h2>
    <h4>Всего игр: {{ results.length }}</h4>
    <ul>
      <li v-for="(item, idx) in results" :key="item._id">
        <fieldset>
          <legend>
            <h3>Игра №{{ idx + 1 }}</h3>
          </legend>
          <h4>Победитель: {{ item.winner }}</h4>
          <h4>Счет: {{ item.score }}</h4>
          <h4>Время: {{ item.time }}</h4>
        </fieldset>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const results = ref([]);

const fetchResults = () => {
  // eslint-disable-next-line no-undef
  axios('http://localhost:8087/res').then((res) => {
    results.value = res.data;
    console.log(results.value);
  });
};

fetchResults();

// results.value = [
//   {
//     _id: { $oid: '62293f0fb996fff6fe9fce01' },
//     winner: 'Игрок 1',
//     score: '9-2',
//     time: '39 секунд',
//     __v: 0,
//   },
// ];
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

h2 {
  margin-top: 3em;
}

ul {
  list-style: none;
  padding: 0;
  width: 100%;
}

li {
  margin: 0 auto;
  width: 80%;
  margin-bottom: 1.5em;
}

fieldset {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  border: 1px solid;
  border-radius: 10px;
  width: 100%;
}

legend > h3 {
  margin: 0;
}
</style>
