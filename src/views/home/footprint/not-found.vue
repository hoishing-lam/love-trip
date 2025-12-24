<template>
  <div class="not-found__container">
    <LocationSearch :size="200" :fill="palette.primary" />
    <span v-if="content">{{ content }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LocationSearch from '@/components/icons/location-search.vue';
import { useThemeStore } from '@/modules/theme';

defineOptions({
  name: 'NotFound'
});

defineProps<{
  content?: string;
}>();

const themeStore = useThemeStore();
const palette = computed(() => themeStore.palette);
</script>

<style scoped>
.not-found__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
</style>
