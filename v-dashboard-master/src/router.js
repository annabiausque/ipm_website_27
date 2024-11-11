import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from './views/Dashboard.vue'
import Forms from './views/Forms.vue'
import Tables from './views/Tables.vue'
import UIElements from './views/UIElements.vue'
import Login from './views/Login.vue'
import Modal from './views/Modal.vue'
import Card from './views/Card.vue'
import Blank from './views/Blank.vue'
import SupabaseTest from './views/SupabaseTest.vue'
import SupabaseAuth from './views/SupabaseAuth.vue'
import {supabase}  from './lib/supabaseClient'; 

const routes= [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { layout: 'empty' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } 
  },
  {
    path: '/forms',
    name: 'Forms',
    component: Forms,
  },
  {
    path: '/cards',
    name: 'Cards',
    component: Card,
  },
  {
    path: '/tables',
    name: 'Tables',
    component: Tables,
  },
  {
    path: '/ui-elements',
    name: 'UIElements',
    component: UIElements,
  },
  {
    path: '/modal',
    name: 'Modal',
    component: Modal,
  },
  {
    path: '/blank',
    name: 'Blank',
    component: Blank,
  },
  {
    path: '/supabase',
    name: 'SupabaseTest',
    component: SupabaseTest,
  },
    {
    path: '/supabase-auth',
    name: 'SupabaseAuth',
    component: SupabaseAuth,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const { data: session } = await supabase.auth.getSession();

  // If the route requires authentication and there's no session, redirect to /login
  if (to.matched.some(record => record.meta.requiresAuth) && !session) {
    next({ name: 'Login' });
  } else if (to.path === '/login' && session) {
    // If logged in and trying to access /login, redirect to /dashboard
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});
export default router
