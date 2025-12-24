<template>
  <div class="page-timelines__container">
    <header class="page-timelines__header">
      <div class="timeline-header__couple">
        <div class="timeline-header__avatars">
          <img class="timeline-header__avatar" :src="couple.girl.avatar" />
          <img class="timeline-header__avatar" :src="couple.boy.avatar" />
        </div>
        <div class="timeline-header__names">
          <span>{{ couple.girl.name }}</span>
          <span>{{ couple.boy.name }}</span>
        </div>
        <div class="timeline-header__days">
          <van-rolling-text
            class="timeline-days__num"
            :start-num="0"
            :target-num="days"
            :height="24"
          />
          <span>天</span>
        </div>
      </div>
    </header>
    <van-steps
      class="page-timelines__steps"
      direction="vertical"
      :active="currentStep"
    >
      <van-step v-for="timeline in timelines" :key="timeline.time">
        <div class="timeline-item__content">
          <p>{{ timeline.description }}</p>
          <ul v-if="timeline.images" class="timeline-image__list">
            <li
              v-for="(image, index) in timeline.images"
              :key="image"
              class="timeline-image__item"
              @click="showTimelineImages(timeline.images, index)"
            >
              <img class="timeline-image__wrapper" :src="image" />
            </li>
          </ul>
          <div class="timeline-item__remark">
            <span class="timeline-item__time">{{ timeline.time }}</span>
          </div>
        </div>
        <template #finish-icon>
          <HeartIcon :size="16" :fill="palette.primary" />
        </template>
        <template #active-icon>
          <HeartIcon :size="16" :fill="palette.primary" />
        </template>
      </van-step>
    </van-steps>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import dayJS from 'dayjs';
import { showImagePreview } from 'vant';
import 'vant/es/image-preview/style';
import { useThemeStore } from '@/modules/theme';
import { timelines } from '@/modules/timeline';
import HeartIcon from '@/components/icons/heart.vue';
import boyAvatar from '@/assets/images/boy.webp';
import girlAvatar from '@/assets/images/girl.webp';

defineOptions({
  name: 'Timelines'
});

const themeStore = useThemeStore();
const palette = computed(() => themeStore.palette);

const currentStep = timelines.length - 1;
const timeColor = '#969799';

const couple = {
  boy: {
    name: '哥哥',
    avatar: boyAvatar
  },
  girl: {
    name: '傻猪猪',
    avatar: girlAvatar
  }
};
const startDate = '2022-08-20';
const days = dayJS().diff(startDate, 'days');

function showTimelineImages(images: string[], startPosition: number) {
  showImagePreview({
    images,
    startPosition,
    showIndex: false
  });
}
</script>

<style scoped>
.page-timelines__container {
  background-color: v-bind('palette.primary');
}
.page-timelines__header {
  padding: 36px;
  color: #eee;
}
.timeline-header__couple {
  max-width: 60%;
  margin: 0 auto;
}
.timeline-header__avatars {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 24px;
}
.timeline-header__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
.timeline-header__names {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
}
.timeline-header__days {
  margin-top: 24px;
  text-align: center;
}
.timeline-days__num {
  margin-right: 4px;
  --van-rolling-text-font-size: 24px;
  --van-rolling-text-gap: 4px;
  --van-rolling-text-item-width: 16px;
  --van-rolling-text-color: #eee;
}
.page-timelines__steps {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}
.timeline-item__content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.timeline-item__remark {
  display: flex;
  align-items: center;
}
.timeline-item__time {
  display: inline-block;
  color: v-bind('timeColor');
  font-size: 14px;
}
.timeline-image__list {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.timeline-image__item {
  position: relative;
  height: 0;
  padding-bottom: 100%;
}
.timeline-image__wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}
</style>
