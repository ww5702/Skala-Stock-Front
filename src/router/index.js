// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StockView from '../views/StockView.vue'
import PlayerView from '../views/PlayerView.vue' 
import PlayerForm from '../components/PlayerForm.vue'
import StockForm from '../components/StockForm.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/stocks', name: 'stocks', component: StockView },
  { path: '/players', name: 'players', component: PlayerView }, 
  { path: '/register-player', name: 'register-player', component: PlayerForm },
  { path: '/register-stock', name: 'register-stock', component: StockForm },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
