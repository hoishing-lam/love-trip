<template>
  <div class="home-layout__container">
    <main class="home-layout__main">
      <router-view v-slot="{ Component }">
        <transition name="slide-fade">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </main>
    <van-tabbar route :fixed="false">
      <van-tabbar-item
        v-for="menu in menus"
        :key="menu.path"
        :to="menu.path"
        replace
      >
        {{ menu.label }}
        <template #icon="props">
          <component
            :is="menu.icon"
            :size="20"
            :fill="props.active ? palette.primary : defaultIconColor"
          />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AlarmClockIcon from '@/components/icons/alarm-clock.vue';
import MapMarkerIcon from '@/components/icons/map-marker.vue';
import HeartIcon from '@/components/icons/heart.vue';
import SettingIcon from '@/components/icons/setting.vue';
import { useThemeStore } from '@/modules/theme';

defineOptions({
  name: 'Home'
});

const themeStore = useThemeStore();
const palette = computed(() => themeStore.palette);
const defaultIconColor = 'var(--van-tabbar-item-text-color)';

const menus = [
  {
    label: '时光机',
    path: '/timeline',
    icon: AlarmClockIcon
  },
  {
    label: '足迹',
    path: '/footprint',
    icon: MapMarkerIcon
  },
  {
    label: '小心愿',
    path: '/wish',
    icon: HeartIcon
  },
  {
    label: '设置',
    path: '/setting',
    icon: SettingIcon
  }
];
</script>

<style scoped>
.home-layout__container {
  height: 100%;
}
.home-layout__main {
  height: calc(100% - 50px);
  overflow: auto;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from {
  position: absolute;
  width: 100%;
  transform: translate3d(100%, 0, 0);
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  position: absolute;
  width: 100%;
  transform: translate3d(0, 0, 0);
}
.slide-fade-leave-to {
  position: absolute;
  width: 100%;
  transform: translate3d(-100%, 0, 0);
}
</style>
