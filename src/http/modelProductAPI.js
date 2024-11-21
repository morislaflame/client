import { $authHost, $host } from './index';

export const fetchModelProducts = async (typeId, brandIds, page, limit = 20, minPrice, maxPrice) => {
    const { data } = await $authHost.get('api/model-product', { params: { typeId, brandIds, page, limit, minPrice, maxPrice } });
    return data;
};

export const fetchModelProductById = async (modelProductId) => {
    const { data } = await $authHost.get(`api/model-product/${modelProductId}`);
    return data;
};

export const fetchPriceRange = async () => {
    const { data } = await $host.get('api/model-product/price-range');
    return data;
};

export const fetchAdultPlatforms = async () => {
    const { data } = await $host.get('api/adult-platform');
    return data;
};

export const fetchCountries = async () => {
    const { data } = await $host.get('api/country');
    return data;
};



