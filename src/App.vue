<script setup lang="ts">
import { onMounted } from "vue";
import { listen } from "@tauri-apps/api/event";
import { readTextFile } from "@tauri-apps/api/fs";
import { useCesium } from "./composables/useCesium";
import type { Packet } from "@jdfwarrior/czml";
import type { NationalPark } from "./types/types";

const cesium = useCesium("cesium");

function createPoint(name: string, position: number[]) {
  return {
    name,
    position: { cartographicDegrees: position },
    point: {
      color: { rgba: [255, 255, 255, 255] },
      outlineColor: { rgba: [255, 0, 0, 255] },
      outlineWidth: 2,
      pixelSize: { number: 8 },
    },
  } as Packet;
}

async function init() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  cesium?.process([
    createPoint("Huntsville, AL", [-86, 34, 0]),
    createPoint("Miami, FL", [-80, 26, 0]),
  ]);
}

init();

async function onSelect() {
  const entities = await cesium?.viewer?.select();
  console.log(entities);
}

async function onDrawCircle() {
  const result = await cesium?.viewer?.drawcircle();
  console.log(result);
}

async function onDrawPolygon() {
  const result = await cesium?.viewer?.drawpolygon();
  console.log(result);
}

async function onMeasure() {
  const result = await cesium?.viewer?.measure();
  console.log(result);
}

async function onPickEntity() {
  const result = await cesium?.viewer?.pickEntity();
  console.log(result);
}

async function onPickLocation() {
  const result = await cesium?.viewer?.pickLocation();
  console.log(result);
}

async function loadJson(file: string) {
  const data = await readTextFile(file);
  const json = JSON.parse(data);

  const colors = [
    [241, 243, 250, 255],
    [255, 255, 204, 255],
    [255, 237, 160, 255],
    [254, 217, 118, 255],
    [246, 172, 73, 255],
    [237, 133, 57, 255],
    [240, 75, 40, 255],
  ];

  const parks: Packet[] = json.map((park: NationalPark) => {
    const visitors = +park.visitors.replaceAll(",", "");
    let color;
    if (visitors > 1_000_000) color = colors[6];
    else if (visitors > 750_000) color = colors[5];
    else if (visitors > 500_000) color = colors[4];
    else if (visitors > 250_000) color = colors[3];
    else if (visitors > 100_000) color = colors[2];
    else if (visitors > 50_000) color = colors[1];
    else color = colors[0];

    return {
      id: park.id,
      name: `${park.title} National Park`,
      position: {
        cartographicDegrees: [
          +park.coordinates.longitude,
          +park.coordinates.latitude,
          0,
        ],
      },
      // point: {
      //   pixelSize: { number: 8 },
      //   color: {
      //     rgba: color
      //   }
      // },
      cylinder: {
        length: { number: 400000 },
        bottomRadius: { number: 50000 },
        topRadius: { number: 50000 },
        material: {
          solidColor: {
            color: { rgba: color },
          },
        },
        fill: { boolean: true },
        heightReference: { heightReference: "RELATIVE_TO_GROUND" },
      },
      properties: {
        area_acres: park.area.acres,
        established: park.date_established_readable,
        image: `${park.image.attribution_url}/${park.image.url}`,
        states: park.states.map((state) => state.title).join(", "),
        visitors: visitors,
      },
    } as Packet;
  });

  cesium?.process(parks);
}

/**
 * Handler for when the user drops a czml file on the application
 * Will read and JSON parse the file before loading it into cesium as is.
 * @param file dropped file
 */
async function loadCzml(file: string) {
  const data = await readTextFile(file);
  const parsed = JSON.parse(data);
  cesium?.process(parsed);
}

/**
 * Handler for when the user drops a csv file onto the application.
 * Will search for specific fields within the file to create an entity. All
 * other fields beyond that will be added to the entity as metadata.
 * @param file dropped file
 */
async function loadCsv(file: string) {
  const data = await readTextFile(file);

  console.log(`Still missing implementation for csv.`);
  console.log(data);
}

async function onDrop(event: { payload: string[] }) {
  const files = event.payload;

  files.forEach((file) => {
    if (file.endsWith(".json")) loadJson(file);
    else if (file.endsWith(".czml")) loadCzml(file);
    else if (file.endsWith(".csv")) loadCsv(file);
    else console.log(`Unsupported file type for ${file}`);
  });
}

onMounted(async () => {
  // cesium?.loadCountryBorders()
  cesium?.loadCountryLabels();
  listen("tauri://file-drop", onDrop);
});
</script>

<template>
  <div id="cesium"></div>

  <div
    style="
      position: absolute;
      bottom: 45px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      display: flex;
      justify-content: center;
      column-gap: 5px;
    "
  >
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
