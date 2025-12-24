<template>
  <div>
    <van-cell-group>
      <van-cell title="主题" @click="openThemePanel">
        <template #value>
          <span class="settings-theme__value" />
        </template>
      </van-cell>
    </van-cell-group>
    <van-action-sheet
      v-model:show="themePanelVisible"
      title="都是你喜欢的颜色~"
    >
      <ul class="settings-theme__list">
        <li
          v-for="option in paletteOptions"
          :key="option.theme"
          :class="[
            'settings-theme__item',
            { 'settings-theme__item--active': option.theme === theme }
          ]"
          :style="{ backgroundColor: option.color }"
          @click="selectTheme(option.theme)"
        >
          <TickIcon class="theme-item__icon" :size="20" fill="#eee" />
        </li>
      </ul>
    </van-action-sheet>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useBoolean } from '@/hooks';
import TickIcon from '@/components/icons/tick.vue';
import { useThemeStore, palettes, type Themes } from '@/modules/theme';

defineOptions({
  name: 'Settings'
});

const themeStore = useThemeStore();
const theme = computed(() => themeStore.theme);
const palette = computed(() => themeStore.palette);
const { state: themePanelVisible, setTrue: openThemePanel } = useBoolean();

const paletteOptions = Object.keys(palettes).map(key => {
  const theme = key as Themes;
  return {
    theme,
    color: palettes[theme].primary
  };
});

function selectTheme(theme: Themes) {
  themeStore.setTheme(theme);
}
</script>

<style scoped>
.settings-theme__value {
  display: inline-block;
  width: 36px;
  height: 24px;
  background-color: v-bind('palette.primary');
  border-radius: 8px;
}
.settings-theme__list {
  padding: 0 12px 12px 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.settings-theme__item {
  position: relative;
  height: 48px;
  border-radius: 12px;
}
.settings-theme__item--active .theme-item__icon {
  opacity: 1;
}
.theme-item__icon {
  position: absolute;
  bottom: 8px;
  right: 8px;
  transition: all 0.2s;
  opacity: 0;
}
</style>
