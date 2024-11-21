import { $authHost } from "./index";

export const fetchBasket = async () => {
    const { data } = await $authHost.get('api/basket');
    return data;
}

export const addToBasket = async (modelProductId) => {
    const { data } = await $authHost.post('api/basket/add', { modelProductId });
    return data;
}

export const removeFromBasket = async (basketItemId) => {
    const { data } = await $authHost.delete(`api/basket/remove/${basketItemId}`);
    return data;
}

export const clearBasket = async () => {
    const { data } = await $authHost.delete('api/basket/clear');
    return data;
}

export const applyPromoCode = async (code) => {
    const { data } = await $authHost.post('api/basket/applyPromoCode', { code });
    return data;
}

export const removePromoCode = async () => {
    const { data } = await $authHost.post('api/basket/removePromoCode');
    return data;
}
