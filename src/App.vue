<script setup lang="ts">
import { useCesium } from './composables/useCesium';

const cesium = useCesium('cesium')

function createPoint(name: string, position: number[]) {
  return {
    name,
    position: { cartographicDegrees: position },
    point: {
      color: { rgba: [255, 255, 255, 255] },
      outlineColor: { rgba: [255, 0, 0, 255] },
      outlineWidth: 2,
      pixelSize: 8,
    },
  }
}

async function init() {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  cesium?.process([
    createPoint('Huntsville, AL', [-86, 34, 0]),
    createPoint('Miami, FL', [-80, 26, 0]),
  ])
}

init()

async function onSelect() {
  const entities = await cesium?.viewer?.select()
  console.log(entities)
}

async function onDrawCircle() {
  const result = await cesium?.viewer?.drawcircle()
  console.log(result)
}

async function onDrawPolygon() {
  const result = await cesium?.viewer?.drawpolygon()
  console.log(result)
}

async function onMeasure() {
  const result = await cesium?.viewer?.measure()
  console.log(result)
}

async function onPickEntity() {
  const result = await cesium?.viewer?.pickEntity()
  console.log(result)
}

async function onPickLocation() {
  const result = await cesium?.viewer?.pickLocation()
  console.log(result)
}

</script>

<template>
  <div id="cesium"></div>

  <div
    style="position: absolute; bottom: 45px; left: 50%; transform: translateX(-50%); width: 100%; display: flex; justify-content: center; column-gap: 5px;">
    <button @click="onSelect">Select</button>
    <button @click="onDrawCircle">Draw Circle</button>
    <button @click="onDrawPolygon">Draw Polygon</button>
    <button @click="onMeasure">Measure</button>
    <button @click="onPickEntity">Pick Entity</button>
    <button @click="onPickLocation">Pick Location</button>
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
