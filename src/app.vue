<template>
  <van-config-provider :theme-vars="vantThemeVars">
    <div class="app-layout__container">
      <router-view v-slot="{ Component }">
        <transition name="blur">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </van-config-provider>
</template>

<script setup lang="ts">
import { computed, watch, provide } from 'vue';
import type { ConfigProviderThemeVars } from 'vant';
import { useThemeStore } from '@/modules/theme';

defineOptions({
  name: 'App'
});

const themeStore = useThemeStore();
const palette = computed(() => themeStore.palette);

const vantThemeVars = computed<ConfigProviderThemeVars>(() => ({
  primaryColor: palette.value.primary,
  tabbarItemActiveColor: palette.value.primary,
  stepActiveColor: palette.value.primary,
  stepFinishLineColor: palette.value.primary,
  swipeIndicatorActiveBackground: palette.value.primary,
  buttonPrimaryBackground: palette.value.primary,
  buttonPrimaryBorderColor: palette.value.primary,
  passwordInputBackground: 'var(--van-background)',
  passwordInputInfoColor: palette.value.light,
  passwordInputErrorInfoColor: palette.value.danger,
  tabsBottomBarColor: palette.value.primary
}));

const meta = document.createElement('meta');
meta.setAttribute('name', 'theme-color');
meta.setAttribute('content', palette.value.primary);
document.head.appendChild(meta);

function setMetaThemeColor(color: string) {
  meta.setAttribute('content', color);
}

provide('setMetaThemeColor', setMetaThemeColor);

watch(palette, palette => {
  setMetaThemeColor(palette.primary);
});
</script>

<style scoped>
.app-layout__container {
  height: 100%;
}
.blur-enter-active,
.blur-leave-active {
  transition: all 0.4s;
}
.blur-enter-from,
.blur-leave-to {
  opacity: 0;
  filter: blur(4px);
}
</style>
