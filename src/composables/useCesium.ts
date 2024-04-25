import { onMounted, nextTick } from 'vue'
import { Viewer } from 'cesium'

const instances = new Map<string, CesiumViewer>()

class CesiumViewer {
    viewer: Viewer | undefined
    constructor(id: string, options: Viewer.ConstructorOptions) {
        onMounted(async () => {
            await nextTick()
            this.viewer = new Viewer(id, options)
        })
    }
}

export const useCesium = (id: string = 'cesium') => {
    const options: Viewer.ConstructorOptions = {
        navigationHelpButton: false,
        geocoder: false
    }

    if (!instances.has(id)) {
        const viewer = new CesiumViewer(id, options)
        instances.set(id, viewer)
    } else {
        return instances.get(id)
    }
}