<template>
  <div>
    <van-cell-group>
      <van-cell v-for="wish in wishes" :key="wish.desc" :title="wish.desc">
        <template #title>
          <div class="wish-item__container">
            <div class="wish-item__title">
              <div>
                <img
                  v-for="owner in wish.owners"
                  :key="owner"
                  class="wish-title__avatar"
                  :src="owner === 'girl' ? girlAvatar : boyAvatar"
                />
              </div>
              <span>{{ wish.desc }}</span>
            </div>
            <TickIcon v-if="wish.achived" :size="20" :fill="palette.primary" />
          </div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/modules/theme';
import { wishes } from '@/modules/wish';
import boyAvatar from '@/assets/images/boy.webp';
import girlAvatar from '@/assets/images/girl.webp';
import TickIcon from '@/components/icons/tick.vue';

defineOptions({
  name: 'Wishes'
});

const themeStore = useThemeStore();
const palette = computed(() => themeStore.palette);
</script>

<style scoped>
.wish-item__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wish-item__title {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}
.wish-title__avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
}
</style>
