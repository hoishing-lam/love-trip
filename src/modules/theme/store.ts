import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { palettes } from './constants';
import type { Themes } from './types';

export const useThemeStore = defineStore('theme', () => {
  const theme = useLocalStorage<Themes>('theme', 'cyan');
  const palette = computed(() => palettes[theme.value]);

  function setTheme(value: Themes | null) {
    theme.value = value;
  }

  return {
    theme,
    palette,
    setTheme
  };
});
