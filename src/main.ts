import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Lazyload } from 'vant';

import { router, setRouterGuard } from './router';
import App from './app.vue';

import './assets/styles/reset.css';
import './assets/styles/global.css';

function bootstrap() {
  setRouterGuard(router);
  createApp(App).use(createPinia()).use(router).use(Lazyload).mount('#app');
}

bootstrap();
