<template>
  <div class="page-footprints__container">
    <van-search
      ref="searchRef"
      class="page-footprints__search"
      :model-value="query"
      shape="round"
      placeholder="找下我们去过的地方叭~"
      background="transparent"
      @focus="handleFocusSearch"
    />
    <div ref="mapContainerRef" class="footprints-map__container" />
    <Search
      v-model:visible="searchVisible"
      v-model:query="query"
      :footprints="footprints"
      @click:footprint="handleClickFootprint"
    />
    <van-action-sheet
      v-model:show="actionSheetVisible"
      :title="selectedFootprint?.name"
    >
      <div>
        <van-swipe
          v-if="selectedFootprint?.images"
          :autoplay="3000"
          lazy-render
        >
          <van-swipe-item
            v-for="image in selectedFootprint?.images"
            :key="image"
          >
            <van-image
              width="100%"
              :height="imageHeight"
              :src="image"
              alt="加载中..."
              lazy-load
            >
              <template #loading>
                <LoadingIcon :size="36" :fill="palette.primary" />
              </template>
              <template #error>
                <FailIcon :size="36" :fill="palette.primary" />
              </template>
            </van-image>
          </van-swipe-item>
        </van-swipe>
        <p v-if="selectedFootprint?.boyDesc" class="footprints-detail__desc">
          {{ selectedFootprint?.boyDesc }}
        </p>
        <p v-if="selectedFootprint?.girlDesc" class="footprints-detail__desc">
          {{ selectedFootprint?.girlDesc }}
        </p>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useAsyncState } from '@vueuse/core';
import type { SearchInstance } from 'vant';
import { useMap, useBoolean } from '@/hooks';
import type { Scene, AMapEvent } from '@/hooks/use-map/types';
import { useThemeStore, palettes } from '@/modules/theme';
import {
  getFootprints,
  isRoute,
  isSpot,
  regions,
  type Footprint,
  type Region,
  type Route,
  type Spot
} from '@/modules/footprint';
import LoadingIcon from '@/components/icons/loading.vue';
import FailIcon from '@/components/icons/fail.vue';
import mapMarkerSVG from '@/assets/images/map-marker.svg';
import heartSVG from '@/assets/images/heart.svg';
import restaurantSVG from '@/assets/images/restaurant.svg';
import Search from './search.vue';

defineOptions({
  name: 'Footprints'
});

const props = defineProps<{
  id?: string;
}>();

const clientWidth = document.body.clientWidth;
const imageHeight = clientWidth * 0.75;

const detailVisibleZoomThreshold = 10;
const detailVisibleZooms = [detailVisibleZoomThreshold, 22];
const initialZoom = 4.8;
let zoom: number = initialZoom;

const themeStore = useThemeStore();
const palette = computed(() => themeStore.palette);

const { state: footprints } = useAsyncState(async () => getFootprints(), []);
const routes = computed(
  () => footprints.value.filter(footprint => isRoute(footprint)) as Route[]
);
const spots = computed(
  () => footprints.value.filter(footprint => isSpot(footprint)) as Spot[]
);

const { state: actionSheetVisible, setTrue: openActionSheet } = useBoolean();
const selectedFootprint = ref<Footprint>();

const mapContainerRef = ref<HTMLElement>();
const searchRef = ref<SearchInstance>();
const query = ref('');
const {
  state: searchVisible,
  setTrue: openSearch,
  setFalse: closeSearch
} = useBoolean();

const { scene, loadMap } = useMap({
  onSuccess: scene => {
    if (scene) {
      addMapEventListener(scene);
    }
  }
});

let routeLayer: any = null;
let regionPointLayer: any = null;
const commonRegionPointLayerStyle = {
  unit: 'px',
  radius: 16,
  borderWidth: 0,
  blurWidth: 2
};

function handleFocusSearch() {
  searchRef.value?.blur();
  openSearch();
}

function renderRoutes(scene: Scene, routes: Route[]) {
  const { loca, Loca } = scene;
  loca.clear();
  const geo = new Loca.GeoJSONSource({
    data: {
      type: 'FeatureCollection',
      features: routes.map(route => ({
        type: 'Feature',
        properties: route,
        geometry: {
          type: 'LineString',
          coordinates: route.route
        }
      }))
    }
  });

  routeLayer = new Loca.PulseLineLayer({
    zIndex: 10,
    zooms: detailVisibleZooms
  });
  routeLayer.setSource(geo);
  routeLayer.setStyle({
    lineWidth: 4,
    // 脉冲头颜色
    headColor: palettes.amber.dark,
    // 脉冲尾颜色
    trailColor: palettes.amber.light,
    // 脉冲长度，0.25 表示一段脉冲占整条路的 1/4
    interval: 1,
    // 脉冲线的速度，几秒钟跑完整段路
    duration: 20000
  });
  loca.add(routeLayer);
  loca.animate.start();
}

