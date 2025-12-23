import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { router } from './router';
import App from './app.vue';

import './assets/styles/reset.css';
import './assets/styles/global.css';

function bootstrap() {
  createApp(App).use(createPinia()).use(router).mount('#app');
}

bootstrap();
