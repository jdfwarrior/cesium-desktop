import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
import 'cesium/Build/Cesium/Widgets/widgets.css'

declare global {
    interface Window {
        CESIUM_BASE_URL: string
    }
}

window.CESIUM_BASE_URL = './'

createApp(App).mount("#app");
