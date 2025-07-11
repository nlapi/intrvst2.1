import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/setting',
        component: () => import(/* webpackChunkName: "about" */ '../views/Setting.vue')
    },
    {
        path: '/customize',
        component: () => import(/* webpackChunkName: "customize" */ '../views/Customize.vue')
    },
    {
        path: '/admin',
        component: () => import(/* webpackChunkName: "admin" */ '../views/AdminPanel.vue')
    },
]

const router = new VueRouter({
    routes
})

export default router
