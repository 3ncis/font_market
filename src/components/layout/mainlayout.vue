<script>
import { RouterView, RouterLink } from 'vue-router'
import Appheader from './appheader.vue';
import Appfooter from './appfooter.vue';
export default {
  name: 'main layout',
  components: {
    Appheader,
    Appfooter
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Appheader/>
    <div class="flex-1 pt-[76px] lg:pt-[90px]">
      <slot></slot>
    </div>
    <Appfooter/>
  </div>
</template>