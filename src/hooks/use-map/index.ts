import { computed, onBeforeUnmount } from 'vue';
import { useAsyncState } from '@vueuse/core';
import AMapLoader from '@amap/amap-jsapi-loader';
import '@amap/amap-jsapi-types';
import { AMAP_KEY, GUANGZHOU_CENTER } from '@/constants';
import type { Scene } from './types';

const defaultMapOptions: AMap.MapOptions = {
  center: GUANGZHOU_CENTER
  // https://lbs.amap.com/demo/javascript-api/example/personalized-map/set-theme-style
};

export interface UseMapOptions {
  onSuccess?: (scene: Scene | null) => void;
  onError?: (e: any) => void;
}

export function useMap(options: UseMapOptions = {}) {
  const { onSuccess, onError } = options;
  const { state: scene, execute: loadMap } = useAsyncState(
    async (container: HTMLElement, options: AMap.MapOptions = {}) => {
      const AMap = await AMapLoader.load({
        key: AMAP_KEY,
        version: '2.0', // 缺省时默认为 1.4.15
        Loca: {
          version: '2.0.0' // 缺省 1.3.2
        }
      });
      const map: AMap.Map = new AMap.Map(container, {
        ...defaultMapOptions,
        ...options
      });
      const loca = map
        ? new (window as any).Loca.Container({ map })
        : undefined;
      return { map, AMap, loca, Loca: window.Loca } as Scene;
    },
    null,
    {
      immediate: false,
      onSuccess,
      onError
    }
  );

  const map = computed(() => scene.value?.map);
  const loca = computed(() => scene.value?.loca);

  onBeforeUnmount(() => {
    loca.value?.destroy();
    // @ts-expect-error 如果参数为空，则清除所有事件监听
    map.value?.clearEvents();
    map.value?.destroy();
    scene.value = null;
  });

  return {
    scene,
    map,
    loca,
    loadMap
  };
}
