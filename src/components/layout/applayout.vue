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
  <div class="">
    <Appheader/>
    <div class="">
      <slot></slot>
    </div>
    <AppfooterLight/>
  </div>
</template>