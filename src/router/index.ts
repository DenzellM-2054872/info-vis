import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OverView from '../views/OverView.vue'
import Timeline from '../views/TimelineView.vue'
import ChampStats from '../views/SynergyView.vue'
import ChampDetailView from '@/views/ChampDetailView.vue'
import GameDetails from '@/views/GameDetails.vue'
import AboutView from '../views/AboutView.vue'
import ChampScatter from '@/views/ChampScatterview.vue'
import SynergyView from '../views/SynergyView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/champscatter',
      name: 'champscatter',
      component: ChampScatter,
    },
    {
      path: '/synergy',
      name: 'synergy',
      component: SynergyView,
    },
    {
      path: '/champdetail',
      name: 'champdetail',
      component: ChampDetailView,
    },
    {
      path: '/gamedetail',
      name: 'gamedetail',
      component: GameDetails,
    },
  ],
})

export default router
