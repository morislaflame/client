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

// Получение всех возвратов пользователя
export const fetchUserReturns = async () => {
    const { data } = await $authHost.get('api/returns/my-returns');
    return data;
};

export const fetchAllOrders = async () => {
    const { data } = await $authHost.get('api/order/all');
    return data;
};

// Подтверждение заказа администратором
export const confirmOrder = async (orderId) => {
    const { data } = await $authHost.put(`api/order/confirm/${orderId}`);
    return data;
};

// Отклонение заказа администратором
export const rejectOrder = async (orderId) => {
    const { data } = await $authHost.put(`api/order/reject/${orderId}`);
    return data;
};