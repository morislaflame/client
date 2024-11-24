import { $authHost, $host } from './index';

export const fetchModelProducts = async (countryId, adultPlatformIds, page, limit = 20, minPriceUSD, maxPriceUSD) => {
    const { data } = await $authHost.get('api/model-product', { params: { countryId, adultPlatformIds, page, limit, minPriceUSD, maxPriceUSD } });
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



