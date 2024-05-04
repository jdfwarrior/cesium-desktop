import { onMounted, nextTick } from 'vue'
import { Viewer, CzmlDataSource } from 'cesium'
import { cursor, controls, selection, tooltip, measure, pickEntity, pickLocation, drawcircle, drawpolygon } from '@jdfwarrior/cesium-mixins'

const instances = new Map<string, CesiumViewer>()

class CesiumViewer {
    viewer: Viewer | undefined
    czml = new CzmlDataSource('czml')
    constructor(id: string, options: Viewer.ConstructorOptions) {
        onMounted(async () => {
            await nextTick()
            this.viewer = new Viewer(id, options)
            this.viewer.extend(cursor)
            this.viewer.extend(controls)
            this.viewer.extend(selection)
            this.viewer.extend(tooltip)
            this.viewer.extend(measure)
            this.viewer.extend(pickEntity)
            this.viewer.extend(pickLocation)
            this.viewer.extend(drawcircle)
            this.viewer.extend(drawpolygon)

            this.viewer.dataSources.add(this.czml)
            this.czml.process({ id: "document", version: "1.0" })
        })
    }

    // @todo replace this data type with the czml packet type
    process(packets: Record<string, unknown>[]) {
        this.czml.process(packets)
        this.viewer?.render()
    }
}

export const useCesium = (id: string = 'cesium') => {
    const options: Viewer.ConstructorOptions = {
        navigationHelpButton: false,
        geocoder: false,
        infoBox: false
        // requestRenderMode: true
    }

    if (!instances.has(id)) {
        const viewer = new CesiumViewer(id, options)
        instances.set(id, viewer)
        return viewer
    } else {
        return instances.get(id)
    }
}