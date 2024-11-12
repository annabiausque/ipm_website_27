import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from './lib/supabaseClient'; 

import Dashboard from './views/Dashboard.vue'
import Forms from './views/Forms.vue'
import Tables from './views/Tables.vue'
import UIElements from './views/UIElements.vue'
import Login from './views/Login.vue'
import Modal from './views/Modal.vue'
import Card from './views/Card.vue'
import Blank from './views/Blank.vue'
import SupabaseTest from './views/SupabaseTest.vue'
import ResetPassword from './views/ResetPassword.vue'
import Register from './views/Register.vue'

// Define routes
const routes = [
  { path: '/', name: 'Login', component: Login, meta: { layout: 'empty' } },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword, meta: { layout: 'empty' } },
  { path: '/register', name: 'Register', component: Register, meta: { layout: 'empty' } },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/forms', name: 'Forms', component: Forms, meta: { requiresAuth: true } },
  { path: '/cards', name: 'Cards', component: Card },
  { path: '/tables', name: 'Tables', component: Tables },
  { path: '/ui-elements', name: 'UIElements', component: UIElements },
  { path: '/modal', name: 'Modal', component: Modal },
  { path: '/blank', name: 'Blank', component: Blank },
  { path: '/supabase', name: 'SupabaseTest', component: SupabaseTest },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to protect routes requiring authentication
router.beforeEach(async (to, from, next) => {
  // Get session asynchronously
  const { data } = await supabase.auth.getSession();
  const session = data.session; // Session object

  // If the route requires authentication and the user is not logged in, redirect to login page
  if (to.matched.some(record => record.meta.requiresAuth) && !session) {
    next({ name: 'Login' });
  }
  // If the user is logged in and tries to go to /login, redirect to /dashboard
  else if (to.name === 'Login' && session) {
    next({ name: 'Dashboard' });
  }
  // Otherwise, proceed to the requested route
  else {
    next();
  }
});

export default router;
