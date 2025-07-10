import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { supabase } from '../utils/supabase'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/signup',
        name: 'signup',
        component: () => import('../views/Signup.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/pricing',
        name: 'pricing',
        component: () => import('../views/Pricing.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/success',
        name: 'success',
        component: () => import('../views/Success.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/setting',
        name: 'setting',
        component: () => import('../views/Setting.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/customize',
        name: 'customize',
        component: () => import('../views/Customize.vue'),
        meta: { requiresAuth: true }
    },
]

const router = new VueRouter({
    routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
    const { data: { session } } = await supabase.auth.getSession()
    const isAuthenticated = !!session

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else if (to.meta.requiresGuest && isAuthenticated) {
        next('/')
    } else {
        next()
    }
})

export default router