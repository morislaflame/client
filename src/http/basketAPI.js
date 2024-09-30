import { $authHost } from "./index";

export const fetchBasket = async () => {
    const { data } = await $authHost.get('api/basket');
    return data;
}

export const addToBasket = async (thingId) => {
    const { data } = await $authHost.post('api/basket/add', { thingId });
    return data;
}

export const removeFromBasket = async (thingId) => {
    const { data } = await $authHost.delete(`api/basket/remove/${thingId}`);
    return data;
}

export const clearBasket = async () => {
    const { data } = await $authHost.delete('api/basket/clear');
    return data;
}

// Новый метод для применения промокода
export const applyPromoCode = async (code) => {
    const { data } = await $authHost.post('api/basket/applyPromoCode', { code });
    return data;
}

// Новый метод для удаления промокода
export const removePromoCode = async () => {
    const { data } = await $authHost.post('api/basket/removePromoCode');
    return data;
}
