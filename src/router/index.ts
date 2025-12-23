import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouteLocationNormalizedGeneric
} from 'vue-router';
import { PUBLIC_PATH } from '@/constants';

function mapRouteToProps(route: RouteLocationNormalizedGeneric) {
  return {
    ...route.query,
    ...route.params
  };
}

const routes: RouteRecordRaw[] = [
  {
    path: '/hello-world',
    component: () => import('@/views/hello-world.vue'),
    props: mapRouteToProps
  }
];

export const router = createRouter({
  history: createWebHistory(PUBLIC_PATH),
  routes
});
