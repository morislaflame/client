import { $authHost } from "./index";

// Создание нового промокода
export const createPromoCode = async ({ code, discountValue, isOneTime }) => {
    const { data } = await $authHost.post('api/promocode/create', { code, discountValue, isOneTime });
    return data;
};

// Деактивация промокода
export const deactivatePromoCode = async (id) => {
    const { data } = await $authHost.post(`api/promocode/deactivate/${id}`);
    return data;
};

// Получение всех промокодов
export const getAllPromoCodes = async () => {
    const { data } = await $authHost.get('api/promocode/');
    return data;
};

// Генерация одноразовых промокодов
export const generateOneTimePromoCodes = async (count, discountValue) => {
    const { data } = await $authHost.post('api/promocode/generate', { count, discountValue });
    return data;
};

// Создание персонального промокода
export const createPersonalPromoCode = async ({ code, discountValue, userId }) => {
    const { data } = await $authHost.post('api/promocode/createPersonal', { code, discountValue, userId });
    return data;
};
