<script setup lang="ts">
import { useCesium } from './composables/useCesium';

const cesium = useCesium('cesium')
</script>

<template>
  <div id="cesium">

  </div>
</template>

<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

#cesium {
  height: 100%;
  width: 100%;
}

.cesium-viewer-bottom {
  display: none !important;
}
</style>
