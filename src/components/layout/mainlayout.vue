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
  <div class="">
    <Appheader/>
    <div class="p-4">
      <slot></slot>
    </div>
    <Appfooter/>
  </div>
</template>