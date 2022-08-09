<template>
  <div>
    <ul>
      <li v-for="(item, idx) in results" :key="item._id">
        <p>Игра №{{ idx + 1 }}</p>
        <p>Победитель: {{ item.winner }}</p>
        <p>Длительность: {{ item.dur }} секунд</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const results = ref([]);

    fetch("http://localhost:3000/games")
      .then(function (response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
        return response.json();
      })
      .then(function (data) {
        // `data` is the parsed version of the JSON returned from the above endpoint.
        results.value = data; // { "userId": 1, "id": 1, "title": "...", "body": "..." }
      });

    return {
      results,
    };
  },
};
</script>

<style scoped>
ul {
  list-style: none;
}

li {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style>