function renderSpots(scene: Scene, spots: Spot[]) {
  const { map, AMap } = scene;
  const spotsConfigs = [
    {
      type: 'regular',
      marker: mapMarkerSVG,
      zIndex: 115
    },
    {
      type: 'heart',
      marker: heartSVG,
      zIndex: 120
    },
    {
      type: 'restaurant',
      marker: restaurantSVG,
      zIndex: 115
    }
  ];
  spotsConfigs.forEach(config => {
    const filteredSpots = spots.filter(spot => spot.type === config.type);
    render(filteredSpots, config);
  });

  function render(
    spots: Spot[],
    config: { type: string; marker: string; zIndex: number }
  ) {
    const massMasks = new AMap.MassMarks(
      spots.map(spot => {
        return {
          data: spot,
          lnglat: [spot.lng, spot.lat]
        };
      }),
      {
        cursor: 'pointer',
        zooms: detailVisibleZooms,
        style: {
          url: config.marker,
          anchor: [20, 28],
          size: [36, 36]
        },
        zIndex: config.zIndex
      }
    );
    massMasks.setMap(map);
    massMasks.on('click', (event: any) => {
      const spot: Spot = event.data.data;
      selectedFootprint.value = spot;
      openActionSheet();
    });
  }
}

function renderRegions(scene: Scene, regions: Region[]) {
  const { map, loca, Loca } = scene;
  regionPointLayer = new Loca.PointLayer({
    blend: 'lighter'
  });
  regionPointLayer.setSource(
    new Loca.GeoJSONSource({
      data: {
        type: 'FeatureCollection',
        features: regions.map(region => ({
          type: 'Feature',
          properties: region,
          geometry: { type: 'Point', coordinates: [region.lng, region.lat] }
        }))
      }
    })
  );
  regionPointLayer.setStyle({
    ...commonRegionPointLayerStyle,
    color: palette.value.primary
  });
  regionPointLayer.addAnimate({
    key: 'radius',
    value: [0, 1],
    duration: 500,
    easing: 'Linear',
    transform: 2000,
    random: true,
    delay: 8000,
    yoyo: true,
    repeat: 100000
  });
  const zoom = map.getZoom();
  if (zoom < detailVisibleZoomThreshold) {
    loca.add(regionPointLayer);
  }
}

function addMapEventListener(scene: Scene) {
  const { map, loca } = scene;
  map.on('click', (event: AMapEvent) => {
    const feature = routeLayer?.queryFeature(event.pixel.toArray());
    if (feature) {
      const route: Route = feature.properties;
      selectedFootprint.value = route;
      openActionSheet();
    }
  });
  map.on('zoomend', () => {
    if (!regionPointLayer) {
      return;
    }
    const currentZoom = map.getZoom();
    if (
      currentZoom < detailVisibleZoomThreshold &&
      detailVisibleZoomThreshold <= zoom
    ) {
      loca.add(regionPointLayer);
    } else if (
      zoom < detailVisibleZoomThreshold &&
      detailVisibleZoomThreshold <= currentZoom
    ) {
      loca.remove(regionPointLayer);
    }
    zoom = currentZoom;
  });
}

watch(mapContainerRef, mapContainerRef => {
  if (mapContainerRef) {
    loadMap(undefined, mapContainerRef, {
      zoom: initialZoom,
      mapStyle: 'amap://styles/fresh'
    });
  }
});

watch([scene, routes, spots], ([scene, routes, spots]) => {
  if (!scene) {
    return;
  }
  renderRoutes(scene, routes);
  renderSpots(scene, spots);
  renderRegions(scene, regions);

  if (props.id) {
    const matchedFootprints = footprints.value.find(
      footprint => footprint.id === props.id
    );
    if (matchedFootprints) {
      scene.map.setZoomAndCenter(16, [
        matchedFootprints.lng,
        matchedFootprints.lat
      ]);
      selectedFootprint.value = matchedFootprints;
      openActionSheet();
    }
  }
});

watch(palette, palette => {
  regionPointLayer.setStyle({
    ...commonRegionPointLayerStyle,
    color: palette.primary
  });
});

function handleClickFootprint(footprint: Footprint) {
  const map = scene.value?.map;
  map?.setZoomAndCenter(16, [footprint.lng, footprint.lat]);
  query.value = footprint.name;
  closeSearch();
}
</script>

<style scoped>
.page-footprints__container,
.footprints-map__container {
  position: relative;
  height: 100%;
}
.page-footprints__search {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 5;
  :deep(.van-search__content) {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}
.footprints-detail__desc {
  padding: 4px;
  line-height: 1.5;
}
</style>
