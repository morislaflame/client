// orderAPI.js

import { $authHost } from "./index";

// Создание нового заказа
export const createOrder = async () => {
    try {
        const { data } = await $authHost.post('api/order');
        return data;
    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        throw error;
    }
};

// Получение всех заказов пользователя
export const fetchUserOrders = async () => {
    try {
        const { data } = await $authHost.get('api/order/my-orders');
        return data;
    } catch (error) {
        console.error('Ошибка при получении заказов пользователя:', error);
        throw error;
    }
};

// Получение новых заказов (для администратора)
export const fetchNewOrders = async () => {
    try {
        const { data } = await $authHost.get('api/order/new');
        return data;
    } catch (error) {
        console.error('Ошибка при получении новых заказов:', error);
        throw error;
    }
};

// Получение всех заказов (для администратора)
export const fetchAllOrders = async () => {
    try {
        const { data } = await $authHost.get('api/order/all');
        return data;
    } catch (error) {
        console.error('Ошибка при получении всех заказов:', error);
        throw error;
    }
};

// Подтверждение заказа администратором
export const confirmOrder = async (orderId) => {
    try {
        const { data } = await $authHost.patch(`api/order/confirm/${orderId}`);
        return data;
    } catch (error) {
        console.error(`Ошибка при подтверждении заказа ${orderId}:`, error);
        throw error;
    }
};

// Отклонение заказа администратором
export const rejectOrder = async (orderId) => {
    try {
        const { data } = await $authHost.patch(`api/order/reject/${orderId}`);
        return data;
    } catch (error) {
        console.error(`Ошибка при отклонении заказа ${orderId}:`, error);
        throw error;
    }
};

// Получение деталей конкретного заказа
export const fetchOrderDetails = async (orderId) => {
    try {
        const { data } = await $authHost.get(`api/order/${orderId}`);
        return data;
    } catch (error) {
        console.error(`Ошибка при получении деталей заказа ${orderId}:`, error);
        throw error;
    }
};

// Создание запроса на возврат по thingId
export const createReturn = async ({ thingId, reason }) => {
    try {
        const { data } = await $authHost.post('api/return', { thingId, reason });
        return data;
    } catch (error) {
        console.error('Ошибка при создании запроса на возврат:', error);
        throw error;
    }
};

// Получение всех возвратов пользователя
export const fetchUserReturns = async () => {
    try {
        const { data } = await $authHost.get('api/return/my-returns');
        return data;
    } catch (error) {
        console.error('Ошибка при получении возвратов пользователя:', error);
        throw error;
    }
};

// Получение возвратов со статусом pending (для администратора)
export const fetchPendingReturns = async () => {
    try {
        const { data } = await $authHost.get('api/return?status=pending');
        return data;
    } catch (error) {
        console.error('Ошибка при получении ожидающих возвратов:', error);
        throw error;
    }
};

// Получение всех возвратов (для администратора)
export const fetchAllReturns = async () => {
    try {
        const { data } = await $authHost.get('api/return');
        return data;
    } catch (error) {
        console.error('Ошибка при получении всех возвратов:', error);
        throw error;
    }
};

// Подтверждение возврата администратором
export const approveReturn = async (returnId) => {
    try {
        const { data } = await $authHost.patch(`api/return/approve/${returnId}`);
        return data;
    } catch (error) {
        console.error(`Ошибка при подтверждении возврата ${returnId}:`, error);
        throw error;
    }
};

// Отклонение возврата администратором
export const rejectReturn = async (returnId) => {
    try {
        const { data } = await $authHost.patch(`api/return/reject/${returnId}`);
        return data;
    } catch (error) {
        console.error(`Ошибка при отклонении возврата ${returnId}:`, error);
        throw error;
    }
};
