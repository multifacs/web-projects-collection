<template>
  <div class="container">
    <ul id="example-1">
      <li v-for="item in jsonData" :key="item['квартира']">
        <json-viewer :value="item" :expand-depth="3"></json-viewer>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import JsonViewer from "vue-json-viewer";

export default {
  name: "Home",
  setup() {
    const data = ref([]);
    const jsonData = ref([]);
    const onLoad = async () => {
      const config = {
        method: "get",
        url: "http://localhost:3000/get-data",
        withCredentials: true,
      };
      data.value = (await axios(config)).data;

      console.log(data.value);
      data.value.forEach((elem) => {
        console.log(elem);
        jsonData.value.push(JSON.parse(elem.data));
      });
    };
    onLoad();

    return { data, jsonData };
  },
};
</script>

<style>
</style>