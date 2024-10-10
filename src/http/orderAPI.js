import { $authHost } from "./index";

export const createOrder = async ({ cryptoCurrency, cryptoTransactionHash, cryptoPaymentAmount }) => {
    const { data } = await $authHost.post('api/order', { cryptoCurrency, cryptoTransactionHash, cryptoPaymentAmount });
    return data;
};

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

export const confirmOrder = async (orderId) => {
    const { data } = await $authHost.patch(`api/order/confirm/${orderId}`);
    return data;
};

export const rejectOrder = async (orderId) => {
    const { data } = await $authHost.patch(`api/order/reject/${orderId}`);
    return data;
};

export const fetchOrderDetails = async (orderId) => {
    const { data } = await $authHost.get(`api/order/${orderId}`);
    return data;
};

export const createReturn = async ({ thingId, reason, cryptoCurrency, cryptoWalletAddress, refundAmount }) => {
    const { data } = await $authHost.post('api/return', { thingId, reason, cryptoCurrency, cryptoWalletAddress, refundAmount });
    return data;
};

export const fetchUserReturns = async () => {
    const { data } = await $authHost.get('api/return/my-returns');
    return data;
};

export const fetchPendingReturns = async () => {
    const { data } = await $authHost.get('api/return?status=pending');
    return data;
};

export const fetchAllReturns = async () => {
    const { data } = await $authHost.get('api/return');
    return data;
};

export const approveReturn = async (returnId, cryptoTransactionHash) => {
    const { data } = await $authHost.patch(`api/return/approve/${returnId}`, { cryptoTransactionHash });
    return data;
};

export const rejectReturn = async (returnId) => {
    const { data } = await $authHost.patch(`api/return/reject/${returnId}`);
    return data;
};
