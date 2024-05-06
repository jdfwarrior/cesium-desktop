import { onMounted, nextTick } from 'vue'
import { Viewer, CzmlDataSource } from 'cesium'
import { cursor, controls, selection, tooltip, measure, pickEntity, pickLocation, drawcircle, drawpolygon } from '@jdfwarrior/cesium-mixins'
import { GeoJsonDataSource } from 'cesium'
import type { Packet } from '@jdfwarrior/czml'

const instances = new Map<string, CesiumViewer>()

class CesiumViewer {
    viewer: Viewer | undefined
    czml = new CzmlDataSource('czml')
    countryLabels = new CzmlDataSource('countryLabels')
    countryBorders = new GeoJsonDataSource('countryBorders')
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

            this.viewer.dataSources.add(this.countryBorders)
            this.viewer.dataSources.add(this.czml)
            this.viewer.dataSources.add(this.countryLabels)
            this.czml.process({ id: "document", version: "1.0" })
        })
    }

    // @todo replace this data type with the czml packet type
    process(packets: Packet[]) {
        this.czml.process(packets)
    }

    async loadCountryBorders() {
        this.countryBorders.load('http://localhost:1420/small.geo.json')
    }

    async loadCountryLabels() {
        const raw = await fetch('http://localhost:1420/countries.csv')
        const countries = await raw.text()
        const rows = countries.split(/\r?\n/)
        const labels = rows.reduce((acc, row, index) => {
            if (!index) return acc
            const cols = row.split(',')
            const [abbr, lat, lon, name] = cols

            if (!lat || !lon) return acc

            acc.push({
                id: abbr,
                position: {
                    cartographicDegrees: [+lon, +lat, 0]
                },
                label: {
                    text: { string: `${name.replace(/"/g, '')} (${abbr})` },
                    font: { font: "12pt" },
                    horizontalOrigin: { horizontalOrigin: 'CENTER' },
                    verticalOrigin: { verticalOrigin: 'CENTER' },
                    translucencyByDistance: {
                        nearFarScalar: [1.5e4, 1.0, 1.5e7, 0]
                    }
                },
            })

            return acc
        }, [] as Packet[])

        this.countryLabels.process({ id: 'document', version: '1.0' })
        this.countryLabels.process(labels)
    }

    setCountryBorderVisibility(value: boolean) {
        this.countryBorders.show = value
    }

    setCountryLabelVisibility(value: boolean) {
        this.countryLabels.show = value
    }

    toggleCountryBorders() {
        this.countryBorders.show = !this.countryBorders.show
    }

    toggleCountryLabels() {
        this.countryLabels.show = !this.countryLabels.show
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