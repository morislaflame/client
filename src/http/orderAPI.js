import { $authHost } from "./index";


// Создание нового заказа с криптовалютной информацией
export const createOrder = async ({ cryptoCurrency, cryptoTransactionHash, cryptoPaymentAmount }) => {
    const { data } = await $authHost.post('api/order', { cryptoCurrency, cryptoTransactionHash, cryptoPaymentAmount });
    return data;
};


// Получение всех заказов пользователя
export const fetchUserOrders = async () => {
    const { data } = await $authHost.get('api/order/my-orders');
    return data;
};

// Получение новых заказов (для администратора)
export const fetchNewOrders = async () => {
    const { data } = await $authHost.get('api/order/new');
    return data;
};

// Получение всех заказов (для администратора)
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

// Получение деталей конкретного заказа
export const fetchOrderDetails = async (orderId) => {
    const { data } = await $authHost.get(`api/order/${orderId}`);
    return data;
};

// Создание запроса на возврат по thingId
export const createReturn = async ({ thingId, reason, cryptoCurrency, cryptoWalletAddress, refundAmount }) => {
    const { data } = await $authHost.post('api/return', { thingId, reason, cryptoCurrency, cryptoWalletAddress, refundAmount });
    return data;
};

// Получение всех возвратов пользователя
export const fetchUserReturns = async () => {
    const { data } = await $authHost.get('api/return/my-returns');
    return data;
};

// Получение возвратов со статусом pending (для администратора)
export const fetchPendingReturns = async () => {
    const { data } = await $authHost.get('api/return?status=pending');
    return data;
};

// Получение всех возвратов (для администратора)
export const fetchAllReturns = async () => {
    const { data } = await $authHost.get('api/return');
    return data;
};

// Подтверждение возврата администратором
export const approveReturn = async (returnId, cryptoTransactionHash) => {
    const { data } = await $authHost.patch(`api/return/approve/${returnId}`, { cryptoTransactionHash });
    return data;
};

// Отклонение возврата администратором
export const rejectReturn = async (returnId) => {
    const { data } = await $authHost.patch(`api/return/reject/${returnId}`);
    return data;
};
