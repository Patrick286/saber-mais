import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '../views/UserLogin.vue';
import UserRegister from '../views/UserRegister.vue';
import saberMais from '../views/saberMais.vue';
import NovoDashboard from '../views/NovoDashboard.vue';

function isAuthenticated() {
  // Verifica se o usuário está autenticado
  return !!localStorage.getItem('user'); // Ajuste conforme seu método de autenticação
}

const routes = [
  {
    path: '/login',
    name: 'UserLogin',
    component: UserLogin,
  },
  {
    path: '/sabermais',
    name: 'saberMais',
    component: saberMais,
  },
  {
    path: '/register',
    name: 'UserRegister',
    component: UserRegister,
  },
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: NovoDashboard,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next('/login');
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
