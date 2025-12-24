import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouteLocationNormalizedGeneric
} from 'vue-router';
import { PUBLIC_PATH } from '@/constants';
import { useAuthStore } from '@/modules/auth';

function mapRouteToProps(route: RouteLocationNormalizedGeneric) {
  return {
    ...route.query,
    ...route.params
  };
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
    redirect: '/timeline',
    children: [
      {
        path: 'timeline',
        component: () => import('@/views/home/timeline/index.vue'),
        props: mapRouteToProps
      },
      {
        path: 'footprint',
        component: () => import('@/views/home/footprint/index.vue'),
        props: mapRouteToProps
      },
    ]
  },
  {
    path: '/signin',
    component: () => import('@/views/signin/index.vue')
  }
];

export const router = createRouter({
  history: createWebHistory(PUBLIC_PATH),
  routes
});

router.beforeEach((to, _, next) => {
  const { token } = useAuthStore();
  if (to.path === '/signin') {
    if (token) {
      next('/');
    } else {
      next();
    }
  } else {
    if (token) {
      next();
    } else {
      next('/signin');
    }
  }
});
