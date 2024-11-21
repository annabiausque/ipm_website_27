import { createRouter, createWebHistory } from 'vue-router'
import {supabase}  from './lib/supabaseClient'; 

import Dashboard from './views/Dashboard.vue'
import Forms from './views/Forms.vue'
import Tables from './views/Tables.vue'
import MyProject from './views/MyProjects.vue'
import Login from './views/Login.vue'
import Modal from './views/Modal.vue'

import Blank from './views/Blank.vue'
import StudentForm from './views/StudentForm.vue'
import SupabaseTest from './views/SupabaseTest.vue'
import ResetPassword from './views/ResetPassword.vue'
import Register from './views/Register.vue'
import Code from './views/Code.vue'
import Groups from './views/Groups.vue'
import Match from './views/Match.vue'
import SingleGroup from './views/SingleGroup.vue'


const routes= [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } 
  },
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { layout: 'empty' },
  },
    {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { layout: 'empty' },
  },
      {
    path: '/groups/:projectId',
    name: 'Groups',
    component: Groups,
  },
      {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { layout: 'empty' },
  },
  
  {
    path: '/forms',
    name: 'Forms',
    component: Forms,
  },

  {
    path: '/code',
    name: 'Code',
    component: Code,
  },
  {
    path: '/tables',
    name: 'Tables',
    component: Tables,
  },
  {
    path: '/my-projects',
    name: 'MyProject',
    component: MyProject,
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
    path: '/studentform/:projectId',
    name: 'StudentForm',
    component: StudentForm,
  },
  {
    path: '/supabase',
    name: 'SupabaseTest',
    component: SupabaseTest,
  },
  {
    path: '/match/:projectId',
    name: 'Match',
    component: Match,
  },
  {
    path: '/singlegroup/:id',
    name: 'SingleGroup',
    component: SingleGroup,
  },
    {
    path: '/profile/:id',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const { data: session } = await supabase.auth.getSession();
  console.log(session, session);
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
