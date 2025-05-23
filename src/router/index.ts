import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OverView from '../views/OverView.vue'
import Timeline from '../views/TimelineView.vue'
import ChampStats from '../views/ChampStats.vue'
import ChampDetailView from '@/views/ChampDetailView.vue'
import GameDetails from '@/views/GameDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: OverView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/page',
      name: 'page',
      component: () => import('../views/OverView.vue'),
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: Timeline,
    },
    {
      path: '/champstats',
      name: 'champstats',
      component: ChampStats,
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
