import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ViewAll from '../views/ViewAll.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/all',
    name: 'All',
    component: ViewAll
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
