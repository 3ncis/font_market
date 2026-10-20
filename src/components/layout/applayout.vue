<script>
import Appheader from './appheader.vue';
import AppfooterLight from './appfooterLight.vue';

export default {
  name: 'AppLayout',
  components: {
    Appheader,
    AppfooterLight,
  },
};
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Appheader/>
    <div class="flex-1 pt-[76px] lg:pt-[90px]">
      <slot></slot>
    </div>
    <AppfooterLight/>
  </div>
</template>