<template>
  <div class="nav">
    <router-link to="/"> Отправить </router-link>
    <router-link to="/all"> Показать все </router-link>
  </div>
  <router-view />
</template>

<style>
* {
  font-family: "Times New Roman", Times, serif;
  color: #2c3e50;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 2em;
  text-decoration: none;
  text-transform: uppercase;
}
</style>
