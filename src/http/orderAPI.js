// orderAPI.js

import { $authHost } from "./index";

// Создание нового заказа
export const createOrder = async (basketItems) => {
    const { data } = await $authHost.post('api/order', {
        basketItems: basketItems.map(item => item.thingId)
    });
    return data;
};

// Получение всех заказов пользователя
export const fetchUserOrders = async () => {
    const { data } = await $authHost.get('api/order/my-orders');
    return data;
};

export const fetchNewOrders = async () => {
    const { data } = await $authHost.get('api/order/new');
    return data;
};

export const fetchAllOrders = async () => {
    const { data } = await $authHost.get('api/order/all');
    return data;
};

// Подтверждение заказа администратором
export const confirmOrder = async (orderId) => {
    const { data } = await $authHost.patch(`api/order/confirm/${orderId}`);
    return data;
};

// Отклонение заказа администратором
export const rejectOrder = async (orderId) => {
    const { data } = await $authHost.patch(`api/order/reject/${orderId}`);
    return data;
};

export const fetchOrderDetails = async (orderId) => {
    const { data } = await $authHost.get(`api/order/${orderId}`);
    return data;
};

// Создание возврата по thingId
export const createReturn = async ({ thingId, reason }) => {
    const { data } = await $authHost.post('api/return', { thingId, reason });
    return data;
};

// Получение всех возвратов пользователя
export const fetchUserReturns = async () => {
    const { data } = await $authHost.get('api/return/my-returns');
    return data;
};

// Получение возвратов со статусом pending
export const fetchPendingReturns = async () => {
    const { data } = await $authHost.get('api/return?status=pending');
    return data;
};

// Получение всех возвратов
export const fetchAllReturns = async () => {
    const { data } = await $authHost.get('api/return');
    return data;
};

// Подтверждение возврата
export const approveReturn = async (returnId) => {
    const { data } = await $authHost.patch(`api/return/approve/${returnId}`);
    return data;
};

// Отклонение возврата
export const rejectReturn = async (returnId) => {
    const { data } = await $authHost.patch(`api/return/reject/${returnId}`);
    return data;
};
