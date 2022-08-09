import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Game from "../views/Game.vue";
import Results from "../views/Results.vue";

const routes = [
  {
    path: "/",
    name: "Морской бой",
    component: Home,
  },
  {
    path: "/game",
    name: "Игра",
    component: Game,
  },
  {
    path: "/results",
    name: "Результаты",
    component: Results,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
