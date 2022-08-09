<template>
  <div class="container">
    <form
      action=""
      method="post"
      id="form"
      @submit.prevent="sendData"
      name="data"
    >
      <fieldset>
        <legend></legend>
      </fieldset>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
export default {
  name: "Home",
  setup() {
    const template = ref([]);
    const onLoad = async () => {
      const config = {
        method: "get",
        url: "http://localhost:3000/template",
        withCredentials: true,
      };
      template.value = (await axios(config)).data;
      console.log(template.value);
      const form = document.querySelector("form > fieldset");
      console.log(form);
      const name = document.querySelector("form > fieldset > legend");
      name.innerHTML = template.value.name;

      const label = document.createElement("label");
      label.for = Object.keys(template.value)[1];
      label.innerHTML = Object.keys(template.value)[1];
      form.appendChild(label);
      const flat = document.createElement("input");
      flat.name = Object.keys(template.value)[1];
      flat.id = Object.keys(template.value)[1];
      form.appendChild(flat);

      template.value.resources.forEach((element, idx) => {
        const fieldset1 = document.createElement("fieldset");
        const legend = document.createElement("legend");
        legend.innerHTML = element.name;
        fieldset1.appendChild(legend);
        for (const [key, value] of Object.entries(element)) {
          if (key != "name") {
            const label = document.createElement("label");
            label.innerHTML = key;
            label.for = key;
            fieldset1.appendChild(label);
            const input = document.createElement("input");
            input.name = key + idx;
            input.id = key;
            fieldset1.appendChild(input);
          }
          console.log(`${key}: ${value}`);
        }
        form.appendChild(fieldset1);
      });

      const button = document.createElement("input");
      button.type = "submit";
      button.value = "Отправить";
      form.appendChild(button);
    };
    onLoad();

    const sendData = async () => {
      const formData = new FormData(document.querySelector("form"));
      console.log(formData.get("квартира"));

      template.value[Object.keys(template.value)[1]] = formData.get(
        Object.keys(template.value)[1]
      );

      template.value.resources.forEach((element, idx) => {
        for (const [key, value] of Object.entries(element)) {
          if (key != "name") {
            if (value == 'number') {
              element[key] = parseInt(formData.get(key + idx))
            } else if (value == 'string') {
              element[key] = formData.get(key + idx)
            }
          }
        }
      });

      console.log(template.value);

      const payload = { data: JSON.stringify(template.value) }

      const config = {
        method: "post",
        url: "http://localhost:3000/post-data",
        withCredentials: true,
        data: payload,
      };
      await axios(config);
    };

    return { template, sendData };
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}
body {
  background-color: rgb(199, 199, 199);
}
.container {
  background-color: rgb(221, 221, 221);
}
form {
  width: 50%;
}
form fieldset {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
</style>