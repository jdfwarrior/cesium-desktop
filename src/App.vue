<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { Viewer } from 'cesium'

onMounted(async () => {
  await nextTick()
  const viewer = new Viewer('cesium')
})
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
