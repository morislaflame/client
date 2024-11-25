import { $authHost, $host } from "../index";

export const createType = async (type) => {
    const { data } = await $authHost.post('api/country', type);
    return data;
};

export const fetchTypes = async () => {
    const { data } = await $host.get('api/country');
    return data;
};

export const createBrand = async (brand) => {
    const { data } = await $authHost.post('api/adult-platform', brand);
    return data;
};

export const fetchBrands = async () => {
    const { data } = await $host.get('api/adult-platform');
    return data;
};

export const createThing = async (thing) => {
    const { data } = await $authHost.post('api/model-product', thing);
    return data;
};

export const fetchThings = async (typeId, brandIds, page, limit = 20, minPrice, maxPrice) => {
    console.log("Fetching things with params:", { typeId, brandIds, page, limit, minPrice, maxPrice });
    try {
        const { data } = await $authHost.get('api/model-product', {
            params: { typeId, brandIds, page, limit, minPrice, maxPrice }
        });
        console.log("Fetched things:", data);
        return data;
    } catch (error) {
        console.error("Error fetching things: ", error);
    }
};

// Добавляем метод для получения диапазона цен всех товаров
export const fetchPriceRange = async () => {
    const { data } = await $host.get('api/model-product/price-range');
    return data;
};

export const fetchOneThing = async (id) => {
    const { data } = await $authHost.get('api/model-product/' + id);
    return data;
};


export const addToBasket = async (thingId) => {
    const { data } = await $authHost.post('api/basket/add', { thingId });
    return data;
};

// Новый метод для обновления товара
export const updateThing = async (id, thing) => {
    const { data } = await $authHost.put(`api/model-product/${id}`, thing);
    return data;
};
