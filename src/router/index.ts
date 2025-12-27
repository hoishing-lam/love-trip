import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouteLocationNormalizedGeneric,
  type Router
} from 'vue-router';
import { PUBLIC_PATH } from '@/constants';
import { useAuthStore } from '@/modules/auth';
import { parseURL } from '@/utils';

const signinPath = '/signin';

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
      {
        path: 'wish',
        component: () => import('@/views/home/wish/index.vue'),
        props: mapRouteToProps
      },
      {
        path: 'setting',
        component: () => import('@/views/home/setting/index.vue'),
        props: mapRouteToProps
      }
    ]
  },
  {
    path: signinPath,
    component: () => import('@/views/signin/index.vue'),
    props: mapRouteToProps
  }
];

export const router = createRouter({
  history: createWebHistory(PUBLIC_PATH),
  routes
});

export function setRouterGuard(router: Router) {
  router.beforeEach((to, _, next) => {
    const { token } = useAuthStore();
    if (to.path === signinPath) {
      if (token) {
        const redirectTo = (to.query.to as string) || '/';
        next(parseURL(redirectTo));
      } else {
        next();
      }
    } else {
      if (token) {
        next();
      } else {
        next({
          path: signinPath,
          query: { to: encodeURIComponent(to.fullPath) }
        });
      }
    }
  });
}
