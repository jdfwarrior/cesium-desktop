export interface NationalPark {
    area: {
        acres: string
        square_km: string
    }
    coordinates: {
        latitude: number
        longitude: number
    }
    date_established_readable: string
    date_established_unix: number
    description: string
    image: {
        url: string
        attribution: string
        attribution_url: string
    }
    nps_link: string
    states: [
        {
            id: string
            title: string
        }
    ]
    title: string
    id: string
    visitors: string
    world_heritage_site: boolean
}