<template>
  <div class="app-layout__container">
    <router-view v-slot="{ Component }">
      <transition name="blur">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

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
