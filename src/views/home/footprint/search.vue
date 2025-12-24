<template>
  <div
    :class="[
      'footprints-search__container',
      {
        'footprints-search__container--visible': visible
      }
    ]"
  >
    <van-search
      ref="searchRef"
      v-model="query"
      shape="round"
      placeholder="找下我们去过的地方叭~"
      background="transparent"
      left-icon="arrow-left"
      @click-left-icon="handleClose"
    />
    <ul v-if="filteredFootprints.length" class="footprints-search__list">
      <van-cell
        v-for="footprint in filteredFootprints"
        :key="footprint.name"
        @click="clickFootprint(footprint)"
      >
        <template #title>
          <div class="footprints-search__item">
            <div class="footprints-search__text">
              <component
                :is="renderIcon(footprint)"
                :size="20"
                :fill="getIconColor(footprint)"
              />
              <span>{{ footprint.name }}</span>
            </div>
            <span class="footprints-search__value">{{ footprint.city }}</span>
          </div>
        </template>
      </van-cell>
    </ul>
    <NotFound v-else content="这里没有我们去过的地方呢，傻猪猪~" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Component } from 'vue';
import type { SearchInstance } from 'vant';
import MapMarkerIcon from '@/components/icons/map-marker.vue';
import HeartIcon from '@/components/icons/heart.vue';
import RestaurantIcon from '@/components/icons/restaurant.vue';
import RouteIcon from '@/components/icons/route.vue';
import { useThemeStore, palettes } from '@/modules/theme';
import { isRoute, isSpot, type Footprint } from '@/modules/footprint';
import NotFound from './not-found.vue';

defineOptions({
  name: 'Search'
});

const props = defineProps<{
  visible: boolean;
  query: string;
  footprints: Footprint[];
}>();

const footprints = computed(() => props.footprints);

const emits = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
  (e: 'update:query', query: string): void;
  (e: 'click:footprint', footprint: Footprint): void;
}>();

const themeStore = useThemeStore();
const palette = computed(() => themeStore.palette);
const visible = computed(() => props.visible);

const query = computed({
  get: () => props.query,
  set: value => {
    emits('update:query', value);
  }
});

const filteredFootprints = computed(() =>
  footprints.value
    .filter(spot => fuzzySearch(spot.name, query.value))
    .sort(({ city: city1 }, { city: city2 }) => {
      if (city1 < city2) {
        return -1;
      } else if (city1 > city2) {
        return 1;
      }
      return 0;
    })
);

function clickFootprint(footprint: Footprint) {
  emits('click:footprint', footprint);
}

function renderIcon(footprint: Footprint) {
  if (isRoute(footprint)) {
    return RouteIcon;
  } else if (isSpot(footprint)) {
    const typeToIcons: Record<string, Component> = {
      regular: MapMarkerIcon,
      heart: HeartIcon,
      restaurant: RestaurantIcon
    };
    return typeToIcons[footprint.type] || MapMarkerIcon;
  }
  return MapMarkerIcon;
}

function getIconColor(footprint: Footprint) {
  if (isRoute(footprint)) {
    return palettes.lightBlue.primary;
  } else if (isSpot(footprint)) {
    const typeToColors: Record<string, string> = {
      regular: palettes.purple.primary,
      heart: palettes.pink.primary,
      restaurant: palettes.teal.primary
    };
    return typeToColors[footprint.type] || palette.value.primary;
  }
  return palette.value.primary;
}

function handleClose() {
  emits('update:visible', false);
}

function fuzzySearch(value: string, query: string) {
  const queryChars = query.split('');
  const str = '(.*?)';
  const regStr = str + queryChars.join(str) + str;
  const reg = new RegExp(regStr, 'i');
  return reg.test(value);
}

const searchRef = ref<SearchInstance>();

watch([visible, searchRef], ([visible, searchRef]) => {
  if (visible && searchRef) {
    searchRef.focus();
  }
});
</script>

<style scoped>
.footprints-search__container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  z-index: -1;
  opacity: 0;
  transition: all 0.4s;
  background-color: #fff;
}
.footprints-search__container--visible {
  z-index: 15;
  opacity: 1;
}
.footprints-search__list {
  flex: 1;
  overflow: auto;
}
.footprints-search__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footprints-search__text {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--van-cell-text-color);
}
.footprints-search__value {
  color: var(--van-cell-value-color);
}
</style>
