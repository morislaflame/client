import { $authHost } from "./index";

export const createInvoice = async (orderId) => {
    const response = await $authHost.post('/api/invoice', { orderId });
    return response.data;
};

export const getAllInvoice = async () => {
    const response = await $authHost.get('/api/invoice');
    return response.data;
};

export const deleteInvoice = async (id) => {
    const response = await $authHost.delete(`/api/invoice/${id}`);
    return response.data;
};
