import { $authHost, $host } from "./index";

export const createType = async (type) => {
    const {data} = await $authHost.post('api/type', type)
    return data
}

export const fetchTypes = async () => {
    const {data} = await $host.get('api/type')
    return data
}

export const createBrand = async (brand) => {
    const {data} = await $authHost.post('api/brand', brand)
    return data
}

export const fetchBrands = async (typeId, brandId, page, limit = 5) => {
    const {data} = await $host.get('api/brand')
    return data
}

export const createThing = async (thing) => {
    const {data} = await $authHost.post('api/thing', thing)
    return data
}

export const fetchThings = async (typeId, brandId, page, limit = 6) => {
    const {data} = await $host.get('api/thing', {params: {
        typeId, brandId, page, limit
    }})
    return data
}

export const fetchOneThing = async (id) => {
    const {data} = await $host.get('api/thing/' + id)
    return data
}